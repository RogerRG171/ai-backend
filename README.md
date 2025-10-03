# AI Backend

A Node.js backend API built with Fastify that provides AI-powered question-answering capabilities using Google's Gemini AI. The system allows users to create rooms, upload audio files for transcription, and ask questions that are answered based on the transcribed content using vector similarity search.

## 🚀 Technologies Used

### Core Framework
- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe JavaScript development
- **Node.js** - JavaScript runtime environment

### Database & ORM
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe SQL ORM with TypeScript
- **pgvector** - Vector similarity search extension for PostgreSQL

### AI & Machine Learning
- **Google Gemini AI** - For audio transcription, text embeddings, and answer generation
- **Vector Embeddings** - Semantic search using text-embedding-004 model

### Development Tools
- **Vitest** - Fast unit testing framework
- **Supertest** - HTTP assertion library for testing
- **Biome** - Fast formatter and linter
- **Faker.js** - Generate fake data for testing
- **Drizzle Kit** - Database migrations and studio

### Validation & Type Safety
- **Zod** - TypeScript-first schema validation
- **fastify-type-provider-zod** - Zod integration for Fastify

## 📦 Package.json Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm start           # Start production server

# Database Management
npm run db:generate # Generate database migrations
npm run db:migrate  # Run database migrations
npm run db:studio   # Open Drizzle Studio (database GUI)
npm run db:seed     # Seed database with initial data

# Testing
npm run test                    # Run all tests
npm run migrate:pretest        # Run migrations before tests
```

## 🗄️ Database Schema

The application uses three main tables:

### Rooms
- `id` (UUID) - Primary key
- `name` (TEXT) - Room name (3-150 characters)
- `description` (TEXT) - Optional room description
- `createdAt` (TIMESTAMP) - Creation timestamp

### Questions
- `id` (UUID) - Primary key
- `roomId` (UUID) - Foreign key to rooms table
- `question` (TEXT) - User question (3-255 characters)
- `answer` (TEXT) - AI-generated answer (nullable)
- `createdAt` (TIMESTAMP) - Creation timestamp

### Audio Chunks
- `id` (UUID) - Primary key
- `roomId` (UUID) - Foreign key to rooms table
- `transcription` (TEXT) - Transcribed audio content
- `embeddings` (VECTOR) - 768-dimensional vector embeddings
- `createdAt` (TIMESTAMP) - Creation timestamp

## 🌐 API Endpoints

### Health Check
- **GET** `/health` - Returns server status

### Rooms Management
- **GET** `/rooms` - Get all rooms with question counts
- **POST** `/rooms` - Create a new room
  ```json
  {
    "name": "Room Name",
    "description": "Optional description"
  }
  ```

### Questions Management
- **GET** `/rooms/:roomId/questions` - Get all questions for a specific room
- **POST** `/rooms/:roomId/questions` - Create a new question
  ```json
  {
    "question": "Your question here"
  }
  ```

### Audio Processing
- **POST** `/rooms/:roomId/audio` - Upload audio file for transcription
  - Content-Type: `multipart/form-data`
  - Body: Audio file

## 🧪 Integration Tests

The project includes comprehensive integration tests using Vitest and Supertest:

### Test Files
- `src/server.test.ts` - Basic server health check
- `src/http/routes/create-room.test.ts` - Room creation tests
- `src/http/routes/create-question.test.ts` - Question creation tests
- `src/http/routes/get-room-questions.test.ts` - Question retrieval tests
- `src/http/routes/get-rooms.test.ts` - Room listing tests

### Test Features
- Database setup and teardown
- Factory functions for creating test data
- Faker.js integration for generating realistic test data
- Full HTTP request/response testing
- Database connection management

## 🪛 API Testing with HTTP Files

The project includes a `request.http` file for testing API endpoints:

### Available Test Requests
1. **Health Check** - `GET /health`
2. **Get Rooms** - `GET /rooms`
3. **Create Room** - `POST /rooms` with JSON body
4. **Get Room Questions** - `GET /rooms/{roomId}/questions`
5. **Create Question** - `POST /rooms/{roomId}/questions` with JSON body

### Usage
The HTTP file uses variables for dynamic testing:
- `@baseUrl` - Base API URL (default: http://localhost:3333)
- `@roomId` - Dynamically captured room ID from create room response

### OBS
- Need install vscode extension REST Client to run this tests.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL 17 with pgvector extension
- Google Gemini API key

### Environment Variables
Create a `.env` file with:
```env
PORT=3333
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:port
HOST_URL=0.0.0.0
```

## 🏗️ Architecture

The application follows a clean architecture pattern:

- **Routes** (`src/http/routes/`) - HTTP request handlers
- **Services** (`src/services/`) - Business logic and external API integrations
- **Database** (`src/db/`) - Database configuration, schemas, and migrations
- **Tests** (`src/test/`) - Test utilities and factories

## 🔍 Key Features

1. **Audio Transcription** - Convert audio files to text using Gemini AI
2. **Vector Search** - Find relevant audio chunks using semantic similarity
3. **AI-Powered Q&A** - Generate contextual answers based on transcribed content
4. **Room-based Organization** - Organize questions and audio content by rooms
5. **Type Safety** - Full TypeScript support with Zod validation
6. **Comprehensive Testing** - Full test coverage with integration tests

## ☸️ Kubernetes Deployment

The application is containerized and deployed on Kubernetes with the following configuration:

### Deployment Configuration
- **Namespace**: `ai-api-ns`
- **Replicas**: 5 (with autoscaling enabled)
- **Image**: `roger171/api.ai.backend:latest`
- **Port**: 3333

### Resource Limits
- **CPU Requests**: 200m
- **Memory Requests**: 256Mi
- **CPU Limits**: 400m
- **Memory Limits**: 512Mi

### Health Checks
- **Startup Probe**: `/health` endpoint with 40s initial delay
- **Liveness Probe**: `/health` endpoint with 60s initial delay
- **Readiness Probe**: `/health` endpoint with 60s initial delay

### Auto Scaling
- **Min Replicas**: 5
- **Max Replicas**: 8
- **CPU Target**: 80%
- **Memory Target**: 75%

### Deployment Commands
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n ai-api-ns

# View logs
kubectl logs -f deployment/ai-api-deploy -n ai-api-ns
```

## 🪶 Helm Charts

The application uses Helm for package management and deployment templating:

### Chart Structure
```
helm/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration values
└── templates/          # Kubernetes manifest templates
    ├── deployment.yaml
    ├── service.yaml
    ├── servicemonitor.yaml
    ├── hpa.yaml
    └── sealed-secrets.yaml
```

### Key Configuration
- **Chart Name**: ai-api
- **Namespace**: ai-api-ns
- **Service Type**: ClusterIP
- **Ingress**: Disabled by default
- **Service Account**: Auto-created with API credentials

### Helm Commands
```bash
# Install/Upgrade with Helm
helm upgrade --install ai-api ./helm -n ai-api-ns

# Check release status
helm status ai-api -n ai-api-ns

# View values
helm get values ai-api -n ai-api-ns
```

## 🔄 ArgoCD GitOps

The application uses ArgoCD for GitOps-based continuous deployment:

### Application Configuration
- **Repository**: https://github.com/RogerRG171/ai-backend.git
- **Target Path**: helm/
- **Destination Namespace**: ai-api-ns
- **Sync Policy**: Automated with self-healing and pruning enabled

### GitOps Features
- **Automated Sync**: Changes in Git automatically trigger deployments
- **Self-Healing**: ArgoCD automatically corrects drift from desired state
- **Pruning**: Removes resources that are no longer defined in Git
- **Namespace Creation**: Automatically creates target namespace if missing

### ArgoCD Commands
```bash
# Check application status
argocd app get ai-api

# Sync application manually
argocd app sync ai-api

# View application logs
argocd app logs ai-api
```

## 🚀 GitHub Actions CI/CD

The project is designed to work with GitHub Actions for continuous integration and deployment. The CI/CD pipeline include Docker image building and automated deployment to Kubernetes via ArgoCD.

## 📊 Prometheus Monitoring

The application exposes metrics for Prometheus monitoring:

### Metrics Endpoint
- **Path**: `/metrics`
- **Format**: Prometheus text format
- **Port**: 3333

### ServiceMonitor Configuration
- **Name**: ai-api
- **Labels**: release: monitoring
- **Metrics Path**: /metrics
- **Scrape Interval**: 15s
- **Port**: http

### Available Metrics
- **Default Node.js Metrics**: CPU, memory, event loop lag
- **HTTP Metrics**: Request duration, status codes
- **Custom Business Metrics**: Application-specific metrics

## 📈 Grafana Dashboards

Grafana dashboards provide visualization of application metrics:

### Dashboard Features
- **Application Overview**: High-level metrics and health status
- **Performance Metrics**: Response times, throughput, error rates
- **Resource Utilization**: CPU, memory, and network usage
## 📝 License

ISC