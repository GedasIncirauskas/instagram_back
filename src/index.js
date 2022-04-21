const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');
const { port } = require('./config');
const logger = require('../logger');

const userInfo = require('./routes/v1/userInfo');
const auth = require('./routes/v1/auth');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(fileupload());
app.use('/static', express.static('files'));

app.use('/', userInfo);
app.use('/', auth);

app.all('*', (req, res) => res.status(404).send({ msg: 'Page not found' }));

app.listen(port, () => logger.info(`Working on ${port}`));
