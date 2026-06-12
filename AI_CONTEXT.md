# AI Context for AI Google Reviews

## Project Overview
- **Purpose**: A platform to help businesses generate high-quality Google Reviews. Customers scan a QR code, select a rating, and receive 4-5 AI-generated review drafts (supporting multiple languages). If they rate 1-3 stars, they are routed to a private feedback form to prevent public bad reviews.
- **Tech Stack**:
  - **Frontend**: Vite + React + TypeScript + Vanilla CSS
  - **Backend**: Node.js + Express + TypeScript + MongoDB (Mongoose)
  - **AI Generation**: Google Gemini API via `@google/generative-ai` on the backend

## Current State
- **Version**: 1.0.1
- **Status**: Production Ready / Verified
- **Last Updated**: 2026-06-11

## File Structure
```
d:\Boostify Corp\AI Google Review\
├── AI_CONTEXT.md
├── CHANGELOG.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── Business.ts
│   │       └── Feedback.ts
│   └── .env
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        └── components/
```

## Key Components

### Backend API
- **Endpoint `POST /api/business`**: Save/update business details.
- **Endpoint `GET /api/business/:id`**: Fetch business context by ID.
- **Endpoint `POST /api/business/:id/feedback`**: Submit private low-rating feedback.
- **Endpoint `GET /api/business/:id/feedbacks`**: Retrieve list of private feedbacks for the admin panel.
- **Endpoint `POST /api/business/:id/generate-reviews`**: Generate review drafts based on ratings and language parameters.

### Database Schema (MongoDB / Mongoose)
- **Business Schema**:
  - `name`: String
  - `category`: String
  - `context`: String
  - `googleReviewUrl`: String
  - `createdAt`: Date
- **Feedback Schema**:
  - `businessId`: ObjectId (ref: Business)
  - `rating`: Number
  - `feedbackText`: String
  - `customerContact`: String
  - `createdAt`: Date

## Development Notes
- Make sure to add `GEMINI_API_KEY` and `MONGODB_URI` to the backend `.env`.
- Frontend requires routing to distinguish between `/admin` and `/review/:id` paths.
