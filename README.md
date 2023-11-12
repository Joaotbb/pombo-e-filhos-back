# Pombo e Filhos Warehouse Management Backend

## Introduction

This backend project, developed as part of the Web Full Stack Programming course by FLAG.pt, is tailored for Pombo e Filhos lda, a company in the electronic and lighting sector. It is an integral component of our training program, designed to apply and assess the skills learned in various modules. The project emphasizes digitizing traditional business operations, such as stock management, to align with the rapid pace of modern business requirements.

## Features

- **Supplier Management**: Track suppliers and their products.
- **Customer Management**: Manage customer details and their purchase history.
- **Stock Management**: Oversee product stock levels in the warehouse.
- **Stock Inquiry**: Query stock levels for specific products.
- **Order Dispatch Dates**: Manage dates for sending out orders.

## Tech Stack

- **Node.js**
- **Express**
- **Prisma ORM**
- **MySQL**
- **Swagger** (API Documentation)
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)
- **Other Utilities**: Body-parser, Cors, Morgan, Nodemon

## Setup and Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Setup MySQL database and update .env file

# Run migrations
npm run migration

# Seed the database (for initial data)
npx prisma db seed

# Start the server
npm start
Resetting and Seeding the Database
If you need to reset your database and inject new data:

bash
Copy code
# This will erase all existing data and reset migrations
npx prisma migrate reset
API Documentation
Access the API documentation at /api-docs on the server. It provides details about API endpoints, parameters, and responses.



Contributing
Contributions are welcome. Please ensure to discuss major changes with the project maintainers.

```
