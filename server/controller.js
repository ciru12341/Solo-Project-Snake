const User = require('./model')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({highScore: {$gt: 0} }).sort({highScore: -1}).limit(10);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

const insertScore = async (req, res) => {
  let { userName, highScore } = req.body;

  if (!userName || typeof highScore !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid field, not inserted' });
  }

  userName = userName.trim().replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);;

  try {
    const existing = await User.findOne({ userName });
    if (existing) {
      if (highScore > existing.highScore) {
        existing.highScore = highScore;
        await existing.save();
        return res.status(200).json(existing);
      } else {
        return res.status(200).json({ message: 'Score not higher. No update.' });
      }
    } else {
      const newScore = await User.create({ userName, highScore });
      return res.status(201).json(newScore);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {getAllUsers, insertScore};