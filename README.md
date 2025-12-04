# Daily Pulse - Temperature Monitoring System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.18.0-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

**Full-stack web application for managing meteorological data**

[Features](#features) • [Technologies](#technologies) • [Installation](#installation) • [Architecture](#architecture)

</div>

## About the Project

**Daily Pulse** is a fully functional web application for collecting, storing, and analyzing temperature data. The project demonstrates the full development cycle of a modern web application from backend API to responsive interface.

### Real Achievements
-   **Full-stack development** - from database to user interface
-   **Containerization** - Docker-ready solution for deployment
-   **RESTful API** - clean and documented API design
-   **Performance** - optimized database queries

---

## Features

### Data Management
-   **Add records** of temperature with data validation
-   **View archive** with date sorting
-   **Edit and delete** records in real-time
-   **Search and filter** by dates and regions

### Analytics
-   **Find minimum temperature** for a specified date
-   **Determine absolute minimum** among all records
-   **Statistics** for all meteorological data
-   **Data visualization** in card format

### User Experience
-   **Responsive interface** with modern CSS design
-   **Intuitive navigation** without page reloads
-   **Form validation** on client and server
-   **Notifications** about operation results

---

## 🛠 Technologies

### Backend
-   **Runtime**: Node.js 20.18.0
-   **Database**: MongoDB with Mongoose ODM
-   **Validation**: Native Mongoose validation

### Frontend
-   **Language**: Vanilla JavaScript (ES6+)
-   **Styling**: CSS3 with Grid and Flexbox
-   **Architecture**: MVC pattern on the client
-   **Responsiveness**: Mobile-first design

### Infrastructure
-   **Containerization**: Docker + Docker Compose
-   **Database**: MongoDB in a separate container

---

### Data Model
```javascript
const temperatureSchema = {
    region: { type: String, required: true, index: true },
    temperature: { type: Number, required: true },
    precipitation: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, index: true },
    createdAt: { type: Date, default: Date.now }
};
```

### API Design
-   **RESTful principles** - CRUD operations via HTTP methods
-   **Unified response format** - { success, data, error }
-   **Status codes** - proper use of HTTP statuses
-   **Validation** - data validation on all levels

---

## Performance

### Optimizations
-   **MongoDB Indexing** - fast search by date and temperature
-   **Browser Caching** - static resources
-   **Efficient Queries** - data projection and limits
-   **Asynchronous Operations** - non-blocking I/O

---

## Installation and Launch

### Quick Start with Docker
```bash
# Clone the repository
git clone https://github.com/Daniil745/daily-pulse.git
cd daily-pulse

# Launch the application
docker-compose up -d --build

# Application available at:
# http://localhost:3000
```

---

## API Endpoints

### Main Endpoints
```http
GET    /api/temperature                    # Get all records
POST   /api/temperature                    # Create a new record
GET    /api/temperature/:id               # Get record by ID
PUT    /api/temperature/:id               # Update record
DELETE /api/temperature/:id               # Delete record
```

### Analytical Endpoints
```http
GET    /api/temperature/analytics/coldest    # Absolute minimum
GET    /api/temperature/search/by-date/:date # Search by date
GET    /api/temperature/analytics/stats      # Statistics
POST   /api/temperature/init-test-data       # Initialize test data
```

### Usage Example
```javascript
// Get all records
const response = await fetch('/api/temperature');
const { success, data } = await response.json();

// Add a new record
await fetch('/api/temperature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        region: "Moscow",
        temperature: -5.2,
        precipitation: 12.5,
        date: "2024-01-15"
    })
});
```

---

## Key Implementation Features

### Backend Excellence
-   **Clean Architecture** - separation of responsibility across layers
-   **Error Handling** - centralized error handling
-   **Data Validation** - at schema and business logic levels
-   **Logging** - detailed operation logging

### Frontend Quality
-   **Modern JavaScript** - ES6+ syntax, async/await
-   **Responsive Design** - adaptation for all devices
-   **User Experience** - intuitive interface with feedback
-   **Performance** - optimized DOM operations

### DevOps Ready
-   **Dockerized** - isolated services
-   **Environment Configuration** - flexible configuration
-   **Health Checks** - service status monitoring
-   **Logging** - structured logging

---

## Scaling Potential

### Near-term Improvements
-   **Authentication** - JWT-based auth system
-   **Pagination** - for large data volumes
-   **Caching** - Redis for frequent queries
-   **Testing** - unit and integration tests

### Long-term Development
-   **Real-time updates** - WebSocket connections
-   **Geolocation** - maps and data visualization
-   **Advanced Analytics** - ML for forecasting
-   **Microservices** - split into specialized services

---

## Developer

**Daniil745**

### Technical Stack
-   **Backend**: Node.js, MongoDB, REST API
-   **Frontend**: Modern JavaScript, CSS3, Responsive Design
-   **DevOps**: Docker, Containerization, Deployment
-   **Database**: MongoDB, Data Modeling, Optimization

### Contacts
-   **GitHub**: [Daniil745](https://github.com/Daniil745)
-   **Email**: askdaniil02@gmail.com

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">


</div>
