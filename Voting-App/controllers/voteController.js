const { Vote } = require('../models');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));

const createVote = async (req, res) => {
  const { title, options, authenticationKey } = req.body;
  try {
    const newVote = await Vote.create({
      title,
      options,
      authenticationKey,
    });
    res.status(201).json({ message: 'Vote created successfully!', voteId: newVote.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating vote', error: error.message });
  }
};

const castVote = async (req, res) => {
  const { voteId, optionIndex, authenticationKey } = req.body;
  try {
    const vote = await Vote.findByPk(voteId);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found!' });
    }

    if (vote.authenticationKey !== authenticationKey) {
      return res.status(403).json({ message: 'Invalid authentication key!' });
    }

    const options = vote.options;
    options[optionIndex].votes += 1;
    vote.options = options;

    await vote.save();
    res.status(200).json({ message: 'Vote casted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error casting vote', error: error.message });
  }
};

const getResults = async (req, res) => {
  const voteId = req.params.voteId;
  try {
    const vote = await Vote.findByPk(voteId);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found!' });
    }

    res.json({ results: vote.options });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vote results', error: error.message });
  }
};

module.exports = { createVote, castVote, getResults };
