const mongoose = require('mongoose');

const temperatureSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    trim: true
  },
  temperature: {
    type: Number,
    required: true
  },
  precipitation: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Индекс для быстрого поиска по дате
temperatureSchema.index({ date: 1 });
temperatureSchema.index({ temperature: 1 });

module.exports = mongoose.model('Temperature', temperatureSchema);