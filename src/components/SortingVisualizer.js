import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  bubbleSortSteps,
  quickSortSteps,
  binaryInsertionSortSteps,
  mergeSortSteps,
  sortingAlgorithms
} from '../algorithms/sortingAlgorithms';

function SortingVisualizer({ array, algorithmId }) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200); // ms per step
  const [isFinished, setIsFinished] = useState(false);
  const speedRef = useRef(speed);
  const playingRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { playingRef.current = isPlaying; }, [isPlaying]);

  // Generate steps when array or algorithm changes
  useEffect(() => {
    if (!array || array.length === 0) return;

    setIsPlaying(false);
    setIsFinished(false);

    let generatedSteps = [];
    switch (algorithmId) {
      case 'quick':
        generatedSteps = quickSortSteps(array);
        break;
      case 'binaryInsertion':
        generatedSteps = binaryInsertionSortSteps(array);
        break;
      case 'merge':
        generatedSteps = mergeSortSteps(array);
        break;
      case 'bubble':
      default:
        generatedSteps = bubbleSortSteps(array);
        break;
    }

    setSteps(generatedSteps);
    setCurrentStep(0);
  }, [array, algorithmId]);

  // Animation timer
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          // Reached the end
          clearInterval(timer);
          setIsPlaying(false);
          setIsFinished(true);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, steps, speed]);

  const togglePlay = useCallback(() => {
    if (isFinished) {
      // Restart from beginning
      setCurrentStep(0);
      setIsFinished(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [isFinished]);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.max(0, prev - 1));
    setIsFinished(false);
  }, []);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    if (currentStep >= steps.length - 2) {
      setIsFinished(true);
    }
  }, [steps.length, currentStep]);

  const handleRestart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsFinished(false);
  }, []);

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  if (!array || array.length === 0 || steps.length === 0) {
    return <div className="visualizer-empty">Please enter an array to begin.</div>;
  }

  const stepData = steps[currentStep];
  const currentArray = stepData.array;
  const maxValue = Math.max(...currentArray);

  // Determine bar coloring
  const getBarClass = (index) => {
    let cls = 'bar';

    // Sorted elements get green
    if (stepData.sorted && stepData.sorted.includes(index)) {
      cls += ' bar-sorted';
      return cls;
    }

    // Currently being swapped gets purple
    if (stepData.swapping && stepData.swapping.includes(index)) {
      cls += ' bar-swapping';
      return cls;
    }

    // Currently being compared gets yellow/red
    if (stepData.comparing && stepData.comparing.includes(index)) {
      cls += ' bar-comparing';
      return cls;
    }

    return cls;
  };

  const currentAlgo = sortingAlgorithms.find(a => a.id === algorithmId);

  return (
    <div className="visualizer-container">
      <div className="visualizer-toolbar">
        <div className="playback-controls">
          <button
            className="btn btn-control btn-restart"
            onClick={handleRestart}
            title="Restart"
            disabled={currentStep === 0 && !isPlaying}
          >
            ⏮ Restart
          </button>
          <button
            className="btn btn-control btn-prev"
            onClick={handleStepBack}
            title="Previous step"
            disabled={currentStep === 0 || isPlaying}
          >
            ◀
          </button>
          <button
            className="btn btn-control btn-play"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : (isFinished ? 'Play again' : 'Play')}
          >
            {isPlaying ? '⏸ Pause' : (isFinished ? '🔁 Play Again' : '▶ Play')}
          </button>
          <button
            className="btn btn-control btn-next"
            onClick={handleStepForward}
            title="Next step"
            disabled={currentStep >= steps.length - 1 || isPlaying}
          >
            ▶
          </button>
          <button
            className="btn btn-control btn-end"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(steps.length - 1);
              setIsFinished(true);
            }}
            title="Skip to end"
            disabled={currentStep >= steps.length - 1 || isPlaying}
          >
            ⏭ End
          </button>
        </div>

        <div className="speed-control">
          <label htmlFor="speed-slider">
            Speed: {speed < 100 ? '⚡ Fast' : speed < 300 ? 'Normal' : '🐌 Slow'}
          </label>
          <input
            id="speed-slider"
            type="range"
            min="50"
            max="800"
            step="25"
            value={speed}
            onChange={handleSpeedChange}
          />
        </div>
      </div>

      {/* Step counter / progress */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            height: '100%',
            transition: 'width 0.2s ease',
            borderRadius: '4px'
          }}
        />
      </div>
      <div className="step-indicator">
        <span>
          Step: <strong>{currentStep + 1}</strong> / {steps.length}
        </span>
        <span className="algorithm-name">
          {currentAlgo ? currentAlgo.name : algorithmId}
        </span>
      </div>

      {/* Current operation message */}
      <div className={`status-message ${isFinished ? 'status-done' : ''}`}>
        {stepData.message}
      </div>

      {/* Bars visualization */}
      <div className="bars-container">
        {currentArray.map((value, index) => {
          const barHeight = (value / maxValue) * 100; // percentage
          return (
            <div
              key={`${index}-${value}-${currentStep}`}
              className="bar-wrapper"
              style={{ flex: `0 0 ${Math.min(100 / currentArray.length, 8)}%` }}
            >
              <div
                className={getBarClass(index)}
                style={{
                  height: `${Math.max(barHeight, 4)}%`,
                }}
              >
                <span className="bar-value">{value}</span>
              </div>
              <span className="bar-index">{index}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="legend">
        <span className="legend-item">
          <div className="legend-color legend-blue" /> Unsorted
        </span>
        <span className="legend-item">
          <div className="legend-color legend-yellow" /> Comparing
        </span>
        <span className="legend-item">
          <div className="legend-color legend-purple" /> Swapping
        </span>
        <span className="legend-item">
          <div className="legend-color legend-green" /> Sorted
        </span>
      </div>
    </div>
  );
}

export default SortingVisualizer;
