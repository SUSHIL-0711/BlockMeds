// API endpoint
const API_URL = 'http://localhost:3000/api';

// DOM elements
const verifyForm = document.getElementById('verifyForm');
const verifyLoadingIndicator = document.getElementById('verifyLoadingIndicator');
const verifyResultMessage = document.getElementById('verifyResultMessage');
const shipmentDetails = document.getElementById('shipmentDetails');
const shipmentInfo = document.getElementById('shipmentInfo');
const blockchainProof = document.getElementById('blockchainProof');
const verificationStatus = document.getElementById('verificationStatus');
const blockHashDetails = document.getElementById('blockHashDetails');

// Function to show loading state
function showLoading() {
    verifyLoadingIndicator.classList.remove('hidden');
    verifyResultMessage.classList.add('hidden');
    shipmentDetails.classList.add('hidden');
    blockchainProof.classList.add('hidden');
}

// Function to show result message
function showResult(message, isSuccess = true) {
    verifyLoadingIndicator.classList.add('hidden');
    verifyResultMessage.classList.remove('hidden');
    verifyResultMessage.textContent = message;
    verifyResultMessage.className = `result-message ${isSuccess ? 'success' : 'error'}`;
}

// Function to show shipment details
function showShipmentDetails(block) {
    shipmentDetails.classList.remove('hidden');
    
    // Get drug data from block
    const drugData = block.data;
    
    // Create HTML for shipment details
    shipmentInfo.innerHTML = `
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
            <div class="info-label">Recorded on Blockchain</div>
            <div class="info-value">${new Date(block.timestamp).toLocaleString()}</div>
        </div>
    `;
}

// Function to show blockchain proof
function showBlockchainProof(block, isValid) {
    blockchainProof.classList.remove('hidden');
    
    // Display verification status
    verificationStatus.innerHTML = isValid 
        ? `<i class="fas fa-check-circle"></i> Verified: This medicine is authentic and tracked on the blockchain.`
        : `<i class="fas fa-exclamation-triangle"></i> Warning: Verification failed! This medicine may be counterfeit.`;
    
    verificationStatus.className = `verification-status ${isValid ? 'valid' : 'invalid'}`;
    
    // Display hash details
    blockHashDetails.innerHTML = `
        <div><strong>Block Index:</strong> ${block.index}</div>
        <div><strong>Hash:</strong> ${block.hash}</div>
        <div><strong>Previous Hash:</strong> ${block.previousHash}</div>
    `;
}

// Function to verify shipment
async function verifyShipment(batchId) {
    try {
        showLoading();
        
        // First fetch the specific shipment
        const response = await fetch(`${API_URL}/shipment/${batchId}`);
        const data = await response.json();
        
        if (!data.success) {
            showResult(`No shipment found with Batch ID: ${batchId}`, false);
            return;
        }
        
        // Then verify the chain integrity
        const verifyResponse = await fetch(`${API_URL}/verify`);
        const verifyData = await verifyResponse.json();
        
        // Get the first block that matches the batch ID
        const block = data.blocks[0];
        
        // Show shipment details
        showShipmentDetails(block);
        
        // Show blockchain proof
        showBlockchainProof(block, verifyData.isValid);
        
        // Show success message
        showResult(`Shipment with Batch ID ${batchId} found and verified.`);
        
    } catch (error) {
        console.error('Error:', error);
        showResult('Error connecting to server. Please try again later.', false);
    }
}

// Event listener for form submission
verifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get batch ID
    const batchId = document.getElementById('searchBatchId').value;
    
    if (!batchId) {
        showResult('Please enter a valid Batch ID', false);
        return;
    }
    
    // Verify shipment
    verifyShipment(batchId);
});