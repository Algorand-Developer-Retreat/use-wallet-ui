// Default IPFS gateway to use as fallback
const IPFS_GATEWAY_URL = 'https://ipfs.algonode.dev'

/**
 * Check availability of an IPFS resource and return appropriate URL
 * Tries images.nf.domains first, falls back to IPFS gateway
 * Only returns URLs for image content types
 *
 * @param url - IPFS URL to check
 * @returns URL to use (either images.nf.domains or fallback gateway)
 */
export const checkIpfsAvailability = async (url: string): Promise<string> => {
  if (!url.startsWith('ipfs://')) {
    return url
  }

  const cid = url.replace('ipfs://', '')
  const nfdUrl = `https://images.nf.domains/ipfs/${cid}`
  const gatewayUrl = `${IPFS_GATEWAY_URL}/ipfs/${cid}`

  // Helper to check if content type is an image
  const isImageContentType = (contentType: string): boolean => {
    return contentType.startsWith('image/')
  }

  // Try images.nf.domains first
  try {
    const response = await fetch(nfdUrl, { method: 'HEAD' })
    if (response.ok) {
      const contentType = response.headers.get('content-type')
      if (contentType && isImageContentType(contentType)) {
        return nfdUrl
      }
    }
  } catch {
    console.info(
      `CID ${cid} is not cached on images.nf.domains, trying IPFS gateway...`,
    )
  }

  // Try IPFS gateway
  try {
    const response = await fetch(gatewayUrl, { method: 'HEAD' })
    if (response.ok) {
      const contentType = response.headers.get('content-type')

      // If it's an image, return the gateway URL
      if (contentType && isImageContentType(contentType)) {
        return gatewayUrl
      }

      // If it's JSON, try to get image URL from metadata
      if (contentType === 'application/json') {
        try {
          const jsonResponse = await fetch(gatewayUrl)
          const metadata = await jsonResponse.json()

          // Get image URL from metadata
          const imageUrl = metadata.image
          if (imageUrl) {
            // If it's an IPFS URL, process it recursively
            if (imageUrl.startsWith('ipfs://')) {
              const imageCid = imageUrl.replace('ipfs://', '')
              const imageGatewayUrl = `${IPFS_GATEWAY_URL}/ipfs/${imageCid}`

              // Verify it's an image
              const imageResponse = await fetch(imageGatewayUrl, {
                method: 'HEAD',
              })
              if (imageResponse.ok) {
                const imageContentType =
                  imageResponse.headers.get('content-type')
                if (imageContentType && isImageContentType(imageContentType)) {
                  return imageGatewayUrl
                }
              }
            }
            // If it's already an HTTP URL and it's an image, return it
            else if (imageUrl.startsWith('http')) {
              try {
                const imageResponse = await fetch(imageUrl, { method: 'HEAD' })
                if (imageResponse.ok) {
                  const imageContentType =
                    imageResponse.headers.get('content-type')
                  if (
                    imageContentType &&
                    isImageContentType(imageContentType)
                  ) {
                    return imageUrl
                  }
                }
              } catch {
                console.error('Error checking HTTP image URL')
              }
            }
          }
        } catch {
          console.error('Error processing JSON metadata')
        }
      }
    }
  } catch {
    console.error(`Error checking gateway for CID ${cid}`)
  }

  // Fallback to IPFS gateway without guarantee it's an image
  return gatewayUrl
}
