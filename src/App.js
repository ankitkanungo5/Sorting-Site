import React, { useState } from 'react';
import SortingVisualizer from './components/SortingVisualizer';
import { sortingAlgorithms } from './algorithms/sortingAlgorithms';
import './App.css';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [arrayInput, setArrayInput] = useState('64, 34, 25, 12, 22, 11, 90');
  const [parsedArray, setParsedArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputError, setInputError] = useState('');
  const [sortKey, setSortKey] = useState(0);

  const selectedAlgo = sortingAlgorithms.find(a => a.id === selectedAlgorithm);

  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value);
    // Reset the visualization when changing algorithms
    setSortKey(prev => prev + 1);
  };

  const handleArrayInputChange = (e) => {
    setArrayInput(e.target.value);
  };

  const handleSetArray = () => {
    // Parse the comma-separated numbers
    const numbers = arrayInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(Number);

    if (numbers.length === 0) {
      setInputError('Please enter at least one number.');
      return;
    }

    if (numbers.some(isNaN)) {
      setInputError('Please enter valid numbers separated by commas.');
      return;
    }

    if (numbers.some(n => n < 0)) {
      setInputError('Please enter only non-negative numbers for better visualization.');
      return;
    }

    setInputError('');
    setParsedArray(numbers);
    // Reset visualization with new array
    setSortKey(prev => prev + 1);
  };

  const handleExample = (arr) => {
    setArrayInput(arr.join(', '));
    setParsedArray(arr);
    setInputError('');
    setSortKey(prev => prev + 1);
  };

  const handleRandom = () => {
    // Generate a random array of 7-10 unique-ish numbers between 1 and 100
    const size = 7 + Math.floor(Math.random() * 4); // 7-10 elements
    const rand = [];
    for (let i = 0; i < size; i++) {
      rand.push(1 + Math.floor(Math.random() * 99)); // 1-99
    }
    handleExample(rand);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔀 Sorting Algorithm Visualizer</h1>
        <p>Watch your array get sorted step-by-step with live animation!</p>
      </header>

      <div className="controls-panel">
        {/* Algorithm selector */}
        <div className="control-group">
          <label className="control-label" htmlFor="algorithm-select">
            Select Sorting Algorithm:
          </label>
          <select
            id="algorithm-select"
            className="algorithm-select"
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
          >
            {sortingAlgorithms.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
          {selectedAlgo && (
            <div className="algorithm-info">
              <p className="algo-description">{selectedAlgo.description}</p>
              <p className="algo-complexity">
                ⏱️ Time: <strong>{selectedAlgo.timeComplexity}</strong> &nbsp;|&nbsp;
                💾 Space: <strong>{selectedAlgo.spaceComplexity}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Array input */}
        <div className="control-group">
          <label className="control-label" htmlFor="array-input">
            Enter Array (comma-separated numbers):
          </label>
          <div className="input-row">
            <input
              id="array-input"
              type="text"
              className="array-input"
              value={arrayInput}
              onChange={handleArrayInputChange}
              placeholder="e.g. 64, 34, 25, 12, 22, 11, 90"
            />
            <button className="btn btn-primary" onClick={handleSetArray}>
              Set Array
            </button>
            <button className="btn btn-secondary" onClick={handleRandom}>
              🎲 Random
            </button>
          </div>
          {inputError && <p className="error-text">{inputError}</p>}
        </div>
      </div>

      {/* Visualization area */}
      <SortingVisualizer
        key={sortKey}
        array={parsedArray}
        algorithmId={selectedAlgorithm}
      />

      <footer className="app-footer">
        <p>
          Built with React.js • Bubble Sort • Quick Sort • Binary Insertion Sort • Merge Sort
        </p>
      </footer>
    </div>
  );
}

export default App;
