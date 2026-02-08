"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      // Store result in sessionStorage and navigate to results
      sessionStorage.setItem("resumeScore", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError("Failed to process resume. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-all duration-500 hover:translate-x-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          <h1 className={`text-4xl md:text-5xl font-bold text-blue-100 mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Upload Your Resume
          </h1>
          <p className={`text-lg text-slate-300 mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Get an instant AI-powered score and personalized feedback
          </p>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 delay-300 ${
              isDragging
                ? "border-blue-400 bg-blue-500/10 backdrop-blur-sm scale-105"
                : "border-blue-400/30 bg-slate-800/50 backdrop-blur-sm"
            } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {!file ? (
              <>
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-100 mb-2">
                  Drop your resume here
                </h3>
                <p className="text-slate-300 mb-6">
                  or click to browse
                </p>
                <label className="cursor-pointer">
                  <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200 inline-block">
                    Choose File
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileInput}
                  />
                </label>
                <p className="text-sm text-slate-400 mt-4">
                  Supported formats: PDF, DOCX (Max 5MB)
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-green-400">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-lg font-semibold text-blue-100">
                    {file.name}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200"
                  >
                    {isUploading ? "Processing..." : "Analyze Resume"}
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-all duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
              <p className="text-red-300 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-400/20 transition-all duration-700 delay-500 hover:scale-105 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h3 className="font-semibold text-blue-100 mb-2">
                What we analyze
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  Skills & keyword relevance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  Experience & career progression
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  Achievements & measurable impact
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  Education & certifications
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  Clarity & ATS compatibility
                </li>
              </ul>
            </div>

            <div className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-400/20 transition-all duration-700 delay-600 hover:scale-105 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <h3 className="font-semibold text-blue-100 mb-2">
                Your privacy matters
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">🔒</span>
                  Files are processed securely
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">🔒</span>
                  No data shared with third parties
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">🔒</span>
                  Temporary storage only
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
