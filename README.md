# Lets-Split-API Documentation
Welcome to the Expense Splitting App API documentation. This API is designed to simplify and streamline the process of splitting expenses among friends, family, or colleagues.

## Database Schema
![Schema](schema.png)

## Features
Coming soon...

## API Documentation
**Swagger**

Explore the API endpoints and test requests using the Swagger documentation by accessing the docs at `http://localhost:{PORT set in .env}/api/docs`

**Endpoints**

POST `/api/auth/register`: Register a new user account.\
POST `/api/auth/login`: Authenticate user login.\
POST `/api/expenses`: Create a new expense entry.\
GET `/api/expenses`: Retrieve all expenses.\
GET `/api/expenses/expense-summary`: Retrieve expense summaries and participant breakdown.\
POST `/api/expenses/settle-expense`: Mark an expense as settled.\
GET `/api/currencies`: Retrieve supported currencies.
... and more.

For detailed API documentation, visit Swagger API Documentation.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sudodeo/lets-split-API.git
   ```

2. Install dependencies:

    ```bash
    cd lets-split-API
    npm install
    ```

3. Create `.env` file and set environment variables using `.env.example` as a template

4. Set up the PostgreSQL database and update the configuration in config/database.js.

5. Start the server:

    ```bash
    npm start
    ```

    The API server will be running at `http://localhost:{PORT set in .env}`.

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).