# Data Table Component

A full-stack data table application built with React and InstantDB, featuring real-time synchronization and secure authentication.

## Authentication

This application uses **InstantDB Magic Code Authentication** for secure user login:

- **Email-based login**: Users enter their email address to receive a verification code
- **6-digit magic code**: A secure 6-digit code is sent to the user's email
- **Two-step verification**: Email → Code verification flow
- **Session management**: Automatic session handling with InstantDB
- **Protected routes**: All data operations require authentication

### Login Flow

1. User enters their email address
2. System sends a 6-digit verification code via email
3. User enters the code to complete authentication
4. Access granted to the data table with real-time sync

## Features

- **Header Section**: Title and description
- **Batch Actions Bar**: Appears when items are selected, showing selected count and action buttons
- **Data Table**: 
  - Selectable rows with checkboxes
  - Dynamic columns with sortable headers
  - Row selection highlighting
  - Inline cell editing
  - Real-time data synchronization
- **Slot Component**: Optional placeholder component
- **Pagination**: Items per page selector, page navigation, and item count display
- **Dark Mode Toggle**: Switch between light and dark themes with a single click
- **CRUD Operations**: Create, read, update, and delete rows with real-time updates

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Features

- ✅ Row selection with checkboxes
- ✅ Select all functionality
- ✅ Batch actions bar when items are selected
- ✅ Pagination controls
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ Responsive design
- ✅ Clean, modern UI matching Figma design
- ✅ Smooth theme transitions

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **InstantDB** - Backend-as-a-Service with real-time sync
  - Magic code authentication
  - Real-time database synchronization
  - No backend code required
- **CSS** - Custom styling (no external CSS frameworks)

## Database

This application uses **InstantDB** as its backend database:

- **Real-time synchronization**: All changes sync instantly across all connected clients
- **Schema**: 
  - `columns` table: Stores column definitions (name, order, createdAt)
  - `rows` table: Stores row data with cells as JSON array
- **Authentication**: Built-in magic code email authentication
- **Permissions**: Shared table - all authenticated users can read/write data

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_INSTADB_APP_ID=your-app-id-here
```

The app ID is configured in `src/config/instadb.js` and can be overridden via environment variables.

## Deployment

- **Live App**: [https://table-test-mcp.vercel.app](https://table-test-mcp.vercel.app)
- **Platform**: Vercel
- **Auto-deploy**: Enabled from main branch
- **Alternative URLs**:
  - https://table-test-mcp-juan-llerenas-projects.vercel.app
  - https://table-test-mcp-git-main-juan-llerenas-projects.vercel.app

## Repository

- **GitHub**: [table-test-mcp](https://github.com/jllerena1/table-test-mcp)
- **Last Updated**: January 15, 2025
