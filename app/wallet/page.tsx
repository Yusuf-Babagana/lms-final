'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { 
  connectWallet, 
  getCurrentAccount, 
  getBalance,
  switchToSepolia,
  initializeProvider 
} from '@/lib/ethereum';
import { useToast } from '@/hooks/use-toast';

export default function WalletPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const { toast } = useToast();

  // Check if MetaMask is installed
  useEffect(() => {
    setHasMetaMask(typeof window !== 'undefined' && !!window.ethereum);
    
    // Check if already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      initializeProvider();
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        setAccount(currentAccount);
        await loadBalance(currentAccount);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const loadBalance = async (address: string) => {
    setIsLoadingBalance(true);
    try {
      const bal = await getBalance(address);
      setBalance(bal);
    } catch (error) {
      console.error('Error loading balance:', error);
      toast({
        title: "Error Loading Balance",
        description: "Could not fetch wallet balance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleConnect = async () => {
    if (!hasMetaMask) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // First switch to Sepolia
      await switchToSepolia();
      
      // Then connect wallet
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      await loadBalance(connectedAccount);
      
      toast({
        title: "Wallet Connected!",
        description: "Successfully connected to MetaMask on Sepolia testnet.",
      });
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRefreshBalance = async () => {
    if (account) {
      await loadBalance(account);
    }
  };

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <Wallet className="w-4 h-4" />
          <span>Wallet Module</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Connect Your Wallet</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect your MetaMask wallet to interact with the Ethereum blockchain. 
          We'll use the Sepolia testnet for safe experimentation.
        </p>
      </div>

      {/* MetaMask Check */}
      {!hasMetaMask && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            MetaMask is not installed. Please{' '}
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-orange-900"
            >
              download MetaMask
            </a>
            {' '}to continue with this tutorial.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Connection Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <span>Connection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {account ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Connected
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Wallet Address:
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                    <code className="text-sm flex-1 font-mono">
                      {shortenAddress(account)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAddress}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <a 
                  href={`https://sepolia.etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <span>View on Etherscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <Badge variant="outline">Not Connected</Badge>
                </div>
                
                <Button 
                  onClick={handleConnect}
                  disabled={isConnecting || !hasMetaMask}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect MetaMask
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span>💰</span>
                <span>Wallet Balance</span>
              </span>
              {account && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshBalance}
                  disabled={isLoadingBalance}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {account ? (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {isLoadingBalance ? (
                      <div className="animate-pulse">Loading...</div>
                    ) : (
                      `${parseFloat(balance || '0').toFixed(4)} ETH`
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Sepolia Testnet</div>
                </div>
                
                {balance && parseFloat(balance) < 0.001 && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      Low balance detected. Get free testnet ETH from the{' '}
                      <a 
                        href="https://faucet.sepolia.dev/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-900"
                      >
                        Sepolia faucet
                      </a>
                      .
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-2xl font-bold">--</div>
                <div className="text-sm mt-1">Connect wallet to view balance</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Content */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-blue-800">🎓 What You Just Learned</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Wallet Connection</h4>
              <ul className="text-sm space-y-1">
                <li>• MetaMask acts as your digital wallet</li>
                <li>• Each wallet has a unique address</li>
                <li>• Private keys are stored securely in MetaMask</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Testnet Usage</h4>
              <ul className="text-sm space-y-1">
                <li>• Sepolia is a safe testing environment</li>
                <li>• Test ETH has no real value</li>
                <li>• Perfect for learning without risk</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {account && (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Ready for the Next Step?</h3>
          <p className="text-gray-600">
            Now that your wallet is connected, let's learn how to send transactions!
          </p>
          <Button 
            asChild
            className="bg-blue-600 hover:bg-blue-700"
          >
            <a href="/transactions">
              Continue to Transactions →
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}