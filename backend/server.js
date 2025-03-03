const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');

// Function to check if running locally
const isLocalEnvironment = () => {
  const hostname = os.hostname();
  const interfaces = os.networkInterfaces();
  
  // Check if running on localhost or local IP
  const isLocal = Object.keys(interfaces).some(interfaceName => {
    return interfaces[interfaceName].some(interface => {
      return interface.address === '127.0.0.1' || interface.address === '::1';
    });
  });

  return isLocal || hostname.includes('localhost') || hostname.includes('.local');
};

// Automatically determine environment
const environment = isLocalEnvironment() ? 'development' : 'production';
dotenv.config({
  path: `.env.${environment}`
});

console.log(`Running in ${environment} mode (Auto-detected)`);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Simple Schema
const volunteerSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// Save volunteer
app.post('/api/volunteers', async (req, res) => {
  try {
    const volunteer = new Volunteer({ name: req.body.name });
    await volunteer.save();
    res.json(volunteer);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// Get all volunteers
app.get('/api/volunteers', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Get environment info
app.get('/api/environment', (req, res) => {
  res.json({
    environment,
    hostname: os.hostname(),
    isLocal: isLocalEnvironment(),
    networkInterfaces: os.networkInterfaces()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${environment} mode`);
});