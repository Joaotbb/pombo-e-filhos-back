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

# Setup and Installation

## Clone the repository

```bash
git clone https://github.com/backendproject-turma77092/ProjetoBE-Joao.git
```

## Install dependencies

```bash
npm install
```

## Setup MySQL Database and Update .env File

Ensure your MySQL database is set up. Then update the `.env` file with your database credentials. For guidance on the required variables, check the `.env.example` file at the root of the project directory.

## Run Migrations

To set up your database schema:

```bash
npm run migration
```

## Seed the Database (For Initial Data)

To seed the database with initial data:

```bash
npx prisma db seed
```

## Start the Server

To start the server:

```bash
npm start
```

## Resetting and Seeding the Database

If you need to reset your database and inject new data:

```bash
npx prisma migrate reset
```

# API Documentation

Access detailed API documentation at /api-docs on the server. This includes information on API endpoints, parameters, and responses.
