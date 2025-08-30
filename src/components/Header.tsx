import React from 'react';
import WalletButton from './WalletButton';

const Header: React.FC = () => {
  return (
    <header 
      className="flex items-center justify-between"
      style={{
        backgroundColor: '#212124',
        width: '1440px',
        height: '56px',
        padding: '12px',
        maxWidth: '100%',
        margin: '0 auto'
      }}
    >
      <div className="flex items-center" style={{ gap: '12px' }}>
        <img 
          src="/homepageImages/logo.png" 
          alt="Token Portfolio" 
          style={{
            width: '28px',
            height: '28px'
          }}
        />
        <h1 
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '24px',
            letterSpacing: '0%',
            color: '#FFFFFF',
            width: '1234px',
            height: '24px'
          }}
        >
          Token Portfolio
        </h1>
      </div>
      
      <WalletButton />
    </header>
  );
};

export default Header;
