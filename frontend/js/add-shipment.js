// API endpoint
const API_URL = 'http://localhost:3000/api';

// DOM elements
const shipmentForm = document.getElementById('shipmentForm');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultMessage = document.getElementById('resultMessage');
const blockDetails = document.getElementById('blockDetails');
const blockInfo = document.getElementById('blockInfo');

// Function to show loading state
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    resultMessage.classList.add('hidden');
    blockDetails.classList.add('hidden');
}

// Function to show result message
function showResult(message, isSuccess = true) {
    loadingIndicator.classList.add('hidden');
    resultMessage.classList.remove('hidden');
    resultMessage.textContent = message;
    resultMessage.className = `result-message ${isSuccess ? 'success' : 'error'}`;
}

// Function to show block details
function showBlockDetails(block) {
    blockDetails.classList.remove('hidden');
    
    // Format the block data for display
    const timestamp = new Date(block.timestamp).toLocaleString();
    const drugData = block.data;
    
    // Create HTML for block details
    blockInfo.innerHTML = `
        <div class="block-info-container">
            <div class="info-item">
                <div class="info-label">Block Index</div>
                <div class="info-value">${block.index}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Timestamp</div>
                <div class="info-value">${timestamp}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Batch ID</div>
                <div class="info-value">${drugData.batchId}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Drug Name</div>
                <div class="info-value">${drugData.drugName}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Manufacturer</div>
                <div class="info-value">${drugData.manufacturer}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Manufacturing Date</div>
                <div class="info-value">${new Date(drugData.manufacturingDate).toLocaleDateString()}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Expiry Date</div>
                <div class="info-value">${new Date(drugData.expiryDate).toLocaleDateString()}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Origin</div>
                <div class="info-value">${drugData.origin}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Destination</div>
                <div class="info-value">${drugData.destination}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Quantity</div>
                <div class="info-value">${drugData.quantity} units</div>
            </div>
            <div class="info-item">
                <div class="info-label">Storage Temperature</div>
                <div class="info-value">${drugData.temperature}°C</div>
            </div>
            <div class="info-item">
                <div class="info-label">Block Hash</div>
                <div class="info-value hash-value">${block.hash}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Previous Hash</div>
                <div class="info-value hash-value">${block.previousHash}</div>
            </div>
        </div>
    `;
}

// Function to add shipment to blockchain
async function addShipment(formData) {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/shipment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResult('Drug shipment added to blockchain successfully!');
            showBlockDetails(data.block);
            shipmentForm.reset(); // Reset form on success
        } else {
            showResult(data.message || 'Error adding shipment to blockchain', false);
        }
    } catch (error) {
        console.error('Error:', error);
        showResult('Error connecting to server. Please try again later.', false);
    }
}

// Event listener for form submission
shipmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        batchId: document.getElementById('batchId').value,
        drugName: document.getElementById('drugName').value,
        manufacturer: document.getElementById('manufacturer').value,
        manufacturingDate: document.getElementById('manufacturingDate').value,
        expiryDate: document.getElementById('expiryDate').value,
        quantity: parseInt(document.getElementById('quantity').value),
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        temperature: parseFloat(document.getElementById('temperature').value)
    };
    
    // Add shipment to blockchain
    addShipment(formData);
});