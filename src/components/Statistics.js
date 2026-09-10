import React, { useState, useMemo } from 'react';
import './Statistics.css';

function Statistics({ questions, onBack }) {
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [filterChapter, setFilterChapter] = useState('all');

  const stats = JSON.parse(localStorage.getItem('questionStats') || '{}');

  // Build table data
  const tableData = useMemo(() => {
    return questions.map(q => {
      const stat = stats[q.id] || { taken: 0, correct: 0 };
      const score = stat.taken === 0 ? 0 : Math.round((stat.correct / stat.taken) * 100);
      return {
        id: q.id,
        chapter: q.chapter,
        questionNumber: q.id.slice(-3),
        question: q.question,
        taken: stat.taken,
        correct: stat.correct,
        score: score
      };
    });
  }, [questions, stats]);

  // Filter data
  const filteredData = useMemo(() => {
    if (filterChapter === 'all') {
      return tableData;
    }
    return tableData.filter(item => item.chapter === filterChapter);
  }, [tableData, filterChapter]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getChapters = () => {
    return [...new Set(questions.map(q => q.chapter))].sort();
  };

  const chapters = getChapters();

  // Calculate overall stats
  const overallStats = useMemo(() => {
    let totalTaken = 0;
    let totalCorrect = 0;
    let questionsAttempted = 0;

    Object.values(stats).forEach(stat => {
      totalTaken += stat.taken;
      totalCorrect += stat.correct;
    });

    Object.values(stats).forEach(stat => {
      if (stat.taken > 0) questionsAttempted++;
    });

    return {
      questionsAttempted,
      totalTaken,
      totalCorrect,
      overallScore: totalTaken === 0 ? 0 : Math.round((totalCorrect / totalTaken) * 100)
    };
  }, [stats]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <span className="sort-icon">⇅</span>;
    return <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="statistics">
      <div className="stats-container">
        {/* Header */}
        <div className="stats-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h1>📊 Your Performance Statistics</h1>
        </div>

        {/* Overall Stats */}
        <div className="overall-stats">
          <div className="stat-card">
            <div className="stat-value">{overallStats.questionsAttempted}</div>
            <div className="stat-label">Questions Attempted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overallStats.totalTaken}</div>
            <div className="stat-label">Total Attempts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overallStats.totalCorrect}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-value" style={{ color: '#667eea' }}>{overallStats.overallScore}%</div>
            <div className="stat-label">Overall Score</div>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <label>Filter by Chapter:</label>
          <select value={filterChapter} onChange={(e) => setFilterChapter(e.target.value)}>
            <option value="all">All Chapters ({chapters.length})</option>
            {chapters.map(chapter => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('chapter')}>
                  Chapter <SortIcon column="chapter" />
                </th>
                <th onClick={() => handleSort('questionNumber')}>
                  Q# <SortIcon column="questionNumber" />
                </th>
                <th>Question</th>
                <th onClick={() => handleSort('taken')}>
                  Times Taken <SortIcon column="taken" />
                </th>
                <th onClick={() => handleSort('correct')}>
                  Correct <SortIcon column="correct" />
                </th>
                <th onClick={() => handleSort('score')}>
                  Score (%) <SortIcon column="score" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No questions attempted yet. Create and complete a test to see statistics.
                  </td>
                </tr>
              ) : (
                sortedData.map(item => (
                  <tr key={item.id} className={`score-${Math.min(Math.floor(item.score / 25), 3)}`}>
                    <td className="chapter-cell">{item.chapter}</td>
                    <td className="number-cell">{item.questionNumber}</td>
                    <td className="question-cell" title={item.question}>
                      {item.question.length > 60
                        ? item.question.substring(0, 60) + '...'
                        : item.question}
                    </td>
                    <td className="number-cell">{item.taken}</td>
                    <td className="number-cell">
                      <span className={`badge ${item.taken === 0 ? 'badge-gray' : item.score >= 80 ? 'badge-green' : item.score >= 50 ? 'badge-orange' : 'badge-red'}`}>
                        {item.correct}/{item.taken}
                      </span>
                    </td>
                    <td className="score-cell">
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor:
                              item.score >= 80 ? '#4caf50' :
                              item.score >= 50 ? '#ff9800' : '#f5576c'
                          }}
                        ></div>
                      </div>
                      <span className="score-text">{item.score}%</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="summary-box">
          <h3>📈 Summary</h3>
          <p>
            You have attempted <strong>{filteredData.filter(d => d.taken > 0).length}</strong> questions
            {filterChapter !== 'all' && ` from ${filterChapter}`} with an overall success rate of{' '}
            <strong>
              {filteredData.filter(d => d.taken > 0).length === 0
                ? 'N/A'
                : Math.round(
                    (filteredData.reduce((sum, d) => sum + d.correct, 0) /
                      filteredData.reduce((sum, d) => sum + d.taken, 0)) *
                    100
                  ) + '%'}
            </strong>
            .
          </p>
          {filteredData.some(d => d.score < 50) && (
            <p className="focus-areas">
              💡 Focus on questions where your score is below 50% to improve further.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
