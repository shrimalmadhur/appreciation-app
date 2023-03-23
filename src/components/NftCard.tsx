import { Dispatch, FC, useContext, useEffect, useRef, useState } from 'react';
import axios from "axios";
import React from 'react'
import { ethers, JsonRpcSigner } from 'ethers'
import { Network, Alchemy, NftTokenType } from 'alchemy-sdk'
import { TokenResponse } from '../../types';
import { WalletState } from '@web3-onboard/core';
import erc721abi from '../../artifacts/erc721-abi.json'
import erc1155abi from '../../artifacts/nft-contract.json'
import { useConnectWallet } from '@web3-onboard/react';

type Props = {
  token: TokenResponse
  wallet?: WalletState | undefined | null
  setTxHashDispatch: Dispatch<string>
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const contractAddress = process.env.NEXT_PUBLIC_KUDOS_CONTRACT || ""
const chainType = process.env.NEXT_PUBLIC_CHAIN || ""
const etherScanURL = process.env.NEXT_PUBLIC_ETHERSCAN_URL;

const NftCard: FC<Props> = (data) => {
  const [showModal, setShowModal] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  let img = data.token.rawImageUrl?.split("://");
  if (!img) {
    img = []
  }
  const finalImg = "https://gateway.pinata.cloud/ipfs/" + img[1];
  const divStyle = {
    backgroundImage: 'url(' + finalImg + ')'
  }

  const mintTo = async function() {

    if (!wallet) {
      return
    }

    let signer = null;
    let provider;
    if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider(chainType)
    } else {
        provider = new ethers.BrowserProvider(window.ethereum)
        signer = await provider.getSigner();
    }

    var address = mintAddress || null;
    if (mintAddress.endsWith('.eth')) {
      address = await provider.resolveName(mintAddress);
    }

    try {
      let nftContract = new ethers.Contract(contractAddress, erc1155abi, signer);
      const tx = await nftContract["mint(address,uint256)"](address, data.token.tokenId, { gasLimit: 100000, value: ethers.parseEther('0.005') })
      setShowModal(false);
      const txURL = etherScanURL + "tx/" + tx.hash;
      data.setTxHashDispatch(txURL);
      const receipt = await tx.wait();
      data.setTxHashDispatch("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="w-80 bg-white shadow rounded">
        <div className="h-64 w-full bg-gray-200 flex flex-col justify-between p-4 bg-cover bg-center" style={divStyle}>
        </div>
        <div className="p-4 flex flex-col items-center">
          <h1 className="text-gray-800 text-center mt-1">{data.token.name}</h1>
          <p className="text-center text-gray-800 mt-1">0.005 ETH</p>
          {/* <div className="inline-flex items-center mt-2">
            <button className="bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/> 
              </svg>
            </button>
            <div className="bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none">2</div>
            <button className="bg-white rounded-r border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/> 
              </svg>
            </button>
          </div> */}
          <button 
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center" 
            onClick={() => { wallet ? setShowModal(true) : connect()}}
          >
            Send To
          </button>
        </div> 
      </div> 
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-full">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-green-500 text-3xl font-semibold">
                    {data.token.name}
                  </h3>
                  <button
                    className="text-red-500 p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-red-500 bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <label className="flex flex-col-reverse relative focus group">
      
                    <input type="text" name="address" required
                        className="border-2 border-black px-4 py-3 leading-9" size={64} onChange={(e) => setMintAddress(e.target.value)}
                        placeholder="Address in 0x... or ENS format"/>

                    <span className="text-red-500 ml-auto leading-10">* Required</span>
                  
                  </label>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:text-red-900 hover:bg-green"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => mintTo()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  )
}

export default NftCard;