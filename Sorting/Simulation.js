// Get references to DOM elements
const arraySizeInput = document.getElementById("arraySize");
const arrayElementsInput = document.getElementById("arrayElements");
const startSortButton = document.getElementById("startSort");
const nextStepButton = document.getElementById("nextStepButton");
const resetButton = document.getElementById("resetButton");
const stepsList = document.getElementById("stepsList");
const mergeSortStepsDiv = document.getElementById("mergeSortSteps");

// Global variables to store the array and steps for visualization
let array = [];
let steps = [];
let currentStep = 0; 

// Event listener for the Start Merge Sort button
startSortButton.addEventListener("click", () => {
  const size = parseInt(arraySizeInput.value);
  const elements = arrayElementsInput.value.split(",").map(Number);

  if (size !== elements.length || isNaN(size) || elements.some(isNaN)) {
    alert(
      "Please ensure the size matches the number of elements and they are valid numbers."
    );
    return;
  }

  array = elements;
  steps = [];
  currentStep = 0;

  // Perform merge sort and capture steps
  mergeSort(array.slice(), 0, array.length - 1);

  // Show the first step
  showStep(currentStep);

  // Show controls
  mergeSortStepsDiv.classList.remove("hidden");
  nextStepButton.classList.remove("hidden");
  resetButton.classList.remove("hidden");
  startSortButton.classList.add("hidden");
});

// Event listener for the Next Step button
nextStepButton.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    // Display "Merge Sort Completed!" in the steps list when sorting is complete
    const completionMessage = document.createElement("li");
    completionMessage.innerHTML = `<span class="highlight">Merge Sort Completed!</span>`;
    stepsList.appendChild(completionMessage);

    // Disable the Next Step button after completion
    nextStepButton.disabled = true;
  }
});

// Event listener for Reset button
resetButton.addEventListener("click", () => {
  location.reload(); // Reload the page to reset everything
});

// Merge Sort algorithm with step recording (showing divisions and merges)
function mergeSort(arr, left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(
      `Divide array from index ${left} to ${mid} and ${mid + 1} to ${right}: [${arr.slice(left, mid + 1)}], [${arr.slice(mid + 1, right + 1)}]`
    );

    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
}

function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;
  const stepDescription = [
    `Merging: Left: [${leftArr.join(", ")}], Right: [${rightArr.join(", ")}]`,
  ];

  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k++] = leftArr[i++];
    } else {
      arr[k++] = rightArr[j++];
    }
    stepDescription.push(`Current Array: [${arr.join(", ")}]`);
  }

  while (i < leftArr.length) {
    arr[k++] = leftArr[i++];
    stepDescription.push(`Remaining Left Array Merged: [${arr.join(", ")}]`);
  }

  while (j < rightArr.length) {
    arr[k++] = rightArr[j++];
    stepDescription.push(`Remaining Right Array Merged: [${arr.join(", ")}]`);
  }

  steps.push(...stepDescription); // Record the current step for visualization
}

// Function to display each step
function showStep(stepIndex) {
  stepsList.innerHTML = ""; // Clear previous step

  const currentSteps = steps[stepIndex].split("\n"); // Support multiple lines per step
  currentSteps.forEach((desc) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="highlight">${desc}</span>`;
    stepsList.appendChild(li);
  });
}
