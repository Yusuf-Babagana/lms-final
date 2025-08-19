import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Blocks, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const concepts = [
  {
    icon: Blocks,
    title: "Blocks & Chain",
    description: "Learn how transactions are grouped into blocks and linked together to form an immutable chain.",
    color: "bg-blue-100 text-blue-700",
    details: [
      "Each block contains transaction data",
      "Blocks are linked using cryptographic hashes",
      "Once added, blocks cannot be changed"
    ]
  },
  {
    icon: Users,
    title: "Decentralization",
    description: "Understand how blockchain eliminates the need for central authorities through distributed consensus.",
    color: "bg-green-100 text-green-700",
    details: [
      "No single point of control",
      "Network of computers verify transactions",
      "Reduces risk of censorship and failure"
    ]
  },
  {
    icon: Shield,
    title: "Cryptographic Security",
    description: "Explore how cryptography secures transactions and maintains network integrity.",
    color: "bg-purple-100 text-purple-700",
    details: [
      "Digital signatures prove ownership",
      "Hash functions ensure data integrity",
      "Public-key cryptography enables secure transfers"
    ]
  },
  {
    icon: Zap,
    title: "Smart Contracts",
    description: "Discover programmable contracts that execute automatically when conditions are met.",
    color: "bg-orange-100 text-orange-700",
    details: [
      "Code that runs on the blockchain",
      "Automatic execution without intermediaries",
      "Powers DeFi, NFTs, and more"
    ]
  }
];

const learningPath = [
  { step: 1, title: "Connect Your Wallet", href: "/wallet", completed: false },
  { step: 2, title: "Send a Transaction", href: "/transactions", completed: false },
  { step: 3, title: "Interact with Smart Contracts", href: "/contracts", completed: false },
  { step: 4, title: "Explore NFTs", href: "/nft", completed: false },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          <Zap className="w-4 h-4" />
          <span>Interactive Blockchain Workshop</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Learn Blockchain
          <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Through Practice
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Master blockchain fundamentals through hands-on experience. Connect real wallets, 
          send transactions, and interact with smart contracts on Ethereum's testnet.
        </p>
        
        <div className="flex justify-center">
          <Link href="/wallet">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 text-lg">
              Start Learning
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Core Concepts */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Core Blockchain Concepts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Understanding these fundamental concepts will help you navigate the blockchain ecosystem with confidence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${concept.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{concept.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{concept.description}</p>
                  <ul className="space-y-2">
                    {concept.details.map((detail, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Learning Path */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Learning Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow this step-by-step path to gain hands-on experience with blockchain technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningPath.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      Step {item.step}
                    </Badge>
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          You'll need MetaMask wallet and some Sepolia testnet ETH to complete the interactive modules. 
          Don't worry - testnet tokens are free and safe to experiment with!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/wallet">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Connect Wallet
            </Button>
          </Link>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            <a href="https://faucet.sepolia.dev/" target="_blank" rel="noopener noreferrer">
              Get Test ETH
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}