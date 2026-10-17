const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://oltinios.github.io",
    "https://isitwednesday.site",
    "https://www.isitwednesday.site",
  ],
})); // we'll lock this down to your domain later
app.use(express.json());

const isWednesdayUK = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "long" })
    .format(new Date()) === "Wednesday";

const messageSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: { expires: 0 } },
  upvotes: { type: [String], default: [] }, // voter IDs
});

const Message = mongoose.model("Message", messageSchema);

// Get all live messages (voter IDs are never sent to the browser)
app.get("/messages", async (req, res) => {
  try {
    const voterId = String(req.query.voterId || "");
    const list = await Message.find({ expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json(
      list.map((m) => ({
        _id: m._id,
        text: m.text,
        createdAt: m.createdAt,
        score: m.upvotes?.length || 0,
        myVote: m.upvotes?.includes(voterId) ? 1 : 0,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a message
app.post("/message", async (req, res) => {
  if (process.env.SKIP_DAY_CHECK !== "true" && !isWednesdayUK()) {
    return res.status(403).json({ error: "Not Wednesday!" });
  }

  const text = String(req.body.text ?? "").trim().slice(0, 280);
  if (!text) return res.status(400).json({ error: "Empty message" });

  try {
    await Message.create({
      text,
      expiresAt: new Date(Date.now() + 6.5 * 24 * 60 * 60 * 1000),
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote: vote = 1 (add my upvote) or 0 (remove it)
app.post("/message/:id/vote", async (req, res) => {
  const voterId = String(req.body.voterId || "");
  const vote = Number(req.body.vote);
  if (!voterId || ![1, 0].includes(vote)) {
    return res.status(400).json({ error: "Bad vote" });
  }

  try {
    const { id } = req.params;
        // $push lets the same person vote many times (testing). $addToSet = one vote each.
    const addVote =
      process.env.UNLIMITED_VOTES === "true"
        ? { $push: { upvotes: voterId } }
        : { $addToSet: { upvotes: voterId } };
    const update = vote === 1 ? addVote : { $pull: { upvotes: voterId } };
    const m = await Message.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!m) return res.status(404).json({ error: "Message not found" });
    res.json({ score: m.upvotes.length, myVote: vote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startUp() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    const port = process.env.PORT || 5137;
    app.listen(port, () => console.log("Server running on port " + port));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

startUp();