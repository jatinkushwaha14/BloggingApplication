const express = require('express');
const app= express();
const PORT=process.env.PORT||3000;
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

app.use(express.json());
app.get('/', (req, res) => {
    res.render("Hello World");
});

app.listen(PORT, () => {
    console.log("Server is running on port 5000");
});