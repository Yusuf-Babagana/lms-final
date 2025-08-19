'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  ExternalLink, 
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Palette
} from 'lucide-react';
import { 
  getCurrentAccount, 
  initializeProvider 
} from '@/lib/ethereum';
import { useToast } from '@/hooks/use-toast';

// Mock NFT data for demonstration
const mockNFTs = [
  {
    id: 1,
    name: "Blockchain Learner #001",
    description: "Commemorative NFT for completing the blockchain workshop",
    image: "https://images.pexels.com/photos/7567228/pexels-photo-7567228.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    collection: "Learning Lab Collection",
    tokenId: "1",
    owned: true
  },
  {
    id: 2,
    name: "Smart Contract Explorer",
    description: "Earned by successfully interacting with smart contracts",
    image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    collection: "Achievement Collection",
    tokenId: "42",
    owned: false
  },
  {
    id: 3,
    name: "Transaction Master",
    description: "Successfully sent your first blockchain transaction",
    image: "https://images.pexels.com/photos/7567432/pexels-photo-7567432.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    collection: "Learning Lab Collection",
    tokenId: "123",
    owned: true
  }
];

interface MintStatus {
  status: 'idle' | 'pending' | 'confirmed' | 'failed';
  hash?: string;
  tokenId?: string;
}

export default function NFTPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [nfts, setNfts] = useState(mockNFTs);
  const [mintStatus, setMintStatus] = useState<MintStatus>({ status: 'idle' });
  const [isMinting, setIsMinting] = useState(false);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    loadNFTs();
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

  const loadNFTs = async () => {
    setIsLoadingNFTs(true);
    try {
      // In a real app, this would fetch from blockchain/OpenSea API
      // For demo, we'll use mock data with slight delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNfts(mockNFTs);
    } catch (error) {
      console.error('Error loading NFTs:', error);
      toast({
        title: "Error Loading NFTs",
        description: "Could not load NFT collection. Using demo data.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNFTs(false);
    }
  };

  const handleMintNFT = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    setMintStatus({ status: 'pending' });

    try {
      // Simulate NFT minting process
      toast({
        title: "Minting Started",
        description: "Your NFT is being minted on the blockchain.",
      });

      // Simulate transaction hash
      const mockTxHash = "0x" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
      setMintStatus({ 
        status: 'pending', 
        hash: mockTxHash 
      });

      // Simulate network confirmation delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful mint
      const newTokenId = Math.floor(Math.random() * 10000).toString();
      
      setMintStatus({
        status: 'confirmed',
        hash: mockTxHash,
        tokenId: newTokenId
      });

      toast({
        title: "NFT Minted Successfully!",
        description: `Your Learning Lab NFT #${newTokenId} has been minted.`,
      });

      // Add new NFT to collection
      const newNFT = {
        id: Date.now(),
        name: `Learning Lab NFT #${newTokenId}`,
        description: "Exclusive NFT for blockchain workshop participants",
        image: "https://images.pexels.com/photos/7567371/pexels-photo-7567371.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
        collection: "Learning Lab Collection",
        tokenId: newTokenId,
        owned: true
      };

      setNfts(prev => [newNFT, ...prev]);
      
    } catch (error: any) {
      console.error('Minting error:', error);
      setMintStatus({ status: 'failed' });
      
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const resetMinting = () => {
    setMintStatus({ status: 'idle' });
  };

  const getStatusIcon = () => {
    switch (mintStatus.status) {
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
    switch (mintStatus.status) {
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

  const ownedNFTs = nfts.filter(nft => nft.owned);
  const availableNFTs = nfts.filter(nft => !nft.owned);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
          <ImageIcon className="w-4 h-4" />
          <span>NFT Module</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">NFT Exploration</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover Non-Fungible Tokens (NFTs) and learn how they represent unique digital ownership on the blockchain.
        </p>
      </div>

      {/* Wallet Check */}
      {!account && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Please connect your wallet first to view and mint NFTs.{' '}
            <a href="/wallet" className="underline hover:text-orange-900">
              Go to Wallet page
            </a>
          </AlertDescription>
        </Alert>
      )}

      {account && (
        <>
          {/* Mint Section */}
          <Card className="border-2 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Mint Your Learning NFT</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Mint a commemorative NFT to celebrate your blockchain learning journey! 
                    This unique digital asset will be yours forever.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Features:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Unique artwork generated for you</li>
                      <li>• Permanent proof of completion</li>
                      <li>• Transferable and tradeable</li>
                      <li>• Part of exclusive Learning Lab collection</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleMintNFT}
                    disabled={isMinting || mintStatus.status === 'pending'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isMinting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Mint NFT (Free)
                      </>
                    )}
                  </Button>
                </div>

                {/* Mint Status */}
                <div className="space-y-4">
                  {mintStatus.status !== 'idle' ? (
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-2 mb-3">
                        {getStatusIcon()}
                        <Badge className={getStatusColor()}>
                          {mintStatus.status === 'pending' && 'Minting in Progress'}
                          {mintStatus.status === 'confirmed' && 'NFT Minted Successfully!'}
                          {mintStatus.status === 'failed' && 'Minting Failed'}
                        </Badge>
                      </div>

                      {mintStatus.hash && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Transaction Hash:</div>
                          <div className="p-2 bg-gray-50 rounded border">
                            <code className="text-xs font-mono break-all">
                              {mintStatus.hash}
                            </code>
                          </div>
                        </div>
                      )}

                      {mintStatus.status === 'confirmed' && mintStatus.tokenId && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                          <div className="text-sm font-medium text-green-800">
                            🎉 Your NFT Token ID: #{mintStatus.tokenId}
                          </div>
                          <Button
                            variant="outline"
                            onClick={resetMinting}
                            className="mt-2 w-full"
                          >
                            Mint Another NFT
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-lg border text-center">
                      <Palette className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                      <div className="text-gray-600">Ready to mint your unique NFT</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your NFTs */}
          {ownedNFTs.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your NFTs</h2>
                <Badge className="bg-green-100 text-green-700">
                  {ownedNFTs.length} Owned
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedNFTs.map((nft) => (
                  <Card key={nft.id} className="hover:shadow-lg transition-shadow border-2">
                    <div className="aspect-square">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{nft.name}</h3>
                        <p className="text-sm text-gray-600">{nft.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            #{nft.tokenId}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Owned
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {nft.collection}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Explore More NFTs */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Explore Collection</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableNFTs.map((nft) => (
                <Card key={nft.id} className="hover:shadow-lg transition-shadow border-2 opacity-75">
                  <div className="aspect-square relative">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-t-lg">
                      <Badge className="bg-gray-800 text-white">
                        Not Owned
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{nft.name}</h3>
                      <p className="text-sm text-gray-600">{nft.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          #{nft.tokenId}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {nft.collection}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Educational Content */}
      <Card className="border-pink-200 bg-pink-50/30">
        <CardHeader>
          <CardTitle className="text-pink-800">🎓 NFT Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-pink-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">What Are NFTs?</h4>
              <ul className="text-sm space-y-1">
                <li>• Non-Fungible Tokens</li>
                <li>• Unique digital assets</li>
                <li>• Proof of ownership</li>
                <li>• Cannot be replicated</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Use Cases</h4>
              <ul className="text-sm space-y-1">
                <li>• Digital art and collectibles</li>
                <li>• Gaming items and avatars</li>
                <li>• Event tickets and certificates</li>
                <li>• Virtual real estate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Features</h4>
              <ul className="text-sm space-y-1">
                <li>• Stored on blockchain</li>
                <li>• Transferable ownership</li>
                <li>• Metadata and attributes</li>
                <li>• Smart contract powered</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}