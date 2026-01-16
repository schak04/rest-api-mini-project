const express = require('express');
const connectDB = require('./config/db');

const logReqRes = require('./middleware/logReqRes');
const userRouter = require('./routes/user');

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'));

connectDB('mongodb://127.0.0.1:27017/rest-api-mini-project-db');

app.use('/api/users', userRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`http://localhost:${port}/api/users`);
});