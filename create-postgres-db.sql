-- PostgreSQL Database Setup for COMPSSA Student Management System
-- Run this script in PostgreSQL to create the database and user

-- Create database
CREATE DATABASE compssa_db;

-- Create user (optional - you can use existing postgres user)
-- CREATE USER compssa_user WITH PASSWORD 'compssa_password';

-- Grant privileges (if using custom user)
-- GRANT ALL PRIVILEGES ON DATABASE compssa_db TO compssa_user;

-- Connect to the database
\c compssa_db;

-- Verify connection
SELECT 'Database compssa_db created successfully!' as status;