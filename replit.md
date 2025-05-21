# Purrfect Trivia - Animal Quiz Game

## Overview
Purrfect Trivia is a web-based trivia game focused on animal facts, particularly cats. The application features a modern, responsive UI with a question-based gameplay system. Players can select difficulty levels, focus on specific animal categories, and track their score through multiple rounds.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application follows a client-server architecture with a clear separation of concerns:

1. **Frontend**: React-based single page application with a component-based architecture
2. **Backend**: Express.js server providing REST API endpoints
3. **Database**: PostgreSQL database using Drizzle ORM for data modeling and querying
4. **AI Integration**: OpenAI API integration to dynamically generate trivia questions
5. **Styling**: Tailwind CSS with Shadcn UI component library

### Key Architectural Decisions

#### 1. Monorepo Structure
The application uses a monorepo structure with clear separation between client, server, and shared code. This approach enables code sharing between frontend and backend while maintaining clear boundaries.

#### 2. API-First Design
The application follows an API-first design where all data is accessed through REST endpoints, allowing for clean separation between UI and business logic.

#### 3. AI-Generated Content
Rather than storing a fixed set of trivia questions, the application leverages the OpenAI API to dynamically generate questions based on user preferences (difficulty, category). This provides virtually unlimited content without requiring manual content creation.

#### 4. In-Memory Storage with Database Schema Ready
The current implementation uses in-memory storage but includes a Drizzle ORM schema ready for PostgreSQL integration. This allows for easy transition to a persistent database when needed.

## Key Components

### Frontend
- **React Application**: Built with React and uses modern hooks for state management
- **Component Library**: Uses Shadcn UI components built on Radix UI primitives
- **Client State Management**: Uses React Query for data fetching and caching
- **Styling**: Tailwind CSS with custom theme variables
- **Routing**: Simple routing with Wouter (lightweight alternative to React Router)

### Backend
- **Express Server**: Handles API requests and serves the frontend application
- **OpenAI Integration**: Generates trivia questions based on difficulty and category
- **Session Management**: In-memory game state tracking with unique game IDs

### Data Model
- **User**: Basic user model with username and password (prepared for auth)
- **Trivia Questions**: Generated dynamically with OpenAI
- **Game State**: Tracks current game progress, score, and question index

## Data Flow

### Game Initialization
1. User selects difficulty and category on the welcome screen
2. Client sends request to `/api/trivia/start` endpoint
3. Server generates trivia questions using OpenAI API
4. Server creates a game session with a unique ID
5. Client receives questions and game state, renders first question

### Game Play
1. User selects an answer for the current question
2. Client validates the answer locally and updates score
3. User proceeds to next question or completes the game
4. On game completion, final score is displayed with option to restart

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM)
- Tailwind CSS for styling
- Shadcn UI / Radix UI for component primitives
- Wouter for routing
- React Query for data fetching
- Lucide Icons for icons

### Backend Dependencies
- Express.js for server implementation
- OpenAI SDK for generating trivia questions
- Drizzle ORM for database schema (ready for PostgreSQL)
- Zod for data validation

### Development Dependencies
- Vite for frontend bundling and development server
- TypeScript for type safety
- ESBuild for server bundling
- TSX for running TypeScript files directly

## Deployment Strategy
The application is configured for deployment on Replit with the following setup:

1. **Development Mode**:
   - Uses Vite's development server with hot module replacement
   - Server runs with tsx for TypeScript execution

2. **Production Mode**:
   - Frontend is built with Vite
   - Backend is bundled with ESBuild
   - Combined assets are served from a single Express server

3. **Database Strategy**:
   - Currently using in-memory storage
   - Schema ready for PostgreSQL integration using Drizzle ORM
   - Configuration prepared for database provisioning

## Getting Started

### Prerequisites
- Node.js environment
- OpenAI API key for question generation
- PostgreSQL database (optional - can use in-memory storage for development)

### Development
1. Set the `OPENAI_API_KEY` environment variable with your OpenAI API key
2. Set the `DATABASE_URL` environment variable if using PostgreSQL
3. Run `npm run dev` to start the development server

### Production
1. Run `npm run build` to create production build
2. Run `npm run start` to start the production server

## Planned Enhancements
1. User authentication and persistent user profiles
2. Leaderboards for competitive play
3. Additional question categories and game modes
4. Image support for visual trivia questions
5. Progressive Web App (PWA) features for offline play