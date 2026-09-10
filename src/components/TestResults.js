import React, { useState } from 'react';
import './TestResults.css';
import Footer from './Footer';

function TestResults({ results, onNewTest, onRetake, onViewStats }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 60) return '#ff9800';
    return '#f5576c';
  };

  return (
    <div className="test-results-wrapper">
      <div className="test-results">
        <div className="results-container">
        {/* Score Section */}
        <div className="score-section" style={{ borderColor: getScoreColor(results.percentage) }}>
          <h1 className="score-title">Test Completed! 🎉</h1>

          <div className="score-display">
            <div className="score-circle" style={{ borderColor: getScoreColor(results.percentage) }}>
              <div className="score-percentage" style={{ color: getScoreColor(results.percentage) }}>
                {results.percentage}%
              </div>
            </div>
            <div className="score-info">
              <p className="score-text">
                <strong>Score:</strong> {results.score} out of {results.total}
              </p>
              <p className="test-time">
                <strong>Completed:</strong> {results.timestamp}
              </p>
              <p className="performance-message">
                {results.percentage >= 80 && "🌟 Excellent! You're ready for the citizenship test!"}
                {results.percentage >= 60 && results.percentage < 80 && "👍 Good job! A bit more practice would help."}
                {results.percentage < 60 && "💪 Keep studying! Review the questions below."}
              </p>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="review-section">
          <h2>📋 Review Your Answers</h2>

          <div className="questions-list">
            {results.details.map((detail, index) => (
              <div key={detail.id} className={`question-card ${detail.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="question-header" onClick={() => toggleExpand(detail.id)}>
                  <div className="question-header-left">
                    <span className={`status-icon ${detail.isCorrect ? 'correct' : 'incorrect'}`}>
                      {detail.isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="question-number">Q{index + 1}</span>
                    <span className="chapter-name">{detail.chapter}</span>
                  </div>
                  <span className="expand-icon">{expandedId === detail.id ? '−' : '+'}</span>
                </div>

                {expandedId === detail.id && (
                  <div className="question-details">
                    <p className="question-text">{detail.question}</p>

                    <div className="answer-section">
                      <div className={`answer-row ${detail.isCorrect ? 'correct' : 'incorrect'}`}>
                        <span className="label">Your Answer:</span>
                        <span className="answer-text">{String.fromCharCode(65 + detail.selectedIndex)}. {detail.selectedOption}</span>
                      </div>

                      {!detail.isCorrect && (
                        <div className="answer-row correct">
                          <span className="label">Correct Answer:</span>
                          <span className="answer-text">{String.fromCharCode(65 + detail.correctIndex)}. {detail.correctOption}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="retake-btn" onClick={onRetake}>
            🔄 Retake Test
          </button>
          <button className="new-test-btn" onClick={onNewTest}>
            🆕 Create New Test
          </button>
          <button className="view-stats-btn" onClick={onViewStats}>
            📊 View Statistics
          </button>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default TestResults;
