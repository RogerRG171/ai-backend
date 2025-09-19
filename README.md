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

## 📝 License

ISC