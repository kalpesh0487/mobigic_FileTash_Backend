const dotenv = require("dotenv");
const express = require('express');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const connectDB = require('./db/db');
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors({
    origin: "*", // Allows all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
}))

dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);



connectDB();

app.listen(3000, ()=>{
    console.log(`server is running on ${PORT}`)
})