import React, { useState } from "react";
import { Eye, EyeOff, AlertTriangle, Shield, CheckCircle } from "lucide-react";

export function AccessibilityReadability() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>("Invalid credentials. Please try again.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setError(null);
    // Submit logic
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8"
      style={{ 
        backgroundColor: "#0d1a0d",
        color: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif"
      }}
    >
      <div 
        className="w-full max-w-md bg-black/40 p-6 md:p-8 rounded-lg"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div 
            className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "rgba(52, 211, 153, 0.1)" }}
          >
            <Shield size={32} color="#34D399" aria-hidden="true" />
          </div>
          <h1 
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            ShadowHabits
          </h1>
          <p className="text-base" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Begin your cursed journey
          </p>
        </div>

        {error && (
          <div 
            className="flex items-start gap-3 p-4 mb-6 rounded-md"
            data-role="alert"
            style={{ 
              backgroundColor: "rgba(255, 68, 68, 0.1)", 
              border: "2px solid #FF4444" 
            }}
          >
            <AlertTriangle className="shrink-0 mt-0.5" size={20} color="#FF4444" aria-hidden="true" />
            <p className="text-[15px] font-bold" style={{ color: "#FF4444" }}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2 flex flex-col">
            <label 
              htmlFor="email-input" 
              className="text-[15px] font-medium block"
            >
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 rounded transition-shadow bg-black/60 text-white placeholder-white/50"
              style={{ 
                height: "48px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "4px",
                fontSize: "16px"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#34D399";
                e.target.style.boxShadow = "0 0 0 3px rgba(52, 211, 153, 0.3)";
                e.target.style.outline = "none";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.target.style.boxShadow = "none";
              }}
              aria-invalid={error ? "true" : "false"}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <div className="flex justify-between items-end">
              <label 
                htmlFor="password-input" 
                className="text-[15px] font-medium block"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-32 rounded transition-shadow bg-black/60 text-white placeholder-white/50"
                style={{ 
                  height: "48px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#34D399";
                  e.target.style.boxShadow = "0 0 0 3px rgba(52, 211, 153, 0.3)";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
                aria-invalid={error ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1.5 rounded text-sm font-medium hover:bg-white/10 transition-colors focus:outline-none focus:ring-[3px] focus:ring-[#34D399] focus:ring-offset-2 focus:ring-offset-[#0d1a0d]"
                style={{ color: "#ffffff" }}
              >
                {showPassword ? (
                  <>
                    <EyeOff size={18} aria-hidden="true" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye size={18} aria-hidden="true" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all focus:outline-none focus:ring-[3px] focus:ring-[#34D399] focus:ring-offset-2 focus:ring-offset-[#0d1a0d]"
            style={{ 
              height: "48px",
              backgroundColor: "#34D399", 
              color: "#000000",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          >
            <span>Sign in to ShadowHabits</span>
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}></div>
          <span className="text-[14px] font-medium" style={{ color: "rgba(255, 255, 255, 0.8)" }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}></div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-[15px]">
            Don't have an account?{" "}
            <a 
              href="#signup" 
              className="font-bold underline underline-offset-4 hover:no-underline focus:outline-none focus:ring-[3px] focus:ring-[#34D399] focus:ring-offset-2 focus:ring-offset-[#0d1a0d] rounded px-1 py-0.5 -mx-1"
              style={{ color: "#34D399" }}
            >
              Create one
            </a>
          </p>
          <p className="text-[15px]">
            <a 
              href="#forgot" 
              className="font-medium underline underline-offset-4 hover:no-underline focus:outline-none focus:ring-[3px] focus:ring-[#34D399] focus:ring-offset-2 focus:ring-offset-[#0d1a0d] rounded px-1 py-0.5 -mx-1"
              style={{ color: "#ffffff" }}
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
