import React, {useEffect, useState} from 'react';
import './SortingVisualizer.css';
import SortingBar from './SortingBar';

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const App = () => {
  const [array, setArray] = useState([]);
  const [sortedIndexes, setSortedIndexes] = useState([]);
  const delay = useState(100);

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArray = [];
    const numBars = 50;
    const minHeight = 50;
    const maxHeight = 400;

    for (let i = 0; i < numBars; i++) {
      newArray.push(getRandomInt(minHeight, maxHeight))
    }

    setArray(newArray);
  };

  const bubbleSort = async () => {
    const arr = array.slice();
    const n = arr.length;


    for (let i = 0; i < n - 1; i++) {
      let swapped = false; // Flag to determine if there were swaps on this iteration

      for (let j = 0; j < n - i - 1; j++) {
        await compare(j, j + 1, arr);

        if (arr[j] > arr[j + 1]) {
          await swap(j, j + 1, arr);
          swapped = true;
        }
      }

      // If there were no swaps at this iteration, then the array is already sorted
      if (!swapped) {
        break;
      }
    }
  };

  const selectionSort = async () => {
    const arr = array.slice();
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < n; j++) {
        await compare(minIndex, j, arr);

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        await swap(i, minIndex, arr);
      }
    }
  };

  const insertionSort = async () => {
    const arr = array.slice();
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        await compare(j + 1, j, arr);
        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;
    }
  };

  const mergeSort = async () => {
    await mergeSortHelper(array, 0, array.length - 1);
  };

  const mergeSortHelper = async (arr, left, right) => {
    if (left >= right) {
      return;
    }

    const middle = Math.floor((left + right) / 2);
    await mergeSortHelper(arr, left, middle);
    await mergeSortHelper(arr, middle + 1, right);

    await merge(arr, left, middle, right);
  };

  const merge = async (arr, left, middle, right) => {
    const leftArray = arr.slice(left, middle + 1);
    const rightArray = arr.slice(middle + 1, right + 1);

    let i = 0;
    let j = 0;

    while (i < leftArray.length && j < rightArray.length) {
      await compare(left + i, middle + 1 + j, arr);

      if (leftArray[i] < rightArray[j]) {
        arr[left + i + j] = leftArray[i];
        i++;
      } else {
        arr[left + i + j] = rightArray[j];
        j++;
      }
    }

    while (i < leftArray.length) {
      arr[left + i + j] = leftArray[i];
      i++;
    }

    while (j < rightArray.length) {
      arr[left + i + j] = rightArray[j];
      j++;
    }

    for (let k = left; k <= right; k++) {
      await sleep(100);
      setArray(prevArray => {
        const newArray = [...prevArray];
        if (k >= left && k <= right) {
          newArray[k] = -newArray[k];
        }
        return newArray;
      });
    }

    // Add sorted indexes to the sortedIndexes state
    setSortedIndexes(prevSortedIndexes => [...prevSortedIndexes, ...Array(right - left + 1).fill().map((_, idx) => left + idx)]);

    // Update the state of the array and add a delay for the animation
    for (let k = left; k <= right; k++) {
      await sleep(100);
      setArray(prevArray => {
        const newArray = [...prevArray];
        if (k >= left && k <= right) {
          newArray[k] = arr[k];
        }
        return newArray;
      });
    }
  };

  const quickSort = async () => {
    const sortedArray = await quickSortHelper(array, 0, array.length - 1);
    setArray(sortedArray);
  };

  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high);
      await quickSortHelper(arr, low, pivotIndex - 1);
      await quickSortHelper(arr, pivotIndex + 1, high);
    }
    return arr;
  };

  const partition = async (arr, low, high) => {
    const pivotValue = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      await compare(j, high, arr);

      if (arr[j] < pivotValue) {
        i++;
        await swap(i, j, arr);
      }
    }

    await swap(i + 1, high, arr);
    return i + 1;
  };

  const compare = async (i, j, arr) => {
    arr[i] = -arr[i]; // Highlight the elements to be compared
    arr[j] = -arr[j];
    setArray([...arr]);
    await sleep(100);
    arr[i] = Math.abs(arr[i]); // Return original values
    arr[j] = Math.abs(arr[j]);
    setArray([...arr]);
  };

  const heapSort = async () => {
    let n = array.length;



    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(array, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      await swap(0, i, array);
      await heapify(array, i, 0);
    }
  };

  const heapify = async (arr, n, i) => {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      await swap(i, largest, arr);
      await heapify(arr, n, largest);
    }
  };

  const swap = async (i, j, arr) => {
    arr[i] = -arr[i]; // Illuminate elements during swap
    arr[j] = -arr[j];
    setArray([...arr]);
    await sleep(delay);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    arr[i] = Math.abs(arr[i]); // Return original values
    arr[j] = Math.abs(arr[j]);
    setArray([...arr]);
    await sleep(100);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
      <div className="sorting-visualizer">
        <div className="array-container">
          {array.map((value, index) => (
              <SortingBar
                  key={index}
                  value={value}
                  isHighlighted={value < 0}
                  isSwapped={value > 0}
                  isSorted={sortedIndexes.includes(index)}
              />
          ))}
        </div>
        <div className="button-container">
          <button onClick={resetArray}>Generate a new array</button>
          <button onClick={bubbleSort}>Start bubble sorting</button>
          <button onClick={selectionSort}>Start selection sorting</button>
          <button onClick={insertionSort}>Start sorting by inserts</button>
          <button onClick={mergeSort}>Start sorting by merging</button>
          <button onClick={quickSort}>Start quick sorting</button>
          <button onClick={heapSort}>Start sorting the pile</button>
        </div>
      </div>
  );
};


export default App;