const express = require('express');
const Vote = require('./models/Vote');
const OptionVote = require('./models/OptionVote');
const authenticateUser = require('./middleware/authMiddleware');

const router = express.Router();

// User votes on an option for a scrutin
router.post('/vote', authenticateUser, async (req, res) => {
  const { scrutin_id, option_id } = req.body;

  try {
    const option = await OptionVote.findByPk(option_id);
    if (!option) return res.status(404).json({ message: 'Option not found' });

    const newVote = await Vote.create({
      voterHash: req.user.id + scrutin_id + option_id, // Unique identifier for the vote
      horodadata: new Date(),
      txHash: 'some-tx-hash', // Normally this would come from your blockchain logic
      user_id: req.user.id,
      scrutin_id,
      option_id,
    });

    return res.status(201).json(newVote);
  } catch (error) {
    return res.status(500).json({ message: 'Error casting vote' });
  }
});

module.exports = router;
