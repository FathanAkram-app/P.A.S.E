import { useState, useEffect, useCallback } from 'react';

// Mock Shape SDK - Replace with actual Shape SDK when available
const mockShapeSDK = {
  async connectWallet() {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock wallet connection
    return {
      address: '0x' + Math.random().toString(16).substr(2, 40),
      network: 'Shape Testnet',
      balance: Math.random() * 10
    };
  },
  
  async disconnectWallet() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },
  
  async getWalletInfo() {
    return {
      isConnected: false,
      address: null,
      network: null
    };
  }
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState({
    isConnected: false,
    address: '',
    network: '',
    balance: 0,
    isConnecting: false,
    error: null
  });

  // Check if wallet is already connected on app load
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check localStorage for saved wallet state
        const savedWallet = localStorage.getItem('walletConnection');
        if (savedWallet) {
          const parsed = JSON.parse(savedWallet);
          if (parsed.isConnected) {
            setWalletState(prev => ({
              ...prev,
              ...parsed,
              isConnecting: false
            }));
          }
        }

        // In a real app, you would check if the wallet is still connected
        // const walletInfo = await mockShapeSDK.getWalletInfo();
        // setWalletState(prev => ({ ...prev, ...walletInfo }));
      } catch (error) {
        console.warn('Failed to check wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, []);

  // Save wallet state to localStorage
  useEffect(() => {
    try {
      if (walletState.isConnected) {
        const cleanWalletState = {
          isConnected: Boolean(walletState.isConnected),
          address: String(walletState.address || ''),
          network: String(walletState.network || ''),
          balance: Number(walletState.balance || 0)
        };
        localStorage.setItem('walletConnection', JSON.stringify(cleanWalletState));
      } else {
        localStorage.removeItem('walletConnection');
      }
    } catch (error) {
      console.warn('Failed to save wallet state to localStorage:', error);
    }
  }, [walletState]);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
      error: null
    }));

    try {
      // Check if MetaMask or compatible wallet is available
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
          // Get network info
          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          });

          // Get balance
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });

          setWalletState({
            isConnected: true,
            address: accounts[0],
            network: chainId === '0x1' ? 'Ethereum Mainnet' : 'Shape Network',
            balance: parseFloat(balance) / Math.pow(10, 18),
            isConnecting: false,
            error: null
          });

          return { success: true, address: accounts[0] };
        }
      } else {
        // Fallback to mock connection for demo purposes
        const walletInfo = await mockShapeSDK.connectWallet();
        
        setWalletState({
          isConnected: true,
          address: walletInfo.address,
          network: walletInfo.network,
          balance: walletInfo.balance,
          isConnecting: false,
          error: null
        });

        return { success: true, address: walletInfo.address };
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet'
      }));

      return { success: false, error: error.message };
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(async () => {
    try {
      await mockShapeSDK.disconnectWallet();
      
      setWalletState({
        isConnected: false,
        address: '',
        network: '',
        balance: 0,
        isConnecting: false,
        error: null
      });

      return { success: true };
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Switch network (for Shape Network)
  const switchToShapeNetwork = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // This would be the actual Shape network configuration
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x...' }], // Replace with actual Shape chain ID
        });

        setWalletState(prev => ({
          ...prev,
          network: 'Shape Network'
        }));

        return { success: true };
      } catch (error) {
        // If the chain hasn't been added to MetaMask, add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x...', // Replace with actual Shape chain ID
                chainName: 'Shape Network',
                nativeCurrency: {
                  name: 'SHAPE',
                  symbol: 'SHAPE',
                  decimals: 18
                },
                rpcUrls: ['https://shape-rpc-url'], // Replace with actual RPC
                blockExplorerUrls: ['https://shape-explorer'] // Replace with actual explorer
              }]
            });
            return { success: true };
          } catch (addError) {
            console.error('Failed to add Shape network:', addError);
            return { success: false, error: addError.message };
          }
        } else {
          console.error('Failed to switch to Shape network:', error);
          return { success: false, error: error.message };
        }
      }
    }
    return { success: false, error: 'MetaMask not available' };
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          disconnectWallet();
        } else if (accounts[0] !== walletState.address) {
          // User switched accounts
          setWalletState(prev => ({
            ...prev,
            address: accounts[0]
          }));
        }
      };

      const handleChainChanged = (chainId) => {
        // Update network info when chain changes
        const networkName = chainId === '0x1' ? 'Ethereum Mainnet' : 'Shape Network';
        setWalletState(prev => ({
          ...prev,
          network: networkName
        }));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [walletState.address, disconnectWallet]);

  return {
    walletState,
    connectWallet,
    disconnectWallet,
    switchToShapeNetwork
  };
};