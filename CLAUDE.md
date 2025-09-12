# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production (runs TypeScript compiler + Vite)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Architecture Overview

### Game Service Pattern
The game uses a singleton `GameService` class (`src/services/gameService.ts`) to manage game state, scoring, and question generation. This service maintains the active game session and handles core game logic.

### Component Architecture
- **App.tsx**: Root component managing game state transitions (menu ↔ game)
- **Layout Components**: Header and Navigation for main menu
- **Game Components**: GameBoard orchestrates the game flow, QuestionCard displays individual questions
- **UI Components**: Reusable Button, FlagCard, and Modal components
- **Game-specific**: ScoreDisplay and Timer for game information

### State Management
- React hooks for local component state
- GameService singleton for global game state
- No external state management library needed

## Key Technical Details

### React 19 Usage
This project uses React 19.1.1 which includes automatic JSX runtime - no explicit `import React` needed for JSX components.

### Styling Approach
Currently configured with Tailwind CSS v4 but experiencing PostCSS compatibility issues. A custom CSS implementation (`src/index.css`) provides all necessary styling as a fallback. When working with styles:
- Use existing CSS classes from `src/index.css`
- New utility classes can be added to the custom CSS file
- Avoid adding Tailwind-specific classes until PostCSS issues are resolved

### Game Flow
1. User selects game mode and difficulty from Navigation
2. App component switches to GameBoard view
3. GameService creates session and generates questions
4. Questions are filtered by difficulty level (easy includes only easy countries, expert includes all)
5. Scoring includes base points + streak bonuses
6. Game ends on wrong answer (challenge mode) or after 10 questions

### Data Structure
- Country data uses emoji flags in `src/data/countries.ts`
- Countries categorized by difficulty: easy (20 major), medium (50), hard (all 195+)
- Each country includes metadata: continent, capital, population
- GameQuestions contain correct country + 3 wrong options from same difficulty pool

## Important Implementation Notes

- The `currentQuestion` field in GameSession stores the active question for answer validation
- GameService uses Chinese comments in some sections - maintain this convention
- Timer component only activates in 'timed' game mode (60 seconds)
- Modal component uses custom CSS classes instead of Tailwind
- All components use TypeScript type imports from `src/types/index.ts`

## Build Considerations

- Vite handles both TypeScript compilation and bundling
- ESLint configuration includes React-specific rules
- No test framework currently configured
- Production build creates optimized assets in `dist/` folder
- 当需要git操作的时候调用git-version-manager。