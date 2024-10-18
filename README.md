# MediGram

## Prerequisites

Before running the app, make sure you have the following installed:
- Node.js (version 14 or later recommended)
- pnpm (You can install it globally using `npm install -g pnpm`)
- Docker (optional, for containerized deployment)

## Running the App Locally

1. Clone the repository:
   ```
   git clone https://github.com/letladi/medigram.git
   cd medigram
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```
   Replace `your_mongodb_connection_string` with your actual MongoDB connection URL. If you don't have a MongoDB instance, you can set up a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

4. Run the development server:
   ```
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`.

5. For production build:
   ```
   pnpm build
   pnpm start
   ```

6. To run with Docker:
   ```
   docker-compose up -d --build
   ```
   Note: Make sure your `.env.local` file is properly set up before running with Docker.

## Important Notes

- Ensure that your MongoDB instance is running and accessible.
- The MONGODB_URI in your `.env.local` file should be in this format:
  ```
  MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/medigram?retryWrites=true&w=majority
  ```
  Note that the database name is specifically set to `medigram`.
- If you're using MongoDB Atlas, you may need to create the `medigram` database manually or ensure your connection string includes `medigram` as the database name.
- If you're having issues connecting to your database, double-check your connection string and ensure that your IP address is whitelisted in your MongoDB Atlas settings (if you're using Atlas).

For any additional help or information, please refer to the project documentation or contact the maintainers.