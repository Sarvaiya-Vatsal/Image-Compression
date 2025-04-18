# Image Compression & Analytics App

A MERN stack application that allows users to upload images, compress them, and view analytics about the compression process.

## Features

- Image upload and compression
- Download compressed images
- Analytics dashboard with charts
- Real-time compression statistics
- Responsive design

## Tech Stack

- **Frontend:**
  - React (Vite)
  - Axios
  - Chart.js
  - Tailwind CSS
- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Multer (file upload)
  - Sharp (image processing)
  - Winston (logging)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm 

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/image-compression-app.git
cd image-compression-app
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/image-compression
NODE_ENV=development
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- `POST /api/images` - Upload and compress an image
- `GET /api/images` - Get all uploaded images
- `GET /api/images/:id/download` - Download a compressed image
- `GET /api/analytics` - Get compression statistics

## Project Structure

```
project-root/
├── client/                     # React Frontend
│   ├── public
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   |── index.css
│   │   └── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── config/
│   │   ├── database.js
│   │   ├── logger.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── uploads/
│   │   ├── .env.example
│   │   ├── app.js
│   │   └── package.json
│   ├── README.md
│   └── .gitignore
```