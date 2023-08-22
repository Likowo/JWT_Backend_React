const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors')

//Initialize our app variable with Express: NB: run command npm i to install all dependencies from package.json in to node_modules
const app = express();

//Connect Database
connectDB();

// Initialize middleware (app.use)
app.use(express.json({ extended: false }));

//Single endpoint just to test API. Send data to browser
app.get('/', (req, res) => res.send('API Running'))
app.use(cors())

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Enviromental Variables ;  5000 port set as default port if assigned port not available
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
