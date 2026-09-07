// Sorting algorithm implementations that produce step-by-step animation frames
// Each "step" object contains:
//   - array: current state of the array
//   - comparing: [indexA, indexB] indices currently being compared (or null)
//   - swapping: [indexA, indexB] indices currently being swapped (or null)
//   - sorted: indices that are confirmed sorted (or null)
//   - minIndex: index of current minimum (for selection-based algorithms, or null)
//   - message: description of the current operation

/**
 * Bubble Sort
 * Repeatedly swaps adjacent elements if they are in the wrong order.
 * After each pass, the largest element "bubbles up" to its final position.
 */
export function bubbleSortSteps(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: null,
    message: 'Starting Bubble Sort - comparing adjacent elements and swapping if out of order'
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: null,
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        message: `Comparing ${arr[j]} and ${arr[j + 1]}`
      });

      if (arr[j] > arr[j + 1]) {
        // Swap step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          message: `Swapping positions to put smaller first`
        });
      }
    }
    // Mark the last element of this pass as sorted
    const newlySorted = n - 1 - i;
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      message: `Pass ${i + 1} complete - ${arr[newlySorted]} is now in its final position`
    });
    if (!swapped) {
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: null,
        sorted: Array.from({ length: n }, (_, k) => k),
        message: 'No swaps in this pass - array is already sorted!'
      });
      break;
    }
  }

  if (steps[steps.length - 1].sorted === null ||
      steps[steps.length - 1].sorted.length < n) {
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: Array.from({ length: n }, (_, k) => k),
      message: '✅ Bubble Sort complete! Array is fully sorted.'
    });
  }

  return steps;
}

/**
 * Quick Sort
 * Uses divide-and-conquer: picks a pivot, partitions array around it, recurses.
 */
export function quickSortSteps(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const sortedIndices = new Set();

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: null,
    message: 'Starting Quick Sort - using divide-and-conquer with a pivot element'
  });

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
      message: `Choosing pivot = ${pivot} (last element of the current subarray)`
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: null,
        sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
        message: `Compare ${arr[j]} with pivot ${arr[high]}`
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            comparing: null,
            swapping: [i, j],
            sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
            message: `${arr[j]} < ${pivot} - move to left partition (swap positions ${i} and ${j})`
          });
        }
      }
    }

    const pivotFinalPos = i + 1;
    if (pivotFinalPos !== high) {
      [arr[pivotFinalPos], arr[high]] = [arr[high], arr[pivotFinalPos]];
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: [pivotFinalPos, high],
        sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
        message: `Move pivot ${pivot} to its correct position (index ${pivotFinalPos})`
      });
    }

    sortedIndices.add(pivotFinalPos);
    return pivotFinalPos;
  }

  function quickSortRec(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortRec(low, pi - 1);
      quickSortRec(pi + 1, high);
    } else if (low === high && low >= 0) {
      sortedIndices.add(low);
    }
  }

  quickSortRec(0, arr.length - 1);

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    message: '✅ Quick Sort complete! Array is fully sorted.'
  });

  return steps;
}

/**
 * Binary Insertion Sort (commonly called "Binary Sort")
 * Insertion sort but uses binary search to find the correct
 * position instead of linear search, reducing comparisons.
 */
export function binaryInsertionSortSteps(inputArray) {
  const arr = [...inputArray];
  const steps = [];

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: null,
    message: 'Starting Binary Insertion Sort - using binary search to find insertion points'
  });

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let low = 0;
    let high = i - 1;

    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: null,
      message: `Picking element ${key} (index ${i}) to insert into the sorted portion`
    });

    // Binary search to find insertion position
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({
        array: [...arr],
        comparing: [mid, i],
        swapping: null,
        sorted: null,
        message: `Binary search: compare ${key} with ${arr[mid]} at middle index ${mid}`
      });
      if (arr[mid] < key) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Shift elements to make room
    for (let j = i - 1; j >= low; j--) {
      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: [j, j + 1],
        sorted: null,
        message: `Shifting element right to make room for ${key}`
      });
    }

    // Insert the key
    arr[low] = key;
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      message: `Inserted ${key} at position ${low}`
    });
  }

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    message: '✅ Binary Insertion Sort complete! Array is fully sorted.'
  });

  return steps;
}

/**
 * Merge Sort
 * Divide-and-conquer: splits array in half, recursively sorts, then merges.
 */
export function mergeSortSteps(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const sortedIndices = new Set();

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: null,
    message: 'Starting Merge Sort - recursively dividing array and merging sorted halves'
  });

  function merge(l, m, r) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        comparing: [l + i, m + 1 + j],
        swapping: null,
        sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
        message: `Merge: compare ${left[i]} with ${right[j]}`
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: [k - 1, null],
        sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
        message: `Placed ${arr[k - 1]} into merged array at index ${k - 1}`
      });
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: [k, null],
        sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
        message: `Copying remaining element from left half`
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: [k, null],
        sorted: sortedIndices.size > 0 ? [...sortedIndices] : null,
        message: `Copying remaining element from right half`
      });
      j++;
      k++;
    }
  }

  function mergeSortRec(l, r) {
    if (l < r) {
      const m = l + Math.floor((r - l) / 2);
      mergeSortRec(l, m);
      mergeSortRec(m + 1, r);
      merge(l, m, r);
    } else {
      if (l >= 0) sortedIndices.add(l);
    }
  }

  mergeSortRec(0, arr.length - 1);

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    message: '✅ Merge Sort complete! Array is fully sorted.'
  });

  return steps;
}

/**
 * Get all available sorting algorithms with metadata
 */
export const sortingAlgorithms = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    description: 'Repeatedly swaps adjacent elements that are out of order. Simple but slow for large arrays.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    generator: bubbleSortSteps
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    description: 'Picks a pivot, partitions the array around it, and recursively sorts each part. Very fast in practice.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    generator: quickSortSteps
  },
  {
    id: 'binaryInsertion',
    name: 'Binary Insertion Sort',
    description: 'Insertion sort enhanced with binary search to find insertion positions, reducing comparisons.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    generator: binaryInsertionSortSteps
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    description: 'Divide-and-conquer algorithm that recursively splits and merges sorted halves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    generator: mergeSortSteps
  }
];

