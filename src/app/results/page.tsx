"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("resumeScore");
    if (stored) {
      setScoreData(JSON.parse(stored));
    } else {
      router.push("/upload");
    }
  }, [router]);

  if (!scoreData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
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
        return "from-yellow-400 to-orange-500";
      case "Champion":
        return "from-purple-400 to-pink-500";
      case "Contender":
        return "from-blue-400 to-indigo-500";
      case "Rookie":
        return "from-green-400 to-teal-500";
      default:
        return "from-gray-400 to-gray-500";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Analysis Complete
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Your Resume Score
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{fileName}</p>
          </div>

          {/* Main Score Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <div className="text-8xl font-bold mb-4">
                <span className={`bg-gradient-to-r ${getTierColor(score.tier)} bg-clip-text text-transparent`}>
                  {score.total}
                </span>
                <span className="text-4xl text-gray-400 dark:text-gray-600">/100</span>
              </div>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                <span className="text-3xl">{getTierEmoji(score.tier)}</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {score.tier} Tier
                </span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Score Breakdown
              </h3>

              {Object.entries(score.breakdown).map(([category, value]) => {
                const max = maxScores[category as keyof typeof maxScores];
                const percentage = (value / max) * 100;
                const isGood = percentage >= 80;
                const isOkay = percentage >= 60;

                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {category}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {value}/{max}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isGood
                            ? "bg-green-500"
                            : isOkay
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Section */}
          {score.feedback.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💡</span>
                Ways to Improve
              </h3>
              <ul className="space-y-3">
                {score.feedback.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-indigo-500 mt-1 flex-shrink-0">▸</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Resume Insights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {parsedData.skillsFound}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Technical Skills Detected
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {parsedData.bulletPointsCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Achievement Bullets
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center"
            >
              Analyze Another Resume
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 text-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Coming Soon Banner */}
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Coming Soon: Tournaments!</h3>
            <p className="text-indigo-100 mb-4">
              Compete against other resumes in bracket-style matchups. Create an account to join the waitlist.
            </p>
            <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
