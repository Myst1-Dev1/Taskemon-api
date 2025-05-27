require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.route.js');
const tasksRouter = require('./routes/tasks.route.js');
const awardsRouter = require('./routes/awards.route.js');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Mongodb connected successfully'))
.catch((e) => console.log(e));

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-next-revalidate-tags']
}));
app.use(express.json());

app.use("/user", userRouter);
app.use("/tasks", tasksRouter);
app.use("/awards", awardsRouter);

app.listen(process.env.PORT, () => {
    console.log('Servidor rodando na porta', process.env.PORT);
})