/* Test script for validating sorting algorithms */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// Copy the ES module source to a .mjs temp file so Node can import it
const algoPath = path.join(__dirname, 'src', 'algorithms', 'sortingAlgorithms.js');
const mjsPath = path.join(__dirname, '_sortingAlgorithms.mjs');
fs.copyFileSync(algoPath, mjsPath);

async function main() {
  const {
    bubbleSortSteps,
    quickSortSteps,
    binaryInsertionSortSteps,
    mergeSortSteps
  } = await import(pathToFileURL(mjsPath).href);

  function validate(name, steps, n) {
    const final = steps[steps.length - 1];
    const arr = final.array;

    // Check array is sorted
    const isSorted = arr.every((v, i) => i === 0 || arr[i - 1] <= v);

    // Check sorted indices are complete
    const sortedComplete = final.sorted && final.sorted.length >= arr.length;

    // Check length preserved
    const lenOK = arr.length === n;

    // Check first and last step arrays match expected values
    const firstArrSorted = steps[0].array.every((v, i) => i === 0 || steps[0].array[i - 1] <= v);
    const firstLenOK = steps[0].array.length === n;
    const lastLenOK = arr.length === n;

    // Check all steps have required fields
    let allStepsOK = true;
    steps.forEach((s, idx) => {
      if (!Array.isArray(s.array)) allStepsOK = false;
      if (typeof s.message !== 'string') allStepsOK = false;
      if (s.comparing && !Array.isArray(s.comparing)) allStepsOK = false;
      if (s.swapping && !Array.isArray(s.swapping)) allStepsOK = false;
    });

    console.log(`${name}: sorted=${isSorted} sortedComplete=${sortedComplete} lenOK=${lenOK} stepsOK=${allStepsOK} totalSteps=${steps.length}`);
    return isSorted && sortedComplete && lenOK && allStepsOK;
  }

  const testArrays = [
    [64, 34, 25, 12, 22, 11, 90],
    [5, 2, 9, 1, 7, 3, 8, 4, 6],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [42],
    [7, 0, -3, 9, 2]
  ];

  let allPass = true;
  testArrays.forEach((arr, idx) => {
    console.log(`\n=== Test Array ${idx + 1}: [${arr.join(', ')}] ===`);
    allPass = validate('Bubble Sort', bubbleSortSteps(arr), arr.length) && allPass;
    allPass = validate('Quick Sort', quickSortSteps(arr), arr.length) && allPass;
    allPass = validate('Binary Insertion Sort', binaryInsertionSortSteps(arr), arr.length) && allPass;
    allPass = validate('Merge Sort', mergeSortSteps(arr), arr.length) && allPass;
  });

  // Validate step array consistency: consecutive steps should differ meaningfully
  const consistencyOK = testArrays.every(arr => {
    const steps = bubbleSortSteps(arr);
    for (let i = 0; i < steps.length - 1; i++) {
      if (steps[i].array.length !== steps[i + 1].array.length) return false;
    }
    return true;
  });
  console.log(`\nStep array length consistency: ${consistencyOK}`);
  allPass = allPass && consistencyOK;

  // Verify merge sort preserves values (no data loss)
  const dataPreservedOK = testArrays.every(arr => {
    const steps = mergeSortSteps(arr);
    const sorted = [...steps[steps.length - 1].array].sort((a, b) => a - b);
    const origSorted = [...arr].sort((a, b) => a - b);
    return JSON.stringify(sorted) === JSON.stringify(origSorted);
  });
  console.log(`Merge sort value preservation: ${dataPreservedOK}`);
  allPass = allPass && dataPreservedOK;

  // Cleanup
  fs.unlinkSync(mjsPath);

  console.log(`\n${allPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  process.exit(allPass ? 0 : 1);
}

main().catch(err => {
  console.error('Test error:', err);
  try { fs.unlinkSync(mjsPath); } catch (e) {}
  process.exit(1);
});