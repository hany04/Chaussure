const express = require('express');
const Scrutin = require('./models/Scrutin');
const authenticateUser = require('./middleware/authMiddleware');

const router = express.Router();

// Create a new scrutin (admin route)
router.post('/create', authenticateUser, async (req, res) => {
  const { titre, description, debut, fin, statut } = req.body;

  try {
    // Only allow admins to create a scrutin (this check could be expanded)
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Not authorized' });

    const newScrutin = await Scrutin.create({
      titre,
      description,
      debut,
      fin,
      statut,
      admin_id: req.user.id,
    });

    return res.status(201).json(newScrutin);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating scrutin' });
  }
});

module.exports = router;
