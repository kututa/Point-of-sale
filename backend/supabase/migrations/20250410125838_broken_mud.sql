/*
  # Add Notification System Tables

  1. New Tables
    - `notifications`: Store system notifications
      - `id` (uuid, primary key)
      - `type` (notification_type enum)
      - `title` (text)
      - `message` (text)
      - `priority` (notification_priority enum)
      - `link` (text, optional)
      - `role_access` (user_role[], optional)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `read_by` (uuid[], store IDs of users who read the notification)

    - `notification_preferences`: Store user notification settings
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `enable_email_notifications` (boolean)
      - `notification_types` (jsonb, store enabled notification types)
      - `summary_frequency` (text)
      - Timestamps for created_at, updated_at

  2. Security
    - Enable RLS on both tables
    - Add policies for different user roles
    - Secure access to notification preferences

  3. Indexes
    - Add indexes for frequently queried columns
    - Add indexes for foreign key relationships
*/

-- Create notification type enum
CREATE TYPE notification_type AS ENUM (
  'SYSTEM',
  'INVENTORY',
  'SALES',
  'USER',
  'EXPENSE'
);

-- Create notification priority enum
CREATE TYPE notification_priority AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH'
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'LOW',
  link text,
  role_access user_role[],
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_by uuid[] DEFAULT ARRAY[]::uuid[]
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  enable_email_notifications boolean NOT NULL DEFAULT true,
  notification_types jsonb NOT NULL DEFAULT '{
    "SYSTEM": true,
    "INVENTORY": true,
    "SALES": true,
    "USER": true,
    "EXPENSE": true
  }'::jsonb,
  summary_frequency text NOT NULL DEFAULT 'daily',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_created_by ON notifications(created_by);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications table
CREATE POLICY "Users can view notifications for their role"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (
    role_access IS NULL OR
    auth.jwt() ->> 'role' = ANY (role_access::text[])
  );

CREATE POLICY "Admins can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for notification preferences table
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();