# Resume Wars 🏆

**Turn Your Resume Into A Champion**

Resume Wars is a gamified resume analysis platform that makes job hunting fun. Upload your resume, get instant AI-powered feedback, and compete in tournament-style brackets.

## 🚀 Live Demo

Visit [http://localhost:3000](http://localhost:3000) to try it out!

## ✨ Features (MVP v1)

### Currently Implemented
- **Landing Page** - Compelling hero section explaining the concept
- **Resume Upload** - Drag & drop interface for PDF/DOCX files (up to 5MB)
- **AI-Powered Scoring** - Analyzes resumes across 5 key dimensions:
  - Experience & Career Progression (30 points)
  - Skills & Technical Keywords (25 points)
  - Achievements & Measurable Impact (25 points)
  - Education & Certifications (10 points)
  - Clarity & ATS Compatibility (10 points)
- **Tier System** - Elite, Champion, Contender, Rookie, Trainee
- **Detailed Feedback** - Actionable tips to improve your score
- **Results Dashboard** - Beautiful score breakdown with progress bars

### Coming Soon
- User authentication (Google/LinkedIn OAuth)
- Tournament brackets with head-to-head matchups
- Category-specific scoring (Software Engineer, Data Scientist, DevOps, etc.)
- Community voting on resume matchups
- Leaderboards and rankings
- MongoDB persistence

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Resume Parsing**:
  - `pdf-parse` for PDF files
  - `mammoth` for DOCX files
- **Deployment**: Vibecode Sandbox (port 3000)

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── parse-resume/
│   │       └── route.ts          # Resume parsing & scoring API
│   ├── upload/
│   │   └── page.tsx              # Upload interface
│   ├── results/
│   │   └── page.tsx              # Score results display
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
```

## 🎯 How It Works

1. **Upload**: User uploads a PDF or DOCX resume
2. **Parse**: Backend extracts text using pdf-parse/mammoth
3. **Analyze**: Algorithm scores across 5 weighted categories
4. **Score**: Assigns a 0-100 score and tier (Elite to Trainee)
5. **Feedback**: Provides specific improvement tips
6. **Display**: Beautiful results page with breakdowns

## 📊 Scoring Algorithm (v1)

The scoring system is designed to mirror what real recruiters and ATS systems look for:

| Category | Weight | What It Measures |
|----------|--------|-----------------|
| **Experience** | 30% | Years of work, career growth, progression |
| **Skills** | 25% | Technical keywords, modern tech stack |
| **Achievements** | 25% | Quantifiable results, strong action verbs |
| **Education** | 10% | Degrees and certifications |
| **Clarity** | 10% | Length (1-2 pages), formatting, structure |

### Tier Thresholds
- **Elite**: 90-100 points
- **Champion**: 80-89 points
- **Contender**: 65-79 points
- **Rookie**: 50-64 points
- **Trainee**: 0-49 points

## 🔮 Roadmap

### Phase 1: Core MVP ✅ (Completed)
- [x] Landing page
- [x] Resume upload
- [x] Parsing & scoring
- [x] Results display

### Phase 2: User Accounts (Next)
- [ ] NextAuth.js integration
- [ ] Google & LinkedIn OAuth
- [ ] MongoDB Atlas setup
- [ ] User profiles

### Phase 3: Tournaments
- [ ] Bracket generation
- [ ] AI-powered head-to-head judging
- [ ] Tournament progression
- [ ] Leaderboards

### Phase 4: Advanced Features
- [ ] Category-specific weights (SWE, DS, MLE, DevOps, PM)
- [ ] Community voting
- [ ] Semantic matching with embeddings
- [ ] LLM-powered holistic judging
- [ ] ATS simulation score
- [ ] Multi-modal (GitHub, portfolio links)

## 💡 Design Philosophy

- **Gamification First**: Make resume improvement fun and addictive
- **Transparency**: Show exactly how scores are calculated
- **Actionable**: Every point of feedback should be implementable
- **Fair**: Bias-free, anonymous scoring
- **Modern**: Reward current tech stacks and measurable impact

## 🎨 UI/UX Highlights

- Clean, gradient-based design (indigo/purple theme)
- Responsive (mobile-first)
- Dark mode support
- Smooth animations and transitions
- Accessible color contrasts

## 📝 Environment

- Node.js 21.7.3
- npm 10.5.0
- Port 3000 forwarded to web
- Persistent storage: `/home/vibecode/workspace`

## 🤝 Contributing

This is a prototype/MVP. Future improvements welcome:
- Additional file format support
- More sophisticated NLP parsing
- Industry-specific keyword libraries
- Multilingual support

## 📄 License

MIT

---

**Built with Claude Code** 🤖
