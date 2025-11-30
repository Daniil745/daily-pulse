const Temperature = require('../models/Temperature');

const updateTemperature = async (temperatureId, updateData) => {
  try {
    const existingRecord = await Temperature.findById(temperatureId);
    if (!existingRecord) {
      return { success: false, error: 'Температурная запись не найдена' };
    }

    const updateFields = {};
    
    if (updateData.region !== undefined) {
      if (!updateData.region || !updateData.region.trim()) {
        return { success: false, error: 'Название региона не может быть пустым' };
      }
      updateFields.region = updateData.region.trim();
    }

    if (updateData.temperature !== undefined) {
      if (typeof updateData.temperature !== 'number') {
        return { success: false, error: 'Температура должна быть числом' };
      }
      updateFields.temperature = parseFloat(updateData.temperature);
    }

    if (updateData.precipitation !== undefined) {
      if (typeof updateData.precipitation !== 'number' || updateData.precipitation < 0) {
        return { success: false, error: 'Количество осадков должно быть положительным числом' };
      }
      updateFields.precipitation = parseFloat(updateData.precipitation);
    }

    if (updateData.date !== undefined) {
      if (!updateData.date) {
        return { success: false, error: 'Дата измерения обязательна' };
      }
      updateFields.date = new Date(updateData.date);
    }

    const result = await Temperature.findByIdAndUpdate(
      temperatureId,
      updateFields,
      { 
        new: true, 
        runValidators: true 
      }
    );

    // Логирование в консоль сервера
    console.log(`✏️ Обновлена температурная запись: ${result.region} - ${result.temperature}°C, ${result.precipitation}мм, ${result.date.toLocaleDateString('ru-RU')}`);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Ошибка при обновлении температурной записи:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = updateTemperature;