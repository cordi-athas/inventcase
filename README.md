## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd library-management
```

2. Install dependencies:

For the server:

```bash
cd server
npm install
```

For the client:

```bash
cd client
npm install
```

3. Set up the database:

```bash
cd server
npx prisma migrate dev
npx prisma generate
npm run prisma:seed
```

## Environment Setup

1. Create a `.env` file in the server directory:

```
PORT=3001
NODE_ENV=development
```

## Running the Application

1. Start the server:

```bash
cd server
npm run dev
```

2. Start the client:

```bash
cd client
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## API Documentation

### Users

- GET `/users` - Get all users
- GET `/users/:id` - Get user details
- POST `/users/:userId/borrow/:bookId` - Borrow a book
- POST `/users/:userId/return/:bookId` - Return a book with rating

### Books

- GET `/books` - Get all books
- GET `/books/:id` - Get book details

## Available Scripts

### Server

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database

### Client

- `npm run start` - Start development server
