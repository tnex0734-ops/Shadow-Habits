import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InfoHierarchy() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please provide both email and password.");
      setIsLoading(false);
      return;
    }

    // Simulate login
    setTimeout(() => {
      setError("Invalid credentials. Try again.");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundColor: "#080f08",
        color: "white",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
      `}} />

      {/* 1. TOP: Logo + app name */}
      <div className="mb-12 text-center flex flex-col items-center">
        <div 
          className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
          style={{ backgroundColor: "#7C3AED" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 2v20" />
            <path d="m17 5-5-3-5 3" />
            <path d="m17 19-5 3-5-3" />
            <path d="M2 12h20" />
            <path d="m5 17-3-5 3-5" />
            <path d="m19 17 3-5-3-5" />
          </svg>
        </div>
        <h1 
          className="text-6xl tracking-wider m-0 leading-none" 
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          SHADOW HABITS
        </h1>
      </div>

      {/* 2. SECOND: Heading + Purpose */}
      <div className="w-full max-w-sm text-center mb-8">
        <h2 
          className="text-4xl mb-2 tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          SIGN IN
        </h2>
        <p className="text-[14px] opacity-50 uppercase tracking-widest font-medium">
          Enter your domain to continue
        </p>
      </div>

      {/* 3. THIRD: The form */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label 
              htmlFor="email" 
              className="text-[11px] uppercase tracking-widest opacity-80"
            >
              Operative Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#010a01] border-[#2a362a] text-white focus-visible:ring-[#7C3AED] h-12 rounded-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <Label 
                htmlFor="password" 
                className="text-[11px] uppercase tracking-widest opacity-80"
              >
                Access Code
              </Label>
              <a href="#" className="text-[10px] opacity-50 hover:opacity-100 uppercase tracking-wider transition-opacity">
                Forgot code?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#010a01] border-[#2a362a] text-white focus-visible:ring-[#7C3AED] h-12 rounded-none"
            />
          </div>

          {/* Error zone - fixed height */}
          <div className="h-6 flex items-center justify-center">
            {error && (
              <p className="text-[11px] text-red-500 uppercase tracking-wider font-semibold">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-none text-lg tracking-widest uppercase transition-all duration-300"
            style={{ 
              backgroundColor: "#7C3AED", 
              color: "white",
              fontFamily: "'Bebas Neue', sans-serif",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Authenticating..." : "Enter Domain"}
          </Button>
        </form>

        {/* 4. BOTTOM: Secondary link */}
        <div className="mt-10 border-t border-[#1a261a] pt-6 text-center">
          <p className="text-[11px] uppercase tracking-widest opacity-50">
            No operative record?{" "}
            <a href="#" className="text-white opacity-100 hover:text-[#7C3AED] transition-colors ml-1 font-semibold">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
