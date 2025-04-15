# Antique Shop Management System

A comprehensive management system for antique shops built with React, TypeScript, and Supabase. This system helps manage inventory, sales, expenses, and provides detailed analytics and reporting.

## Features

### 🔐 User Management
- Role-based authentication (Admin, Owner, Attendant)
- User profile management
- Activity tracking
- Permission-based access control

### 📦 Inventory Management
- Item tracking with detailed information
- Category management
- Low stock alerts
- Image upload and management
- Stock history

### 💰 Sales Management
- Point of Sale (POS) interface
- Real-time inventory updates
- Sales history
- Profit calculation
- Attendant performance tracking

### 💳 Expense Tracking
- Expense categorization
- Receipt management
- Budget tracking
- Expense reports

### 📊 Analytics & Reporting
- Sales analytics
- Profit analysis
- Inventory valuation
- Expense summaries
- Custom date range reports

### 🔔 Notifications
- System alerts
- Low stock notifications
- Sales milestones
- Custom notification preferences

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - React Router
  - Zustand (State Management)
  - React Hook Form
  - Recharts (Charts)
  - React Hot Toast

- **Backend:**
  - Node.js
  - Express
  - Prisma (ORM)
  - Supabase (Auth & Database)
  - Winston (Logging)
  - Zod (Validation)

- **Testing:**
  - Vitest
  - Supertest

## Prerequisites

- Node.js 18+
- Supabase Account
- PostgreSQL Database

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/antique_shop?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/antique_shop?schema=public"

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd antique-shop-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run prisma:generate
npm run prisma:push
```

4. Start the development server:
```bash
# Start the frontend
npm run dev

# Start the backend
npm run server:dev
```

## Project Structure

```
├── src/
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Shared utilities
│   ├── server/            # Backend server
│   │   ├── config/        # Server configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── tests/         # Server tests
│   │   └── utils/         # Server utilities
│   ├── store/             # State management
│   └── types/             # TypeScript types
├── prisma/                # Database schema
└── supabase/             # Supabase migrations
```

## API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/deactivate` - Deactivate user

### Inventory
- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Create new item
- `GET /api/inventory/:id` - Get item details
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Sales
- `POST /api/sales` - Create new sale
- `GET /api/sales` - Get all sales
- `GET /api/sales/date-range` - Get sales by date range
- `GET /api/sales/stats` - Get sales statistics

### Expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/stats` - Get expense statistics
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Reports
- `GET /api/reports/sales-summary` - Get sales summary
- `GET /api/reports/profit-analysis` - Get profit analysis
- `GET /api/reports/inventory-value` - Get inventory value
- `GET /api/reports/expense-summary` - Get expense summary

## Testing

Run the test suite:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.# Point-of-sale
