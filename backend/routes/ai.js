const express = require("express");
const router = express.Router();

// Stub route - AI feature is disabled
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // Return disabled message instead of AI response
    res.json({ 
      reply: "AI feature is currently disabled. Please contact support for more information." 
    });

  } catch (error) {
    console.error("AI Stub Error:", error.message);
    res.status(500).json({
      error: "Service temporarily unavailable"
    });
  }
});

module.exports = router;
