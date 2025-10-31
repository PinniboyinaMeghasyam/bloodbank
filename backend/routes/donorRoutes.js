const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// Get all donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register a new donor
router.post('/', async (req, res) => {
  try {
    const { name, bloodGroup, contact } = req.body;
    
    // Check if donor already exists
    const existingDonor = await Donor.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }, 
      bloodGroup 
    });
    
    if (existingDonor) {
      return res.status(400).json({ 
        message: `Donor ${name} with blood group ${bloodGroup} is already registered.` 
      });
    }
    
    const donor = new Donor({
      name,
      bloodGroup,
      contact
    });
    
    const newDonor = await donor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;