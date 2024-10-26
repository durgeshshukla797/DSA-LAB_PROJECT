const canvas = document.getElementById('hashCanvas');
const ctx = canvas.getContext('2d');

const tableSize = 11; // Increased size of the hash table
let hashTable = new Array(tableSize).fill(null); // Initialize empty table

// Adjust font size for better visibility with larger values
ctx.font = "14px Arial";

// Draw the initial empty hash table
drawHashTable();

function hashFunction(key) {
    return key % tableSize;
}

function drawHashTable() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Set the color for table borders and text
    ctx.strokeStyle = '#ea2d59'; // Border color
    ctx.fillStyle = '#ffffff'; // Text color

    // Adjust spacing between slots for larger table
    const slotSize = 55; // Adjust size to fit more slots
    const startX = 20; // Starting x position of the table
    const startY = 100; // Starting y position of the table

    // Draw the table slots
    for (let i = 0; i < tableSize; i++) {
        ctx.strokeRect(startX + i * slotSize, startY, slotSize, slotSize); // Draw slot

        // Draw index numbers below the slots
        ctx.fillText(i, startX + i * slotSize + 10, startY + slotSize + 20);

        // Draw value inside the slot if it exists
        if (hashTable[i] !== null) {
            ctx.fillText(hashTable[i], startX + i * slotSize + 10, startY + slotSize / 2);
        }
    }
}

function insert() {
    const element = parseInt(document.getElementById('element').value);

    if (isNaN(element)) {
        document.getElementById('result').innerText = 'Please enter a valid number';
        return;
    }

    let index = hashFunction(element);
    let startIndex = index;

    document.getElementById('result').innerText = `Hashing Calculation: ${element} % ${tableSize} = ${index}\n`;

    // Linear probing for collision resolution
    while (hashTable[index] !== null) {
        document.getElementById('result').innerText += `Collision at index ${index}. Trying next index...\n`;
        index = (index + 1) % tableSize;

        if (index === startIndex) {
            document.getElementById('result').innerText += 'Hash table is full!';
            return;
        }
    }

    hashTable[index] = element;
    drawHashTable();
    document.getElementById('result').innerText += `Element ${element} inserted at index ${index}`;
}

function deleteElement() {
    const element = parseInt(document.getElementById('element').value);

    if (isNaN(element)) {
        document.getElementById('result').innerText = 'Please enter a valid number';
        return;
    }

    let index = hashFunction(element);
    let startIndex = index;
    let found = false;

    document.getElementById('result').innerText = `Hashing Calculation: ${element} % ${tableSize} = ${index}\n`;

    while (hashTable[index] !== null) {
        if (hashTable[index] === element) {
            hashTable[index] = null;
            drawHashTable();
            document.getElementById('result').innerText += `Element ${element} deleted from index ${index}`;
            found = true;
            break;
        }
        document.getElementById('result').innerText += `Checking index ${index}... Not a match. Trying next index...\n`;
        index = (index + 1) % tableSize;

        if (index === startIndex) {
            break;
        }
    }

    if (!found) {
        document.getElementById('result').innerText += 'Element not found!';
    }
}

function searchElement() {
    const element = parseInt(document.getElementById('element').value);

    if (isNaN(element)) {
        document.getElementById('result').innerText = 'Please enter a valid number';
        return;
    }

    let index = hashFunction(element);
    let startIndex = index;
    let found = false;

    document.getElementById('result').innerText = `Hashing Calculation: ${element} % ${tableSize} = ${index}\n`;

    while (hashTable[index] !== null || index === startIndex) {
        if (hashTable[index] === element) {
            document.getElementById('result').innerText += `Element ${element} found at index ${index}`;
            found = true;
            break;
        }
        document.getElementById('result').innerText += `Checking index ${index}... Not a match. Trying next index...\n`;
        index = (index + 1) % tableSize;

        if (index === startIndex) {
            break;
        }
    }

    if (!found) {
        document.getElementById('result').innerText += 'Element not found!';
    }
}

function resetTable() {
    hashTable = new Array(tableSize).fill(null);
    drawHashTable();
    document.getElementById('result').innerText = 'Hash table has been reset.';
}
