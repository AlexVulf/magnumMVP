const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const userRoutes = require('./modules/users/user.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', userRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
