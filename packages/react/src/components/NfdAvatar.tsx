import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { cn } from '../utils/cn'
import { checkIpfsAvailability } from '../utils/ipfs'

import type { NfdRecord } from '../hooks/useNfd'

export interface NfdAvatarProps {
  /** NFD record containing avatar data */
  nfd: NfdRecord | null | undefined
  /** Optional alt text for the image (defaults to NFD name or 'NFD Avatar') */
  alt?: string
  /** Optional className for styling the image */
  className?: string
  /** Optional size in pixels (defaults to 40px) */
  size?: number
  /** Optional fallback element to show when no avatar is available */
  fallback?: React.ReactNode
  /** Optional flag to show light only avatar */
  lightOnly?: boolean
}

/**
 * Component for displaying NFD avatar images with automatic IPFS handling
 * - Handles IPFS URLs by converting them to HTTPS
 * - Checks availability on images.nf.domains and falls back to IPFS gateway if needed
 * - Caches results using TanStack Query
 */
export function NfdAvatar({
  nfd,
  alt,
  className,
  size = 40,
  fallback,
  lightOnly = false,
}: NfdAvatarProps) {
  // Extract the potential avatar URL from the NFD data
  const rawAvatarUrl =
    nfd?.properties?.userDefined?.avatar ||
    nfd?.properties?.verified?.avatar ||
    null

  // Use a sensible alt text if not provided
  const imgAlt = alt || nfd?.name || 'NFD Avatar'

  // Use Tanstack Query to handle the availability check and cache the result
  const { data: avatarUrl, isLoading } = useQuery({
    queryKey: ['nfd-avatar', rawAvatarUrl],
    queryFn: async () => {
      if (!rawAvatarUrl) return null

      // If it's already an HTTPS URL and not IPFS-related, use as is
      if (
        rawAvatarUrl.startsWith('https://') &&
        !rawAvatarUrl.includes('/ipfs/')
      ) {
        return rawAvatarUrl
      }

      // For IPFS URLs, check availability and use the best option
      if (
        rawAvatarUrl.startsWith('ipfs://') ||
        rawAvatarUrl.includes('/ipfs/')
      ) {
        return await checkIpfsAvailability(rawAvatarUrl)
      }

      // For any other type of URL, just return it as is
      return rawAvatarUrl
    },
    enabled: !!rawAvatarUrl,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })

  // Render loading state or fallback if no avatar available
  if (isLoading || !avatarUrl) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Default fallback is a rounded placeholder with light/dark mode variants
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          lightOnly
            ? 'bg-gray-200 dark:bg-gray-200'
            : 'bg-gray-200 dark:bg-[#192A39]',
          className,
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        aria-label={imgAlt}
        role="img"
        data-wallet-ui
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('text-gray-400', !lightOnly && 'dark:text-gray-500')}
          style={{
            width: `${Math.max(size / 2, 12)}px`,
            height: `${Math.max(size / 2, 12)}px`,
          }}
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  }

  // Render the avatar image
  return (
    <img
      src={avatarUrl}
      alt={imgAlt}
      className={cn('rounded-full', className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
      }}
      loading="lazy"
    />
  )
}
