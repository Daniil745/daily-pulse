const express = require('express');
const router = express.Router();
const Temperature = require('../models/Temperature');

router.get('/', async (req, res) => {
  try {
    const records = await Temperature.find().sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const record = await Temperature.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const temperature = new Temperature(req.body);
    const result = await temperature.save();
    console.log(`🌡️ Добавлена запись: ${result.region} - ${result.temperature}°C`);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await Temperature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    console.log(`✏️ Обновлена запись: ${result.region} - ${result.temperature}°C`);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Temperature.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    console.log(`🗑️ Удалена запись: ${result.region} - ${result.temperature}°C`);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/search/by-date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const records = await Temperature.find({
      date: {
        $gte: date,
        $lt: nextDay
      }
    }).sort({ temperature: 1 });
    
    if (records.length > 0) {
      const minTemp = records[0];
      console.log(`❄️ Минимальная температура за ${date.toLocaleDateString('ru-RU')}: ${minTemp.region} - ${minTemp.temperature}°C`);
    }
    
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/analytics/coldest', async (req, res) => {
  try {
    const coldest = await Temperature.findOne().sort({ temperature: 1 });
    
    if (coldest) {
      console.log(`🥶 Абсолютный минимум: ${coldest.region} - ${coldest.temperature}°C (${coldest.date.toLocaleDateString('ru-RU')})`);
    }
    
    res.json({ success: true, data: coldest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;