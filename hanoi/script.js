let towers = {
    A: [],
    B: [],
    C: []
};

let moveQueue = [];   // Store the moves for visualization
let paused = false;   // Flag to control stop and resume
let timer = null;     // To hold the setTimeout reference
let transitionSpeed = 500;  // Initial transition speed (in milliseconds)

// Create and initialize the rings on Tower A
function createRings(numRings) {
    towers = { A: [], B: [], C: [] };
    const towerA = document.getElementById('towerA');
    const towerB = document.getElementById('towerB');
    const towerC = document.getElementById('towerC');

    // Clear previous rings
    towerA.innerHTML = '';
    towerB.innerHTML = '';
    towerC.innerHTML = '';

    // Add rings to Tower A in the correct order (largest at the bottom)
    for (let i = numRings; i >= 1; i--) {
        const ring = document.createElement('div');
        ring.classList.add('ring', `ring-${i}`);
        towerA.appendChild(ring);
        towers.A.push(i); // Stack rings on Tower A (source)
    }

    positionRings(towerA, towers.A); // Position rings visually on Tower A
}

// Move a ring from one tower to another
function moveRing(fromTower, toTower) {
    const fromElement = document.getElementById(`tower${fromTower}`);
    const toElement = document.getElementById(`tower${toTower}`);

    const ring = towers[fromTower].pop();
    towers[toTower].push(ring);

    // Remove ring from source tower
    fromElement.removeChild(fromElement.lastElementChild);

    // Add ring to destination tower
    const newRing = document.createElement('div');
    newRing.classList.add('ring', `ring-${ring}`);
    toElement.appendChild(newRing);

    // Adjust the positioning after the move
    positionRings(fromElement, towers[fromTower]);
    positionRings(toElement, towers[toTower]);
}

// Recursive Tower of Hanoi algorithm (generate the moves)
function hanoi(n, from, to, aux) {
    if (n === 1) {
        moveQueue.push([from, to]);  // Move single ring from source to destination
        return;
    }

    hanoi(n - 1, from, aux, to);   // Move n-1 rings from source to auxiliary using destination
    moveQueue.push([from, to]);    // Move nth ring from source to destination
    hanoi(n - 1, aux, to, from);   // Move n-1 rings from auxiliary to destination using source
}

// Play the moves from the move queue step by step
function playMoves() {
    if (paused || moveQueue.length === 0) return;  // Stop if paused or no more moves

    const [from, to] = moveQueue.shift();  // Get the next move
    moveRing(from, to);  // Execute the move

    timer = setTimeout(playMoves, transitionSpeed);  // Schedule the next move after a delay based on speed
}

// Start the Tower of Hanoi process
function startHanoi() {
    const numRings = parseInt(document.getElementById('numRings').value);
    if (numRings < 1 || numRings > 8) {
        alert('Please enter a valid number between 1 and 8');
        return;
    }

    createRings(numRings);
    moveQueue = [];  // Clear previous move queue
    paused = false;  // Reset the paused flag
    hanoi(numRings, 'A', 'C', 'B');  // Generate the moves for Tower of Hanoi
    setTimeout(playMoves, transitionSpeed);  // Start playing the moves after a delay
}

// Stop the visualization
function stopHanoi() {
    paused = true;  // Set the flag to pause the visualization
    clearTimeout(timer);  // Clear the current timer
}

// Resume the visualization
function resumeHanoi() {
    if (paused) {
        paused = false;  // Reset the flag to resume the visualization
        playMoves();  // Continue playing the moves
    }
}

// Function to update speed when slider is moved
function updateSpeed() {
    const slider = document.getElementById('speedSlider');
    transitionSpeed = parseInt(slider.value);  // Get the speed from the slider
    document.getElementById('speedDisplay').textContent = `${transitionSpeed}ms`;  // Display the speed
}

// Function to position rings on the rods
function positionRings(rod, tower) {
    const rings = rod.children;
    for (let i = 0; i < rings.length; i++) {
        const ring = rings[i];
        ring.style.bottom = `${i * 25}px`;  // Position each ring correctly starting from the base
    }
}
