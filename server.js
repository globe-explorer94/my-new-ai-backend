    // server.js (Glitch Backend Proxy)

    // Import necessary modules
    const express = require('express');
    const cors = require('cors'); // For handling Cross-Origin Resource Sharing
    const { GoogleGenerativeAI } = require('@google/generative-ai'); // Gemini SDK

    const app = express();
    const port = process.env.PORT || 3000; // Glitch uses process.env.PORT

    // Enable CORS for your Netlify frontend (replace with your actual Netlify URL)
    // This allows your Netlify site to make requests to this Glitch backend.
    app.use(cors({
        origin: 'https://delicate-horse-ae2f85.netlify.app' // IMPORTANT: Replace with your Netlify URL!
    }));

    // Middleware to parse JSON request bodies
    app.use(express.json());

    // Initialize Gemini API
    // Ensure GEMINI_API_KEY is set in your Glitch .env file
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Or "gemini-1.5-flash"

    // --- API Endpoint for Chatbot ---
    app.post('/chat', async (req, res) => {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: "Message is required." });
        }

        try {
            const result = await model.generateContent(userMessage);
            const response = await result.response;
            const text = response.text();
            res.json({ reply: text });
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            res.status(500).json({ error: "Failed to get response from AI." });
        }
    });

    // --- Serve static frontend files (if you want to host frontend on Glitch too) ---
    // If you're using Netlify for frontend, you don't need this.
    // If you want to host everything on Glitch, uncomment and adjust this.
    // app.use(express.static('public')); // Assumes your HTML/CSS/JS are in a 'public' folder

    // Start the server
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
    
