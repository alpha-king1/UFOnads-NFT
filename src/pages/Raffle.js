
import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Trophy, Clock, Wallet, CheckCircle, XCircle, Zap } from 'lucide-react';
import { ethers } from 'ethers';

// CONTRACT ADDRESSES
const NFT_CONTRACT_ADDRESS = "0xc96eE45A7afe24f549B4480Cd60d7C2B7fd14871";
const RAFFLE_CONTRACT_ADDRESS = "0xc412212BB476fF78bb55FDFc9f19AC497F02556A";

// MONAD TESTNET CONFIG
const MONAD_TESTNET = {
  chainId: '10143', // 41454 in hex
  chainName: 'Monad Testnet',
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  blockExplorerUrls: ['https://testnet.monadexplorer.com']
};

// CONTRACT ABIs
const NFT_ABI = ["function balanceOf(address owner) view returns (uint256)"];
const RAFFLE_ABI = [
  "function enterRaffle() external",
  "function hasUserEntered(address) view returns (bool)",
  "function getCurrentRaffleId() view returns (uint256)",
  "function getRaffleEndTime() view returns (uint256)",
  "function getPrizePool() view returns (uint256)"
];

const AlienRaffleUI = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isHolder, setIsHolder] = useState('');
  const [hasEntered, setHasEntered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 23, seconds: 45 });
  const [currentRound, setCurrentRound] = useState(12);
  const [prizePool, setPrizePool] = useState('500');
  const [isEntering, setIsEntering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock previous winners
  const previousWinners = [
    { round: 11, address: '0x742d...3a9f', prize: '500 MONAD', date: 'Oct 15, 2025' },
    { round: 10, address: '0x8f1c...2b4e', prize: '500 MONAD', date: 'Oct 8, 2025' },
    { round: 9, address: '0x3a2f...7c8d', prize: '500 MONAD', date: 'Oct 1, 2025' },
  ];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const connectWallet = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    // Switch to Monad Testnet
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [MONAD_TESTNET],
        });
      }
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    setWalletAddress(shortAddress);
    setWalletConnected(true);

    //Check NFT balance
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
    const balance = await nftContract.balanceOf(address);
    setIsHolder(balance.gt(0));

    // Check if already entered
    if (balance.gt(0)) {
       const raffleContract = new ethers.Contract(RAFFLE_CONTRACT_ADDRESS, RAFFLE_ABI, provider);
       const entered = await raffleContract.hasUserEntered(address);
       setHasEntered(entered);
    }
  } 
  catch (error) {
    console.error("Error connecting wallet:", error);
    alert('Failed to connect: ' + error.message);
  }
};

  const enterRaffle = async () => {
  try {
    setIsEntering(true);
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const raffleContract = new ethers.Contract(RAFFLE_CONTRACT_ADDRESS, RAFFLE_ABI, signer);
    
    const tx = await raffleContract.enterRaffle();
    console.log('Transaction:', tx.hash);
    
    await tx.wait();
    
    setHasEntered(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  } catch (error) {
    console.error("Error entering raffle:", error);
    alert('Failed: ' + error.message);
  } finally {
    setIsEntering(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-purple-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ALIEN RAFFLE
              </h1>
            </div>
            
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-3 px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-mono text-sm">{walletAddress}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-24 right-8 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in z-50">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Successfully entered the raffle! 🎉</span>
          </div>
        )}

        {/* Main Raffle Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">ROUND #{currentRound}</span>
            </div>
            
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {prizePool} MONAD
            </h2>
            <p className="text-slate-300 text-lg">Weekly Prize Pool</p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-1">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Entry Section */}
          {!walletConnected ? (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 text-center">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-slate-500" />
              <h3 className="text-xl font-semibold mb-2 text-slate-300">Connect Your Wallet</h3>
              <p className="text-slate-400">Connect your wallet to check eligibility and enter the raffle</p>
            </div>
          ) : !isHolder ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold mb-2 text-red-300">Not Eligible</h3>
              <p className="text-red-300/80">You need to hold an Alien NFT to participate in the raffle</p>
            </div>
          ) : hasEntered ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2 text-green-300">You're In! 👽</h3>
              <p className="text-green-300/80">Your entry has been confirmed for this week's raffle</p>
            </div>
          ) : (
            <button
              onClick={enterRaffle}
              disabled={isEntering}
              className="w-full py-6 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-xl hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isEntering ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entering Raffle...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>Enter Raffle Now</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <Wallet className="w-8 h-8" />,
              title: "Connect Wallet",
              desc: "Connect your wallet and verify you hold an Alien NFT"
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Enter Raffle",
              desc: "One click to enter the weekly raffle draw"
            },
            {
              icon: <Trophy className="w-8 h-8" />,
              title: "Win MONAD",
              desc: "Winner announced every weekend with instant payout"
            }
          ].map((step, idx) => (
            <div key={idx} className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Previous Winners */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold">Previous Winners</h2>
          </div>
          
          <div className="space-y-4">
            {previousWinners.map((winner, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center font-bold">
                    #{winner.round}
                  </div>
                  <div>
                    <div className="font-mono text-cyan-400">{winner.address}</div>
                    <div className="text-sm text-slate-400">{winner.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">{winner.prize}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-purple-500/30 mt-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>Built on Monad • Holders Only Raffle Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default AlienRaffleUI;