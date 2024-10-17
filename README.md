# MediGram

## Running the App Locally

1. Clone the repository:
   ```
   git clone https://github.com/letladi/medigram.git
   cd medigram
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

5. For production build:
   ```
   npm run build
   npm start
   ```

6. To run with Docker:
   ```
   docker-compose up -d --build
   ```

Make sure you have Node.js, npm, and Docker installed on your machine.