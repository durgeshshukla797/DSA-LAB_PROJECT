const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

let nodes = [];
let edges = [];
let isCreatingEdge = false;
let startNode = null;
let dragNode = null;

// Button Elements
const createEdgeButton = document.getElementById('createEdgeButton');
const runDijkstraButton = document.getElementById('runDijkstraButton');
const resetButton = document.getElementById('resetButton');

// Event Listeners
createEdgeButton.addEventListener('click', () => {
    isCreatingEdge = !isCreatingEdge; // Toggle edge creation
    if (isCreatingEdge) {
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
    } else {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
    }
});
runDijkstraButton.addEventListener('click', runDijkstra);
resetButton.addEventListener('click', resetGraph);
canvas.addEventListener('click', handleCanvasClickForNode);

// Draw nodes and edges
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);

        // Draw the edge line in white
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = edge.color || 'white'; // Use edge-specific color
        ctx.lineWidth = 3; // Increased edge thickness
        ctx.stroke();

        // Draw edge weight at the midpoint in a different color
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = edge.weightColor || 'yellow'; // Use edge-specific weight color
        ctx.font = 'bold 16px Arial'; // Bold font for edge weight
        ctx.fillText(edge.weight, midX, midY);
    });

    // Draw nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = node.color || 'lightblue';  // Use node-specific color if available
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // Draw node id (label)
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(node.id, node.x - 5, node.y + 5);
    });
}

// Handle node creation
function handleCanvasClickForNode(event) {
    if (isCreatingEdge) return; // Prevent node creation if creating edges

    const x = event.offsetX;
    const y = event.offsetY;

    const id = String.fromCharCode(65 + nodes.length); // 'A', 'B', 'C', etc.
    nodes.push({ x, y, id, color: 'lightblue' }); // Initial color for nodes

    drawGraph();
}

// Handle mouse down for edge creation
function handleMouseDown(event) {
    const x = event.offsetX;
    const y = event.offsetY;

    // Check if the user is clicking on a node
    const clickedNode = getNodeAtPosition(x, y);
    if (clickedNode) {
        dragNode = clickedNode; // Start dragging from this node
    }
}

// Handle mouse up for edge creation
function handleMouseUp(event) {
    if (dragNode) {
        const x = event.offsetX;
        const y = event.offsetY;

        // Check if the user is releasing over another node
        const targetNode = getNodeAtPosition(x, y);
        if (targetNode && targetNode !== dragNode) {
            const weight = Math.floor(Math.random() * 20) + 1; // Random weight between 1-20
            edges.push({ 
                from: dragNode.id, 
                to: targetNode.id, 
                weight, 
                color: 'white', // Edge color
                weightColor: 'yellow' // Default weight color
            });
        }
        drawGraph();
        dragNode = null; // Reset dragging state
    }
}

// Get node at click position
function getNodeAtPosition(x, y) {
    return nodes.find(node => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) < 20; // Check if click is inside node radius
    });
}

// Dijkstra's Algorithm with animation and multiple colors
async function dijkstra(start) {
  const distances = {};
  const visited = {};
  const prev = {};

  nodes.forEach(node => {
      distances[node.id] = Infinity;
      prev[node.id] = null;
      node.color = 'lightblue'; // Reset node color
  });
  distances[start.id] = 0;
  start.color = 'green'; // Mark start node

  while (Object.keys(visited).length < nodes.length) {
      drawGraph();
      await sleep(1000); // Delay for animation

      // Get the unvisited node with the smallest distance
      const unvisitedNodes = nodes.filter(n => !visited[n.id]);
      let currentNode = unvisitedNodes.reduce((acc, node) => {
          return distances[node.id] < distances[acc.id] ? node : acc;
      });

      visited[currentNode.id] = true;
      currentNode.color = 'orange'; // Mark current node as being visited

      // For each edge, update distances to neighbors
      edges
          .filter(e => e.from === currentNode.id || e.to === currentNode.id)
          .forEach(edge => {
              const neighborId = edge.from === currentNode.id ? edge.to : edge.from;
              const neighbor = nodes.find(n => n.id === neighborId);

              if (!visited[neighborId]) {
                  const newDist = distances[currentNode.id] + edge.weight;
                  if (newDist < distances[neighborId]) {
                      distances[neighborId] = newDist;
                      prev[neighborId] = currentNode.id;
                      edge.color = 'blue'; // Color the edge being updated
                      edge.weightColor = 'pink'; // Change weight color to indicate an update
                  }
              }
          });

      currentNode.color = 'green'; // Mark current node as visited
  }

  highlightShortestPath(prev);
  return { distances, prev };
}

// Highlight the shortest path after Dijkstra's algorithm completes
function highlightShortestPath(prev) {
    let currentNodeId = nodes[nodes.length - 1].id; // You can change this to the target node

    while (prev[currentNodeId]) {
        const nextNodeId = prev[currentNodeId];
        const edge = edges.find(e => (e.from === currentNodeId && e.to === nextNodeId) || 
                                      (e.from === nextNodeId && e.to === currentNodeId));
        edge.color = 'red';  // Highlight the shortest path in red
        edge.weightColor = 'red'; // Change weight color for the shortest path
        currentNodeId = nextNodeId;
        drawGraph();
    }
}

// Run Dijkstra and display results in the table
async function runDijkstra() {
    if (nodes.length === 0) {
        alert('Please create at least one node!');
        return;
    }

    // Ask the user to input the source node via an alert box
    let sourceId = prompt('Enter the source node (e.g., A, B, C):');
    startNode = nodes.find(node => node.id === sourceId);

    if (!startNode) {
        alert('Invalid source node! Please try again.');
        return;
    }

    const result = await dijkstra(startNode);

    const tableBody = document.querySelector('#distancesTable tbody');
    tableBody.innerHTML = ''; // Clear the table

    nodes.forEach(node => {
        const row = document.createElement('tr');
        const nodeCell = document.createElement('td');
        nodeCell.textContent = node.id;

        const distanceCell = document.createElement('td');
        const distance = result.distances[node.id];
        distanceCell.textContent = distance === Infinity ? '∞' : distance;

        row.appendChild(nodeCell);
        row.appendChild(distanceCell);
        tableBody.appendChild(row);
    });
}

// Sleep function to introduce delays for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Reset the graph
function resetGraph() {
    nodes = [];
    edges = [];
    startNode = null;
    drawGraph();

    const tableBody = document.querySelector('#distancesTable tbody');
    tableBody.innerHTML = ''; // Clear the table
}

// Initial draw
drawGraph();
