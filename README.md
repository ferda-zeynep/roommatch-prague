# RoomMatch Prague

A production-oriented mobile-first platform for discovering rooms and flatmates in Prague, built for Erasmus students and young professionals relocating to the city.

RoomMatch Prague provides a fast, intuitive, and responsive experience for browsing rental listings, saving favorites, and creating advertisements. The project was built as a production-style MVP using modern full-stack technologies, AI-assisted development workflows, and Progressive Web App (PWA) capabilities.

Designed with native mobile application principles in mind, the interface emphasizes mobile-first layouts, touch-friendly interactions, bottom navigation, and responsive user experiences that could later evolve into a native iOS or Android application.

## 🌐 Live Demo

- **Production URL:** [roommatch-prague.vercel.app](https://roommatch-prague.vercel.app/)

---

## 📱 Application Preview

|                                                            Premium Entrance View                                                            |                                                            Explore Stream View                                                            |                                                            AI Wizard View                                                            |
| :-----------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/89f4b878-a7f7-4492-822b-160fe09e631f" width="240" alt="Premium Entrance View Mockup"/> | <img src="https://github.com/user-attachments/assets/c12a04b1-28a1-44ab-b3f4-2f0081cb85c2" width="240" alt="Explore Stream View Mockup"/> | <img src="https://github.com/user-attachments/assets/9131cd2e-5b89-40cf-89f7-f9da2e86d4a1" width="240" alt="AI Wizard View Mockup"/> |

# Why I Built This

Finding accommodation in a new city is often fragmented across Facebook groups, WhatsApp chats, and multiple websites.

RoomMatch Prague was created as a centralized platform where students and young professionals can easily browse listings, compare apartments, save favorites, and create their own advertisements through a mobile-first experience.

The project also allowed me to explore modern full-stack architecture, server-driven applications, AI integration, and responsive product design.

---

# Tech Stack

### Frontend

- Next.js 15 (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Server Actions
- PostgreSQL
- Prisma ORM

### Authentication

- Clerk

### AI

- Google Gemini API (`gemini-2.5-flash`)

### Deployment

- Vercel

---

# Architecture

The application follows a production-style full-stack architecture using the Next.js App Router.

### Key architectural decisions

- Server Components for efficient data fetching
- Server Actions for secure server-side mutations
- PostgreSQL as the primary relational database
- Prisma ORM for type-safe database access
- Clerk for authentication and route protection
- Mobile-first responsive UI
- Progressive Web App (PWA) support

---

# Features

## 📱 Mobile Experience

- Mobile-first responsive interface
- Bottom navigation
- Progressive Web App (PWA)
- Touch-friendly layouts
- Responsive mobile screens

## 🏠 Listings

- Create listings
- Delete listings
- Browse available rooms
- Advanced search
- District filtering
- Budget filtering
- Price sorting
- Save favorite listings
- Listing management

## ✨ User Experience

- Loading skeletons
- Empty states
- Optimistic UI updates
- Disabled loading states
- Responsive layouts
- Debounced search

## 🤖 AI Features

- AI-generated listing descriptions
- AI-powered rental price suggestions
- AI-assisted listing creation workflow

---

# Database Design

Main entities:

- User
- Listing
- Favorite

Relationships:

- One user can create multiple listings.
- Users can save multiple favorite listings.
- Listings can belong to many users through favorites.

The database is modeled using PostgreSQL and Prisma ORM.

---

# AI-Assisted Development

This project was developed using AI-assisted workflows with Cursor, Gemini, and Claude.

AI was used to accelerate development, explore implementation approaches, and improve productivity. Every generated solution was manually reviewed, tested, and refined before becoming part of the final codebase.

---

# Technical Highlights

Key engineering concepts explored in this project:

- Next.js Server Actions
- Server Components
- PostgreSQL relational modeling
- Prisma ORM
- Clerk Authentication
- Responsive mobile-first design
- Optimistic UI updates
- Google Gemini API integration
- Progressive Web App configuration

---

# Future Improvements

Planned improvements include:

- Image uploads (Cloudinary / Vercel Blob)
- Interactive maps
- Real-time messaging
- Push notifications
- Recommendation engine
- Native iOS application
- Native Android application

---

# Running Locally

```bash
git clone https://github.com/yourusername/roommatch-prague

cd roommatch-prague

npm install

npm run dev
```

Create a `.env` file:

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

GEMINI_API_KEY=
```

---

# Project Goals

The goal of this project was to build a production-oriented mobile-first application while gaining hands-on experience with:

- Modern full-stack architecture
- Secure authentication
- Relational database design
- AI integration
- Product-focused user experience
- Responsive application development

---

## License

This project was built for educational and portfolio purposes.
