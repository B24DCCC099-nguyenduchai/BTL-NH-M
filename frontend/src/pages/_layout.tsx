import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ToastContainer from '@/components/common/ToastContainer';
import '@/styles/global.less';

export default ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ToastContainer />
    </>
  );
};
