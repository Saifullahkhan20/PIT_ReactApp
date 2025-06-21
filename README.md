# PIT_ReactApp (frontend)

This is a full-stack e-commerce application for an online store that sells phones and laptops. The frontend is built with React, and it communicates with a Node.js/Express backend.

## Features

*   User authentication (login, registration)
*   Product browsing, searching, and filtering
*   Shopping cart functionality
*   User profiles
*   Admin dashboard for managing products, categories, and brands
*   Contact form

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/)
*   [npm](https://www.npmjs.com/get-npm)
*   [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Saifullahkhan20/PIT_ReactApp.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd PIT_ReactApp
    ```

3.  **Install NPM packages for both the server and the client:**
    ```sh
    npm install
    ```
    This will install dependencies for both the frontend and backend.

4.  **Create a `.env` file in the root of the project.**
    This file will hold your environment variables. You can use the `.env.example` as a template.

    ```
    PORT=5000
    MONGO_URI=<YOUR_MONGODB_URI>
    JWT_SECRET=<YOUR_JWT_SECRET>
    JWT_EXPIRE=30d
    ```

    **Note:** You must replace `<YOUR_MONGODB_URI>` and `<YOUR_JWT_SECRET>` with your actual credentials.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the React app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run server`

Runs the backend Express server on `http://localhost:5000`.

### `npm run dev`

Runs both the client and server concurrently with `concurrently`. This is the recommended way to run the project for development.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Built With

*   [React](https://reactjs.org/) - The web framework used
*   [Node.js](https://nodejs.org/) - Backend runtime environment
*   [Express](https://expressjs.com/) - Backend web framework
*   [MongoDB](https://www.mongodb.com/) - NoSQL Database
*   [Mongoose](https://mongoosejs.com/) - ODM for MongoDB
*   [React Bootstrap](https://react-bootstrap.github.io/) - UI component library
*   [Axios](https://axios-http.com/) - Promise-based HTTP client
