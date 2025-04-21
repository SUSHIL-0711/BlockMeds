const express = require('express');
const router = express.Router();
const { Blockchain } = require('../../blockchain/Blockchain');

// Initialize blockchain
const blockMedsChain = new Blockchain();

// GET all blocks in the chain
router.get('/chain', (req, res) => {
    res.json({
        chain: blockMedsChain.chain,
        length: blockMedsChain.chain.length,
        isValid: blockMedsChain.isChainValid()
    });
});

// POST a new drug shipment
router.post('/shipment', (req, res) => {
    const drugData = req.body;
    
    // Basic validation
    if (!drugData.batchId || !drugData.drugName || !drugData.manufacturer) {
        return res.status(400).json({
            success: false,
            message: 'Missing required drug information'
        });
    }

    try {
        const newBlock = blockMedsChain.addDrugShipment(drugData);
        res.status(201).json({
            success: true,
            message: 'Drug shipment added to blockchain',
            block: newBlock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding drug to blockchain',
            error: error.message
        });
    }
});

// GET a specific drug shipment by batch ID
router.get('/shipment/:batchId', (req, res) => {
    const { batchId } = req.params;
    const blocks = blockMedsChain.findDrugByBatchId(batchId);
    
    if (blocks.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Drug batch not found'
        });
    }
    
    res.json({
        success: true,
        blocks: blocks
    });
});

// Verify the integrity of the chain
router.get('/verify', (req, res) => {
    const isValid = blockMedsChain.isChainValid();
    res.json({
        isValid: isValid,
        message: isValid ? 'Blockchain is valid' : 'Blockchain has been tampered with!'
    });
});

module.exports = router;