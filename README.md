# Node.js Web Service Documentation

Table of Contents

1. Introduction

2. Getting Started
    - Installation
    - Running the Application
    - Environment Variables

3. API Endpoints
   - User Registration
   - User Login
   - Wallet Management
   - Transaction PIN Management
   - Donations
   - Thank You Messages
   - Viewing Donations

4. Security
   - NoSQL Injection

5. Pagination

6. Deployment

<br />


## Introduction

This web service is designed to allow users to create accounts, manage wallets, and make donations to other users. 
The service also includes NoSQL injection prevention for security measures, and comprehensive API documentation. 
The service is deployed on Render and can be consumed by any client.

<br />

## Getting Started
1. Installation
   ```
   git clone https://github.com/areel007/fastamoni.git
   
   cd fastamoni
   ```

2. ```
   npm install
   npm run start:dev
   ```
   
      ```PORT=your-port
   
      MONGODB_URI=you-mongodb-uri
   
      JWT_SECRET=your-jwt-secret
   
      EMAIL=your-email
   
    PASSWORD=your-gmail-app-password
   ```
3. API Endpoints
   - User Registration
     
     - Endpoint: `POST /api/auth/register`
     - Description: Allows a user to create an account
     - Request body: `
       { "name": "string", "email": "string", "password": "string" }`
     - Response: `{ "message": "User registered successfully" }`

   - User Login
     
     - Endpoint: `POST /api/auth/login`
     - Description: Allows a user to log in.
     - Request body: `
       { "email": "string", "password": "string" }`
     - Response: `{ "token": "string", "_id": "string", "email": "string", "name": "string" }`
    
  - Transaction PIN Management
     
     - Endpoint: `POST /api/auth/set-transaction-pin`
     - Description: Allows a user to create or update a transaction PIN.
     - Request body: `
       { "pin": "string" }`
     - Response: `{ "message": "Transaction PIN set successfully" }`
   
   - Donations
     
     - Endpoint: `POST /api/make-donation`
     - Description: Allows a user to create a donation to another user.
     - Request body: `
       { "beneficiaryId": "string", "amount": "number", "transactionPIN": "string" }`
     - Response: `{ "donor": "string", "beneficiary": "string", "amount": "number" }`
    
  - Viewing Donations
     
     - Endpoint: `GET /api/make-donation`
     - Description: View all donations made by a particular user.
     - Query Parameters:
       - page: Page number for pagination, limit: Number of items per page
     - Response: `[{ "_id": "string", "donor": "string", "beneficiary": "string", "amount": "number", "createdAt": "Date", "updatedAt": "Date" }]`
   
  - Single Donation

    - Endpoint: `GET /api/make-donation/:id`
     - Description: View a single donation made to a beneficiary.
     - Response: `{ "_id": "string", "donor": "string", "beneficiary": "object", "amount": "number", "createdAt": "Date", "updatedAt": "Date" }`
   
  <br />

## Security
  - NoSQL Injection Prevention
    - All inputs are validated and sanitized using libraries like mongo-sanitizer
   
  - Additional Security Measures
    - Utilized JWT for secure authentication.

<br />

## Pagination
  - Pagination is implemented on endpoints that return lists of resources, such as donation history. Use "page" and "limit" query parameters to navigate through results.

## Deployment
  - The service is deployed on Render. For deployment, configure the environment variables as specified.
