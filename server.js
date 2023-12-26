const express = require('express');
const serverInfo = require('debug')('app:server');
const connectToDB = require('./config/db');

const app = express();
connectToDB();

app.get('/', (req, res) => res.send('Wel Come to DevConn.'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => serverInfo(`Server started on port ${PORT}`));
