const express = require("express");
const router = express.Router();

// Working AI endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // Temporary working response
    res.json({ 
      reply: "AI is working. You asked: " + message + " - This is a mock response for testing purposes." 
    });

  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      error: "Service temporarily unavailable"
    });
  }
});

module.exports = router;
