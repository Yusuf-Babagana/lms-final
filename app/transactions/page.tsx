'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRightLeft, 
  ExternalLink, 
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  RefreshCw
} from 'lucide-react';
import { 
  getCurrentAccount, 
  getBalance,
  sendTransaction,
  waitForTransaction,
  getTransaction,
  initializeProvider 
} from '@/lib/ethereum';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

interface TransactionStatus {
  hash?: string;
  status: 'pending' | 'confirmed' | 'failed' | 'idle';
  blockNumber?: number;
  gasUsed?: string;
  effectiveGasPrice?: string;
}

export default function TransactionsPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<TransactionStatus>({ status: 'idle' });
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      initializeProvider();
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        setAccount(currentAccount);
        const bal = await getBalance(currentAccount);
        setBalance(bal);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleSendTransaction = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!recipientAddress || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in both recipient address and amount.",
        variant: "destructive",
      });
      return;
    }

    if (!ethers.isAddress(recipientAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (balance && amountNum > parseFloat(balance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough ETH for this transaction.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setTxStatus({ status: 'pending' });

    try {
      // Send transaction
      const tx = await sendTransaction(recipientAddress, amount);
      
      setTxStatus({ 
        status: 'pending', 
        hash: tx.hash 
      });

      toast({
        title: "Transaction Sent!",
        description: "Your transaction has been submitted to the network.",
      });

      // Wait for confirmation
      const receipt = await waitForTransaction(tx.hash);
      
      if (receipt) {
        setTxStatus({
          status: 'confirmed',
          hash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          effectiveGasPrice: receipt.gasPrice?.toString()
        });

        toast({
          title: "Transaction Confirmed!",
          description: `Transaction included in block ${receipt.blockNumber}.`,
        });

        // Refresh balance
        const newBalance = await getBalance(account);
        setBalance(newBalance);
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxStatus({ status: 'failed' });
      
      let errorMessage = "Transaction failed. Please try again.";
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = "Insufficient funds for transaction + gas fees.";
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        errorMessage = "Unable to estimate gas. Please check the recipient address.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const resetTransaction = () => {
    setTxStatus({ status: 'idle' });
    setRecipientAddress('');
    setAmount('');
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
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transaction Module</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Send Transactions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn how to send ETH transactions on the blockchain. You'll see real-time 
          transaction status and understand gas fees.
        </p>
      </div>

      {/* Wallet Check */}
      {!account && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Please connect your wallet first to send transactions.{' '}
            <a href="/wallet" className="underline hover:text-orange-900">
              Go to Wallet page
            </a>
          </AlertDescription>
        </Alert>
      )}

      {account && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-blue-600" />
                <span>Send ETH</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Balance */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Your Balance</div>
                <div className="text-xl font-bold text-blue-800">
                  {balance ? `${parseFloat(balance).toFixed(6)} ETH` : 'Loading...'}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    disabled={isSending}
                    className="font-mono text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Enter a valid Ethereum address (starts with 0x)
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (ETH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isSending}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Minimum: 0.000001 ETH (remember to leave some for gas fees)
                  </div>
                </div>

                <Button
                  onClick={handleSendTransaction}
                  disabled={isSending || txStatus.status === 'pending'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Transaction
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Status */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>Transaction Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {txStatus.status === 'idle' ? (
                <div className="text-center text-gray-500 py-8">
                  <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <div className="text-lg font-medium mb-2">Ready to Send</div>
                  <div className="text-sm">Fill out the form to send your first transaction</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    {getStatusIcon()}
                    <Badge className={getStatusColor()}>
                      {txStatus.status === 'pending' && 'Pending Confirmation'}
                      {txStatus.status === 'confirmed' && 'Confirmed'}
                      {txStatus.status === 'failed' && 'Failed'}
                    </Badge>
                  </div>

                  {/* Transaction Hash */}
                  {txStatus.hash && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Transaction Hash:</Label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <code className="text-sm font-mono break-all">
                          {txStatus.hash}
                        </code>
                      </div>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${txStatus.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <span>View on Etherscan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Transaction Details */}
                  {txStatus.status === 'confirmed' && (
                    <div className="space-y-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800">Transaction Confirmed!</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-green-600 font-medium">Block:</span>
                          <div className="font-mono">{txStatus.blockNumber}</div>
                        </div>
                        <div>
                          <span className="text-green-600 font-medium">Gas Used:</span>
                          <div className="font-mono">
                            {txStatus.gasUsed ? parseInt(txStatus.gasUsed).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    onClick={resetTransaction}
                    className="w-full"
                  >
                    Send Another Transaction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Educational Content */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-blue-800">🎓 Transaction Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Gas Fees</h4>
              <ul className="text-sm space-y-1">
                <li>• Payment to network validators</li>
                <li>• Varies based on network congestion</li>
                <li>• Required for all transactions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Transaction Lifecycle</h4>
              <ul className="text-sm space-y-1">
                <li>• 1. Broadcast to network</li>
                <li>• 2. Picked up by validators</li>
                <li>• 3. Included in a block</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Security</h4>
              <ul className="text-sm space-y-1">
                <li>• Transactions are immutable</li>
                <li>• Always verify recipient address</li>
                <li>• Double-check amounts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}