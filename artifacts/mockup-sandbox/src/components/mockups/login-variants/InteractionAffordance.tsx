import React, { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

export function InteractionAffordance() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>("Invalid cursed energy signature detected.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required to enter the domain.");
    } else {
      setError(null);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 font-['Rajdhani',sans-serif] text-slate-200"
      style={{ 
        backgroundColor: "#080f08",
        backgroundImage: "radial-gradient(circle at top, #010a01, #080f08)"
      }}
    >
      <div className="w-full max-w-md bg-[#010a01] border-2 border-slate-800 p-8 rounded-none relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF6B35]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF6B35]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF6B35]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF6B35]" />

        <div className="mb-8 text-center border-b-2 border-slate-800 pb-6">
          <div className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-2">Step 1 of 1 — Sign In</div>
          <h1 className="text-5xl font-['Bebas_Neue',sans-serif] text-white tracking-wider">ENTER DOMAIN</h1>
          <p className="text-slate-400 mt-2 font-semibold">Resume your cursed journey, Operative.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-sm">1</div>
              <label htmlFor="email" className="font-bold text-lg tracking-wide uppercase text-slate-200">
                Operative Email
              </label>
            </div>
            
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@jujutsu.edu"
                className={`w-full h-[52px] bg-[#0a140a] border-2 px-4 text-lg text-white font-semibold transition-all duration-200 placeholder:text-slate-600 outline-none
                  ${error && !email ? 'border-l-4 border-l-red-500 border-red-500/50' : 'border-slate-700'}
                  hover:border-[#FF6B35] hover:bg-[#111f11]
                  focus:border-[#FF6B35] focus:bg-[#0a140a] focus:ring-4 focus:ring-[#FF6B35]/20 focus:shadow-[0_0_15px_rgba(255,107,53,0.3)]
                `}
                style={{
                  boxShadow: email ? "inset 0 0 10px rgba(0,0,0,0.5)" : "none"
                }}
              />
            </div>
            {error && !email && (
              <div className="flex items-center gap-2 text-red-500 font-bold bg-red-950/30 p-2 border border-red-900/50">
                <AlertCircle size={18} />
                <span>Email signature is required.</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-sm">2</div>
              <label htmlFor="password" className="font-bold text-lg tracking-wide uppercase text-slate-200">
                Cursed Passcode
              </label>
            </div>
            
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode"
                className={`w-full h-[52px] bg-[#0a140a] border-2 pl-4 pr-24 text-lg text-white font-semibold transition-all duration-200 placeholder:text-slate-600 outline-none
                  ${error && !password ? 'border-l-4 border-l-red-500 border-red-500/50' : 'border-slate-700'}
                  hover:border-[#FF6B35] hover:bg-[#111f11]
                  focus:border-[#FF6B35] focus:bg-[#0a140a] focus:ring-4 focus:ring-[#FF6B35]/20 focus:shadow-[0_0_15px_rgba(255,107,53,0.3)]
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-wider transition-colors border border-slate-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <div className="flex justify-between items-start mt-2">
              <div className="flex-1">
                {error && !password && (
                  <div className="flex items-center gap-2 text-red-500 font-bold bg-red-950/30 p-2 border border-red-900/50 mb-2">
                    <AlertCircle size={18} />
                    <span>Passcode is required.</span>
                  </div>
                )}
                {error && email && password && (
                  <div className="flex items-center gap-2 text-red-500 font-bold bg-red-950/30 p-2 border border-red-900/50 mb-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <a 
                href="#forgot" 
                className="text-[#FF6B35] hover:text-[#ff8a5c] font-bold underline underline-offset-4 decoration-2 text-sm pt-2 ml-4 flex-shrink-0"
              >
                Forgot passcode?
              </a>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-slate-800">
            <button
              type="submit"
              className="w-full h-[60px] bg-[#FF6B35] hover:bg-[#e05624] text-white font-['Bebas_Neue',sans-serif] text-2xl tracking-widest flex items-center justify-center gap-4 transition-all active:scale-[0.98] outline-none focus:ring-4 focus:ring-[#FF6B35]/50 border-2 border-transparent hover:border-white shadow-[0_0_20px_rgba(255,107,53,0.4)] hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]"
            >
              <span>Breach Domain</span>
              <ArrowRight size={28} strokeWidth={3} />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-slate-800">
          <p className="text-slate-400 font-semibold mb-4 text-center">New to the shadows?</p>
          <a 
            href="#signup" 
            className="flex items-center justify-center w-full h-[52px] border-2 border-slate-600 text-slate-200 hover:text-white hover:border-slate-400 font-bold tracking-widest uppercase transition-colors outline-none focus:ring-4 focus:ring-slate-500/30 bg-slate-900/50 hover:bg-slate-800"
          >
            Enlist as Operative
          </a>
        </div>
      </div>
    </div>
  );
}
