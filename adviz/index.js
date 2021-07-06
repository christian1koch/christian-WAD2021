require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error)=> console.error(error)); 
db.once('open', () => console.log('Connected to Database'));
const app = express();  

const PORT = process.env.PORT || 8000;

//Set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
const usersRouter = require('./routes/users');
const contactsRouter = require('./routes/contacts');
app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));