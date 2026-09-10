import React, { useState, useEffect } from 'react';
import './TestTaking.css';

function TestTaking({ config, questions, onComplete, onCancel }) {
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter questions based on selected chapters
    let filtered = questions.filter(q => config.chapters.includes(q.chapter));

    // Limit questions if needed
    if (config.numQuestions !== 'all') {
      filtered = filtered.slice(0, config.numQuestions);
    }

    // Randomize if needed
    if (config.randomize) {
      filtered = filtered.sort(() => Math.random() - 0.5);
    }

    setTestQuestions(filtered);
    setLoading(false);
  }, [questions, config]);

  const handleAnswerChange = (questionId, selectedOptionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOptionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < testQuestions.length) {
      alert('Please answer all questions before submitting');
      return;
    }

    // Calculate score
    let score = 0;
    const details = testQuestions.map(q => {
      const isCorrect = answers[q.id] === q.answer;
      if (isCorrect) score++;
      return {
        id: q.id,
        question: q.question,
        chapter: q.chapter,
        selectedOption: q.options[answers[q.id]],
        selectedIndex: answers[q.id],
        correctOption: q.options[q.answer],
        correctIndex: q.answer,
        isCorrect
      };
    });

    // Save to localStorage
    const stats = JSON.parse(localStorage.getItem('questionStats') || '{}');
    testQuestions.forEach(q => {
      if (!stats[q.id]) {
        stats[q.id] = { taken: 0, correct: 0 };
      }
      stats[q.id].taken++;
      if (answers[q.id] === q.answer) {
        stats[q.id].correct++;
      }
    });
    localStorage.setItem('questionStats', JSON.stringify(stats));

    const results = {
      score,
      total: testQuestions.length,
      percentage: Math.round((score / testQuestions.length) * 100),
      details,
      timestamp: new Date().toLocaleString()
    };

    onComplete(results);
  };

  if (loading) {
    return <div className="test-taking"><div className="loading">Loading questions...</div></div>;
  }

  if (testQuestions.length === 0) {
    return (
      <div className="test-taking">
        <div className="error-message">
          <p>No questions found for the selected chapters.</p>
          <button onClick={onCancel}>← Back</button>
        </div>
      </div>
    );
  }

  const currentQuestion = testQuestions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const unansweredCount = testQuestions.length - Object.keys(answers).length;

  return (
    <div className="test-taking">
      <div className="test-container">
        {/* Header */}
        <div className="test-header">
          <div className="progress-info">
            <h2>Question {currentQuestionIndex + 1} of {testQuestions.length}</h2>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%`}}
              ></div>
            </div>
          </div>
          <div className="test-stats">
            <span className="unanswered">Unanswered: {unansweredCount}</span>
          </div>
        </div>

        {/* Question */}
        <div className="question-section">
          <div className="chapter-badge">{currentQuestion.chapter}</div>
          <h3 className="question-text">{currentQuestion.question}</h3>

          {/* Options */}
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={() => handleAnswerChange(currentQuestion.id, index)}
                />
                <span className="option-text">{String.fromCharCode(65 + index)}. {option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation-buttons">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>

          <div className="question-numbers">
            {testQuestions.map((q, idx) => (
              <button
                key={idx}
                className={`question-number ${idx === currentQuestionIndex ? 'active' : ''} ${answers[q.id] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(idx)}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            className="nav-btn next-btn"
            onClick={handleNext}
            disabled={currentQuestionIndex === testQuestions.length - 1}
          >
            Next →
          </button>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={unansweredCount > 0}
            title={unansweredCount > 0 ? `Answer ${unansweredCount} more question(s)` : 'Submit test'}
          >
            {unansweredCount === 0 ? '✓ Submit Test' : `Answer ${unansweredCount} more...`}
          </button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TestTaking;
