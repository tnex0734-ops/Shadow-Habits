import React, { useState } from "react";
import { Eye, EyeOff, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./_group.css";

export function SplitPanel() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#010a01] text-zinc-300 font-sans selection:bg-[#00BFFF]/30">
      {/* LEFT PANEL: Character Showcase */}
      <div className="relative hidden md:flex w-1/2 flex-col items-center justify-center overflow-hidden border-r border-[#00BFFF]/30 animate-pulse-glow bg-[#080f08]">
        {/* Background effects */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "radial-gradient(circle at 50% 50%, #00BFFF 0%, transparent 60%)" 
          }}
        />
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300BFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        {/* Character Placeholder Content */}
        <div className="z-10 flex flex-col items-center text-center animate-float space-y-6">
          <div className="relative w-64 h-96 border border-[#00BFFF]/40 rounded-sm bg-[#010a01]/80 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,191,255,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#00BFFF]/20 to-transparent opacity-50" />
            <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
              <Hexagon className="text-[#00BFFF] w-6 h-6 animate-spin-slow" style={{ animationDuration: "10s" }} />
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {/* Silhouette representation */}
              <div className="w-24 h-24 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center blur-[1px]">
                <div className="w-16 h-16 rounded-full bg-[#00BFFF]/20 animate-pulse" />
              </div>
            </div>
            
            {/* Overlay Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          </div>

          <div className="flex flex-col items-center space-y-2">
            <span className="px-3 py-1 text-xs tracking-widest text-[#00BFFF] border border-[#00BFFF]/50 bg-[#00BFFF]/10 rounded uppercase font-bold shadow-[0_0_10px_rgba(0,191,255,0.2)]">
              Special Grade Sorcerer
            </span>
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white" style={{ fontFamily: "Rajdhani, Bebas Neue, sans-serif" }}>
              Satoru Gojo
            </h1>
            <p className="text-zinc-400 text-sm tracking-widest uppercase">
              Limitless & Six Eyes
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#010a01] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00BFFF]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-10 z-10">
          
          <div className="space-y-2 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-[#00BFFF] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.5)]">
                <Hexagon className="text-[#010a01] w-5 h-5 fill-current" />
              </div>
              <h2 className="text-2xl font-bold tracking-widest uppercase text-white" style={{ fontFamily: "Rajdhani, Bebas Neue, sans-serif" }}>
                ShadowHabits
              </h2>
            </div>
            <h3 className="text-3xl font-semibold text-white">Welcome back.</h3>
            <p className="text-zinc-400 text-sm">
              Your cursed energy awaits. Log in to continue your journey.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-zinc-400 group-focus-within:text-[#00BFFF] transition-colors">
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="sorcerer@jujutsu.high"
                  className="bg-[#080f08] border-zinc-800 focus-visible:border-[#00BFFF] focus-visible:ring-1 focus-visible:ring-[#00BFFF]/50 text-white placeholder:text-zinc-600 rounded-sm h-12"
                />
              </div>

              <div className="space-y-2 group">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider text-zinc-400 group-focus-within:text-[#00BFFF] transition-colors">
                    Password
                  </Label>
                  <a href="#" className="text-xs text-[#00BFFF] hover:text-white transition-colors hover:underline">
                    Forgot technique?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-[#080f08] border-zinc-800 focus-visible:border-[#00BFFF] focus-visible:ring-1 focus-visible:ring-[#00BFFF]/50 text-white placeholder:text-zinc-600 rounded-sm h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#00BFFF] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-[#010a01] font-bold tracking-widest uppercase rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,191,255,0.4)]"
            >
              Enter the Domain
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-zinc-500">
              New to the academy?{" "}
              <a href="#" className="text-[#00BFFF] hover:text-white transition-colors hover:underline underline-offset-4">
                Choose your companion
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
