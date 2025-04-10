// Default IPFS gateway to use as fallback
const IPFS_GATEWAY_URL = 'https://ipfs.algonode.dev'

/**
 * Check availability of an IPFS resource and return appropriate URL
 * Tries images.nf.domains first, falls back to IPFS gateway
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

  try {
    const response = await fetch(nfdUrl, { method: 'HEAD' })
    if (response.ok) {
      return nfdUrl
    }
  } catch {
    console.info(
      `CID ${cid} is not cached on images.nf.domains, trying IPFS gateway...`,
    )
  }

  // Fallback to IPFS gateway
  return `${IPFS_GATEWAY_URL}/ipfs/${cid}`
}
