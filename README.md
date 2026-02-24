# Bank Simulation App

A full-stack bank simulation application with JWT authentication, MySQL database, and React frontend.

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Secure Token Storage**: JWT tokens stored in database with expiration
- **Bank Operations**: Check balance and transfer money
- **Transaction History**: View all transactions
- **Modern UI**: Responsive design with Tailwind CSS
- **Security**: Password hashing, rate limiting, CORS protection

## Tech Stack

### Backend
- Node.js with Express.js
- MySQL database with Aiven cloud hosting
- JWT authentication with database token storage
- bcryptjs for password hashing
- Helmet for security headers
- Rate limiting for API protection

### Frontend
- React 18 with React Router
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

## Database Schema

### Users Table
- id, username, email, password_hash
- full_name, account_number, balance
- created_at, updated_at

### User Tokens Table
- id, user_id, token_hash, expires_at
- created_at, is_active

### Transactions Table
- id, from_account, to_account, amount
- transaction_type, description, created_at

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
DB_HOST=mysql-348b4ad6-adilpashags-a1ac.i.aivencloud.com
DB_PORT=22837
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=defaultdb
JWT_SECRET=your-secret-key
PORT=5000
```

4. Set up the database:
```bash
mysql -h mysql-348b4ad6-adilpashags-a1ac.i.aivencloud.com -P 22837 -u your_username -p defaultdb < database.sql
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Banking Operations
- `GET /api/bank/balance` - Check account balance
- `POST /api/bank/transfer` - Transfer money
- `GET /api/bank/transactions` - Get transaction history

## Security Features

- JWT tokens stored in database with expiration
- Password hashing with bcryptjs
- Rate limiting to prevent abuse
- CORS configuration
- Helmet security headers
- SQL injection prevention with parameterized queries
- Input validation and sanitization

## Usage

1. Register a new account or login with existing credentials
2. View your account balance
3. Transfer money to other accounts
4. View transaction history
5. Secure logout with token invalidation

## Default Test Users

The database includes sample users for testing:
- Username: `john_doe`, Account: `ACC001`, Balance: $5000
- Username: `jane_smith`, Account: `ACC002`, Balance: $3000

Note: You'll need to set actual passwords for these users in the database.

## Development

The application uses:
- Backend runs on port 5000
- Frontend runs on port 3000
- MySQL database on Aiven cloud
- JWT tokens with 24-hour expiration
