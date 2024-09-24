require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db/db');
const server = express();
const port = process.env.PORT || 4000
const path = require('path');
const indexRoutes = require('./routes/indexRoutes');

server.use(express.json());

server.use("/api", indexRoutes);
server.use("/public", express.static(path.join(__dirname, "public")))

server.listen(port, () => {
    connectDB();
    console.log(`Server Is Connected At Port ${port}`);
})