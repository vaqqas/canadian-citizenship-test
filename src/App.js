import React, { useState, useEffect } from 'react';
import './App.css';
import TestCreation from './components/TestCreation';
import TestTaking from './components/TestTaking';
import TestResults from './components/TestResults';
import Statistics from './components/Statistics';

function App() {
  const [currentPage, setCurrentPage] = useState('creation');
  const [testConfig, setTestConfig] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/question-bank.json')
      .then(response => response.json())
      .then(data => {
        setAllQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load questions:', err);
        setLoading(false);
      });
  }, []);

  const handleStartTest = (config) => {
    setTestConfig(config);
    setCurrentPage('test');
  };

  const handleTestComplete = (results) => {
    setTestResults(results);
    setCurrentPage('results');
  };

  const handleBackToCreation = () => {
    setCurrentPage('creation');
    setTestConfig(null);
    setTestResults(null);
  };

  const handleRetakeTest = () => {
    setTestResults(null);
    setCurrentPage('test');
  };

  const handleViewStatistics = () => {
    setCurrentPage('statistics');
  };

  if (loading) {
    return (
      <div className="App loading-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentPage === 'creation' && (
        <TestCreation onStartTest={handleStartTest} onViewStats={handleViewStatistics} />
      )}
      {currentPage === 'test' && testConfig && (
        <TestTaking
          config={testConfig}
          questions={allQuestions}
          onComplete={handleTestComplete}
          onCancel={handleBackToCreation}
        />
      )}
      {currentPage === 'results' && testResults && (
        <TestResults
          results={testResults}
          onNewTest={handleBackToCreation}
          onRetake={handleRetakeTest}
          onViewStats={handleViewStatistics}
        />
      )}
      {currentPage === 'statistics' && (
        <Statistics
          questions={allQuestions}
          onBack={handleBackToCreation}
        />
      )}
    </div>
  );
}

export default App;
