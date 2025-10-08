# Studo.ps Admin Access

## Admin Login Credentials

**Email:** jibreel@studo.ps  
**Password:** 12345

## Setup Instructions

1. **First Time Setup:**
   - Go to `/auth/signup` and create an account with the email: `admin@studo.ps`
   - Use the password: `StudoAdmin2024!`
   - After signing up, run the SQL script `scripts/04-create-admin-user.sql` to grant admin privileges

2. **Access Admin Dashboard:**
   - Navigate to `/admin` after logging in
   - You'll have full access to:
     - Product Management (Add/Edit/Delete products)
     - Category Management
     - Banner Management (Promotional offers)
     - Order Management (View all customer orders)
     - User Management

3. **Database Setup:**
   - Run all SQL scripts in order:
     1. `scripts/01-create-tables.sql` - Creates all database tables
     2. `scripts/02-enable-rls.sql` - Enables Row Level Security
     3. `scripts/03-seed-data.sql` - Seeds initial categories
     4. `scripts/05-seed-sample-products.sql` - Adds sample products
     5. `scripts/06-seed-promotional-banners.sql` - Adds promotional banners
     6. `scripts/07-update-banners-schema.sql` - Updates banner schema
     7. `scripts/04-create-admin-user.sql` - Grants admin access (after signup)

## Features

### Product Management
- Add new products with images, pricing, and inventory
- Edit existing products
- Toggle product visibility
- Mark products as featured
- Manage stock quantities

### Banner Management
- Maximum 3 active banners (1 large, 2 small)
- Large banner auto-rotates every 5 seconds if multiple offers exist
- Upload custom images for each banner
- Set custom badge text, titles, and CTAs

### Order Management
- View all customer orders with full details
- See customer information and delivery addresses
- Track order status and payment status
- View ordered products with images and quantities

### Delivery Options
- Free delivery to Birzeit University
- Free pickup from Billin village  
- ₪20 delivery to customer's house

## Currency
All prices are displayed in Israeli Shekel (₪)

## Contact Information
- Instagram: @studo.ps
- WhatsApp: +972599765211
