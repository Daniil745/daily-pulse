class TemperatureManager {
    constructor() {
        this.baseUrl = '/api/temperature';
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRecords();
        this.setDefaultDates();
        this.loadStats();
        this.updateCurrentDate();
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        document.getElementById('searchDate').value = today;
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('ru-RU', options);
    }

    bindEvents() {
        document.getElementById('addRecordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRecord();
        });

        document.getElementById('searchByDate').addEventListener('click', () => {
            this.searchByDate();
        });

        document.getElementById('findColdest').addEventListener('click', () => {
            this.findColdestRecord();
        });

        document.getElementById('editRecordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateRecord();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.cancelEdit();
        });

        document.getElementById('closeSearchResults').addEventListener('click', () => {
            this.hideSearchResults();
        });

        document.getElementById('initTestData').addEventListener('click', () => {
            this.initTestData();
        });

        document.getElementById('refreshData').addEventListener('click', () => {
            this.loadRecords();
            this.loadStats();
            this.showAlert('Данные обновлены', 'success');
        });

        document.getElementById('viewStats').addEventListener('click', () => {
            this.showDetailedStats();
        });

        document.getElementById('closeStats').addEventListener('click', () => {
            this.hideDetailedStats();
        });

        setInterval(() => {
            this.updateCurrentDate();
        }, 30000);
    }

    async loadRecords() {
        try {
            const response = await fetch(this.baseUrl);
            const result = await response.json();
            
            if (result.success) {
                this.displayRecords(result.data);
            } else {
                this.showAlert('Ошибка при загрузке записей: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/stats`);
            const result = await response.json();
            
            if (result.success) {
                this.displayStats(result.data);
            }
        } catch (error) {
            console.log('Не удалось загрузить статистику:', error.message);
        }
    }

    displayStats(stats) {
        const statsElement = document.getElementById('weatherStats');
        if (!statsElement) return;

        if (stats.totalRecords === 0) {
            statsElement.innerHTML = '<p>Нет данных для отображения статистики</p>';
            return;
        }

        statsElement.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Минимальная температура:</span>
                <span class="stat-number">${stats.minTemperature}°C</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Максимальная температура:</span>
                <span class="stat-number">${stats.maxTemperature}°C</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Средняя температура:</span>
                <span class="stat-number">${stats.avgTemperature ? stats.avgTemperature.toFixed(1) : 0}°C</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Всего записей:</span>
                <span class="stat-number">${stats.totalRecords}</span>
            </div>
        `;
    }

    async loadDetailedStats() {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/stats`);
            const result = await response.json();
            
            if (result.success) {
                this.displayDetailedStats(result.data);
            }
        } catch (error) {
            console.log('Не удалось загрузить детальную статистику:', error.message);
            this.showAlert('Ошибка при загрузке статистики', 'error');
        }
    }

    displayDetailedStats(stats) {
        const content = document.getElementById('detailedStatsContent');
        
        if (stats.totalRecords === 0) {
            content.innerHTML = '<div class="alert alert-info">Нет данных для отображения статистики</div>';
            return;
        }

        const tempRange = Math.abs(stats.maxTemperature - stats.minTemperature);
        const avgRecordsPerDay = (stats.totalRecords / 30).toFixed(1);
        const coldDays = stats.minTemperature < 0 ? 'Большинство дней холодные' : 'Преобладают теплые дни';
        const tempTrend = stats.avgTemperature > 10 ? 'Теплый период' : stats.avgTemperature > 0 ? 'Умеренный период' : 'Холодный период';

        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>📊 Общая статистика</h3>
                    <div class="stat-item">
                        <span class="stat-label">Всего записей:</span>
                        <span class="stat-number">${stats.totalRecords}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Минимальная температура:</span>
                        <span class="stat-number">${stats.minTemperature}°C</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Максимальная температура:</span>
                        <span class="stat-number">${stats.maxTemperature}°C</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Средняя температура:</span>
                        <span class="stat-number">${stats.avgTemperature ? stats.avgTemperature.toFixed(1) : 0}°C</span>
                    </div>
                </div>
                <div class="stat-card">
                    <h3>📈 Аналитика</h3>
                    <div class="stat-item">
                        <span class="stat-label">Диапазон температур:</span>
                        <span class="stat-number">${tempRange.toFixed(1)}°C</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Записей в день (ср.):</span>
                        <span class="stat-number">${avgRecordsPerDay}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Температурный тренд:</span>
                        <span class="stat-number">${tempTrend}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Характеристика периода:</span>
                        <span class="stat-number">${coldDays}</span>
                    </div>
                </div>
                <div class="stat-card">
                    <h3>❄️ Рекорды температуры</h3>
                    <div class="stat-item">
                        <span class="stat-label">Абсолютный минимум:</span>
                        <span class="stat-number">${stats.minTemperature}°C</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Абсолютный максимум:</span>
                        <span class="stat-number">${stats.maxTemperature}°C</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Амплитуда:</span>
                        <span class="stat-number">${tempRange.toFixed(1)}°C</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Температурный режим:</span>
                        <span class="stat-number">${stats.avgTemperature > 0 ? 'Выше нуля' : 'Ниже нуля'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    displayRecords(records) {
        const container = document.getElementById('recordsList');
        
        if (records.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <p>Температурные записи не найдены.</p>
                    <button id="initTestDataEmpty" class="btn btn-info btn-sm" style="margin-top: 10px;">
                        Загрузить тестовые данные
                    </button>
                </div>
            `;
            
            setTimeout(() => {
                const initBtn = document.getElementById('initTestDataEmpty');
                if (initBtn) {
                    initBtn.addEventListener('click', () => this.initTestData());
                }
            }, 100);
            
            return;
        }

        container.innerHTML = records.map(record => `
            <div class="record-card" data-id="${record._id}">
                <div class="record-header">
                    <div class="record-region">📍 ${record.region}</div>
                    <div class="record-actions">
                        <button class="btn btn-secondary btn-sm" onclick="temperatureManager.editRecord('${record._id}')" title="Редактировать">
                            ✏️
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="temperatureManager.deleteRecord('${record._id}')" title="Удалить">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="record-info">
                    <div>
                        <span>🌡️ Температура:</span>
                        <span class="temperature-value">${record.temperature}°C</span>
                    </div>
                    <div>
                        <span>💧 Осадки:</span>
                        <span class="precipitation-value">${record.precipitation} мм</span>
                    </div>
                    <div>
                        <span>📅 Дата:</span>
                        <span class="date-value">${new Date(record.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div>
                        <span>⏰ Время добавления:</span>
                        <span class="date-value">${new Date(record.createdAt).toLocaleTimeString('ru-RU')}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async addRecord() {
        const formData = {
            region: document.getElementById('region').value,
            temperature: parseFloat(document.getElementById('temperature').value),
            precipitation: parseFloat(document.getElementById('precipitation').value),
            date: document.getElementById('date').value
        };

        if (!formData.region.trim()) {
            this.showAlert('Пожалуйста, введите название региона', 'error');
            return;
        }

        if (isNaN(formData.temperature)) {
            this.showAlert('Пожалуйста, введите корректную температуру', 'error');
            return;
        }

        if (isNaN(formData.precipitation) || formData.precipitation < 0) {
            this.showAlert('Пожалуйста, введите корректное количество осадков', 'error');
            return;
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('Температурная запись успешно добавлена!', 'success');
                document.getElementById('addRecordForm').reset();
                this.setDefaultDates();
                this.loadRecords();
                this.loadStats();
                
                console.log(`✅ Добавлена новая запись: ${formData.region}, ${formData.temperature}°C, ${formData.date}`);
            } else {
                this.showAlert('Ошибка при добавлении: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    async deleteRecord(id) {
        if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('Запись успешно удалена!', 'success');
                this.loadRecords();
                this.loadStats();
            } else {
                this.showAlert('Ошибка при удалении: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    async editRecord(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            const result = await response.json();

            if (result.success) {
                const record = result.data;
                this.currentEditId = id;
                
                document.getElementById('editRecordId').value = record._id;
                document.getElementById('editRegion').value = record.region;
                document.getElementById('editTemperature').value = record.temperature;
                document.getElementById('editPrecipitation').value = record.precipitation;
                document.getElementById('editDate').value = record.date.split('T')[0];
                
                document.getElementById('editRecordForm').style.display = 'block';
                document.getElementById('editRecordForm').scrollIntoView({ behavior: 'smooth' });
            } else {
                this.showAlert('Ошибка при загрузке записи: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    async updateRecord() {
        const formData = {
            region: document.getElementById('editRegion').value,
            temperature: parseFloat(document.getElementById('editTemperature').value),
            precipitation: parseFloat(document.getElementById('editPrecipitation').value),
            date: document.getElementById('editDate').value
        };

        if (!formData.region.trim()) {
            this.showAlert('Пожалуйста, введите название региона', 'error');
            return;
        }

        if (isNaN(formData.temperature)) {
            this.showAlert('Пожалуйста, введите корректную температуру', 'error');
            return;
        }

        if (isNaN(formData.precipitation) || formData.precipitation < 0) {
            this.showAlert('Пожалуйста, введите корректное количество осадков', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/${this.currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('Запись успешно обновлена!', 'success');
                this.cancelEdit();
                this.loadRecords();
                this.loadStats();
            } else {
                this.showAlert('Ошибка при обновлении: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    cancelEdit() {
        document.getElementById('editRecordForm').style.display = 'none';
        document.getElementById('editRecordForm').reset();
        this.currentEditId = null;
    }

    async searchByDate() {
        const date = document.getElementById('searchDate').value;
        
        if (!date) {
            this.showAlert('Пожалуйста, выберите дату для поиска', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/search/by-date/${date}`);
            const result = await response.json();

            if (result.success) {
                if (result.data && result.data.length > 0) {
                    const minTempRecord = result.data.reduce((min, record) => 
                        record.temperature < min.temperature ? record : min
                    );
                    
                    console.log(`❄️ Минимальная температура за ${date}: ${minTempRecord.region} - ${minTempRecord.temperature}°C`);
                    
                    this.displaySearchResults(
                        `Минимальная температура за ${new Date(date).toLocaleDateString('ru-RU')}`,
                        [minTempRecord]
                    );
                } else {
                    this.showAlert(`На дату ${new Date(date).toLocaleDateString('ru-RU')} записи не найдены`, 'error');
                }
            } else {
                this.showAlert('Ошибка при поиске: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    async findColdestRecord() {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/coldest`);
            const result = await response.json();

            if (result.success) {
                if (result.data) {
                    console.log(`🥶 Абсолютный минимум: ${result.data.region} - ${result.data.temperature}°C (${new Date(result.data.date).toLocaleDateString('ru-RU')})`);
                    
                    this.displaySearchResults(
                        'Абсолютный минимальный температурный показатель',
                        [result.data]
                    );
                } else {
                    this.showAlert('Записи не найдены', 'error');
                }
            } else {
                this.showAlert('Ошибка при поиске: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    async initTestData() {
        if (!confirm('Загрузить тестовые данные? Существующие записи будут удалены.')) {
            return;
        }

        try {
            this.showAlert('Загрузка тестовых данных...', 'success');
            
            const response = await fetch(`${this.baseUrl}/init-test-data`, {
                method: 'POST'
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert(`Успешно загружено ${result.data.length} тестовых записей!`, 'success');
                this.loadRecords();
                this.loadStats();
            } else {
                this.showAlert('Ошибка при загрузке тестовых данных: ' + result.error, 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка сети: ' + error.message, 'error');
        }
    }

    displaySearchResults(title, records) {
        const resultsContainer = document.getElementById('searchResultsContent');
        
        if (records.length === 0) {
            resultsContainer.innerHTML = '<div class="alert alert-info">По вашему запросу ничего не найдено</div>';
        } else {
            resultsContainer.innerHTML = `
                <div class="analytics-result minimal-temp">
                    <h3>${title}</h3>
                    <div class="records-list">
                        ${records.map(record => `
                            <div class="record-card" style="border-color: rgba(231, 76, 60, 0.6);">
                                <div class="record-header">
                                    <div class="record-region">❄️ ${record.region}</div>
                                    <div class="temperature-value" style="font-size: 1.5em;">${record.temperature}°C</div>
                                </div>
                                <div class="record-info">
                                    <div>
                                        <span>💧 Осадки:</span>
                                        <span class="precipitation-value">${record.precipitation} мм</span>
                                    </div>
                                    <div>
                                        <span>📅 Дата:</span>
                                        <span class="date-value">${new Date(record.date).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                    <div>
                                        <span>⏰ Время измерения:</span>
                                        <span class="date-value">${new Date(record.createdAt).toLocaleTimeString('ru-RU')}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        document.getElementById('searchResults').style.display = 'block';
        document.getElementById('searchResults').scrollIntoView({ behavior: 'smooth' });
    }

    hideSearchResults() {
        document.getElementById('searchResults').style.display = 'none';
    }

    showDetailedStats() {
        this.loadDetailedStats();
        document.getElementById('detailedStats').style.display = 'block';
        document.getElementById('detailedStats').scrollIntoView({ behavior: 'smooth' });
    }

    hideDetailedStats() {
        document.getElementById('detailedStats').style.display = 'none';
    }

    showAlert(message, type) {
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

const alertStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .alert {
        padding: 15px 20px;
        border-radius: 4px;
        margin-bottom: 20px;
        border-left: 4px solid;
        background: #f8f9fa;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .alert-success {
        background: rgba(40, 167, 69, 0.1);
        color: #155724;
        border-color: #28a745;
    }
    
    .alert-error {
        background: rgba(220, 53, 69, 0.1);
        color: #721c24;
        border-color: #dc3545;
    }
    
    .alert-info {
        background: rgba(23, 162, 184, 0.1);
        color: #0c5460;
        border-color: #17a2b8;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = alertStyles;
document.head.appendChild(styleSheet);

const temperatureManager = new TemperatureManager();

window.debugTemperatureManager = temperatureManager;