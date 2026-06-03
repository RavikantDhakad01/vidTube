# VidTube Backend

A scalable backend API for a video-sharing platform inspired by YouTube, built using Node.js, Express.js, MongoDB, and Mongoose.

## Features

- User Authentication & Authorization
- JWT Access & Refresh Token System
- Video Upload & Management
- Playlist Management
- Comment System
- Like System (Videos, Comments, Tweets)
- Tweet Management
- Channel Subscription System
- User Dashboard Statistics
- Watch History Tracking
- Cloudinary Integration for Media Storage
- Secure Route Protection
- Aggregation Pipelines for Advanced Queries

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cloudinary
- Multer

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
```

### Navigate to Project Directory

```bash
cd vidtube-backend
```

### Install Dependencies

```bash
npm install
```

### Create .env File

```env
PORT=

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Run Development Server

```bash
npm run dev
```

---

## API Modules

### Authentication

- Register User
- Login User
- Logout User
- Refresh Access Token
- Change Password
- Update Account Details
- Get Current User
- Get Channel Profile
- Get Watch History

### Videos

- Publish Video
- Get Video By ID
- Update Video
- Delete Video
- Toggle Publish Status
- Get All Videos

### Playlists

- Create Playlist
- Get Playlist
- Update Playlist
- Delete Playlist
- Add Video To Playlist
- Remove Video From Playlist

### Comments

- Add Comment
- Get Video Comments
- Update Comment
- Delete Comment

### Likes

- Toggle Video Like
- Toggle Comment Like
- Toggle Tweet Like
- Get Liked Videos

### Tweets

- Create Tweet
- Get User Tweets
- Update Tweet
- Delete Tweet

### Subscriptions

- Toggle Subscription
- Get Channel Subscribers
- Get Subscribed Channels

### Dashboard

- Get Channel Statistics
- Get Channel Videos

---

## Project Structure

```text
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── constants/
├── app.js
└── index.js
```

---

## Author

**Ravikant Dhakar**