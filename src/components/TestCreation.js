import React, { useState, useEffect } from 'react';
import './TestCreation.css';

function TestCreation({ onStartTest, onViewStats }) {
  const [chapters, setChapters] = useState({});
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [numQuestions, setNumQuestions] = useState('20');
  const [randomize, setRandomize] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch and process question bank
    fetch('/data/question-bank.json')
      .then(response => response.json())
      .then(data => {
        // Extract unique chapters and their question counts
        const chapterMap = {};
        data.forEach(question => {
          if (!chapterMap[question.chapter]) {
            chapterMap[question.chapter] = 0;
          }
          chapterMap[question.chapter]++;
        });
        setChapters(chapterMap);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load question bank');
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChapterToggle = (chapter) => {
    setSelectedChapters(prev => {
      if (prev.includes(chapter)) {
        return prev.filter(c => c !== chapter);
      } else {
        return [...prev, chapter];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedChapters.length === Object.keys(chapters).length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(Object.keys(chapters));
    }
  };

  const handleStartTest = () => {
    if (selectedChapters.length === 0) {
      alert('Please select at least one chapter');
      return;
    }

    const config = {
      chapters: selectedChapters,
      numQuestions: numQuestions === 'all' ? 'all' : parseInt(numQuestions),
      randomize: randomize
    };

    onStartTest(config);
  };

  if (loading) {
    return (
      <div className="test-creation">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-creation">
        <div className="error">{error}</div>
      </div>
    );
  }

  const chapterEntries = Object.entries(chapters).sort();
  const allSelected = selectedChapters.length === chapterEntries.length;

  return (
    <div className="test-creation">
      <div className="container">
        <div className="header">
          <div className="header-top">
            <div>
              <h1>🇨🇦 Citizenship Test Creator</h1>
              <p>Create your custom test by selecting chapters and preferences</p>
            </div>
            <button className="stats-btn" onClick={onViewStats} title="View your performance statistics">
              📊 Statistics
            </button>
          </div>
        </div>

        <div className="form-section">
          {/* Select Questions From Section */}
          <div className="form-group">
            <label className="section-title">📚 Select Questions from:</label>

            <div className="select-all-container">
              <input
                type="checkbox"
                id="all-chapters"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <label htmlFor="all-chapters" className="select-all-label">
                All Chapters ({chapterEntries.length} chapters)
              </label>
            </div>

            <div className="chapters-list">
              {chapterEntries.map(([chapter, count], index) => (
                <div key={chapter} className="chapter-item">
                  <input
                    type="checkbox"
                    id={`chapter-${index}`}
                    checked={selectedChapters.includes(chapter)}
                    onChange={() => handleChapterToggle(chapter)}
                  />
                  <label htmlFor={`chapter-${index}`}>
                    {chapter}
                    <span className="question-count">({count} questions)</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Number of Questions Section */}
          <div className="form-group">
            <label className="section-title">🔢 Number of Questions:</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="all-questions"
                  name="numQuestions"
                  value="all"
                  checked={numQuestions === 'all'}
                  onChange={(e) => setNumQuestions(e.target.value)}
                />
                <label htmlFor="all-questions">All</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="twenty-questions"
                  name="numQuestions"
                  value="20"
                  checked={numQuestions === '20'}
                  onChange={(e) => setNumQuestions(e.target.value)}
                />
                <label htmlFor="twenty-questions">20</label>
              </div>
            </div>
          </div>

          {/* Randomize Section */}
          <div className="form-group">
            <label className="section-title">🔀 Randomize:</label>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="randomize"
                checked={randomize}
                onChange={(e) => setRandomize(e.target.checked)}
              />
              <label htmlFor="randomize">
                {randomize ? '✓ Questions will appear in random order' : 'Questions will appear in random order'}
              </label>
            </div>
          </div>

          {/* Start Test Button */}
          <button
            className="start-btn"
            onClick={handleStartTest}
            disabled={selectedChapters.length === 0}
          >
            Start Test →
          </button>
        </div>

        {/* Summary */}
        <div className="summary">
          <h3>Test Summary:</h3>
          <p>
            <strong>Chapters Selected:</strong> {selectedChapters.length > 0 ? selectedChapters.length : 'None'}
          </p>
          <p>
            <strong>Questions:</strong> {numQuestions === 'all' ? 'All available' : '20'}
          </p>
          <p>
            <strong>Order:</strong> {randomize ? 'Random' : 'Sequential'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestCreation;
