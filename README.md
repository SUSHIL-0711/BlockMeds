# BlockMeds – Blockchain-Based Pharmaceutical Supply Chain Management System

## 🚀 Project Overview

**BlockMeds** is a full-stack web application built to track the journey of pharmaceutical drugs from the manufacturer to the pharmacy using a **custom-built blockchain in JavaScript**. It ensures:

- 📦 Tamper-proof shipment logs  
- 🔍 Real-time verification of medicine origin  
- 🔐 Transparent and secure drug supply chain  

---

## 🧱 System Architecture

### 🔹 Frontend
- HTML/CSS for layout
- JavaScript for UI logic and API interaction

### 🔹 Backend
- Node.js + Express.js
- Blockchain logic integration

### 🔹 Blockchain
- Custom JavaScript-based blockchain
- SHA256 with Proof-of-Work for security

### 🔹 (Optional) Docker
- For deployment and scalability

---

## 🛠️ Implementation Steps

### 1. Blockchain Development (JavaScript)
- Implemented `Block` and `Blockchain` classes
- Integrated SHA256 hashing and Proof-of-Work
- Key Methods:
  - `createGenesisBlock()`
  - `addBlock()`
  - `isChainValid()`
  - `mineBlock()`

### 2. Backend Development (Node.js + Express)
**API Endpoints:**
- `POST /addDrugShipment` → Add a new drug shipment
- `GET /getChain` → View the entire blockchain
- `GET /verifyShipment/:batchID` → Verify shipment using batch ID

**Middleware Used:**
- `body-parser`
- `cors`

### 3. Frontend Development (HTML/CSS/JS)
- Pages:
  - **Add Shipment** (for manufacturers)
  - **Verify Shipment** (for pharmacies)
- Used `fetch()` to call backend APIs
- Responsive design using CSS Grid

### 4. Testing & Validation
- Added multiple drug shipments
- Attempted data tampering (successfully detected and rejected)
- Verified batches with batch ID
- Validated hash and block linkage

### 5. Docker Deployment *(Optional)*
- Created a `Dockerfile` using `node:alpine`
- Used Docker CLI to build and run the container

---

## 🖼️ Screenshots (To Be Added)

- 🔗 Blockchain chain visualization  
- 📋 Drug shipment form  
- ✅ Verification success/failure screen  

---

## 🧾 Code Snippet Example

```javascript
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data; // shipment info
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}
