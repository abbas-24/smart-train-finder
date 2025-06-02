# Smart Train Finder

Smart Train Finder is a web application that helps users search for train trips between **Hamburg** and **Amsterdam**, including both one-way and roundtrip options. The app allows filtering by fastest, cheapest, or least number of changes and displays data for available trips.

---

## Features

- Search one-way or roundtrip train journeys
- Filter by departure and return dates
- Sort by fastest, cheapest, or least number of changes
- Real-time UI updates
- Mock backend using static JSON files

---

## Technologies Used

### Frontend
- React (Vite)
- Tailwind CSS
- Fetch API

### Backend
- Node.js
- Express
- CORS
- Static JSON for mock data

---

## Mock Data
Mock train data was generated with a Python script (```server/generate_data.py```) and stored in two ```JSON``` files:
- ```hamburg_to_amsterdam.json```
- ```amsterdam_to_hamburg.json```

Each contains trip data for one year from June 2025.

---

## Deployment
- Frontend deployed on Vercel: https://smart-train-finder-one.vercel.app/
- Backend deployed on Render: https://smart-train-finder.onrender.com

---

## Deploying the Project on ```localhost```

### 1. Clone the Repository

```bash
git clone --branch dev https://github.com/abbas-24/smart-train-finder.git
cd smart-train-finder
```

### 2. Run the Backend

```bash
cd server
npm install
node index.js
```
The backend should now be running at: ```http://localhost:4000```

### 3. Run the Frontend

```bash
cd client
npm install
npm run dev
```
The frontend should now be running at: ```http://localhost:5173```
