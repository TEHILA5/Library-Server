# Library Server

A comprehensive backend system for managing a library, including user authentication, book management, and borrowing tracking.

## 🚀 Project Overview
- **Base URL:** `http://localhost:5000`
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

---

## ⚙️ Environment Variables
To run this project, you will need to create a `.env` file in your root directory and add the following variables:

### env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

## Users Endpoints

| Method | URL            | Description       | Permissions | Body                                                    | Headers                       | Returns              | Status Codes    |
| ------ | -------------- | ----------------- | ----------- | ------------------------------------------------------- | ----------------------------- | -------------------- | -------------------- |
| GET    | /users         | Get all users     | Admin       | -                                                       | Authorization: Bearer <token> | Array of users       | 200, 401, 500      |
| POST   | /users/sign-up | Register new user | Public      | username, email, phone, password, repeat_password, role | -                             | Created user + token | 201, 409, 500      |
| POST   | /users/sign-in | Login user        | Public      | email, password                                         | -                             | JWT token            | 200, 403, 500      |
| PATCH  | /users/update  | Update user info  | Owner       | username?, email?, phone?, password?                    | Authorization: Bearer <token> | Updated user         | 200, 400, 404, 500 |

## Books Endpoints

| Method | URL                       | Description                          | Permissions |  Body                    | Headers                       | Returns                                   | Status Codes       |
|--------|---------------------------|--------------------------------------|-------------|--------------------------|-------------------------------|-------------------------------------------|--------------------|
| GET    | /books                    | Get all books (pagination + search)  | Public      | -                        | -                             | Array of books with total, page, limit | 200, 500           |
| GET    | /books/:id                | Get book by ID                       | Public      | -                        | -                             | Book object                               | 200, 404, 500      |
| POST   | /books                    | Add new book                         | Admin       | name, category, price    | Authorization: Bearer <token> | Created book                              | 201, 500           |
| PUT    | /books/:id                | Update book                          | Admin       | name?, category?, price? | Authorization: Bearer <token> | Updated book                              | 200, 404, 500      |
| PATCH  | /books/:id/borrow         | Borrow a book                        | Owner/Admin | userId                   | Authorization: Bearer <token> | Book + User info                          | 200, 400, 404, 500 |
| PATCH  | /books/:id/return         | Return a book                        | Owner/Admin | userId                   | Authorization: Bearer <token> | Book + User info                         | 200, 400, 404, 500  | 
| POST   | /books/:id/picture        | Upload book image                    | Admin       | FormData file: picture   | Authorization: Bearer <token> | Image URL                                | 200, 400, 404, 500  |
| GET    | /books/category/:category | Get books by category                | Public      | -                        | -                             | Array of books                           | 200, 400, 500       |
