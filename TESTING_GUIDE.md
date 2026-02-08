# Testing Guide for Resume Wars

## Quick Test Steps

### 1. Access the Application
- Navigate to: `http://localhost:3000`
- You should see the landing page with "Resume Wars" title

### 2. Test the Upload Flow
- Click **"Upload Your Resume"** button
- You'll be redirected to `/upload`

### 3. Upload a Resume

#### Option A: Use Your Own Resume
- Drag & drop your PDF or DOCX resume
- Or click "Choose File" to browse

#### Option B: Create a Test Resume
If you don't have a resume handy, create a simple test file:

**Sample Content for a Test Resume:**
```
John Doe
john.doe@email.com | (555) 123-4567

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-Present
• Built scalable microservices handling 1M+ requests per day
• Reduced API latency by 40% through optimization
• Led team of 5 engineers on critical projects

Software Engineer | StartupCo | 2018-2020
• Developed React applications serving 100K+ users
• Implemented CI/CD pipeline reducing deployment time by 60%
• Designed PostgreSQL database schemas

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker,
Kubernetes, PostgreSQL, MongoDB, Redis, GraphQL, CI/CD

EDUCATION
Bachelor of Science in Computer Science | University Name | 2018

CERTIFICATIONS
AWS Certified Solutions Architect
Certified Kubernetes Administrator
```

Save this as `test-resume.txt` and then copy to Word/PDF.

### 4. Analyze the Resume
- After selecting the file, click **"Analyze Resume"**
- Wait 2-3 seconds for processing
- You'll be redirected to `/results`

### 5. Review the Results

**Check for:**
- ✅ Total score (0-100)
- ✅ Tier badge (Elite/Champion/Contender/Rookie/Trainee)
- ✅ Breakdown across 5 categories
- ✅ Progress bars showing performance
- ✅ Feedback tips list
- ✅ Insights card (skills found, bullets counted)

### 6. Test Edge Cases

#### A. Invalid File Type
- Try uploading a .txt or .jpg file
- Should see error: "Please upload a PDF or DOCX file"

#### B. Large File
- Try uploading a file > 5MB
- Should see error: "File size must be less than 5MB"

#### C. Direct Results Access
- Navigate directly to `/results` without uploading
- Should redirect back to `/upload`

#### D. Remove File
- Upload a file, then click "Remove"
- Should clear selection and allow new upload

### 7. Test Navigation
- From results page, click "Back to Home"
- From results page, click "Analyze Another Resume"
- All navigation should work smoothly

## Expected Scores for Sample Resume

Using the sample content above, you should see approximately:

| Category | Expected Score | Reasoning |
|----------|---------------|-----------|
| Experience | 20-25/30 | ~5 years, clear progression |
| Skills | 20-25/25 | 13+ technical skills detected |
| Achievements | 18-23/25 | Multiple quantified bullets |
| Education | 8-10/10 | Degree + certifications |
| Clarity | 8-10/10 | Clean, well-structured |
| **TOTAL** | **74-93** | **Contender to Elite tier** |

## Testing Different Profiles

### Test Profile 1: Junior Developer
```
Experience: 1 year
Skills: 3-5 basic skills
No quantified achievements
Bachelor's degree
Expected: Rookie tier (50-64)
```

### Test Profile 2: Senior Engineer
```
Experience: 10+ years
Skills: 15+ technologies
Multiple metrics in bullets
Advanced degree + certs
Expected: Elite tier (90-100)
```

### Test Profile 3: Career Changer
```
Experience: 3 years
Skills: 6-8 skills
Few achievements
Bootcamp graduate
Expected: Contender tier (65-79)
```

## Browser Testing

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

Test responsive design:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

## Dark Mode Testing

1. Check system dark mode
2. All pages should adapt:
   - Dark backgrounds
   - Light text
   - Proper contrast
   - Readable colors

## Performance Checks

### Upload Speed
- Small file (100KB): < 1 second
- Large file (4MB): 2-3 seconds

### Parsing Accuracy
- Check console logs for errors
- Verify extracted skills match resume
- Confirm email/phone detected

## Known Limitations (MVP)

1. **Scoring Algorithm**: Basic keyword matching
   - Future: Semantic matching with embeddings

2. **File Parsing**: May miss complex formatting
   - Future: Better OCR for scanned PDFs

3. **Category Detection**: Fixed to "Software Engineer"
   - Future: Auto-detect or user selection

4. **Persistence**: Uses sessionStorage only
   - Future: Database integration

## Troubleshooting

### Issue: "Failed to process resume"
- **Cause**: Parsing error or corrupted file
- **Fix**: Try different file or simpler formatting

### Issue: Score seems too low
- **Cause**: Missing keywords or metrics
- **Fix**: Add more technical skills and quantified achievements

### Issue: Page won't load
- **Cause**: Dev server not running
- **Fix**: Check that port 3000 is active

### Issue: Redirect loop on results page
- **Cause**: Missing sessionStorage data
- **Fix**: Clear browser storage and re-upload

## Reporting Issues

If you find bugs, note:
1. Browser and version
2. Steps to reproduce
3. Expected vs. actual behavior
4. Console errors (F12 → Console tab)

## Next: What to Test After Phase 2

Once authentication is added:
- Sign up flow
- Login persistence
- Resume history
- Profile management
- Score tracking over time

---

**Happy Testing! 🧪🎯**
