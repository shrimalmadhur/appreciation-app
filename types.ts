import { NftTokenType, OwnedNft } from "alchemy-sdk"

export type TokenResponse  = {
  name: string,
  contractAddress: string,
  tokenId: string,
  tokenType: NftTokenType,
  rawImageUrl?: string
}