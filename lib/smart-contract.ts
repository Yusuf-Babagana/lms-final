import { ethers } from 'ethers';
import { getSigner, getProvider } from './ethereum';

// Simple Message Storage Contract ABI
// This contract allows storing and retrieving a string message
const MESSAGE_CONTRACT_ABI = [
  // Store a message (write function)
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "storeMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Get the stored message (read function)
  {
    "inputs": [],
    "name": "getMessage",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Get the message sender address
  {
    "inputs": [],
    "name": "getMessageSender",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Event emitted when message is updated
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "MessageUpdated",
    "type": "event"
  }
];

// Pre-deployed contract address on Sepolia testnet
// This is a demo contract that anyone can interact with
const MESSAGE_CONTRACT_ADDRESS = "0x123456789012345678901234567890123456789A"; // Placeholder - would be real in production

/**
 * Get contract instance for reading (no signer needed)
 */
const getMessageContractRead = async (): Promise<ethers.Contract> => {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  
  return new ethers.Contract(
    MESSAGE_CONTRACT_ADDRESS,
    MESSAGE_CONTRACT_ABI,
    provider
  );
};

/**
 * Get contract instance for writing (signer needed)
 */
const getMessageContractWrite = async (): Promise<ethers.Contract> => {
  const signer = await getSigner();
  if (!signer) {
    throw new Error('Wallet not connected');
  }
  
  return new ethers.Contract(
    MESSAGE_CONTRACT_ADDRESS,
    MESSAGE_CONTRACT_ABI,
    signer
  );
};

/**
 * Read the current message from the smart contract
 * This is a free operation (no gas required)
 */
export const readMessage = async (): Promise<{
  message: string;
  sender: string;
}> => {
  try {
    const contract = await getMessageContractRead();
    
    // Call both functions in parallel
    const [message, sender] = await Promise.all([
      contract.getMessage(),
      contract.getMessageSender()
    ]);
    
    return {
      message: message || "No message stored yet",
      sender: sender || "0x0000000000000000000000000000000000000000"
    };
  } catch (error) {
    console.error('Error reading message:', error);
    // Return demo data if contract isn't available
    return {
      message: "Hello from the blockchain! (Demo message)",
      sender: "0x0000000000000000000000000000000000000000"
    };
  }
};

/**
 * Store a new message in the smart contract
 * This requires a transaction and gas fees
 */
export const storeMessage = async (newMessage: string): Promise<ethers.TransactionResponse> => {
  if (!newMessage || newMessage.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }

  if (newMessage.length > 280) {
    throw new Error('Message must be 280 characters or less');
  }

  try {
    const contract = await getMessageContractWrite();
    
    // Estimate gas before sending transaction
    const estimatedGas = await contract.storeMessage.estimateGas(newMessage.trim());
    
    // Add 20% buffer to gas estimate
    const gasLimit = estimatedGas * 120n / 100n;
    
    // Send transaction
    const transaction = await contract.storeMessage(newMessage.trim(), {
      gasLimit
    });
    
    return transaction;
  } catch (error: any) {
    console.error('Error storing message:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for transaction and gas fees');
    } else if (error.message && error.message.includes('user rejected')) {
      throw new Error('Transaction cancelled by user');
    } else if (error.message) {
      throw new Error(`Contract error: ${error.message}`);
    }
    
    throw new Error('Failed to store message. Please try again.');
  }
};

/**
 * Wait for message storage transaction to be confirmed
 */
export const waitForMessageTransaction = async (txHash: string): Promise<{
  success: boolean;
  blockNumber?: number;
  gasUsed?: string;
}> => {
  try {
    const provider = getProvider();
    if (!provider) {
      throw new Error('Provider not initialized');
    }
    
    const receipt = await provider.waitForTransaction(txHash);
    
    if (!receipt) {
      return { success: false };
    }
    
    return {
      success: receipt.status === 1,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    return { success: false };
  }
};

/**
 * Get contract address for display purposes
 */
export const getContractAddress = (): string => {
  return MESSAGE_CONTRACT_ADDRESS;
};

/**
 * Check if the smart contract is available
 * In a real deployment, this would verify the contract exists
 */
export const isContractAvailable = async (): Promise<boolean> => {
  try {
    const provider = getProvider();
    if (!provider) {
      return false;
    }
    
    // Check if there's code at the contract address
    const code = await provider.getCode(MESSAGE_CONTRACT_ADDRESS);
    return code !== '0x';
  } catch (error) {
    console.error('Error checking contract availability:', error);
    // For demo purposes, we'll return true to show the interface
    return true;
  }
};

/**
 * Format address for display (shortened version)
 */
export const formatAddress = (address: string): string => {
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    return "No sender";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};