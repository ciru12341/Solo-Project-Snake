const User = require('./model')

const getAllEvents = async (req, res) => {
  try {
    const users = await User.find({highScore: {$gt: 0} }).sort({highScore: -1});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

const insertEvent = async (req, res) => {
  console.log(req.body);
  const {userName, highScore} = req.body;
  if (!userName || !highScore) return res.status(400).json({error: 'Missing field, not inserted'})
  try {
    const newScore = await User.create({userName, highScore});
    console.log('successfully inserted: ', newScore)
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

module.exports = {getAllEvents, insertEvent};