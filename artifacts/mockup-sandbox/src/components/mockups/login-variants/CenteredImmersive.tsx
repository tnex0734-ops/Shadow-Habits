import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CenteredImmersive() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080f08] flex items-center justify-center font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 8s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glass-panel {
          background: rgba(8, 15, 8, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(230, 57, 70, 0.3);
          box-shadow: 0 0 40px rgba(230, 57, 70, 0.1), inset 0 0 20px rgba(230, 57, 70, 0.05);
        }
      `}} />

      {/* Deep Background Layers */}
      <div className="absolute inset-0 z-0 bg-[#010a01]">
        {/* Radial dark vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#010a01_100%)] z-10"></div>
        
        {/* Animated Crimson Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,rgba(230,57,70,0.15)_0%,transparent_70%)] rounded-full animate-pulse-glow mix-blend-screen z-0"></div>
        <div className="absolute top-1/3 left-1/3 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[radial-gradient(circle,rgba(230,57,70,0.1)_0%,transparent_60%)] rounded-full animate-pulse-glow mix-blend-screen z-0" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle noise/pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Diagonal slashing energy lines (linear gradients) */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(45deg,transparent_45%,rgba(230,57,70,0.1)_49%,rgba(230,57,70,0.3)_50%,rgba(230,57,70,0.1)_51%,transparent_55%)]"></div>
        <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(-60deg,transparent_40%,rgba(230,57,70,0.1)_49%,rgba(230,57,70,0.2)_50%,rgba(230,57,70,0.1)_51%,transparent_60%)]"></div>
      </div>

      {/* Ghost Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none select-none">
        <h1 
          className="text-[15vw] md:text-[200px] font-bold text-transparent tracking-tighter whitespace-nowrap -rotate-6 opacity-20"
          style={{ 
            fontFamily: "'Bebas Neue', 'Rajdhani', sans-serif",
            WebkitTextStroke: '2px rgba(230, 57, 70, 0.3)'
          }}
        >
          KING OF CURSES
        </h1>
      </div>

      {/* Main Form Card Container */}
      <div className="relative z-20 w-full max-w-md px-6 animate-float">
        <div className="glass-panel rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden group">
          {/* Card internal glow highlight on hover/focus */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E63946] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Logo Area */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 border-2 border-[#E63946] flex items-center justify-center mb-4 rotate-45 shadow-[0_0_15px_rgba(230,57,70,0.5)]">
              <span className="font-bold text-xl -rotate-45 text-[#E63946] tracking-tighter" style={{ fontFamily: "'Bebas Neue', 'Rajdhani', sans-serif" }}>SH</span>
            </div>
            <h2 className="text-3xl font-bold uppercase tracking-widest text-center" style={{ fontFamily: "'Bebas Neue', 'Rajdhani', sans-serif" }}>
              Welcome Back
            </h2>
            <p className="text-[#a0a8a0] text-sm mt-2 font-medium tracking-wide">
              Re-enter the Domain.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#a0a8a0] uppercase tracking-wider text-xs font-semibold">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="vessel@shadowhabits.com" 
                className="bg-[#010a01]/80 border-[#1a2e1a] focus-visible:border-[#E63946] focus-visible:ring-1 focus-visible:ring-[#E63946] text-white placeholder:text-[#3a4a3a] h-12 rounded-none transition-colors"
              />
            </div>
            
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#a0a8a0] uppercase tracking-wider text-xs font-semibold">Password</Label>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="bg-[#010a01]/80 border-[#1a2e1a] focus-visible:border-[#E63946] focus-visible:ring-1 focus-visible:ring-[#E63946] text-white placeholder:text-[#3a4a3a] h-12 rounded-none pr-10 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a8a0] hover:text-[#E63946] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-4 bg-[#E63946] hover:bg-[#c92a36] text-white font-bold uppercase tracking-widest text-md rounded-none transition-all hover:shadow-[0_0_20px_rgba(230,57,70,0.6)] group relative overflow-hidden"
              style={{ fontFamily: "'Bebas Neue', 'Rajdhani', sans-serif" }}
            >
              <span className="relative z-10">Enter the Domain</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <a href="#" className="text-xs text-[#a0a8a0] hover:text-[#E63946] transition-colors uppercase tracking-widest font-semibold inline-flex items-center gap-2 group">
              <span className="w-4 h-[1px] bg-[#a0a8a0] group-hover:bg-[#E63946] transition-colors"></span>
              Choose your companion
              <span className="w-4 h-[1px] bg-[#a0a8a0] group-hover:bg-[#E63946] transition-colors"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
