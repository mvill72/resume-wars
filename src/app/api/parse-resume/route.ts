import { NextRequest, NextResponse } from "next/server";
// @ts-ignore - pdf-parse has module resolution issues with Next.js 16
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Scoring algorithm types
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

// Helper function to extract text from PDF
async function extractPdfText(buffer: Buffer): Promise<string> {
  // @ts-ignore
  const pdfParser = pdfParse.default || pdfParse;
  const data = await pdfParser(buffer);
  return data.text;
}

// Helper function to extract text from DOCX
async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Basic resume parsing
function parseResume(text: string) {
  const lowercaseText = text.toLowerCase();

  // Extract basic info
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  // Extract years of experience (rough estimate)
  const yearMatches = text.match(/\b(19|20)\d{2}\b/g) || [];
  const years = yearMatches.map(y => parseInt(y));
  const yearsExp = years.length > 0 ? Math.max(...years) - Math.min(...years) : 0;

  // Extract skills (common tech keywords)
  const allSkills = [
    "javascript", "typescript", "react", "next.js", "node.js", "python", "java", "go", "rust",
    "aws", "docker", "kubernetes", "terraform", "ci/cd", "graphql", "postgresql", "mongodb",
    "microservices", "system design", "algorithms", "data structures", "redis", "kafka",
    "tensorflow", "pytorch", "sql", "pandas", "numpy", "scikit-learn", "machine learning",
    "a/b testing", "causal inference", "statistics", "deep learning", "llm", "rag",
    "ansible", "prometheus", "grafana", "helm", "argo", "jenkins", "gitlab"
  ];

  const skills = allSkills.filter(skill => lowercaseText.includes(skill));

  // Split into lines for bullet analysis
  const lines = text.split("\n").filter(line => line.trim().length > 0);

  // Find bullets (lines starting with common bullet characters or action verbs)
  const bulletPoints = lines.filter(line => {
    const trimmed = line.trim();
    return /^[•\-\*]/.test(trimmed) || /^(Led|Built|Increased|Reduced|Launched|Grew|Designed|Implemented|Optimized|Delivered|Developed|Created|Managed)/i.test(trimmed);
  });

  // Check for education keywords
  const hasEducation = /bachelor|master|phd|university|college|degree/i.test(text);
  const hasCertifications = /certified|certification|certificate/i.test(text);

  return {
    email: emailMatch?.[0],
    phone: phoneMatch?.[0],
    yearsExp,
    skills,
    bulletPoints,
    hasEducation,
    hasCertifications,
    text,
    lines
  };
}

// Scoring algorithm (Software Engineer default)
function calculateScore(parsed: ReturnType<typeof parseResume>): ScoreResult {
  const feedback: string[] = [];
  const breakdown: ScoreBreakdown = {
    experience: 0,
    skills: 0,
    achievements: 0,
    education: 0,
    clarity: 0
  };

  // 1. Experience & Progression (0-30)
  let expPoints = 0;
  if (parsed.yearsExp >= 15) expPoints = 30;
  else if (parsed.yearsExp >= 10) expPoints = 28;
  else if (parsed.yearsExp >= 7) expPoints = 24;
  else if (parsed.yearsExp >= 4) expPoints = 20;
  else if (parsed.yearsExp >= 2) expPoints = 15;
  else if (parsed.yearsExp >= 1) expPoints = 10;
  else expPoints = 5;

  breakdown.experience = Math.min(expPoints, 30);

  if (parsed.yearsExp < 2) {
    feedback.push("Add more work experience or highlight relevant projects");
  }

  // 2. Skills & Keywords (0-25)
  let skillPoints = parsed.skills.length * 2.5;
  if (parsed.skills.length >= 8) skillPoints += 5;
  breakdown.skills = Math.min(skillPoints, 25);

  if (parsed.skills.length < 5) {
    feedback.push("Add more technical skills relevant to your target role");
  }

  // 3. Achievements & Impact (0-25)
  const bulletsWithNumbers = parsed.bulletPoints.filter(b => /\d+/.test(b)).length;
  const strongVerbBullets = parsed.bulletPoints.filter(b =>
    /^(Led|Built|Increased|Reduced|Launched|Grew|Designed|Implemented|Optimized|Delivered)/i.test(b.trim())
  ).length;

  const achievementScore = bulletsWithNumbers * 2 + strongVerbBullets * 1.5;
  breakdown.achievements = Math.min(achievementScore, 25);

  if (bulletsWithNumbers === 0) {
    feedback.push("Add quantifiable achievements (e.g., 'Increased revenue by 42%')");
  }
  if (strongVerbBullets < 3) {
    feedback.push("Use strong action verbs at the start of bullet points");
  }

  // 4. Education & Certifications (0-10)
  let eduPoints = 0;
  if (parsed.hasEducation) eduPoints += 5;
  if (parsed.hasCertifications) eduPoints += 3;
  breakdown.education = Math.min(eduPoints, 10);

  if (!parsed.hasCertifications) {
    feedback.push("Consider adding relevant certifications to boost your profile");
  }

  // 5. Clarity & Polish (0-10)
  let clarityPoints = 10;
  const pageEstimate = parsed.text.length / 3000;
  if (pageEstimate > 2.5) {
    clarityPoints -= 3;
    feedback.push("Resume is too long - aim for 1-2 pages");
  }
  if (parsed.bulletPoints.length < 5) {
    clarityPoints -= 2;
    feedback.push("Add more detailed bullet points about your experience");
  }
  breakdown.clarity = Math.max(clarityPoints, 0);

  // Calculate total
  const total = Math.round(
    breakdown.experience +
    breakdown.skills +
    breakdown.achievements +
    breakdown.education +
    breakdown.clarity
  );

  // Determine tier
  let tier = "Trainee";
  if (total >= 90) tier = "Elite";
  else if (total >= 80) tier = "Champion";
  else if (total >= 65) tier = "Contender";
  else if (total >= 50) tier = "Rookie";

  return {
    total,
    breakdown,
    tier,
    feedback,
    category: "Software Engineer" // Default for MVP
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text based on file type
    let text = "";
    if (file.type === "application/pdf") {
      text = await extractPdfText(buffer);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractDocxText(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Parse resume
    const parsed = parseResume(text);

    // Calculate score
    const scoreResult = calculateScore(parsed);

    return NextResponse.json({
      success: true,
      score: scoreResult,
      fileName: file.name,
      parsedData: {
        email: parsed.email,
        phone: parsed.phone,
        skillsFound: parsed.skills.length,
        bulletPointsCount: parsed.bulletPoints.length
      }
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
