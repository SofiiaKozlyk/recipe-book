# Project Name  

**RecipeBook** is a web application for storing and managing recipes. Users can browse the recipes available in the database, and also register an account to be able to add their own recipes, edit them, and delete them. Users can also search for recipes by title.  

## 1. Getting Started  

### Clone the Repository  

To clone this project, run the following command:  

```sh
git clone https://github.com/SofiiaKozlyk/recipe-book.git
cd recipe-book
```

## 2. Basic Commands

### 2.1. Backend (Server-side)
Navigate to the backend folder, install dependencies, and run the server:

```sh
cd backend
npm install
```

#### 2.1.1. Configuration Files
The backend requires an `.env` file located in the backend folder. Example:
```ini
PORT=5000
DB_USERNAME=your_user
DB_PASSWORD=your_password
DB_DATABASE=your_db
```
#### 2.1.2. Database Setup & Migrations 
If you don't have a PostgreSQL database setup yet, follow these steps:

1. Create a PostgreSQL database

```sh
CREATE DATABASE your_db;
CREATE ROLE your_user;
ALTER ROLE your_user WITH PASSWORD 'your_password';
ALTER ROLE your_user WITH LOGIN;
ALTER DATABASE your_db OWNER TO your_user;
GRANT ALL PRIVILEGES ON DATABASE your_db TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

2. Run Migrations

To run the database migrations, use the following command in the backend folder:

```sh
npx typeorm-ts-node-commonjs migration:run --dataSource=src/ormconfig.ts
```

#### 2.1.3. Run the server:

```sh
npm run start
```

### 2.2. Frontend (Client-side)
Navigate to the frontend folder, install dependencies, and start the frontend:

```sh
cd frontend
npm install
npm run dev
```

## 3. Documentation

### 3.1. Swagger (API Documentation)
The API documentation is available at:
[http://localhost:5000/api/#](http://localhost:5000/api/#)

### 3.2. Storybook (UI Documentation)
To run Storybook for the frontend:

```sh
cd frontend
npm run storybook
```

It will be available at:
[http://localhost:6006](http://localhost:6006)

### 3.3. Typedoc (Code Documentation)
To generate backend documentation:

```sh
cd backend
npx typedoc
```

The documentation will be available in the `backend/docs` folder.

## 4. License

This project is licensed under the [**MIT License**](https://github.com/SofiiaKozlyk/recipe-book/blob/main/LICENSE.md).

## 5. Privacy Policy

By using this project, you agree to our [**Privacy Policy**](https://github.com/SofiiaKozlyk/recipe-book/blob/main/privacy-policy.md) which outlines how your data is handled according to GDPR.

## 6. Author
Author: *Sofiia Kozlyk*  
Contact: *ipz222_kso@student.ztu.edu.ua*