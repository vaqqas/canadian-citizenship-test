# 🇨🇦 Citizenship Test Taker - Project Guide

## Project Overview
A React web application for creating and taking Canadian citizenship tests based on the "Discover Canada" study guide. Users can customize tests by selecting chapters, question count, and randomization. The app tracks performance metrics and provides detailed statistics.

## Core Purpose
- Help users prepare for Canadian citizenship tests
- Track individual question performance
- Provide detailed results and performance analytics
- Store test history locally in the browser

## Tech Stack
- **Frontend:** React 18.2.0
- **Styling:** CSS3 (no external UI libraries, all custom)
- **State Management:** React hooks (useState, useEffect, useMemo)
- **Persistence:** Browser localStorage
- **Data Source:** `/data/question-bank.json` (149 questions across 16 chapters)

## Project Structure

```
tester/
├── public/
│   ├── data/
│   │   └── question-bank.json          # 149 citizenship questions
│   └── index.html                      # HTML template
├── src/
│   ├── components/
│   │   ├── TestCreation.js/.css        # Test configuration page
│   │   ├── TestTaking.js/.css          # Question display & answering
│   │   ├── TestResults.js/.css         # Score & answer review
│   │   └── Statistics.js/.css          # Performance analytics table
│   ├── App.js/.css                     # Main app routing
│   └── index.js                        # React entry point
├── package.json
└── claude.md (this file)
```

## Component Responsibilities

### **App.js**
- Main app component, handles page routing
- Loads question bank from `/data/question-bank.json`
- Manages state: currentPage, testConfig, testResults, allQuestions
- Routes: creation → test → results → statistics

### **TestCreation.js** (Homepage)
- User selects test parameters:
  - Chapters (multi-select checkboxes)
  - Number of questions (All or 20)
  - Randomize option (checkbox)
- Shows "Select All" button for all chapters
- Displays "Statistics" button to view performance
- Validates at least one chapter is selected before starting

### **TestTaking.js** (Test Interface)
- Displays questions one at a time
- Radio button options (A, B, C, D)
- Navigation:
  - Previous/Next buttons
  - Question number grid (clickable, shows answered status)
- Progress bar showing completion
- Tracks answers in state object: `{ questionId: optionIndex }`
- Prevents submission until all questions answered
- Saves stats to localStorage on submit

### **TestResults.js** (Score Review)
- Displays score with color coding:
  - Green: ≥80% (Excellent)
  - Orange: 60-79% (Good)
  - Red: <60% (Needs work)
- Shows timestamp and performance message
- Expandable question cards showing:
  - Question text
  - User's answer (highlighted)
  - Correct answer (if wrong)
  - Chapter name
- Buttons: New Test, View Statistics

### **Statistics.js** (Analytics Page)
- Displays overall stats: Questions Attempted, Total Attempts, Correct, Overall Score
- Filterable table by chapter
- Sortable columns:
  - Chapter, Question Number, Question Text
  - Times Taken, Correct (with badge)
  - Score (%) with progress bar
- Color-coded performance rows
- Mobile-responsive card view for small screens

## LocalStorage Schema

**Key:** `questionStats` (JSON object)

```javascript
{
  "01001": { "taken": 5, "correct": 4 },  // 80% (4 correct out of 5)
  "03015": { "taken": 2, "correct": 1 },  // 50%
  "08008": { "taken": 0, "correct": 0 }   // Never attempted
}
```

**Saved on:** Test completion (after user submits answers)
**Used by:** Statistics page to calculate performance metrics

## Question Bank Format

**File:** `/data/question-bank.json`
**Structure:** Array of question objects

```javascript
{
  "id": "01001",              // Chapter##Question###
  "chapter": "Chapter Name",  // From 16 chapters
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "answer": 0                 // Index of correct option (0-3)
}
```

**Key Points:**
- 149 total questions across 16 chapters
- Chapter numbers: 01-16 (mapped in TestCreation.js)
- IDs format: [chapter #][question # within chapter]
- Answer is 0-indexed (0-3 for A-D)

## Key Development Notes

### State Management
- Use React hooks consistently (useState, useEffect, useMemo)
- Memoize expensive computations (sorting, filtering) with useMemo
- Lift state to App.js for cross-component data sharing

### Styling
- No external UI libraries - all CSS is custom
- Use CSS variables for consistent theming
- Gradient background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Color scheme:
  - Primary: #667eea (blue)
  - Secondary: #764ba2 (purple)
  - Success: #4caf50 (green)
  - Warning: #ff9800 (orange)
  - Error: #f5576c (red)

### Data Flow
1. **Test Creation:** User selects parameters → passed to TestTaking
2. **Test Taking:** Questions filtered/randomized → answers tracked → submitted
3. **Results:** Score calculated → localStorage updated → displayed
4. **Statistics:** LocalStorage read → data processed → table rendered

### Performance Considerations
- Filter and randomize questions once in TestTaking.useEffect
- Use useMemo for sorting/filtering in Statistics to avoid re-renders
- Questions loaded only once on app mount
- LocalStorage writes only on test completion (not per answer)

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm start
# Opens at http://localhost:3000

# Build for production
npm run build
# Output in /build folder
```

## Common Tasks

### Add a New Feature
1. Create component in `src/components/`
2. Create paired `.css` file with same name
3. Import in `App.js` and add to routing logic
4. Follow existing component patterns (props, state, rendering)

### Modify Question Bank
1. Update `/public/data/question-bank.json`
2. Ensure all questions have required fields (id, chapter, question, options, answer)
3. No need to rebuild - app fetches dynamically
4. Test with different chapter/question combinations

### Fix a Bug
1. Check console for errors
2. Verify localStorage via browser DevTools (Application → LocalStorage)
3. Test with fresh localStorage: `localStorage.clear()`
4. Check component props and state flow in React DevTools

### Add Chapter Statistics
- Chapter list auto-generated from question bank in TestCreation
- No hardcoding needed - changes to questions automatically update UI

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13+)
- IE: Not supported (uses modern JS/CSS)

## Known Limitations & Future Enhancements
- ✅ Current: Single-user, browser-only (localStorage)
- 🔄 Could add: Cloud sync, user accounts, progress tracking
- 🔄 Could add: Timed tests, study notes per question
- 🔄 Could add: Export test results as PDF
- 🔄 Could add: Difficulty level filtering
- 🔄 Could add: Category-based question hints

## Debugging Tips

### Questions Not Loading
- Check browser console (F12)
- Verify `/data/question-bank.json` exists in public folder
- Check file is valid JSON: `JSON.parse(fileContent)`

### LocalStorage Issues
- Open DevTools → Application tab → LocalStorage
- Clear with: `localStorage.clear()`
- View stats: `console.log(JSON.parse(localStorage.getItem('questionStats')))`

### Styling Issues
- Ensure CSS class names match in JS imports
- Check responsive breakpoints: 768px, 600px
- Test in DevTools device emulator

### State Not Updating
- Use React DevTools to inspect component state
- Check that setState is called with new object reference
- Verify useEffect dependencies array

## Code Conventions
- **Components:** PascalCase (TestCreation.js)
- **CSS Classes:** kebab-case (.test-creation, .question-card)
- **Functions:** camelCase (handleAnswerChange, calculateScore)
- **Constants:** UPPER_SNAKE_CASE (CHAPTER_NUMBERS)
- **Files:** Match component name exactly (TestCreation.js, TestCreation.css)

## File Paths to Remember
- Questions load from: `/data/question-bank.json`
- Main app file: `src/App.js`
- Component folder: `src/components/`
- CSS always paired with component file
- Public assets in: `public/` folder

## Important URLs
- **Development:** http://localhost:3000
- **Question data:** Loaded from `/data/question-bank.json` via fetch()
- **GitHub:** N/A (local project)

## Questions? Refer To:
- Component code for implementation patterns
- TestCreation.css for styling conventions
- App.js for routing and state flow
- Questions in question-bank.json structure format
