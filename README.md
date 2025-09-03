# Flag Quiz Game

A React-based flag identification quiz game built with TypeScript and Tailwind CSS.

## Features

- **Multiple Game Modes**:
  - Flag Identification: Identify the country from its flag
  - Country Selection: Choose the correct flag for a country
  - Timed Challenge: Answer as many as you can in 60 seconds
  - Survival Mode: Keep going until you get one wrong

- **Difficulty Levels**:
  - Easy: 20 major countries
  - Medium: 50 countries including smaller nations
  - Hard: All countries worldwide
  - Expert: Includes historical flags and territories

- **Scoring System**:
  - Points based on difficulty
  - Streak bonuses for consecutive correct answers
  - Accuracy tracking

## Tech Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Game/          # Game-related components
│   │   ├── GameBoard.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── ScoreDisplay.tsx
│   │   └── Timer.tsx
│   ├── UI/            # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── FlagCard.tsx
│   │   └── Modal.tsx
│   └── Layout/        # Layout components
│       ├── Header.tsx
│       └── Navigation.tsx
├── data/
│   └── countries.ts   # Country and flag data
├── services/
│   └── gameService.ts # Game logic service
├── types/
│   └── index.ts       # TypeScript type definitions
└── App.tsx            # Main application component
```

## Future Enhancements

- User authentication and profiles
- Global leaderboard
- Achievement system
- Sound effects and animations
- Learning mode with country information
- Mobile app version with React Native
- Backend API with Node.js and MongoDB
- Multiplayer mode
