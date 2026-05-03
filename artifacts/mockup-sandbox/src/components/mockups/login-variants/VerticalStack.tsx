import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerticalStack() {
  return (
    <div 
      className="min-h-[100dvh] w-full flex flex-col items-center justify-start text-white overflow-y-auto"
      style={{
        backgroundColor: "#010a01",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px), radial-gradient(circle at center, transparent 0%, #080f08 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Top Banner (16:5 aspect ratio structure) */}
      <div className="w-full max-w-[600px] mt-8 mb-12 relative overflow-hidden flex-shrink-0" style={{ aspectRatio: '16/5' }}>
        <div className="absolute inset-0 bg-[#080f08] border-y border-[#C9A84C]/30 flex items-center justify-center">
          {/* Simulated cinematic glow */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#C9A84C] shadow-[0_0_20px_5px_rgba(201,168,76,0.3)]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#010a01] via-transparent to-[#010a01] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#010a01] via-transparent to-[#010a01] pointer-events-none"></div>
        </div>
      </div>

      {/* Centered Column */}
      <div className="w-full max-w-[420px] px-6 flex flex-col items-center z-10 pb-16">
        
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="w-16 h-16 border-2 border-[#C9A84C] flex items-center justify-center relative bg-[#080f08]">
            <span className="font-['Rajdhani',sans-serif] text-3xl font-bold tracking-widest text-[#C9A84C]">SH</span>
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#C9A84C]"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#C9A84C]"></div>
          </div>
          <h1 className="font-['Rajdhani',sans-serif] text-5xl font-bold tracking-[0.2em] text-white">SHADOWHABITS</h1>
        </div>

        {/* Form area */}
        <form className="w-full flex flex-col space-y-10" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-4">
            <Label className="flex items-baseline space-x-2 text-[#C9A84C] uppercase tracking-widest font-['Rajdhani',sans-serif]">
              <span className="text-xs opacity-70">01.</span>
              <span className="text-sm font-semibold">OPERATIVE ID</span>
            </Label>
            <Input 
              type="email" 
              placeholder="user@domain.com" 
              className="bg-[#080f08]/50 border-t-0 border-x-0 border-b-2 border-white/20 rounded-none px-0 py-3 text-lg focus-visible:ring-0 focus-visible:border-[#C9A84C] focus-visible:outline-none transition-colors h-auto shadow-none placeholder:text-white/20"
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-baseline space-x-2 text-[#C9A84C] uppercase tracking-widest font-['Rajdhani',sans-serif]">
              <span className="text-xs opacity-70">02.</span>
              <span className="text-sm font-semibold">CURSED KEY</span>
            </Label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              className="bg-[#080f08]/50 border-t-0 border-x-0 border-b-2 border-white/20 rounded-none px-0 py-3 text-lg focus-visible:ring-0 focus-visible:border-[#C9A84C] focus-visible:outline-none transition-colors h-auto shadow-none placeholder:text-white/20"
            />
          </div>

          <div className="pt-8">
            <Button 
              type="submit" 
              className="w-full bg-[#C9A84C] hover:bg-[#b0923e] text-black font-['Rajdhani',sans-serif] text-lg font-bold tracking-widest py-8 rounded-none uppercase transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                ENTER THE DOMAIN <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </Button>
          </div>

        </form>

        <div className="mt-12 text-center">
          <a href="#" className="text-sm font-['Rajdhani',sans-serif] text-white/50 hover:text-[#C9A84C] uppercase tracking-widest transition-colors inline-block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-[#C9A84C] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            INITIATE PACT (SIGN UP)
          </a>
        </div>

      </div>
    </div>
  );
}
