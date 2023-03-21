import { FC } from 'react';
import React from 'react'
import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { Tabs } from 'flowbite-react';
import ListAllNFT from './ListAllNFT';

const rpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_URL || ""
const goerliRpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_URL || ""

const injected = injectedModule();

const chainType = process.env.NEXT_PUBLIC_CHAIN || ""

if (chainType == "goerli") {
  // initialize Onboard
  init({
    wallets: [injected],
    chains: [
      {
        id: '0x5',
        token: 'ETH',
        label: 'Ethereum Goerli',
        rpcUrl: goerliRpcUrl
      }
    ],
    appMetadata: {
      name: "Kudos",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#fc3003" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>',
      description: "Give Kudos to people"
    }
  })
} else {
  // initialize Onboard
  init({
    wallets: [injected],
    chains: [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl
      }
    ],
    appMetadata: {
      name: "Kudos",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#fc3003" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>',
      description: "Give Kudos to people"
    }
  })
}



const Landing: FC = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  return (
    <div className='w-screen px-4 flex flex-col'>
      <div className="flex mx-auto">
        <button className="mt-4 px-2 w-32 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={connecting}
          onClick={() => (wallet ? disconnect(wallet) : connect())}
        >
          {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect Wallet'}
        </button>
      </div>

      <div className="w-full flex flex-col mx-auto">
        <div className="mt-4 text-2xl text-center">Appreciation List</div>
        <Tabs.Group
          aria-label="Tabs with underline"
          style="pills"
        >
          <Tabs.Item title="NFT" active={true}>
            <div className='w-full'><ListAllNFT wallet={wallet}></ListAllNFT></div>
          </Tabs.Item>
        </Tabs.Group>  
      </div>
    </div>
  )
}

export default Landing