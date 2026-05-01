# 🎬 FlimFindr - Smart Movie Discovery Platform

A full-stack movie discovery and recommendation platform built with React (Frontend), Node.js/Express (Backend), and MongoDB (Database). Integrates with The Movie Database (TMDb) API for real-time movie data.

---

## 📦 Project Structure

```
movie-app/
├── FlimFindr-be/          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration files
│   │   └── index.js       # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── FlimFindr-fe/          # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API for state management
│   │   ├── styles/        # CSS files
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json
│
└── README.md              # Project documentation
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (for database)
- **TMDb API Key** (for movie data)

---

### 1. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/filmfindr`)
4. Add it to `FlimFindr-be/.env`

---

### 2. TMDb API Key

1. Visit [The Movie Database (TMDb)](https://www.themoviedb.org/settings/api)
2. Sign up and request an API key
3. Add it to `FlimFindr-be/.env`

---

### 3. Backend Setup

```bash
cd FlimFindr-be

# Install dependencies
npm install

# Create .env file (already created)
# Update MONGODB_URI and TMDB_API_KEY in .env

# Start the server
npm run dev
# Server runs on http://localhost:5000
```

**Backend environment variables (.env):**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/filmfindr
JWT_SECRET=your_jwt_secret_key_here
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

---

### 4. Frontend Setup

```bash
cd FlimFindr-fe

# Install dependencies
npm install

# Start development server
npm run dev
# App opens on http://localhost:3000
```

---

## 🚀 Running the Application

You need **3 terminal windows**:

**Terminal 1: Start Backend**
```bash
cd FlimFindr-be
npm run dev
```
✓ Backend runs on `http://localhost:5000`

**Terminal 2: Start Frontend**
```bash
cd FlimFindr-fe
npm run dev
```
✓ Frontend runs on `http://localhost:3000`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search?query=...` - Search movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/feed` - Get personalized feed (protected)

### User
- `POST /api/user/watchlist` - Add to watchlist (protected)
- `DELETE /api/user/watchlist` - Remove from watchlist (protected)
- `GET /api/user/watchlist` - Get watchlist (protected)
- `POST /api/user/watched` - Mark as watched (protected)
- `GET /api/user/watched` - Get watched movies (protected)
- `PUT /api/user/preferences` - Update preferences (protected)

---

## 🔑 Features

### ✅ Implemented
- **User Authentication** - Signup, Login with JWT
- **Personalized Feed** - Trending, Popular, Upcoming movies based on preferences
- **Movie Search** - Search any movie from TMDb database
- **Movie Details** - Full movie information with cast, ratings, overview
- **Watchlist** - Add/remove movies to personal watchlist
- **Watched History** - Mark movies as watched
- **Responsive Design** - Works on desktop and tablet

### 📦 Default Credentials
You can use these to test:
```
Email: test@example.com
Password: password123
```
(Create these through signup first)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router 7, Axios |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB Atlas |
| **External API** | The Movie Database (TMDb) |
| **Build Tool** | Vite |
| **Authentication** | JWT (JSON Web Tokens) |
| **Styling** | CSS (Custom) |

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/filmfindr
JWT_SECRET=your_jwt_secret_key_here
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

---

## 🎯 User Flow

1. **Signup/Login** → Create account or login
2. **Home Page** → See trending, popular, and upcoming movies
3. **Search** → Search for any movie
4. **Movie Details** → View full details, cast, ratings
5. **Watchlist** → Save movies to watch later
6. **Mark as Watched** → Track watched movies

---

## 🔒 Security Features

- **Password Hashing** - Bcrypt for secure password storage
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Frontend routes require authentication
- **CORS** - Configured for frontend-backend communication
- **Input Validation** - Server-side validation on all endpoints

---

## 📱 Future Enhancements

- Dark/Light mode toggle
- User reviews and ratings
- Advanced filtering (genre, year, language)
- Recommendations based on watched movies
- Push notifications
- Mobile app (React Native)
- User profiles and following system

---

## ⚠️ Troubleshooting

### Backend not connecting to MongoDB
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB Atlas cluster is active
- Check IP whitelist in MongoDB Atlas

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS is enabled in backend
- Check `http://localhost:5000` is correct

### Movies not loading
- Verify `TMDB_API_KEY` in `.env`
- Check TMDb API key is valid
- Ensure rate limits aren't exceeded

### Vite hot reload not working
- Try `npm run dev` again
- Clear `.vite` cache folder
- Restart dev server

---

## 📄 Resume Description

**Developed a full-stack movie recommendation platform using React, Node.js, and MongoDB with personalized content filtering. Integrated external APIs for real-time movie data and implemented JWT-based authentication with secure password hashing.**

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in browser console and terminal
3. Verify API keys and environment variables
4. Check internet connection and API rate limits

---

**Happy Movie Watching! 🍿**
