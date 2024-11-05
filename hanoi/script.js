let towers = {};
let moveQueue = [];
let paused = false;
let timer = null;
let transitionSpeed = 500;

// Create towers dynamically based on the number of pegs selected
function createRings(numRings, numPegs) {
    towers = {};
    const towerContainer = document.getElementById('towerContainer');
    towerContainer.innerHTML = ''; // Clear previous pegs

    // Initialize towers and create rods dynamically based on user-selected pegs
    for (let i = 0; i < numPegs; i++) {
        const pegId = String.fromCharCode(65 + i); // Generate IDs A, B, C, etc.
        towers[pegId] = [];

        const rodContainer = document.createElement('div');
        rodContainer.classList.add('rod-container');

        const rod = document.createElement('div');
        rod.classList.add('rod');
        rod.id = `tower${pegId}`;
        rodContainer.appendChild(rod);

        const label = document.createElement('div');
        label.classList.add('tower-label');
        label.textContent = pegId;
        rodContainer.appendChild(label);

        towerContainer.appendChild(rodContainer);
    }

    // Add rings to the first tower (source peg)
    const sourceTower = document.getElementById('towerA');
    for (let i = numRings; i >= 1; i--) {
        const ring = document.createElement('div');
        ring.classList.add('ring', `ring-${i}`);
        sourceTower.appendChild(ring);
        towers['A'].push(i);
    }

    positionRings(sourceTower, towers['A']);
}

// Move a ring from one tower to another
function moveRing(fromTower, toTower) {
    const fromElement = document.getElementById(`tower${fromTower}`);
    const toElement = document.getElementById(`tower${toTower}`);

    const ring = towers[fromTower].pop();
    towers[toTower].push(ring);

    fromElement.removeChild(fromElement.lastElementChild);

    const newRing = document.createElement('div');
    newRing.classList.add('ring', `ring-${ring}`);
    toElement.appendChild(newRing);

    positionRings(fromElement, towers[fromTower]);
    positionRings(toElement, towers[toTower]);
}

// Frame-Stewart based algorithm for Tower of Hanoi with multiple pegs
function hanoiMultiPeg(n, source, target, auxPegs) {
    if (n === 0) return;
    if (n === 1) {
        moveQueue.push([source, target]);
        return;
    }

    if (auxPegs.length > 1) {
        // Using the Frame-Stewart strategy for multiple pegs
        let k = Math.floor(n / 2); // Optimal move-splitting choice

        // Move the first k rings to the first auxiliary peg
        hanoiMultiPeg(k, source, auxPegs[0], [target, ...auxPegs.slice(1)]);

        // Move the remaining n-k rings directly from source to target
        hanoiMultiPeg(n - k, source, target, auxPegs.slice(1));

        // Move the k rings from the auxiliary peg to the target
        hanoiMultiPeg(k, auxPegs[0], target, [source, ...auxPegs.slice(1)]);
    } else {
        // Classic 3-peg Hanoi when only one auxiliary peg is available
        hanoiMultiPeg(n - 1, source, auxPegs[0], [target]);
        moveQueue.push([source, target]);
        hanoiMultiPeg(n - 1, auxPegs[0], target, [source]);
    }
}

// Play the moves from the move queue step by step
function playMoves() {
    if (paused || moveQueue.length === 0) return;

    const [from, to] = moveQueue.shift();
    moveRing(from, to);
    timer = setTimeout(playMoves, transitionSpeed);
}

// Start the Tower of Hanoi process
function startHanoi() {
    const numRings = parseInt(document.getElementById('numRings').value);
    const numPegs = parseInt(document.getElementById('numPegs').value);

    if (numRings < 1 || numRings > 8 || numPegs < 3 || numPegs > 5) {
        alert('Please enter valid numbers for rings (1-8) and pegs (3-5)');
        return;
    }

    createRings(numRings, numPegs);
    moveQueue = [];
    paused = false;

    const pegs = Object.keys(towers);
    const source = pegs[0];
    const target = pegs[pegs.length - 1];
    const auxPegs = pegs.slice(1, -1);

    hanoiMultiPeg(numRings, source, target, auxPegs);
    setTimeout(playMoves, transitionSpeed);
}

// Stop the visualization
function stopHanoi() {
    paused = true;
    clearTimeout(timer);
}

// Resume the visualization
function resumeHanoi() {
    if (paused) {
        paused = false;
        playMoves();
    }
}

// Update the transition speed based on the slider
function updateSpeed() {
    const slider = document.getElementById('speedSlider');
    transitionSpeed = parseInt(slider.value);
    document.getElementById('speedDisplay').textContent = `${transitionSpeed}ms`;
}

// Position rings on a rod
function positionRings(rod, tower) {
    const rings = rod.children;
    for (let i = 0; i < rings.length; i++) {
        rings[i].style.bottom = `${i * 25}px`;
    }
}
