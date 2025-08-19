import { ethers } from 'ethers';

// Ethereum provider and signer management
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;

/**
 * Initialize Ethereum provider using MetaMask
 * Returns the provider instance or null if MetaMask is not available
 */
export const initializeProvider = (): ethers.BrowserProvider | null => {
  if (typeof window !== 'undefined' && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }
  return null;
};

/**
 * Get the current provider instance
 */
export const getProvider = (): ethers.BrowserProvider | null => {
  return provider;
};

/**
 * Get signer for transaction signing
 * Must be called after connecting to MetaMask
 */
export const getSigner = async (): Promise<ethers.JsonRpcSigner | null> => {
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  
  if (!signer) {
    signer = await provider.getSigner();
  }
  
  return signer;
};

/**
 * Connect to MetaMask and request account access
 * Returns the connected account address
 */
export const connectWallet = async (): Promise<string> => {
  const provider = initializeProvider();
  
  if (!provider) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Connection rejected by user.');
    }
    throw error;
  }
};

/**
 * Get the current account address if connected
 */
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!provider) return null;
  
  try {
    const accounts = await provider.listAccounts();
    return accounts.length > 0 ? accounts[0].address : null;
  } catch {
    return null;
  }
};

/**
 * Get ETH balance for a given address
 * Returns balance in ETH (not wei)
 */
export const getBalance = async (address: string): Promise<string> => {
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

/**
 * Send ETH transaction from connected wallet
 */
export const sendTransaction = async (
  to: string, 
  amount: string
): Promise<ethers.TransactionResponse> => {
  const signer = await getSigner();
  
  if (!signer) {
    throw new Error('Wallet not connected');
  }

  // Convert ETH amount to wei
  const valueInWei = ethers.parseEther(amount);

  // Send transaction
  const transaction = await signer.sendTransaction({
    to,
    value: valueInWei,
  });

  return transaction;
};

/**
 * Wait for transaction confirmation
 */
export const waitForTransaction = async (
  txHash: string
): Promise<ethers.TransactionReceipt | null> => {
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  
  return await provider.waitForTransaction(txHash);
};

/**
 * Get transaction details
 */
export const getTransaction = async (
  txHash: string
): Promise<ethers.TransactionResponse | null> => {
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  
  return await provider.getTransaction(txHash);
};

/**
 * Switch to Sepolia testnet
 */
export const switchToSepolia = async (): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
    });
  } catch (error: any) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    } else {
      throw error;
    }
  }
};

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  }
}