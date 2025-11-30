const Temperature = require('../models/Temperature');

const deleteTemperature = async (temperatureId) => {
  try {
    const existingRecord = await Temperature.findById(temperatureId);
    if (!existingRecord) {
      return { success: false, error: 'Температурная запись не найдена' };
    }

    const result = await Temperature.findByIdAndDelete(temperatureId);
    
    console.log(`🗑️ Удалена температурная запись: ${result.region} - ${result.temperature}°C`);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Ошибка при удалении температурной записи:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = deleteTemperature;