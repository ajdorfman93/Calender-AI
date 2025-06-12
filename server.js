import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();
const app = express();
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Redirect user to consent screen
app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(url);
});

// Handle OAuth callback
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // Save tokens in DB/session here
  res.send('Authorized! You can close this window.');
});

// Handle AI instruction and Calendar update
app.post('/chat', async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { userInput } = req.body;

  // Step 1: Ask GPT to extract intent and parameters
  const gptResponse = await openai.chat.completions.create({
    messages: [{ role: 'user', content: `Parse this to calendar action JSON: "${userInput}"` }],
    model: 'gpt-4',
  });

  const action = JSON.parse(gptResponse.choices[0].message.content); // e.g., { summary: "...", start: "...", end: "..." }

  // Step 2: Use Google API to insert event
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: action.summary,
      start: { dateTime: action.start },
      end: { dateTime: action.end },
    },
  });

  res.json({ status: 'event_created', id: event.data.id });
});
