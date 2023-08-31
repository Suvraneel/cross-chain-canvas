import type { NextPage } from 'next';
import { inter, maven } from '@/fonts'
import { useAccount } from 'wagmi';
import ReplicateFrontEnd from './../components/ReplicateFrontEnd';
const Home: NextPage = () => {
  const { address } = useAccount();
  return (
    <div className='flex justify-start items-start p-10 z-10'>
      {!address ?
        <div className='w-1/3 h-fit bg-brandGray-400 rounded-md p-3 flex flex-col gap-3 shadow-lg shadow-black'>
          <h1 className={`${inter.className} text-4xl text-primary`}>CrossChain Canvas</h1>
          <p className={`${maven.className} text-lg text-white`}>
            Mint. Showcase. Own. Across blockchains. Limitless NFT possibilities await. Join the interchain revolution now!
          </p>
        </div>
        :
        <div className='flex justify-center items-center w-full h-full'><ReplicateFrontEnd /></div>
      }
    </div>
  );
};

export default Home;