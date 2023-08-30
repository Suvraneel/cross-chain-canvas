import type { NextPage } from 'next';
import { ConnectKitButton } from 'connectkit';
import { ReactNode } from 'react';
import Spline from '@splinetool/react-spline';

interface LayoutProps {
  children: ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <div className='h-screen w-screen flex flex-col bg-brandGray-300 relative'>
      <div className='w-full flex flex-row justify-end items-center bg-brandGray-400 shadow-md shadow-brandGray-600 p-3'>
        <ConnectKitButton />
      </div>
      <div className='relative h-full w-full flex justify-center items-center'>
        <div className='absolute z-0 w-fit h-fit'>
          <Spline scene="https://prod.spline.design/H4hvCa-im9BZA53N/scene.splinecode" />
        </div>
        <div className='z-10 h-full w-full'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
