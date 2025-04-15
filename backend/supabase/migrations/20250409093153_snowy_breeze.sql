/*
  # Initial Schema for Antique Shop Management System

  1. New Tables
    - `users`: Store user information and authentication
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `full_name` (text)
      - `role` (enum: admin, owner, attendant)
      - `email` (text, unique)
      - `last_login` (timestamp)
      - `status` (enum: active, inactive)
      - Timestamps for created_at, updated_at

    - `inventory`: Track antique items
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `description` (text)
      - `buying_price` (numeric)
      - `selling_price` (numeric)
      - `quantity` (integer)
      - `image_url` (text)
      - Foreign key to users (modified_by)
      - Timestamps for created_at, updated_at

    - `sales`: Record transactions
      - `id` (uuid, primary key)
      - `quantity` (integer)
      - `selling_price` (numeric)
      - `profit` (numeric)
      - `sale_date` (timestamp)
      - Foreign keys to inventory and users
      - Timestamps for created_at

    - `expenses`: Track business expenses
      - `id` (uuid, primary key)
      - `description` (text)
      - `amount` (numeric)
      - `date` (timestamp)
      - `category` (text)
      - Foreign key to users (added_by)
      - Timestamps for created_at

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Secure sensitive information

  3. Indexes
    - Add indexes for frequently queried columns
    - Add indexes for foreign key relationships
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'attendant');
CREATE TYPE user_status AS ENUM ('active', 'inactive');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'attendant',
  email text UNIQUE NOT NULL,
  last_login timestamptz,
  status user_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  buying_price numeric(10,2) NOT NULL CHECK (buying_price >= 0),
  selling_price numeric(10,2) NOT NULL CHECK (selling_price >= 0),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  image_url text,
  modified_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES inventory(id) ON DELETE RESTRICT NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  selling_price numeric(10,2) NOT NULL CHECK (selling_price >= 0),
  profit numeric(10,2) NOT NULL,
  sale_date timestamptz NOT NULL DEFAULT now(),
  attendant_id uuid REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  date timestamptz NOT NULL DEFAULT now(),
  category text NOT NULL,
  added_by uuid REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_modified_by ON inventory(modified_by);
CREATE INDEX IF NOT EXISTS idx_sales_item_id ON sales(item_id);
CREATE INDEX IF NOT EXISTS idx_sales_attendant_id ON sales(attendant_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_added_by ON expenses(added_by);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for inventory table
CREATE POLICY "Everyone can view inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and owners can modify inventory"
  ON inventory
  USING (auth.jwt() ->> 'role' IN ('admin', 'owner'));

-- Create policies for sales table
CREATE POLICY "Users can view all sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create sales records"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'owner', 'attendant'));

-- Create policies for expenses table
CREATE POLICY "Users can view expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and owners can manage expenses"
  ON expenses
  USING (auth.jwt() ->> 'role' IN ('admin', 'owner'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();