# Ecomly Backend Server

RESTful backend API for **Ecomly**, an e-commerce application built with Node.js, Express, and MongoDB.

The backend provides authentication, user management, product and category retrieval, product search, reviews, wishlist/cart data models, order data models, administrative operations, JWT-based authorization, password recovery through email OTPs, and local image upload support.

## Tech Stack

* **Node.js**
* **Express 5**
* **MongoDB**
* **Mongoose**
* **JSON Web Tokens (JWT)**
* **bcryptjs** — password hashing
* **express-validator** — request validation
* **express-jwt** — JWT authentication middleware
* **Multer** — multipart/form-data and image uploads
* **Nodemailer** — password-reset email delivery
* **Google OAuth2** — Gmail authentication for email delivery
* **Morgan** — HTTP request logging
* **CORS**
* **dotenv**
* **Nodemon** — development server

## Features

### Authentication

* User registration
* User login
* JWT access tokens
* Long-lived refresh tokens
* Token persistence and revocation through MongoDB
* Protected API routes
* Admin authorization
* Password reset through email OTP
* OTP expiration
* Password hashing with bcrypt

### Products

* Retrieve products
* Retrieve a product by ID
* Product pagination
* Category filtering
* "New Arrivals" filtering
* Popular-product filtering based on rating
* Product search
* Product ratings and review counts
* Product categories
* Product images
* Product variants such as sizes and colours

### Reviews

* Authenticated users can leave reviews
* One review per user per product
* Product-specific review retrieval
* Review pagination
* Reviews sorted by newest first
* Reviewer information populated from the User collection
* Product rating aggregation
* Product review count aggregation

### Users

* Retrieve users
* Retrieve an individual user
* Update user information
* Administrative user count
* Administrative user deletion

### Categories

* Retrieve all categories
* Retrieve a category by ID
* Image upload support for categories

### E-commerce Data Models

The project also contains Mongoose models for:

* Cart products
* Orders
* Order items
* Products
* Categories
* Reviews
* Users
* Authentication tokens

Some of these models are currently used by administrative functionality or are prepared for future API functionality.

---

# Architecture

The application follows a relatively straightforward Express MVC-style structure:

```text
Client
   │
   │ HTTP Request
   ▼
Express Application
   │
   ├── Authentication Middleware
   │
   ├── Routes
   │
   ├── Controllers
   │
   └── Mongoose Models
             │
             ▼
          MongoDB
```

The project separates responsibilities into:

```text
routes/
    Define API endpoints

controllers/
    Implement request/business logic

models/
    Define MongoDB schemas

middlewares/
    Authentication and error handling

helpers/
    Reusable services such as email and file uploads

app.js
    Application configuration and server/database startup
```

## Project Structure

```text
Ecomly_Backend_Server/
│
├── app.js
├── package.json
├── .env.example
├── .gitignore
│
├── controllers/
│   ├── auth_controller.js
│   ├── categoriesController.js
│   ├── product_controller.js
│   ├── reviews_controller.js
│   ├── user_controller.js
│   │
│   └── admin/
│       ├── categories.js
│       └── users.js
│
├── helpers/
│   ├── email-sender.js
│   ├── generate-token.js
│   ├── media_helper.js
│   └── credentials_example.json
│
├── middlewares/
│   ├── jwt.js
│   └── error_handler.js
│
├── models/
│   ├── cart_product.js
│   ├── category.js
│   ├── order.js
│   ├── order_item.js
│   ├── product.js
│   ├── review.js
│   ├── token.js
│   └── user.js
│
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── categories.js
│   ├── product.js
│   └── users.js
│
└── public/
    └── uploads/
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB

You can use either a local MongoDB instance or a MongoDB deployment such as MongoDB Atlas.

## Installation

Clone the repository:

```bash
git clone https://github.com/JBAyoub/Ecomly-Backend-Server.git
```

Move into the project directory:

```bash
cd Ecomly-Backend-Server
```

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

On Windows, you can create `.env` manually based on `.env.example`.

---

# Environment Variables

The application expects the following variables:

```env
HOSTNAME=
PORT=
MONGODB_CONNECTION_STRING=
API_URL=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

EMAIL_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

### `HOSTNAME`

The hostname/interface on which the Express server listens.

Example:

```env
HOSTNAME=0.0.0.0
```

### `PORT`

The HTTP port used by the Express server.

Example:

```env
PORT=3000
```

### `MONGODB_CONNECTION_STRING`

MongoDB connection string.

Example:

```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/ecomly
```

For production, this can point to a MongoDB Atlas deployment or another managed MongoDB instance.

### `API_URL`

Base API path.

For example:

```env
API_URL=/api/v1
```

This produces endpoints such as:

```text
/api/v1/login
/api/v1/products
/api/v1/users
```

### `ACCESS_TOKEN_SECRET`

Secret used to sign JWT access tokens.

### `REFRESH_TOKEN_SECRET`

Secret used to sign JWT refresh tokens.

These secrets should be long, random values and should never be committed to source control.

### Email Configuration

The password recovery system uses Gmail through OAuth2.

```env
EMAIL_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

The Gmail OAuth credentials are used by Nodemailer to send password-reset OTP emails.

---

# Running the Server

Development:

```bash
npm start
```

The `start` script uses Nodemon:

```json
"start": "nodemon app.js"
```

The application connects to MongoDB during startup and then starts the Express HTTP server.

---

# Authentication

The application uses a combination of access tokens and refresh tokens.

## Access Token

After successful login, the server generates an access token containing the user's identity and admin status.

Conceptually:

```json
{
    "userId": "...",
    "isAdmin": false
}
```

The access token currently expires after 24 hours.

Clients send it using:

```http
Authorization: Bearer <access_token>
```

## Refresh Token

A refresh token is generated alongside the access token and expires after 60 days.

Refresh tokens are persisted in MongoDB through the `Token` model.

This allows the server to revoke/validate tokens against the database rather than relying exclusively on JWT signature validation.

## Authentication Middleware

Protected requests pass through the JWT middleware.

The middleware:

1. Extracts the Bearer token.
2. Verifies the JWT.
3. Checks whether the token exists in MongoDB.
4. Checks whether the requesting user has administrative privileges when accessing admin routes.
5. Allows the request to continue if authentication succeeds.

Authentication is applied globally, with specific authentication endpoints excluded from JWT verification.

---

# API Reference

Assuming:

```env
API_URL=/api/v1
```

the following endpoints are available.

## Authentication

### Register

```http
POST /api/v1/register
```

Creates a new user.

Example request:

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPassword!",
    "phone": "+123456789"
}
```

Password requirements include:

* At least 8 characters
* At least one uppercase character
* At least one symbol

The phone number and email are also validated.

The password is hashed with bcrypt before being stored.

---

### Login

```http
POST /api/v1/login
```

Authenticates an existing user.

Example:

```json
{
    "email": "john@example.com",
    "password": "StrongPassword!"
}
```

A successful login returns the user information and an access token.

The backend also creates a refresh token and stores the token pair in MongoDB.

---

### Forgot Password

```http
POST /api/v1/forgot-password
```

Starts the password recovery process.

Example:

```json
{
    "email": "john@example.com"
}
```

The server generates an OTP and sends it to the user's email.

The OTP expires after 10 minutes.

---

### Verify OTP

```http
POST /api/v1/verify-otp
```

Verifies the password-reset OTP.

Example:

```json
{
    "email": "john@example.com",
    "otp": 12345
}
```

---

### Reset Password

```http
POST /api/v1/reset-password
```

Resets the password after successful OTP verification.

Example:

```json
{
    "email": "john@example.com",
    "newPassword": "NewStrongPassword!"
}
```

The new password is hashed with bcrypt.

---

### Verify Token

```http
GET /api/v1/verify-token
```

Checks whether the provided authentication token is valid.

The token is provided through:

```http
Authorization: Bearer <token>
```

---

# Products

## Get Products

```http
GET /api/v1/products
```

Returns a paginated list of products.

Default page size:

```text
10 products
```

### Pagination

```http
GET /api/v1/products?page=2
```

### Category Filtering

```http
GET /api/v1/products?category=<categoryId>
```

### New Arrivals

```http
GET /api/v1/products?criteria=newArrivals
```

New arrivals are currently defined as products added within the previous 14 days.

### Popular Products

```http
GET /api/v1/products?criteria=Popular
```

Popular products are currently determined by a rating of at least `4.5`.

### Combined Filtering

Filtering can be combined with a category:

```http
GET /api/v1/products?criteria=Popular&category=<categoryId>
```

---

## Search Products

```http
GET /api/v1/products/search?q=<searchTerm>
```

Searches products using the supplied search term.

Pagination is supported:

```http
GET /api/v1/products/search?q=shoes&page=1&pageSize=10
```

The search currently matches the product name and description using a case-insensitive regular expression.

Supported parameters:

| Parameter  | Description       |  Default |
| ---------- | ----------------- | -------: |
| `q`        | Search term       | Required |
| `page`     | Page number       |      `1` |
| `pageSize` | Number of results |     `10` |

The maximum page size is `100`.

---

## Get Product

```http
GET /api/v1/products/:id
```

Returns a single product.

Example:

```http
GET /api/v1/products/64abc123...
```

The endpoint validates invalid MongoDB IDs and returns `400 Bad Request` for malformed IDs.

A missing product returns `404 Not Found`.

---

# Reviews

Reviews use a relationship where the review stores references to both the product and the user.

Conceptually:

```text
User
  │
  └──── Review ──── Product
```

This allows products to have an arbitrary number of reviews without maintaining a large array of review IDs inside the Product document.

## Leave a Review

```http
POST /api/v1/products/:id/reviews
```

Requires authentication.

Example:

```json
{
    "rating": 5,
    "comment": "Great product!"
}
```

The authenticated user's ID is taken from the JWT rather than being trusted from the request body.

The server:

1. Verifies that the product exists.
2. Checks whether the user has already reviewed the product.
3. Validates the rating.
4. Creates the review.
5. Updates the product's rating.
6. Updates the product's review count.

Ratings must be between `1` and `5`.

The Review schema also contains a compound unique index:

```text
product + user
```

which prevents the same user from having multiple reviews for the same product at the database level.

---

## Get Product Reviews

```http
GET /api/v1/products/:id/reviews
```

Returns reviews belonging to a specific product.

Pagination:

```http
GET /api/v1/products/:id/reviews?page=1&pageSize=10
```

Reviews are sorted from newest to oldest.

Reviewer names are populated from the User collection.

Example response:

```json
{
    "reviews": [
        {
            "_id": "...",
            "product": "...",
            "user": {
                "_id": "...",
                "name": "John Doe"
            },
            "rating": 5,
            "comment": "Great product!",
            "date": "2026-08-29T12:00:00.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "pageSize": 10,
        "total": 25,
        "totalPages": 3
    }
}
```

---

# Users

## Get Users

```http
GET /api/v1/users/admin/all
```

Returns user information intended for administrative use.

Admin authorization is required.

Returned fields include:

* Name
* Email
* ID
* Admin status

---

## Get User

```http
GET /api/v1/users/:id
```

Returns a user's public information.

Sensitive fields such as:

* Password hash
* Password reset information
* Admin status
* Cart

are excluded from this response.

---

## Update User

```http
PUT /api/v1/users/:id
```

Updates user information.

Supported fields include:

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+123456789"
}
```

---

# Categories

## Get Categories

```http
GET /api/v1/categories
```

Returns all categories.

---

## Get Category

```http
GET /api/v1/categories/getCategory/:id
```

Returns a category by its MongoDB ID.

---

# Admin API

Administrative routes are mounted under:

```text
/api/v1/admin
```

Administrative requests require an authenticated user with:

```json
{
    "isAdmin": true
}
```

## Get User Count

```http
GET /api/v1/admin/users/count
```

Returns the total number of users.

Example response:

```json
{
    "userCount": 42
}
```

---

## Delete User

```http
DELETE /api/v1/admin/users/:id
```

Deletes a user and associated data.

The current implementation also removes:

* The user's orders
* Associated order items
* Cart products
* Stored authentication token

---

# Data Models

## User

The User model contains:

* Name
* Email
* Password hash
* Address information
* Phone
* Admin status
* Password reset OTP
* Password reset expiration
* Cart references
* Wishlist items

The email field has a unique MongoDB index.

Passwords are never intended to be stored in plaintext.

---

## Product

Products contain:

* Name
* Description
* Price
* Rating
* Primary image
* Additional images
* Colours
* Sizes
* Category
* Gender category
* Stock count
* Date added
* Number of reviews

The Product model also has a text index over:

```text
name
description
```

The application currently performs product search using a regular expression query.

---

## Review

Reviews contain:

```text
product
user
userName
rating
comment
date
```

The `product` field references the Product collection.

The `user` field references the User collection.

A database-level compound unique index prevents duplicate reviews from the same user for the same product:

```text
{ product: 1, user: 1 }
```

---

## Category

Categories contain:

* Name
* Color
* Image
* Deletion marker

---

## Cart Product

Cart products contain:

* Product reference
* Quantity
* Selected size
* Selected colour
* Product name
* Product image
* Product price
* Reservation expiration
* Reservation status

---

## Order

Orders contain:

* Order items
* Shipping address
* City
* Postal code
* Country
* Phone
* Payment ID
* Order status
* Status history
* Total price
* User reference
* Order date

Supported statuses include:

```text
pending
processed
shipped
out for delivery
delivered
cancelled
on-hold
expired
```

---

## Order Item

Order items contain:

* Product reference
* Quantity
* Product name
* Product image
* Product price
* Selected size
* Selected colour

Product information is copied into the order item so that historical order data can retain the information associated with the purchase.

---

## Token

Authentication tokens contain:

* User ID
* Access token
* Refresh token
* Creation date

Tokens automatically expire from MongoDB after 60 days through a TTL index.

---

# File Uploads

The project includes a Multer-based image upload helper.

Supported image types currently include:

```text
image/png
image/jpeg
image/jpg
```

Uploads are limited to:

```text
5 MB
```

Files are currently stored locally under:

```text
public/uploads
```

The application exposes the public directory through:

```text
/public
```

The current upload implementation is primarily used by the category administration code.

For a horizontally scaled production deployment, local filesystem storage would generally be replaced with object storage such as Amazon S3, Cloudflare R2, Google Cloud Storage, or Azure Blob Storage.

---

# Password Reset Email System

Password recovery uses:

```text
Nodemailer
      │
      ▼
Google OAuth2
      │
      ▼
Gmail
```

The application generates an OTP, stores it against the user account, sets an expiration time, and sends the OTP to the user's email.

The project also includes `helpers/generate-token.js`, which is used to obtain a Google OAuth refresh token for the Gmail integration.

Google credentials should never be committed to the repository.

---

# HTTP Error Handling

The application contains a centralized error-handling middleware responsible primarily for authentication-related errors.

JWT expiration is handled by attempting to validate the stored refresh token and generate a new access token.

Authentication failures are returned with appropriate HTTP status codes such as:

```text
401 Unauthorized
403 Forbidden
404 Not Found
```

Individual controllers also perform resource validation and return errors for conditions such as:

* Missing resources
* Invalid product IDs
* Duplicate reviews
* Invalid request data
* Database failures

---

# Security Considerations

The application currently implements several important security mechanisms:

* Password hashing using bcrypt
* JWT authentication
* Refresh-token persistence
* Token revocation through MongoDB
* Admin authorization
* Request validation using `express-validator`
* File upload size limits
* File MIME-type restrictions
* Sensitive user fields excluded from public responses
* Unique email index
* Unique user/product review constraint

Environment variables are used for:

* Database credentials
* JWT secrets
* Email credentials
* Google OAuth credentials

These values should remain outside source control.

---

# Example Request Flow

A typical authenticated review workflow looks like:

```text
Flutter / Web Client
        │
        │ POST /products/:id/reviews
        │ Authorization: Bearer <JWT>
        │
        ▼
JWT Middleware
        │
        │ authenticate user
        ▼
Review Controller
        │
        ├── Check product
        ├── Check existing review
        ├── Validate rating
        │
        ▼
MongoDB
        │
        ├── Create Review
        │
        └── Update Product
              ├── rating
              └── numberOfReviews
```

Fetching reviews:

```text
Client
  │
  │ GET /products/:id/reviews?page=1&pageSize=10
  ▼
Review Controller
  │
  ▼
MongoDB
  │
  ├── Find reviews for product
  ├── Populate user name
  ├── Sort by date
  ├── Apply pagination
  └── Count total reviews
  │
  ▼
JSON Response
```

---

# Production Considerations

The project provides the foundation for a production-style e-commerce backend, but several areas would be natural next steps before deploying at significant scale.

### File Storage

The current Multer configuration stores images on the application server:

```text
public/uploads
```

A production deployment with multiple application instances would generally use object storage and a CDN instead.

### Transactions

Review creation and product rating updates are currently separate database operations.

A transaction can be introduced so that creating the review and updating the product aggregate either both succeed or both fail.

### Validation

Additional schema and request validation can be introduced for fields such as:

* Product IDs
* User IDs
* Review comments
* Prices
* Stock quantities
* Addresses

### Pagination

The API already uses pagination for products and reviews.

For extremely large datasets, cursor-based pagination can eventually replace large `skip()` offsets.

### Rate Limiting

Authentication and password-reset endpoints would benefit from rate limiting to reduce brute-force and abuse risks.

### Logging

The project currently uses Morgan and console logging. A structured logging system can be introduced for production observability.

### API Documentation

An OpenAPI/Swagger specification could be added to make the API easier for frontend developers and external clients to consume.

---

# Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The project uses Nodemon, so the server automatically restarts when source files change.

---

# License

This project currently uses the `ISC` license as specified in `package.json`.
