
**Vehicle Management System API**


This project is a RESTful API built using Node.js, Express, and MongoDB. The API provides user authentication, registration, and vehicle management features, including adding, updating, and retrieving vehicle data.

**Features**
User Authentication and Authorization:
Register new users with hashed passwords.
Login and receive JWT tokens for secure API access.
Authenticate requests using middleware.

**Vehicle Management**:

Add vehicle details (requires authentication).
Retrieve all vehicles or a specific vehicle by ID.
Update vehicle seat availability.

**Technologies Used**
Backend: Node.js, Express.js
Database: MongoDB (Mongoose for schema modeling)
Authentication: JWT (JSON Web Tokens)
Password Hashing: bcrypt
Middleware: CORS for cross-origin resource sharing
Deployment: Suitable for cloud platforms (e.g., Render)
