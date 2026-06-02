const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 
const app = express();

app.use(cors());
app.use(express.json());

async function connectDB () {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    } 
};

async function startUp () {
    try {
        await connectDB();
        app.listen(5137, () => console.log("Server running"));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startUp();

const NameOfSchema = new mongoose.Schema(
    {
        "text": String,
        "createdAt": {type: Date, default: Date.now}
    }
);

const Message = mongoose.model("Message", NameOfSchema);

app.post("/message", async (req, res) => {
  try {
    const newMessage = new Message({
      text: req.body.text
    });

    await newMessage.save();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

