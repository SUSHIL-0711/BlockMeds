const crypto = require('crypto');

// Block class representing each block in the blockchain
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index + 
                this.previousHash + 
                this.timestamp + 
                JSON.stringify(this.data) + 
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join('0');
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

// Blockchain class to manage the chain of blocks
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), { 
            message: 'Genesis Block',
            drugs: []
        }, '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Validate hash calculation
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Validate chain linkage
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    addDrugShipment(drugData) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                batchId: drugData.batchId,
                drugName: drugData.drugName,
                manufacturer: drugData.manufacturer,
                manufacturingDate: drugData.manufacturingDate,
                expiryDate: drugData.expiryDate,
                origin: drugData.origin,
                destination: drugData.destination,
                quantity: drugData.quantity,
                temperature: drugData.temperature,
                timestamp: Date.now()
            }
        );
        return this.addBlock(newBlock);
    }

    findDrugByBatchId(batchId) {
        return this.chain.filter(block => 
            block.data.batchId === batchId
        );
    }
}

module.exports = { Block, Blockchain };