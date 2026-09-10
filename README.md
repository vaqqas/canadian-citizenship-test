# 🇨🇦 Citizenship Test Taker

A React web application for creating and taking Canadian Citizenship tests based on the "Discover Canada" study guide.

## Features

- **Test Creation Page**: Users can customize their test by:
  - Selecting specific chapters or all chapters
  - Choosing number of questions (20 or all available)
  - Option to randomize question order

- **Question Bank**: 149 citizenship test questions covering:
  - Rights and Responsibilities of Citizenship
  - Who We Are (Founding Peoples and Diversity)
  - Canada's History
  - Modern Canada
  - How Canadians Govern Themselves
  - Federal Elections
  - The Justice System
  - Canadian Symbols
  - Canada's Economy
  - Canada's Regions
  - And more!

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the tester folder:
```bash
cd "c:\Data\Work\repos\TP Invoice Counter\tester"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Project Structure

```
tester/
├── public/
│   ├── index.html
│   └── question-bank.json (149 citizenship questions)
├── src/
│   ├── components/
│   │   ├── TestCreation.js (Test creation form)
│   │   └── TestCreation.css (Styling)
│   ├── App.js (Main app component)
│   ├── App.css (App styling)
│   └── index.js (React entry point)
├── package.json
└── README.md (This file)
```

## Usage

1. **Create a Test**: 
   - Select chapters you want to study
   - Choose number of questions (20 or all)
   - Optional: Enable randomization
   - Click "Start Test"

2. **Take the Test**:
   - Answer each question
   - Review your answers before submitting
   - See your score and results

## Question Format

Each question in the question bank includes:
- `id`: Unique identifier (e.g., "03015")
- `chapter`: Chapter/topic name
- `question`: The question text
- `options`: Array of 4 multiple-choice options
- `answer`: Index of the correct option (0-3)

## Building for Production

To create a production build:
```bash
npm run build
```

The optimized build will be in the `build/` folder.

## Technology Stack

- **React 18**: UI library
- **CSS3**: Styling with gradients and animations
- **JavaScript (ES6+)**: Modern JavaScript features

## Future Enhancements

- [ ] Complete test-taking interface
- [ ] Answer submission and scoring
- [ ] Result analysis and statistics
- [ ] Progress tracking
- [ ] Timer/time limit option
- [ ] Practice mode vs. exam mode
- [ ] Review mode after test completion
- [ ] Study notes for each question
- [ ] Performance analytics

## Notes

- The app is fully responsive and works on mobile, tablet, and desktop devices
- Question bank is loaded from `public/question-bank.json`
- All questions are based on the official "Discover Canada" study guide

## License

This project is for educational purposes.
