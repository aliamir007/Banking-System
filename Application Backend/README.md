# Bank Account Management System with Rule-Based Fraud Detection

A backend banking application built with **Node.js, Express.js, MongoDB, and Mongoose** that provides secure account management, JWT-based authentication, money transfers, role-based authorization, audit logging, and a rule-based fraud detection system.

The project is designed as a backend-focused learning and portfolio project demonstrating how real-world banking operations can be organized using a modular service-based architecture.

---

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Role-based authorization
* Customer and Admin roles
* Current-user endpoint
* Account activation/deactivation checks
* Token expiration support

### Account Management

* Create bank accounts
* Support for:

  * CHECKING
  * SAVINGS
* Automatic unique 10-digit account number generation
* Account balance management
* Account status management
* Currency support with PKR as the default
* Account ownership validation
* Admin account visibility

### Money Transfers

* Transfer money between accounts
* Sender ownership verification
* Receiver account validation
* Insufficient balance protection
* Same-account transfer prevention
* Account status validation
* Transaction reference generation
* Atomic balance updates using MongoDB transactions
* Concurrency-aware balance updates
* Transaction history
* Transaction access control

### Rule-Based Fraud Detection

The system evaluates transactions before completing them using multiple fraud detection rules.

#### Large Amount Detection

Transactions are scored based on configurable thresholds.

* Large transaction
* Critical transaction

#### Rapid Transaction Detection

Detects multiple transactions made by the same account within a configurable time window.

#### Unusual Activity Detection

Compares a transaction against the sender's historical average transaction amount.

#### Account Safety Detection

Checks whether the sender and receiver accounts are active.

### Fraud Risk Scoring

Transactions receive a risk score from `0` to `100`.

| Severity | Risk Score |
| -------- | ---------: |
| LOW      |       0–29 |
| MEDIUM   |      30–59 |
| HIGH     |      60–79 |
| CRITICAL |     80–100 |

The fraud engine determines whether a transaction should be:

* Completed normally
* Completed but flagged
* Blocked and submitted for review

### Fraud Alerts

Administrators can:

* View fraud alerts
* View individual fraud alerts
* Review suspicious transactions
* Change alert status
* Mark alerts as:

  * UNDER_REVIEW
  * RESOLVED
  * FALSE_POSITIVE

### Audit Logging

Important system activities are recorded in an audit log, including:

* User registration
* User login
* Account creation
* Completed transfers
* Flagged transfers
* Fraud alert reviews

Audit records can contain:

* User
* Action
* Resource
* Resource ID
* Metadata
* IP address
* User agent
* Timestamp

### API Response Structure

Successful responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Errors follow a structured format:

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": {
    "code": "ERROR"
  }
}
```

---

# Technology Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js            | Runtime environment           |
| Express.js         | REST API framework            |
| MongoDB            | Database                      |
| Mongoose           | MongoDB ODM                   |
| JWT                | Authentication                |
| bcryptjs           | Password hashing              |
| Helmet             | HTTP security middleware      |
| Morgan             | HTTP request logging          |
| CORS               | Cross-origin request handling |
| express-rate-limit | Rate limiting dependency      |
| dotenv             | Environment configuration     |
| Jest               | Testing framework             |
| Supertest          | API testing                   |

---

# Project Architecture

The project follows a modular backend architecture:

```text
src/
│
├── config/
│   ├── database.js
│   ├── env.js
│   └── jwt.js
│
├── constants/
│   ├── accountStatus.js
│   ├── fraudSeverity.js
│   ├── roles.js
│   └── transactionStatus.js
│
├── controllers/
│   ├── account.controller.js
│   ├── audit.controller.js
│   ├── auth.controller.js
│   ├── fraud.controller.js
│   └── transaction.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── notFound.middleware.js
│   └── role.middleware.js
│
├── models/
│   ├── Account.js
│   ├── AuditLog.js
│   ├── FraudAlert.js
│   ├── Transaction.js
│   └── User.js
│
├── routes/
│   ├── account.routes.js
│   ├── audit.routes.js
│   ├── auth.routes.js
│   ├── fraud.routes.js
│   └── transaction.routes.js
│
├── rules/
│   ├── balance.rule.js
│   ├── largeAmount.rule.js
│   ├── rapidTransactions.rule.js
│   ├── unusualActivity.rule.js
│   └── ruleEngine.js
│
├── services/
│   ├── account.service.js
│   ├── audit.service.js
│   ├── auth.service.js
│   ├── fraud.service.js
│   └── transaction.service.js
│
├── utils/
│   ├── apiResponse.js
│   ├── appError.js
│   ├── asyncHandler.js
│   ├── generateToken.js
│   └── hash.js
│
├── validators/
│   ├── account.validator.js
│   ├── auth.validator.js
│   ├── fraud.validator.js
│   └── transaction.validator.js
│
├── app.js
└── server.js
```

---

# Architecture Overview

```text
                    Client
                      │
                      ▼
                Express REST API
                      │
          ┌───────────┴───────────┐
          │                       │
     Authentication          Authorization
       JWT/Bcrypt             Customer/Admin
          │                       │
          └───────────┬───────────┘
                      │
                 Controllers
                      │
                   Services
                      │
          ┌───────────┼────────────┐
          │           │            │
       Accounts   Transactions   Fraud
          │           │            │
          │       Rule Engine      │
          │           │            │
          └───────────┼────────────┘
                      │
                  Mongoose
                      │
                      ▼
                   MongoDB
                      │
                      ▼
                 Audit Logs
```

---

# Database Models

The system uses five primary MongoDB collections.

### User

Stores application users.

Important fields:

* name
* email
* password
* phone
* role
* isActive
* timestamps

### Account

Stores bank accounts.

Important fields:

* accountNumber
* userId
* accountType
* balance
* currency
* status
* timestamps

### Transaction

Stores money transfer records.

Important fields:

* senderAccount
* receiverAccount
* amount
* type
* status
* reference
* description
* fraudFlagged
* fraudScore
* timestamps

### FraudAlert

Stores suspicious transaction alerts.

Important fields:

* transactionId
* accountId
* rulesTriggered
* riskScore
* severity
* status
* reviewedBy
* reviewedAt

### AuditLog

Stores security and operational events.

Important fields:

* userId
* action
* resource
* resourceId
* metadata
* ipAddress
* userAgent
* createdAt

---

# Fraud Detection Workflow

A transfer follows this general flow:

```text
Transfer Request
       │
       ▼
Validate Request
       │
       ▼
Validate Sender Account
       │
       ▼
Validate Receiver Account
       │
       ▼
Check Balance
       │
       ▼
Run Fraud Rule Engine
       │
       ├───────────────┐
       │               │
       ▼               ▼
  Risk Detected     No Risk
       │               │
       ▼               ▼
Calculate Score    Complete Transfer
       │               │
       ▼               │
Determine Severity    │
       │               │
   ┌───┼────┐          │
   │   │    │          │
  LOW MED  HIGH       │
   │   │    │          │
   │   │    └─► Flag + Alert
   │   │
   │   └────► Complete + Flag
   │
   └────────► Complete
       
CRITICAL
   │
   ▼
Block Transfer
   │
   ▼
Create Fraud Alert
   │
   ▼
Create Audit Log
```

---

# API Endpoints

Base URL:

```text
http://localhost:8000/api/v1
```

## Health Check

| Method | Endpoint  | Authentication |
| ------ | --------- | -------------- |
| GET    | `/health` | No             |

---

## Authentication

| Method | Endpoint         | Authentication |
| ------ | ---------------- | -------------- |
| POST   | `/auth/register` | No             |
| POST   | `/auth/login`    | No             |
| GET    | `/auth/me`       | JWT            |

### Register

```http
POST /api/v1/auth/register
```

Example request:

```json
{
  "name": "Ali Amir",
  "email": "ali@example.com",
  "password": "password123",
  "phone": "03001234567"
}
```

### Login

```http
POST /api/v1/auth/login
```

Example:

```json
{
  "email": "ali@example.com",
  "password": "password123"
}
```

The response returns a JWT token that should be supplied to protected endpoints.

```http
Authorization: Bearer <token>
```

---

# Account Endpoints

| Method | Endpoint                | Authentication |
| ------ | ----------------------- | -------------- |
| POST   | `/accounts`             | JWT            |
| GET    | `/accounts`             | JWT            |
| GET    | `/accounts/:id`         | JWT            |
| GET    | `/accounts/:id/balance` | JWT            |

### Create Account

```http
POST /api/v1/accounts
Authorization: Bearer <token>
```

Example:

```json
{
  "accountType": "SAVINGS",
  "currency": "PKR"
}
```

---

# Transaction Endpoints

| Method | Endpoint                 | Authentication |
| ------ | ------------------------ | -------------- |
| POST   | `/transactions/transfer` | JWT            |
| GET    | `/transactions`          | JWT            |
| GET    | `/transactions/:id`      | JWT            |

### Transfer Money

```http
POST /api/v1/transactions/transfer
Authorization: Bearer <token>
```

Example:

```json
{
  "senderAccount": "1234567890",
  "receiverAccount": "9876543210",
  "amount": 5000,
  "description": "Test transfer"
}
```

---

# Fraud Management Endpoints

These endpoints require an authenticated **ADMIN** user.

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | `/fraud/alerts`            |
| GET    | `/fraud/alerts/:id`        |
| PATCH  | `/fraud/alerts/:id/review` |

### Review Fraud Alert

```http
PATCH /api/v1/fraud/alerts/:id/review
```

Example:

```json
{
  "status": "UNDER_REVIEW"
}
```

Other review statuses include:

```text
RESOLVED
FALSE_POSITIVE
```

---

# Audit Log Endpoints

Admin-only endpoints:

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/audit-logs`     |
| GET    | `/audit-logs/:id` |

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/bank-account-management-system.git
```

Navigate into the project:

```bash
cd bank-account-management-system
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=8000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12

FRAUD_LARGE_AMOUNT=100000
FRAUD_CRITICAL_AMOUNT=500000
FRAUD_RAPID_TRANSACTION_COUNT=5
FRAUD_RAPID_TRANSACTION_WINDOW=5
```

Never commit your `.env` file.

## 4. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:8000
```

## 5. Start in production mode

```bash
npm start
```

---

# Testing with Postman

The API can be tested using Postman.

Recommended testing order:

### Step 1 — Register a customer

```text
POST /api/v1/auth/register
```

### Step 2 — Login

```text
POST /api/v1/auth/login
```

Copy the returned JWT token.

### Step 3 — Authenticate requests

Add:

```text
Authorization: Bearer <JWT_TOKEN>
```

### Step 4 — Create an account

```text
POST /api/v1/accounts
```

Create at least two accounts so transfers can be tested.

### Step 5 — Check accounts

```text
GET /api/v1/accounts
```

### Step 6 — Transfer money

```text
POST /api/v1/transactions/transfer
```

### Step 7 — Test fraud rules

Try transactions that exceed the configured fraud thresholds or trigger rapid-transaction detection.

### Step 8 — Review fraud alerts

Authenticate as an Admin and test:

```text
GET /api/v1/fraud/alerts
```

and:

```text
PATCH /api/v1/fraud/alerts/:id/review
```

---

# Security Features

The project demonstrates several backend security practices:

* JWT authentication
* Password hashing with bcrypt
* Role-based authorization
* Account ownership verification
* Input validation
* Centralized error handling
* HTTP security middleware
* Rate-limiting dependency
* Environment-based secrets
* MongoDB transaction support
* Audit logging
* Fraud detection rules
* Transaction concurrency protection

---

# MongoDB Transactions

Money transfers use MongoDB sessions and transactions to ensure that balance updates and transaction records remain consistent.

For a normal transfer:

```text
Sender Balance
      ↓
Subtract Amount
      ↓
Receiver Balance
      ↓
Add Amount
      ↓
Create Transaction
      ↓
Create Audit Log
      ↓
Commit
```

If an operation fails, the transaction can be rolled back rather than leaving the system in an inconsistent state.

---

# Error Handling

The application uses centralized error handling through:

```text
AppError
asyncHandler
error.middleware
notFound.middleware
```

This allows controllers and services to throw operational errors while keeping API responses consistent.

Example:

```json
{
  "success": false,
  "message": "Insufficient account balance",
  "error": {
    "code": "INSUFFICIENT_BALANCE"
  }
}
```

---

# Environment Configuration

The following variables control the fraud engine:

```env
FRAUD_LARGE_AMOUNT=100000
FRAUD_CRITICAL_AMOUNT=500000
FRAUD_RAPID_TRANSACTION_COUNT=5
FRAUD_RAPID_TRANSACTION_WINDOW=5
```

This makes the fraud rules configurable without changing the source code.

---

# Project Goals

This project was developed to demonstrate practical backend development concepts including:

* REST API development
* Authentication and authorization
* Database modeling
* MongoDB relationships
* Service/controller architecture
* Transaction management
* Fraud detection logic
* Security practices
* Audit logging
* API validation
* Error handling
* Postman API testing

---

# Future Improvements

Possible future improvements include:

* Admin account-management dashboard
* Account freeze/unfreeze endpoints
* Deposit and withdrawal functionality
* Pagination for transactions and audit logs
* Advanced transaction filtering
* Refresh tokens
* Password reset functionality
* Email notifications for fraud alerts
* Rate limiting enforcement at the API layer
* Automated integration tests
* API documentation using Swagger/OpenAPI
* Docker support
* CI/CD pipeline
* More advanced fraud detection models
* Monitoring and observability
* Production deployment

---

# Disclaimer

This project is an educational backend application and is **not intended for use as a real banking system**.

Real financial systems require significantly stronger security controls, compliance requirements, infrastructure, monitoring, encryption, auditing, availability, and regulatory safeguards.

---

# License

This project is licensed under the MIT License.
#
