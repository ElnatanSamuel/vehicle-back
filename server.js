const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Vehicle = require('./models/Vehicle');

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://vehicle-front-iota.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

// Basic CORS setup
app.use(cors(corsOptions));

// Additional headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://vehicle-front-iota.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Routes
app.get('/api/vehicles', async (req, res) => {
  try {
    await mongoose.connect('mongodb+srv://ktk2real:krosection999@cluster0.abfalpl.mongodb.net/internshiptest?retryWrites=true&w=majority');
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    await mongoose.connect('mongodb+srv://ktk2real:krosection999@cluster0.abfalpl.mongodb.net/internshiptest?retryWrites=true&w=majority');
    const vehicle = new Vehicle(req.body);
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Error creating vehicle', error: error.message });
  }
});

app.put('/api/vehicles/:id', async (req, res) => {
  try {
    await mongoose.connect('mongodb+srv://ktk2real:krosection999@cluster0.abfalpl.mongodb.net/internshiptest?retryWrites=true&w=majority');
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Error updating vehicle', error: error.message });
  }
});

// Handle OPTIONS requests
app.options('*', cors());

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}