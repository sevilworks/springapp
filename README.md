# 📝 Notes App with Grammar Checker

A modern, full-stack web application for creating and managing notes with integrated grammar checking functionality. Built with Spring Boot (Java) backend and React (Vite) frontend.

## ✨ Features

### Core Functionality
- **CRUD Operations**: Create, Read, Update, and Delete notes seamlessly
- **Grammar Checking**: Automatic grammar analysis using LanguageTool API
- **Grammar Scoring**: Visual half-circular progress indicators for each note's grammar score
- **Grammar Analytics**: Interactive chart showing grammar scores across all notes

### User Interface
- **Modern Design**: Beautiful, responsive UI with Material-UI components
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preferences
- **Note Detail View**: Click any note to view full details in an elegant popup
- **Enhanced Dialogs**: Styled create/edit dialogs with gradient headers
- **Delete Confirmation**: Safe deletion with confirmation dialog
- **List View**: Clean, organized list display of all notes

### Technical Features
- **RESTful API**: Well-structured REST endpoints for all operations
- **MySQL Database**: Persistent data storage with automatic schema management
- **CORS Enabled**: Seamless frontend-backend communication
- **Real-time Updates**: Instant UI updates after operations

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL with JPA/Hibernate
- **API**: RESTful web services
- **External Service**: LanguageTool API for grammar checking

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI) v5
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios for API communication

## 📁 Project Structure

```
springapp/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/springapp/springapp/
│   │       │       ├── controller/    # REST controllers
│   │       │       ├── model/         # Entity classes
│   │       │       ├── repository/    # Data access layer
│   │       │       └── service/       # Business logic
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend/                # React application
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── App.css         # Application styles
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- MySQL 8.0+

### Backend Setup

1. **Configure Database**
   - Update `backend/src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. **Run the Application**
   ```bash
   cd springapp/backend
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd springapp/frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/{id}` | Get note by ID |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/{id}` | Update existing note |
| DELETE | `/api/notes/{id}` | Delete note |
| POST | `/api/notes/{id}/check-grammar` | Check grammar for a note |

## 🎯 Usage

1. **Create a Note**: Click the "Add Note" button, enter title and content, then save
2. **View Note**: Click on any note card to view full details
3. **Edit Note**: Click the edit icon (✏️) on any note
4. **Check Grammar**: Click "Check Grammar" button - score updates automatically
5. **Delete Note**: Click delete icon (🗑️) and confirm deletion
6. **Toggle Theme**: Use the switch in the top-right corner

## 🛠️ Technologies Used

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Connector
- Lombok
- LanguageTool API

### Frontend
- React 18.2.0
- Vite 7.2.4
- Material-UI 5.15.0
- Recharts 2.10.0
- Axios 1.6.0

## 📊 Database Schema

### Notes Table
- `id` (Long, Primary Key)
- `title` (String, Not Null)
- `content` (TEXT)
- `created_date` (DateTime, Not Null)
- `modified_date` (DateTime)
- `grammar_score` (Double)

## 🔧 Configuration

### Backend Configuration
- Server Port: `8080`
- Database: Auto-created if not exists
- JPA: Auto-update schema on startup

### Frontend Configuration
- Development Port: `5173`
- API Base URL: `http://localhost:8080/api/notes`

## 🎨 Features in Detail

### Grammar Checking
- Uses LanguageTool API (free tier)
- Calculates score based on error count and text length
- Score range: 0-100%
- Visual indicators: Green (≥80%), Yellow (60-79%), Red (<60%)

### Theme System
- Dark mode with gradient backgrounds
- Light mode with clean white interface
- Theme preference saved in localStorage
- Smooth transitions between themes

## 📝 Notes

- Grammar checking requires internet connection
- Database is auto-created on first run
- All dates are stored in UTC format
- Grammar scores are recalculated on each check

## 🤝 Contributing

This is a learning project. Feel free to fork and enhance!

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ❤️ using Spring Boot and React**

