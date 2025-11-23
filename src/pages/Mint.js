import React, { useState, useEffect } from 'react';
import { Rocket, Wallet, Plus, Minus, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { ethers } from 'ethers';

// CONTRACT CONFIG
const NFT_CONTRACT_ADDRESS = "0xc96eE45A7afe24f549B4480Cd60d7C2B7fd14871";
const MONAD_TESTNET = {
  chainId: '0x279F',
  chainName: 'Monad Testnet',
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  blockExplorerUrls: ['https://testnet.monadexplorer.com']
};

const NFT_ABI = [
  "function mint(uint256 quantity) payable",
  "function currentPhase() view returns (uint8)",
  "function MINT_PRICE() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function nextTokenId() view returns (uint256)",
  "function gtdWhitelist(address) view returns (bool)",
  "function fcfsWhitelist(address) view returns (bool)",
  "function mintedPerWallet(address) view returns (uint256)",
  "function getRemainingMints(address) view returns (uint256)",
  "function getCurrentPhase() view returns (string)"
];

const UfonadsMint = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Contract data
  const [currentPhase, setCurrentPhase] = useState('Not Started');
  const [mintPrice, setMintPrice] = useState('0.05');
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(10);
  const [isGTD, setIsGTD] = useState(false);
  const [isFCFS, setIsFCFS] = useState(false);
  const [remainingMints, setRemainingMints] = useState(0);
  const [alreadyMinted, setAlreadyMinted] = useState(0);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask!');
        return;
      }

      // Switch to Monad
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

      // Load contract data
      await loadContractData(address, provider);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet');
    }
  };

  const loadContractData = async (address, provider) => {
    try {
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
      
      // Get phase
      const phase = await contract.getCurrentPhase();
      setCurrentPhase(phase);
      
      // Get price
      const price = await contract.MINT_PRICE();
      setMintPrice(ethers.utils.formatEther(price));
      
      // Get supply info
      const minted = await contract.nextTokenId();
      const max = await contract.MAX_SUPPLY();
      setTotalMinted(minted.toNumber());
      setMaxSupply(max.toNumber());
      
      // Check whitelist status
      const gtd = await contract.gtdWhitelist(address);
      const fcfs = await contract.fcfsWhitelist(address);
      setIsGTD(gtd);
      setIsFCFS(fcfs);
      
      // Get remaining mints
      const remaining = await contract.getRemainingMints(address);
      setRemainingMints(remaining.toNumber());
      
      // Get already minted
      const minted_count = await contract.mintedPerWallet(address);
      setAlreadyMinted(minted_count.toNumber());
      
    } catch (error) {
      console.error('Error loading contract data:', error);
    }
  };

  const mintNFT = async () => {
    try {
      setIsMinting(true);
      setError('');
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
      
      const price = await contract.MINT_PRICE();
      const totalCost = price.mul(quantity);
      
      console.log('Minting', quantity, 'NFTs for', ethers.utils.formatEther(totalCost), 'MON');
      
      const tx = await contract.mint(quantity, { value: totalCost });
      console.log('Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('Minting successful!');
      
      setTxSuccess(true);
      setTimeout(() => setTxSuccess(false), 5000);
      
      // Reload data
      const address = await signer.getAddress();
      await loadContractData(address, provider);
      
    } catch (error) {
    console.error('Minting error:', error);
    
    // Handle different error types
    let errorMessage = 'Minting failed';
    
    if (error.code === 4001) {
      errorMessage = 'Transaction rejected';
    } else if (error.reason) {
      // Extract clean error from contract
      if (error.reason.includes('one mint per wallet')) {
        errorMessage = 'You already minted! Max 1 per wallet';
      } else if (error.reason.includes('one per user')) {
        errorMessage = 'Max 1 NFTs per user';
      } else if (error.reason.includes('Max supply')) {
        errorMessage = 'Sold out!';
      } else if (error.reason.includes('Insufficient')) {
        errorMessage = 'Insufficient MON';
      } else {
        errorMessage = error.reason;
      }
    } else if (error.message) {
      errorMessage = error.message.slice(0, 100); // Limit length
    }
    
    setError(errorMessage);
    setTimeout(() => setError(''), 5000); // Auto-hide after 5 seconds
    } finally {
      setIsMinting(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < remainingMints && quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getPhaseColor = () => {
    if (currentPhase.includes('GTD')) return 'from-green-500 to-emerald-500';
    if (currentPhase.includes('FCFS')) return 'from-yellow-500 to-orange-500';
    if (currentPhase.includes('Public')) return 'from-purple-500 to-pink-500';
    return 'from-slate-500 to-slate-600';
  };

  const canMint = () => {
    if (!walletConnected) return false;
    if (currentPhase === 'Not Started') return false;
    if (totalMinted >= maxSupply) return false;
    if (remainingMints === 0) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background stars */}
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
                ALIEN
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

      {/* Success Toast */}
      {txSuccess && (
        <div className="fixed top-24 right-8 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-slide-in">
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Successfully minted! 🎉</span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-24 right-8 bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50">
          <AlertCircle className="w-6 h-6" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Phase Badge */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${getPhaseColor()} rounded-full shadow-lg`}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-white">{currentPhase} Phase</span>
          </div>
        </div>

        {/* Main Mint Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left: NFT Preview */}
          <div className="space-y-6">
            <img 
                    src="/u.jpg" 
                    alt="Alien" 
                    className="w-full aspect-square object-cover rounded-3xl border-2 border-purple-500/30"
                />

            {/* Supply Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Minted</span>
                <span className="font-bold text-cyan-400">{totalMinted} / {maxSupply}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(totalMinted / maxSupply) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right: Mint Interface */}
          <div className="space-y-6">
            {/* Mint Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Mint Your Alien</h2>

              {!walletConnected ? (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-400 mb-6">Connect your wallet to mint</p>
                  <button
                    onClick={connectWallet}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <>
                  {/* Whitelist Status */}
                  {(isGTD || isFCFS) && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">
                          {isGTD ? 'GTD Whitelist' : 'FCFS Whitelist'} ✓
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Already Minted Info */}
                  {alreadyMinted > 0 && (
                    <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <p className="text-cyan-400">You've minted: <span className="font-bold">{alreadyMinted} NFT(s)</span></p>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-400 mb-3">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-4xl font-bold text-cyan-400">{quantity}</div>
                      </div>
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= remainingMints || quantity >= 5}
                        className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-center text-sm text-slate-400 mt-2">
                      {remainingMints > 0 ? `${remainingMints} remaining to be minted` : 'No mints remaining'}
                    </p>
                  </div>

                  {/* Price Info */}
                  <div className="mb-6 p-4 bg-slate-900/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Price per NFT</span>
                      <span className="font-semibold">{mintPrice} MON</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-cyan-400">{(parseFloat(mintPrice) * quantity).toFixed(3)} MON</span>
                    </div>
                  </div>

                  {/* Mint Button */}
                  <button
                    onClick={mintNFT}
                    disabled={!canMint() || isMinting}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isMinting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Minting...</span>
                      </>
                    ) : remainingMints === 0 ? (
                      'Mint Limit Reached'
                    ) : currentPhase === 'Not Started' ? (
                      'Minting Not Started'
                    ) : totalMinted >= maxSupply ? (
                      'Sold Out!'
                    ) : (
                      'Mint Now'
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 border border-purple-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{mintPrice} MON</div>
                <div className="text-sm text-slate-400">Mint Price</div>
              </div>
              <div className="bg-slate-800/30 border border-purple-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{maxSupply}</div>
                <div className="text-sm text-slate-400">Max Supply</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ALIENMint;