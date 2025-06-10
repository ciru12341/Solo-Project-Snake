const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const router = require('./router');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(router);

connectDB();

app.listen(port, () => {
  console.log(`Server running at PORT: ${port}`);
});