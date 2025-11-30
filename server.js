const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather_news';

const connectWithRetry = () => {
    console.log('🔄 Попытка подключения к MongoDB...');
    
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
    }).then(() => {
        console.log('✅ Успешное подключение к MongoDB');
        initializeTestData();
    }).catch(err => {
        console.error('❌ Ошибка подключения к MongoDB:', err.message);
        console.log('🔄 Повторная попытка через 5 секунд...');
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

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

const Temperature = mongoose.model('Temperature', temperatureSchema);

const initializeTestData = async () => {
    try {
        const count = await Temperature.countDocuments();
        if (count === 0) {
            const testData = [
                {
                    region: "Москва",
                    temperature: -5.2,
                    precipitation: 12.5,
                    date: new Date("2024-01-15")
                },
                {
                    region: "Санкт-Петербург",
                    temperature: 8.7,
                    precipitation: 3.2,
                    date: new Date("2024-01-15")
                },
                {
                    region: "Новосибирск",
                    temperature: -15.8,
                    precipitation: 8.1,
                    date: new Date("2024-01-14")
                },
                {
                    region: "Сочи",
                    temperature: 22.3,
                    precipitation: 0.5,
                    date: new Date("2024-01-16")
                },
                {
                    region: "Якутск",
                    temperature: -28.4,
                    precipitation: 15.2,
                    date: new Date("2024-01-16")
                }
            ];
            
            await Temperature.insertMany(testData);
            console.log(`✅ Добавлено ${testData.length} тестовых записей`);
        }
    } catch (error) {
        console.error('❌ Ошибка при инициализации данных:', error);
    }
};

app.get('/api/temperature', async (req, res) => {
    try {
        const records = await Temperature.find().sort({ date: -1, createdAt: -1 });
        res.json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/temperature/:id', async (req, res) => {
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

app.post('/api/temperature', async (req, res) => {
    try {
        const temperature = new Temperature(req.body);
        const result = await temperature.save();
        console.log(`🌡️ Добавлена запись: ${result.region} - ${result.temperature}°C`);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.put('/api/temperature/:id', async (req, res) => {
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

app.delete('/api/temperature/:id', async (req, res) => {
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

app.get('/api/temperature/search/by-date/:date', async (req, res) => {
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
        
        res.json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/temperature/analytics/coldest', async (req, res) => {
    try {
        const coldest = await Temperature.findOne().sort({ temperature: 1 });
        res.json({ success: true, data: coldest });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/temperature/analytics/stats', async (req, res) => {
    try {
        const stats = await Temperature.aggregate([
            {
                $group: {
                    _id: null,
                    minTemperature: { $min: "$temperature" },
                    maxTemperature: { $max: "$temperature" },
                    avgTemperature: { $avg: "$temperature" },
                    totalRecords: { $sum: 1 }
                }
            }
        ]);
        
        const result = stats[0] || { totalRecords: 0 };
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/temperature/init-test-data', async (req, res) => {
    try {
        await Temperature.deleteMany({});
        await initializeTestData();
        const count = await Temperature.countDocuments();
        res.json({ success: true, message: `Добавлено ${count} тестовых записей` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Weather News System running on http://localhost:${PORT}`);
});