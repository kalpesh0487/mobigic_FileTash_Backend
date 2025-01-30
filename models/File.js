const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    filename: { 
        type: String, 
        required: true
    },
    originalName: { 
        type: String, 
        required: true 
    },
    path: { 
        type: String,
        required: true 
    },
    fileCode: { 
        type: Number,
        required: true 
    },
})

module.exports= mongoose.model("File", fileSchema);