const Temperature = require('../models/Temperature');

const addTemperature = async (temperatureData) => {
  try {

    if (!temperatureData.region || !temperatureData.region.trim()) {
      return { success: false, error: 'Название региона обязательно' };
    }

    if (typeof temperatureData.temperature !== 'number') {
      return { success: false, error: 'Температура должна быть числом' };
    }

    if (typeof temperatureData.precipitation !== 'number' || temperatureData.precipitation < 0) {
      return { success: false, error: 'Количество осадков должно быть положительным числом' };
    }

    if (!temperatureData.date) {
      return { success: false, error: 'Дата измерения обязательна' };
    }

    const temperature = new Temperature({
      region: temperatureData.region.trim(),
      temperature: parseFloat(temperatureData.temperature),
      precipitation: parseFloat(temperatureData.precipitation),
      date: new Date(temperatureData.date)
    });

    const result = await temperature.save();
    
    console.log(`🌡️ Добавлена новая температурная запись: ${result.region} - ${result.temperature}°C, ${result.precipitation}мм, ${result.date.toLocaleDateString('ru-RU')}`);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Ошибка при добавлении температурной записи:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = addTemperature;