import React, { useState } from 'react';
import { Rocket, Search, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

const WhitelistChecker = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null); // { found: true/false, type: 'GTD'/'FCFS' }
  const [error, setError] = useState('');

  // Replace this with your actual Google Sheets CSV URL
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSRCUeUXGJbzhmuGf8Z57cDe4A5OalI0mOF9EUyzJgSjRFUKLT_Un4ONGkepWznpA/pub?output=csv';

  const checkWhitelist = async () => {
    if (!walletAddress || walletAddress.length < 10) {
      setError('Please enter a valid wallet address');
      return;
    }

    setChecking(true);
    setError('');
    setResult(null);

    try {
      // Fetch the CSV from Google Sheets
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();

      // Parse CSV
      const lines = csvText.split('\n');
      const cleanAddress = walletAddress.trim().toLowerCase();

      let found = false;
      let whitelistType = '';

      // Skip header row, start from index 1
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [address, type] = line.split(',').map(item => item.trim());
        
        if (address.toLowerCase() === cleanAddress) {
          found = true;
          whitelistType = type.toUpperCase();
          break;
        }
      }

      setResult({ found, type: whitelistType });

    } catch (err) {
      console.error('Error checking whitelist:', err);
      setError('Failed to check whitelist. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkWhitelist();
    }
  };

  const reset = () => {
    setWalletAddress('');
    setResult(null);
    setError('');
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
          <div className="flex items-center gap-3">
            <Rocket className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              UFONADS WHITELIST CHECKER
            </h1>
          </div>
        </div>
      </header>

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Check Whitelist Status</h2>
            <p className="text-slate-300 text-lg">Enter your wallet address to check if you're whitelisted</p>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-3">
                Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="0x..."
                  className="w-full px-6 py-4 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={checkWhitelist}
              disabled={checking || !walletAddress}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {checking ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Check Whitelist</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8">
              {result.found ? (
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    Whitelisted! 🎉
                  </h3>
                  <div className="inline-block px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full mt-4">
                    <span className="text-xl font-bold text-green-300">
                      {result.type} Whitelist
                    </span>
                  </div>
                  <p className="text-slate-300 mt-6">
                    {result.type === 'GTD' 
                      ? 'You have Guaranteed whitelist access! You can mint up to 2 NFTs.'
                      : 'You have FCFS whitelist access! You can mint 1 NFT.'}
                  </p>
                  <button
                    onClick={reset}
                    className="mt-6 px-6 py-2 border border-green-400/30 rounded-lg hover:bg-green-400/10 transition-colors"
                  >
                    Check Another Address
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-2 border-red-500/30 rounded-2xl p-8 text-center">
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <h3 className="text-2xl font-bold text-red-400 mb-2">
                    Not Whitelisted
                  </h3>
                  <p className="text-slate-300 mt-4">
                    This address is not on the whitelist. You can still mint during the public sale!
                  </p>
                  <button
                    onClick={reset}
                    className="mt-6 px-6 py-2 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    Check Another Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-4 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">GTD</div>
            <div className="text-sm text-slate-400">Guaranteed • 2 NFTs Max</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400 mb-2">FCFS</div>
            <div className="text-sm text-slate-400">First Come First Serve • 1 NFT Max</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhitelistChecker;