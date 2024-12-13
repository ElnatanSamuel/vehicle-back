const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Vehicle = require('./models/Vehicle');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const initializeDummyData = async () => {
    try {
      const count = await Vehicle.countDocuments();
      if (count === 0) {
        const dummyVehicles = [
          { name: 'Truck 001', status: 'active' },
          { name: 'Van 102', status: 'maintenance' },
          { name: 'Delivery Car 203', status: 'active' },
          { name: 'Heavy Truck 304', status: 'inactive' },
          { name: 'Pickup 405', status: 'active' }
        ];
        await Vehicle.insertMany(dummyVehicles);
        console.log('Dummy data initialized');
      }
    } catch (error) {
      console.error('Error initializing dummy data:', error);
    }
  };

mongoose.connect('mongodb+srv://ktk2real:krosection999@cluster0.abfalpl.mongodb.net/internshiptest?retryWrites=true&w=majority').then(() => {
    console.log('Connected to MongoDB');
    initializeDummyData();
  });



// Routes
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ updatedAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const vehicle = new Vehicle({
      name: req.body.name,
      status: req.body.status || 'active'
    });
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      vehicle.status = req.body.status;
      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});