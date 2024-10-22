const canvas = document.getElementById('hashCanvas');
const ctx = canvas.getContext('2d');

const tableSize = 11; // Size of the hash table
let hashTable = new Array(tableSize).fill(null); // Initialize empty table

// Draw the initial empty hash table
drawHashTable();

function hashFunction(key) {
    return key % tableSize;
}

function drawHashTable() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Set the color for table borders
    ctx.strokeStyle = '#ea2d59'; // Blue color for the slot borders

    // Set the color for the text (index and values)
    ctx.fillStyle = '#ea2d59'; // Red color for the text

    // Draw the table slots
    for (let i = 0; i < tableSize; i++) {
        ctx.strokeRect(50 + i * 50, 50, 50, 50); // Draw a rectangle with blue borders

        // Draw index numbers in red
        ctx.fillText(i, 50 + i * 50 + 20, 120); // index numbers

        if (hashTable[i] !== null) {
            // Draw the value inside the slot in red
            ctx.fillText(hashTable[i], 50 + i * 50 + 20, 80); // values
        }
    }
}


// function drawHashTable() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

//     // Draw the table slots
//     for (let i = 0; i < tableSize; i++) {
//         ctx.strokeRect(50 + i * 50, 50, 50, 50); // Draw a rectangle
//         ctx.fillText(i, 50 + i * 50 + 20, 120); // index numbers
//         if (hashTable[i] !== null) {
//             ctx.fillText(hashTable[i], 50 + i * 50 + 20, 80); // values
//         }
//     }
// }

function insert() {
    const element = parseInt(document.getElementById('element').value);

    if (isNaN(element)) {
        document.getElementById('result').innerText = 'Please enter a valid number';
        return;
    }

    let index = hashFunction(element);
    let startIndex = index;

    // Display calculation for the hashing operation
    document.getElementById('result').innerText = `Hashing Calculation: ${element} % ${tableSize} = ${index}\n`;

    // Linear probing for collision resolution
    while (hashTable[index] !== null) {
        document.getElementById('result').innerText += `Collision occured at index ${index}. Trying at next index...\n`;
        index = (index + 1) % tableSize;

        // If we've gone through the entire table, it's full
        if (index === startIndex) {
            document.getElementById('result').innerText += 'Hash table is full!';
            return;
        }
    }

    hashTable[index] = element; // Insert element in found slot
    drawHashTable(); // Redraw table to show new element
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
    let found = false;  // To track if element was found during probing

    // Display calculation for the hashing operation
    document.getElementById('result').innerText = `Hashing Calculation: ${element} % ${tableSize} = ${index}\n`;

    // Linear probing to find the element
    while (hashTable[index] !== null) {
        if (hashTable[index] === element) {
            hashTable[index] = null; // Delete the element by setting it to null
            drawHashTable(); // Redraw table after deletion
            document.getElementById('result').innerText += `Element ${element} deleted from index ${index}`;
            found = true;
            break;
        }
        document.getElementById('result').innerText += `Checking index ${index}... Not a match. Trying next index...\n`;
        index = (index + 1) % tableSize;

        // If we've looped through the whole table and not found the element
        if (index === startIndex) {
            break;  // We've searched the entire table
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
    let found = false;  // To track if element was found during probing

    // Display calculation for the hashing operation
    document.getElementById('result').innerText = `Hashing Calculation: ${element} % ${tableSize} = ${index}\n`;

    // Linear probing to find the element
    while (hashTable[index] !== null || index === startIndex) {
        if (hashTable[index] === element) {
            document.getElementById('result').innerText += `Element ${element} found at index ${index}`;
            found = true;
            break;
        }
        document.getElementById('result').innerText += `Checking index ${index}... Not a match. Trying next index...\n`;
        index = (index + 1) % tableSize;

        // If we've looped through the whole table and not found the element
        if (index === startIndex) {
            break;  // We've searched the entire table
        }
    }

    if (!found) {
        document.getElementById('result').innerText += 'Element not found!';
    }
}

function resetTable() {
    hashTable = new Array(tableSize).fill(null); // Reset the hash table
    drawHashTable(); // Redraw the empty hash table
    document.getElementById('result').innerText = 'Hash table has been reset.'; // Update result message
}



// function drawHashTable() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

//     // Set the color for table borders
//     ctx.strokeStyle = '#ea2d59'; // Blue color for the slot borders

//     // Set the color for the text (index and values)
//     ctx.fillStyle = '#ea2d59'; // Red color for the text

//     // Draw the table slots
//     for (let i = 0; i < tableSize; i++) {
//         ctx.strokeRect(50 + i * 50, 50, 50, 50); // Draw a rectangle with blue borders

//         // Draw index numbers in red
//         ctx.fillText(i, 50 + i * 50 + 20, 120); // index numbers

//         if (hashTable[i] !== null) {
//             // Draw the value inside the slot in red
//             ctx.fillText(hashTable[i], 50 + i * 50 + 20, 80); // values
//         }
//     }
// }