import React, { useState } from 'react';
import { Rocket, Zap, Trophy, Users, ArrowRight, Menu, X } from 'lucide-react';

const UfonadsLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-60 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-purple-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Rocket className="w-10 h-10 text-cyan-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ALIEN
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
              <a href="#utility" className="hover:text-cyan-400 transition-colors">Utility</a>
              <a href="#roadmap" className="hover:text-cyan-400 transition-colors">Roadmap</a>
              <button onClick={() => window.location.href = '/mint'} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105">
                Mint Now
              </button>
              <button onClick={() => window.location.href = '/raffle'} className="px-6 py-2 border border-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-all">
                Enter Raffle
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3">
              <a href="#about" className="block py-2 hover:text-cyan-400">About</a>
              <a href="#utility" className="block py-2 hover:text-cyan-400">Utility</a>
              <a href="#roadmap" className="block py-2 hover:text-cyan-400">Roadmap</a>
              <button onClick={() => window.location.href = '/mint'} className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold">
                Mint Now
              </button>
              <button onClick={() => window.location.href = '/raffle'} className="w-full py-2 border border-cyan-400 rounded-lg font-semibold">
                Enter Raffle
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <span className="text-sm font-semibold text-purple-300">🛸 Building on Monad</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ALIEN
                </span>
                <br />
                <span className="text-white">Alien NFTs</span>
                <br />
                <span className="text-slate-300 text-3xl md:text-5xl">on Monad</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                The signal has been received.
                Only true explorers can decode it.
                Mint your Alien, join the mission, and unlock weekly MONAD rewards known only to holders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.location.href = '/mint'} className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                  Mint Your Alien
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-cyan-400 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all">
                  View Collection
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">999</div>
                  <div className="text-sm text-slate-400">Total Supply</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">500</div>
                  <div className="text-sm text-slate-400">MON Prize</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-400">Weekly</div>
                  <div className="text-sm text-slate-400">Raffles</div>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
                <img 
                    src="u.jpeg"  
                    className="w-full aspect-square object-cover rounded-3xl border-2 border-purple-500/30"
                />
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 border-t border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                What is ALIEN?
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A collection of 999 unique alien NFTs living on Monad. Each NFT grants you access to exclusive holder benefits and weekly prize raffles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Exclusive Community</h3>
              <p className="text-slate-300">
                Join a thriving community of alien enthusiasts and NFT collectors building on Monad.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Weekly Raffles</h3>
              <p className="text-slate-300">
                Automatic entry into weekly 500 MON prize raffles. Winners selected every Saturday.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Built on Monad</h3>
              <p className="text-slate-300">
                Experience lightning-fast transactions and low fees on the Monad blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Utility Section */}
      <section id="utility" className="relative py-20 border-t border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Holder Utility
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎰</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Weekly Raffle Access</h3>
                  <p className="text-slate-300">
                    Enter weekly raffles to win 500 MON. One entry per holder, every Sunday-Friday.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👽</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Unique Aliens</h3>
                  <p className="text-slate-300">
                    Each alien is procedurally generated with rare traits and attributes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Future Airdrops</h3>
                  <p className="text-slate-300">
                    Receive exclusive airdrops and benefits as the project evolves.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Trade on Magic Eden</h3>
                  <p className="text-slate-300">
                    Buy, sell, and trade your aliens on Magic Eden marketplace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 border-t border-purple-500/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border-2 border-purple-500/30 rounded-3xl p-12 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join the Invasion?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Mint your alien NFT now and start winning weekly MON prizes. Limited supply of 999!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => window.location.href = '/mint'} className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-xl hover:from-purple-500 hover:to-cyan-500 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                Mint Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => window.location.href = '/raffle'} className="px-10 py-5 border-2 border-cyan-400 rounded-xl font-bold text-xl hover:bg-cyan-400/10 transition-all">
                Enter Raffle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-purple-500/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ALIEN
              </span>
            </div>
            <div className="flex gap-6 text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Discord</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Magic Eden</a>
            </div>
            <p className="text-slate-400">Built on Monad • 2025 ALIEN</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UfonadsLanding;