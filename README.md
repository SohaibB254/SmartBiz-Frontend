# SmartBiz

SmartBiz is a **MERN stack business management and marketplace platform** where users can browse products or services, communicate with sellers, and place orders.
At the same time, business owners can create and manage their own businesses, list products or services, and handle customer inquiries and orders.

This project was built as a **full-stack prototype** to simulate how real marketplace platforms manage businesses, listings, inquiries, and orders.

---

# Tech Stack

**Frontend**
- React.js
- CSS
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication & Validation**
- JWT (JSON Web Tokens)
- Zod
- bcrypt

---

# Main Features

## Authentication
- User Sign Up
- User Login
- Secure authentication using **JWT**
- Password hashing using **bcrypt**

---

# Customer Features

### Browse Marketplace
Users can explore a public marketplace containing various **products and services** listed by different businesses.

### Search & Pagination
- Backend powered **search system**
- **Server-side pagination** for efficient data loading
- Filter and browse large numbers of listings smoothly

### Place Orders
Customers can:
- View listing details
- Place orders for products or services
- View full order details and status

### Inquiry System
Before placing an order, users can start an **inquiry conversation** with the seller.

Features include:
- Thread-based messaging
- Ask questions about a product or service
- Continue conversation before purchasing

Users can also **place an order directly from an inquiry conversation**.

### Order Management
Customers can:
- View all their orders
- Track order status
- View order details

---

# Seller Features

### Business Profile
Sellers can create their own **business profile** which includes:
- Business title
- Description
- Business image
- Unique Business ID

### Listings Management
Sellers can:
- Add **products or services**
- Edit listings
- Update business information
- Manage their marketplace presence

### Orders Dashboard
Sellers can:
- View all incoming orders
- View detailed order information
- Update order status
  - Pending
  - Completed
  - Cancelled

### Inquiry Management
Sellers can:
- View all customer inquiries
- Reply to inquiries
- Continue conversations with customers
- Close inquiries once resolved

---

# System Design Concepts

This project implements several **real-world backend concepts**, including:

- RESTful API design
- Authentication using JWT
- Schema validation with Zod
- Secure password hashing
- MongoDB relational referencing
- Server-side pagination
- Inquiry-based communication between users and sellers
- Automatic image deletion when business or products images are updated
---

# Future Improvements

Possible enhancements for the platform include:

- Real-time chat using **WebSockets**
- Payment gateway integration
- Cart and wishlist system
- Ratings and review system
- Notification system
- Image upload with cloud storage
- UI & UX Improvements
---

# Project Purpose

SmartBiz was built as a **learning project and prototype marketplace system** to practice building scalable full-stack applications using the MERN stack.

It demonstrates how modern platforms manage:

- Users
- Businesses
- Listings
- Orders
- Customer inquiries

---

# Author

**Sohaib Zaman**

BS Computer Science Student
Frontend Developer | MERN Stack Learner