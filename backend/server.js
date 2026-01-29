const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase
const SUPABASE_URL = 'https://xlayiymdhgixsqtcivzq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYXlpeW1kaGdpeHNxdGNpdnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTY4MzksImV4cCI6MjA4NTI5MjgzOX0.U-tijNKjpzJNZUnDGwFR6W2UmykPB3NkklDmhRXAb4c';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Contact form endpoint (deprecated - now handled by frontend)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: 'Failed to save message'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Your message has been received. We will get back to you soon!',
      data
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      error: 'Failed to process your request. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`Contact endpoint: POST http://localhost:${PORT}/api/contact`);
});
