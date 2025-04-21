// API endpoint for getting the blockchain
const API_URL = 'http://localhost:3000/api';

// Function to fetch the blockchain data
async function fetchBlockchain() {
    try {
        const response = await fetch(`${API_URL}/chain`);
        const data = await response.json();
        
        if (data.chain && data.chain.length > 0) {
            renderBlockchain(data.chain);
        } else {
            document.getElementById('blockchain-blocks').innerHTML = `
                <div class="no-data">
                    <p>No blockchain data available yet.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching blockchain:', error);
        document.getElementById('blockchain-blocks').innerHTML = `
            <div class="error-message">
                <p>Error loading blockchain data. Please try again later.</p>
            </div>
        `;
    }
}

// Function to render the blockchain
function renderBlockchain(chain) {
    const blocksContainer = document.getElementById('blockchain-blocks');
    
    // Only show the last 5 blocks to keep the UI clean
    const blocksToShow = chain.length > 5 ? chain.slice(-5) : chain;
    
    let blocksHTML = '';
    
    blocksToShow.forEach((block, index) => {
        // Skip the genesis block for display in the main page
        if (index === 0 && block.data.message === 'Genesis Block') {
            return;
        }
        
        blocksHTML += `
            <div class="block">
                <div class="block-index">${block.index}</div>
                <div class="block-header">
                    <div class="label">Timestamp</div>
                    <div>${new Date(block.timestamp).toLocaleString()}</div>
                </div>
                <div class="block-content">
                    ${renderBlockContent(block.data)}
                </div>
                <div class="block-footer">
                    <div class="label">Hash</div>
                    <div class="hash-value">${block.hash.substring(0, 15)}...</div>
                </div>
            </div>
        `;
        
        // Add arrow between blocks except after the last one
        if (index < blocksToShow.length - 1) {
            blocksHTML += `
                <div class="block-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
        }
    });
    
    // If no blocks other than genesis, show a message
    if (blocksHTML === '') {
        blocksHTML = `
            <div class="no-data">
                <p>No drug shipments recorded yet.</p>
                <a href="add-shipment.html" class="btn btn-primary">
                    <i class="fas fa-plus-circle"></i> Add First Shipment
                </a>
            </div>
        `;
    }
    
    blocksContainer.innerHTML = blocksHTML;
}

// Function to render block content based on data type
function renderBlockContent(data) {
    // If it's the genesis block, just show a simple message
    if (data.message === 'Genesis Block') {
        return `<div class="data-item">
            <div class="label">Type</div>
            <div>Genesis Block</div>
        </div>`;
    }
    
    // Otherwise, show drug shipment data
    return `
        <div class="data-item">
            <div class="label">Batch ID</div>
            <div>${data.batchId}</div>
        </div>
        <div class="data-item">
            <div class="label">Drug</div>
            <div>${data.drugName}</div>
        </div>
        <div class="data-item">
            <div class="label">Route</div>
            <div>${data.origin} → ${data.destination}</div>
        </div>
    `;
}

// Fetch blockchain data when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only fetch blockchain data if we're on the home page
    const blockchainElement = document.getElementById('blockchain-blocks');
    if (blockchainElement) {
        fetchBlockchain();
    }
});