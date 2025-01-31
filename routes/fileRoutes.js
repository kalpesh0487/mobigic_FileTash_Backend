const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const File = require("../models/File");

const router = express.Router();

// verifier
const authMiddleware = (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  });
const upload = multer({ storage });
  
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
    const fileCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    const newFile = new File({
      userId: req.user.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      fileCode,
    });
  
    await newFile.save();
    res.json({ message: "File uploaded", fileCode });
});
  
// Get uploaded files for user
router.get("/get", authMiddleware, async (req, res) => {
  console.log("reached getcode")
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId; 
            const files = await File.find({ userId }).select("-__v"); // Exclude __v field
            console.log(userId, " == ", files);
            if (files.length === 0) {
                return res.status(404).json({ message: "No files found for this user" });
            }

            res.json(files);
        } catch (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// getting all files for download
router.get("/getAll", async (req, res) => {
  try {
      // Fetch all files from the database
      const files = await File.find().select("-__v"); // Exclude __v field

      if (files.length === 0) {
          return res.status(404).json({ message: "No files found" });
      }

      res.json(files);
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});
  
// Delete the file
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId; // Get logged-in user ID
            const file = await File.findById(req.params.id); // Assuming req.params.id is the correct parameter for the file ID
        
            if (!file) {
              return res.status(404).json({ error: "File not found" });
            }
        
            if (file.userId.toString() !== userId) {
              return res.status(403).json({ error: "Unauthorized: You can only delete your own files" });
            }
        
            // Remove file from storage
            fs.unlink(file.path, (err) => {
              if (err) {
                console.error("File deletion error:", err);
                return res.status(500).json({ error: "Error deleting file from storage" });
              }
            });
        
            // Remove file entry from database
            await File.findByIdAndDelete(req.params.id);
        
            res.json({ message: "File deleted successfully" });
        } catch (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
});
  
// Download the file
router.post("/download/:fileId", async (req, res) => {

    console.log("Request received for downloading...");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Params:", req.params);
     
    console.log("donwloading from frontend")
    const { code } = req.body;
    const file = await File.findOne({ _id: req.params.fileId });
    console.log("code :", code);
    console.log("fileId: ", req.params.fileId)
    if (!file) return res.status(404).json({ message: "File not found" });
    if (file.fileCode !== parseInt(code))
      return res.status(403).json({ message: "Invalid file code" });
  
    res.download(file.path, file.originalName);
    
});

router.post("/download", async (req, res) => {
  console.log("Downloading file from frontend");

  const { code } = req.body;  // Get the code from the request body
  if (!code) return res.status(400).json({ message: "File code is required" });
  console.log("code", code)
  // Find the file based on the fileCode
  const file = await File.findOne({ fileCode: parseInt(code) });

  console.log("file", file);

  if (!file) return res.status(404).json({ message: "File not found" });
  
  // Download the file
  res.download(file.path, file.originalName, (err) => {
      if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading file" });
      }
  });
});

  
module.exports = router;