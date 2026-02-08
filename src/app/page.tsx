"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Beta Launch - Free to Use
          </div>

          {/* Main Headline */}
          <h1 className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            Resume Wars
          </h1>

          <p className={`text-2xl md:text-3xl font-semibold text-blue-100 mb-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Turn Your Resume Into A Champion
          </p>

          <p className={`text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Upload your resume, get an instant AI-powered score, and compete in brackets against others.
            Think March Madness meets LinkedIn. Make job hunting actually fun.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/upload"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200 text-lg"
            >
              Upload Your Resume
            </Link>
            <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-blue-100 font-semibold rounded-lg shadow-md transition-all duration-200 border border-blue-400/30 text-lg backdrop-blur-sm">
              See How It Works
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-400/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 text-blue-100">Instant Scoring</h3>
              <p className="text-slate-300">
                Get a detailed 0-100 score breakdown across skills, experience, achievements, and more
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-400/20">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2 text-blue-100">Tournament Brackets</h3>
              <p className="text-slate-300">
                Compete in head-to-head matchups. Advance through rounds and claim your rank
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-400/20">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2 text-blue-100">Actionable Feedback</h3>
              <p className="text-slate-300">
                Get specific tips to improve your score and level up your resume to Elite tier
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-cyan-400">100+</div>
              <div className="text-sm text-slate-400">Resumes Scored</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">5</div>
              <div className="text-sm text-slate-400">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">Elite</div>
              <div className="text-sm text-slate-400">Tier System</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
