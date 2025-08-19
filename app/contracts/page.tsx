'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Contact as FileContract, ExternalLink, AlertCircle, CheckCircle, Clock, Code, RefreshCw, MessageSquare, User } from 'lucide-react';
import { 
  getCurrentAccount, 
  initializeProvider 
} from '@/lib/ethereum';
import { 
  readMessage,
  storeMessage,
  waitForMessageTransaction,
  getContractAddress,
  formatAddress
} from '@/lib/smart-contract';
import { useToast } from '@/hooks/use-toast';

interface ContractState {
  message: string;
  sender: string;
  lastUpdated?: number;
}

interface TransactionStatus {
  hash?: string;
  status: 'idle' | 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
}

export default function ContractsPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [contractState, setContractState] = useState<ContractState>({
    message: '',
    sender: ''
  });
  const [newMessage, setNewMessage] = useState('');
  const [txStatus, setTxStatus] = useState<TransactionStatus>({ status: 'idle' });
  const [isReading, setIsReading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    loadContractState();
  }, []);

  const checkConnection = async () => {
    try {
      initializeProvider();
      const currentAccount = await getCurrentAccount();
      setAccount(currentAccount);
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const loadContractState = async () => {
    setIsReading(true);
    try {
      const state = await readMessage();
      setContractState({
        ...state,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error loading contract state:', error);
      toast({
        title: "Error Loading Contract",
        description: "Could not read from smart contract. Using demo data.",
        variant: "destructive",
      });
    } finally {
      setIsReading(false);
    }
  };

  const handleStoreMessage = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!newMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to store.",
        variant: "destructive",
      });
      return;
    }

    if (newMessage.length > 280) {
      toast({
        title: "Message Too Long",
        description: "Message must be 280 characters or less.",
        variant: "destructive",
      });
      return;
    }

    setIsWriting(true);
    setTxStatus({ status: 'pending' });

    try {
      // Store message in contract
      const tx = await storeMessage(newMessage.trim());
      
      setTxStatus({ 
        status: 'pending', 
        hash: tx.hash 
      });

      toast({
        title: "Transaction Sent!",
        description: "Your message is being stored on the blockchain.",
      });

      // Wait for confirmation
      const result = await waitForMessageTransaction(tx.hash);
      
      if (result.success) {
        setTxStatus({
          status: 'confirmed',
          hash: tx.hash,
          blockNumber: result.blockNumber,
          gasUsed: result.gasUsed
        });

        toast({
          title: "Message Stored!",
          description: "Your message has been permanently stored on the blockchain.",
        });

        // Clear input and refresh contract state
        setNewMessage('');
        await loadContractState();
      } else {
        setTxStatus({ status: 'failed' });
        toast({
          title: "Transaction Failed",
          description: "The transaction was not successful.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Contract interaction error:', error);
      setTxStatus({ status: 'failed' });
      
      toast({
        title: "Contract Interaction Failed",
        description: error.message || "Failed to store message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWriting(false);
    }
  };

  const resetTransaction = () => {
    setTxStatus({ status: 'idle' });
    setNewMessage('');
  };

  const getStatusIcon = () => {
    switch (txStatus.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (txStatus.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
          <FileContract className="w-4 h-4" />
          <span>Smart Contract Module</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Contract Interaction</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Interact with a simple smart contract that stores messages on the blockchain. 
          Experience how decentralized applications work.
        </p>
      </div>

      {/* Wallet Check */}
      {!account && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Please connect your wallet first to interact with smart contracts.{' '}
            <a href="/wallet" className="underline hover:text-orange-900">
              Go to Wallet page
            </a>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contract Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-purple-600" />
              <span>Contract Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contract Address */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium mb-1">Contract Address</div>
              <div className="font-mono text-xs break-all text-purple-800">
                {getContractAddress()}
              </div>
              <a 
                href={`https://sepolia.etherscan.io/address/${getContractAddress()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm mt-2"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Current Message */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Stored Message</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadContractState}
                  disabled={isReading}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isReading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border min-h-[100px]">
                {isReading ? (
                  <div className="animate-pulse text-gray-500">Loading...</div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                      <div className="text-gray-800 leading-relaxed">
                        {contractState.message || "No message stored yet"}
                      </div>
                    </div>
                    
                    {contractState.sender && contractState.sender !== "0x0000000000000000000000000000000000000000" && (
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <User className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          Last updated by: {formatAddress(contractState.sender)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interaction Panel */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Store New Message</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {account ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message to store on the blockchain..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isWriting}
                    className="resize-none"
                    rows={4}
                    maxLength={280}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {newMessage.length}/280 characters
                  </div>
                </div>

                <Button
                  onClick={handleStoreMessage}
                  disabled={isWriting || txStatus.status === 'pending' || !newMessage.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isWriting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Storing Message...
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4 mr-2" />
                      Store Message
                    </>
                  )}
                </Button>

                {/* Transaction Status */}
                {txStatus.status !== 'idle' && (
                  <div className="space-y-3 p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon()}
                      <Badge className={getStatusColor()}>
                        {txStatus.status === 'pending' && 'Transaction Pending'}
                        {txStatus.status === 'confirmed' && 'Message Stored!'}
                        {txStatus.status === 'failed' && 'Transaction Failed'}
                      </Badge>
                    </div>

                    {txStatus.hash && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Transaction Hash:</div>
                        <div className="p-2 bg-white rounded border">
                          <code className="text-xs font-mono break-all">
                            {txStatus.hash}
                          </code>
                        </div>
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${txStatus.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <span>View Transaction</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {txStatus.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        onClick={resetTransaction}
                        className="w-full"
                      >
                        Store Another Message
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <FileContract className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <div className="text-lg font-medium mb-2">Wallet Required</div>
                <div className="text-sm">Connect your wallet to interact with the smart contract</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Content */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-purple-800">🎓 Smart Contract Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-purple-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">What Are Smart Contracts?</h4>
              <ul className="text-sm space-y-1">
                <li>• Self-executing code on blockchain</li>
                <li>• No intermediaries needed</li>
                <li>• Transparent and immutable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contract Functions</h4>
              <ul className="text-sm space-y-1">
                <li>• Read functions (free to call)</li>
                <li>• Write functions (require gas)</li>
                <li>• Events for logging</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Use Cases</h4>
              <ul className="text-sm space-y-1">
                <li>• DeFi (lending, trading)</li>
                <li>• NFTs and digital ownership</li>
                <li>• DAOs and governance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}