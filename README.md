# Volunteer Check-in System

A simple volunteer registration and check-in system built with React, Node.js, Express, and MongoDB.

## Project Structure

```
.
├── frontend/          # React frontend
├── backend/           # Node.js backend
└── docker-compose.yml # Docker configuration
```

## Getting Started

Quick start guide to run this project:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/volunteer-checkin.git

# Install dependencies
cd volunteer-checkin
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm start
```

Visit http://localhost:3001 to see the application in action!

## Prerequisites

- Node.js 16+
- Docker and Docker Compose
- MongoDB (handled via Docker)
- Google Cloud SDK
- Firebase CLI

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/fred5354/
cd checkin
```

2. Create environment files:

For backend (backend/.env.development):
```
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/volunteers
PORT=3000
```

For frontend (frontend/.env.development):
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```

3. Start the application:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## Production Deployment

### Environment Setup

1. Create production environment files:

For backend (backend/.env.production):
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
PORT=8080
```

For frontend (frontend/.env.production):
```
REACT_APP_PROD_API_URL=your_cloud_run_url
REACT_APP_ENV=production
```

### Google Cloud Platform Deployment Steps

1. Set up MongoDB Atlas
2. Deploy backend to Cloud Run
3. Deploy frontend to Firebase Hosting

Detailed deployment instructions in [DEPLOYMENT.md](DEPLOYMENT.md)

## Features

- Automatic environment detection (development/production)
- Docker containerization
- Environment-specific configurations
- MongoDB database
- Simple volunteer registration form
- List of registered volunteers
- Environment information display (in development)
- Cloud Run auto-scaling
- Firebase Hosting with CDN

## API Endpoints

- POST /api/volunteers - Register new volunteer
- GET /api/volunteers - List all volunteers
- GET /api/environment - Get environment information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details 