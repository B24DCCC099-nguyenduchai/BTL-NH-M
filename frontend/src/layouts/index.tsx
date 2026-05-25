import React from 'react';
import Navbar from '../components/layout/Navbar';
import ToastContainer from '../components/common/ToastContainer';
import './index.less';

interface Props {
  children: React.ReactNode;
  currentUser?: any;
}

const BasicLayout: React.FC<Props> = ({ children, currentUser }) => {
  return (
    <div className="basic-layout">
      <Navbar user={currentUser} />
      <main className="basic-layout-content">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
};

export default BasicLayout;
