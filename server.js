const express = require('express');
const serverInfo = require('debug')('app:server');
const connectToDB = require('./config/db');

const app = express();
connectToDB();

app.get('/', (req, res) => res.send('Wel Come to DevConn.'));

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => serverInfo(`Server started on port ${PORT}`));
