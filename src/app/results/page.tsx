"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hook for counting animation
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsComplete(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return { count, isComplete };
}

interface ScoreBreakdown {
  experience: number;
  skills: number;
  achievements: number;
  education: number;
  clarity: number;
}

interface ScoreResult {
  total: number;
  breakdown: ScoreBreakdown;
  tier: string;
  feedback: string[];
  category?: string;
}

interface ResumeScore {
  success: boolean;
  score: ScoreResult;
  fileName: string;
  parsedData: {
    email?: string;
    phone?: string;
    skillsFound: number;
    bulletPointsCount: number;
  };
}

export default function ResultsPage() {
  const [scoreData, setScoreData] = useState<ResumeScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  // Call useCountUp hook at top level, it will work even with scoreData null initially
  const totalScore = scoreData?.score?.total ?? 0;
  const { count: animatedScore, isComplete } = useCountUp(totalScore, 2000);

  useEffect(() => {
    const loadScoreData = () => {
      const stored = sessionStorage.getItem("resumeScore");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setScoreData(data);
          // Trigger animations after data loads
          const timer = setTimeout(() => setShowContent(true), 100);
          return () => clearTimeout(timer);
        } catch (error) {
          console.error("Failed to parse score data:", error);
          router.push("/upload");
        }
      } else {
        router.push("/upload");
      }
      setIsLoading(false);
    };

    loadScoreData();
  }, [router]);

  if (isLoading || !scoreData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading results...</p>
        </div>
      </div>
    );
  }

  const { score, fileName, parsedData } = scoreData;

  const maxScores = {
    experience: 30,
    skills: 25,
    achievements: 25,
    education: 10,
    clarity: 10,
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Elite":
        return "from-yellow-400 to-amber-500";
      case "Champion":
        return "from-cyan-400 to-blue-500";
      case "Contender":
        return "from-blue-400 to-sky-500";
      case "Rookie":
        return "from-green-400 to-emerald-500";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case "Elite":
        return "🏆";
      case "Champion":
        return "⭐";
      case "Contender":
        return "🥊";
      case "Rookie":
        return "🌱";
      default:
        return "📝";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium mb-6 animate-pulse">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Analysis Complete
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-100 mb-4">
              Your Resume Score
            </h1>
            <p className="text-slate-300">{fileName}</p>
          </div>

          {/* Main Score Card */}
          <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-400/20 p-8 md:p-12 mb-8 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center mb-8">
              <div className="text-8xl font-bold mb-4">
                <span className={`bg-gradient-to-r ${getTierColor(score.tier)} bg-clip-text text-transparent transition-all duration-500 ${isComplete ? 'scale-110' : 'scale-100'}`}>
                  {animatedScore}
                </span>
                <span className="text-4xl text-slate-500">/100</span>
              </div>
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 backdrop-blur-sm transition-all duration-500 delay-500 ${isComplete ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <span className="text-3xl">{getTierEmoji(score.tier)}</span>
                <span className="text-2xl font-bold text-blue-100">
                  {score.tier} Tier
                </span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-100 mb-4">
                Score Breakdown
              </h3>

              {Object.entries(score.breakdown).map(([category, value], index) => {
                const max = maxScores[category as keyof typeof maxScores];
                const percentage = (value / max) * 100;
                const isGood = percentage >= 80;
                const isOkay = percentage >= 60;

                return (
                  <div
                    key={category}
                    className={`transition-all duration-500`}
                    style={{
                      transitionDelay: `${600 + index * 100}ms`,
                      opacity: showContent ? 1 : 0,
                      transform: showContent ? 'translateX(0)' : 'translateX(-20px)'
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300 capitalize">
                        {category}
                      </span>
                      <span className="text-sm font-semibold text-blue-100">
                        {value}/{max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                          isGood
                            ? "bg-green-500"
                            : isOkay
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: showContent ? `${percentage}%` : '0%',
                          transitionDelay: `${800 + index * 100}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Section */}
          {score.feedback.length > 0 && (
            <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-400/20 p-8 mb-8 transition-all duration-700 delay-[1200ms] ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-2xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
                <span>💡</span>
                Ways to Improve
              </h3>
              <ul className="space-y-3">
                {score.feedback.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-slate-300 transition-all duration-500"
                    style={{
                      transitionDelay: `${1400 + index * 100}ms`,
                      opacity: showContent ? 1 : 0,
                      transform: showContent ? 'translateX(0)' : 'translateX(-10px)'
                    }}
                  >
                    <span className="text-blue-400 mt-1 flex-shrink-0">▸</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats Card */}
          <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-400/20 p-8 mb-8 transition-all duration-700 delay-[1500ms] ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="text-2xl font-semibold text-blue-100 mb-6">
              Resume Insights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <div className="text-3xl font-bold text-cyan-400 mb-1">
                  {parsedData.skillsFound}
                </div>
                <div className="text-sm text-slate-400">
                  Technical Skills Detected
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <div className="text-3xl font-bold text-cyan-400 mb-1">
                  {parsedData.bulletPointsCount}
                </div>
                <div className="text-sm text-slate-400">
                  Achievement Bullets
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-[1800ms] ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/upload"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200 text-center hover:scale-105"
            >
              Analyze Another Resume
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-blue-100 font-semibold rounded-lg shadow-md transition-all duration-200 border border-blue-400/30 text-center backdrop-blur-sm hover:scale-105"
            >
              Back to Home
            </Link>
          </div>

          {/* Coming Soon Banner */}
          <div className={`mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center text-white shadow-lg transition-all duration-700 delay-[2000ms] ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-2">Coming Soon: Tournaments!</h3>
            <p className="text-blue-100 mb-4">
              Compete against other resumes in bracket-style matchups. Create an account to join the waitlist.
            </p>
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-md">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
