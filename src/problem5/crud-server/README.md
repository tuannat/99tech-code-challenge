# CRUD Server

A TypeScript-based Express.js REST API server providing full CRUD operations for resource management with SQLite database persistence.

## Features

### Core Functionality
- **Full CRUD Operations**: Create, Read, Update, Delete resources with comprehensive API
- **Advanced Filtering**: Filter resources by category, status, and search terms with optional parameters

### Security & Performance
- **Security Headers**: Helmet.js for protection against common vulnerabilities
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Development & Operations
- **TypeScript**: Full type safety throughout the application
- **SQLite Database**: Lightweight, file-based database for data persistence
- **Request Logging**: Comprehensive request logging with Morgan
- **Sample Data**: Rich dataset with 30+ realistic resources for testing
- **Database Seeding**: Automated script to populate sample data

## Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd crud-server
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```
   
3. **Environment Setup:**
   Copy the `.env` file and modify if needed:
   ```bash
   # The .env file is already created with default values:
   PORT=3000
   NODE_ENV=development
   DB_PATH=./database.sqlite
   ```

## Quick Start

Get up and running in 3 simple steps:

```bash
# 1. Install dependencies
pnpm install

# 2. Seed the database with sample data
pnpm seed

# 3. Start the development server
pnpm dev
```

Then open http://localhost:3000 in your browser to access the web interface!

## Running the Application

### Development Mode
```bash
pnpm dev
```
This starts the server with hot-reload using ts-node-dev.

**Access the application:**
- **Web UI**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

### Production Mode
```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Other Scripts
```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Database seeding
pnpm seed
```

## Sample Data

The application includes a seeding script that populates the database with 30+ diverse sample resources for testing and demonstration purposes.

### Running the Seed Script
```bash
pnpm seed
```

### Sample Data Categories
- **Electronics**: Laptops, phones, monitors, headphones, tablets, mice
- **Furniture**: Office chairs, desks, standing desk converters
- **Software**: Design tools, development IDEs, productivity apps
- **Office Supplies**: Notebooks, pens, sticky notes, staplers, organizers
- **Books & Learning**: Programming books, design books, online courses
- **Networking**: Access points, cables, hubs
- **Storage**: NAS devices, organizers
- **Health & Ergonomics**: Blue light glasses, ergonomic accessories

### Features
- **Realistic Data**: Professional descriptions and real product names
- **Status Variety**: Mix of active and inactive resources
- **Category Diversity**: 10+ different categories for comprehensive testing
- **Filtering Testing**: Perfect for testing search and filter functionality

## Web UI

The application includes a modern, responsive web interface that provides a user-friendly way to manage resources.

### Features:
- **📋 Resource Management**: Create, view, edit, and delete resources with modal dialogs
- **🔍 Advanced Search**: Real-time search by name or description with debouncing
- **🏷️ Category Filtering**: Optional category filtering with auto-populated dropdowns
- **📊 Status Filtering**: Filter by active/inactive status with validation
- **📄 Smart Pagination**: Navigate through large datasets with metadata
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **⚡ Real-time Updates**: Instant feedback with toast notifications
- **🎨 Modern Design**: Clean, gradient-based interface with animations
- **🛡️ Security Compliant**: CSP-compliant with no inline event handlers
- **✅ Input Validation**: Client-side and server-side validation with clear error messages

### Usage:
1. **Navigate to** http://localhost:3000 in your browser
2. **Create resources** using the form at the top
3. **View all resources** in the grid layout below
4. **Filter resources** using the search and dropdown controls
5. **Edit resources** by clicking the "Edit" button on any resource card
6. **Delete resources** by clicking the "Delete" button (with confirmation)

## API Documentation

Base URL: `http://localhost:3000/api`

### Health Check
```http
GET /health
```
Returns server status and timestamp.

### Resources API

#### 1. Create a Resource
```http
POST /api/resources
Content-Type: application/json

{
  "name": "Sample Resource",
  "description": "A sample resource for testing",
  "category": "electronics",
  "status": "active"
}
```

**Request Body:**
- `name` (string, required): Resource name (1-255 characters)
- `description` (string, required): Resource description (1-1000 characters)
- `category` (string, required): Resource category (1-100 characters)
- `status` (string, optional): Resource status ("active" or "inactive", defaults to "active")

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sample Resource",
    "description": "A sample resource for testing",
    "category": "electronics",
    "status": "active",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

#### 2. List Resources with Filters
```http
GET /api/resources?category=electronics&status=active&search=sample&limit=10&offset=0
```

**Query Parameters:**
- `category` (string, optional): Filter by category
- `status` (string, optional): Filter by status ("active" or "inactive")
- `search` (string, optional): Search in name and description
- `limit` (number, optional): Number of results per page (1-100, default: 20)
- `offset` (number, optional): Number of results to skip (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sample Resource",
      "description": "A sample resource for testing",
      "category": "electronics",
      "status": "active",
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

#### 3. Get Resource Details
```http
GET /api/resources/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sample Resource",
    "description": "A sample resource for testing",
    "category": "electronics",
    "status": "active",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

#### 4. Update Resource
```http
PUT /api/resources/:id
Content-Type: application/json

{
  "name": "Updated Resource Name",
  "status": "inactive"
}
```

**Request Body:**
All fields are optional. Only provided fields will be updated.
- `name` (string, optional): Resource name (1-255 characters)
- `description` (string, optional): Resource description (1-1000 characters)
- `category` (string, optional): Resource category (1-100 characters)
- `status` (string, optional): Resource status ("active" or "inactive")

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Resource Name",
    "description": "A sample resource for testing",
    "category": "electronics",
    "status": "inactive",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
}
```

#### 5. Delete Resource
```http
DELETE /api/resources/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

**Common HTTP Status Codes:**
- `400`: Bad Request (validation errors, invalid input)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Database Schema

The SQLite database contains a `resources` table with the following structure:

```sql
CREATE TABLE resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
├── public/            # Static web UI files
│   ├── index.html     # Main web interface
│   ├── styles.css     # UI styling
│   └── script.js      # Client-side functionality
├── src/
│   ├── controllers/   # Request handlers
│   │   └── resourceController.ts
│   ├── middleware/    # Express middleware
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   ├── models/        # Database models and connections
│   │   ├── database.ts
│   │   └── resource.ts
│   ├── routes/        # API routes
│   │   └── resourceRoutes.ts
│   ├── types/         # TypeScript type definitions
│   │   └── resource.ts
│   ├── utils/         # Utility functions
│   │   └── validation.ts
│   └── index.ts       # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Security

The application implements comprehensive security measures to protect against common web vulnerabilities:

### Content Security Policy (CSP)
- **Script Source**: Only allows scripts from same origin (`'self'`)
- **Style Source**: Allows inline styles for dynamic styling (`'unsafe-inline'`)
- **Image Source**: Allows same origin, data URLs, and HTTPS sources
- **Script Attributes**: Blocks all inline event handlers (`script-src-attr 'none'`)

### Input Validation & Sanitization
- **Client-side Validation**: Real-time validation with user-friendly error messages
- **Server-side Validation**: Comprehensive Joi schemas with custom error messages
- **Data Sanitization**: Automatic trimming and HTML escaping
- **Parameter Validation**: Optional filter parameters with proper validation

### Security Headers
- **Helmet.js Integration**: Automatic security headers for common vulnerabilities
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Anti-XSS Protection**: Content Security Policy prevents script injection
- **Data Validation**: Prevents SQL injection through parameterized queries

### Error Handling
- **No Information Leakage**: Production mode hides stack traces
- **Centralized Error Handling**: Consistent error response format
- **Input Validation Errors**: Clear, specific error messages for users
- **HTTP Status Codes**: Proper status codes for different error types

## Development

### Adding New Features

1. Define types in `src/types/`
2. Create validation schemas in `src/utils/validation.ts`
3. Implement model methods in `src/models/`
4. Create controller methods in `src/controllers/`
5. Add routes in `src/routes/`

### Testing

The application includes comprehensive input validation and error handling. Test your endpoints using tools like:

- **curl**
- **Postman**
- **Insomnia**
- **VS Code REST Client**

### Example cURL Commands

```bash
# Create a resource
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Resource","description":"Test description","category":"test"}'

# Get all resources
curl http://localhost:3000/api/resources

# Get resource by ID
curl http://localhost:3000/api/resources/1

# Update resource
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}'

# Delete resource
curl -X DELETE http://localhost:3000/api/resources/1
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `DB_PATH`: SQLite database file path (default: ./database.sqlite)

### Security

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configured to allow cross-origin requests
- **Input Validation**: All inputs are validated using Joi schemas
- **SQL Injection Prevention**: Uses parameterized queries

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in `.env` file or kill existing processes
   ```bash
   lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
   ```

2. **Database permission issues**: Ensure write permissions in the project directory
   ```bash
   chmod 755 .  # Ensure directory permissions
   ```

3. **TypeScript compilation errors**: Run `pnpm typecheck` to identify issues
   ```bash
   pnpm typecheck  # Check for TypeScript errors
   pnpm lint       # Check for linting issues
   ```

4. **SQLite3 binding issues with pnpm**: Rebuild SQLite3 if needed
   ```bash
   pnpm rebuild sqlite3
   ```

5. **Empty resources on startup**: Run the seed script to populate sample data
   ```bash
   pnpm seed
   ```

6. **CSP violations in browser console**: All inline event handlers have been removed for security compliance

### Logs & Debugging

The application includes comprehensive logging:
- **Request Logging**: All API calls are logged with Morgan
- **Error Logging**: Centralized error handling with stack traces in development
- **Client Logging**: Browser console shows resource loading and API calls
- **Validation Errors**: Clear error messages for both client and server validation

In production, consider using a proper logging service like Winston or Pino.

## License

MIT License