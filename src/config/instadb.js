import { init, i } from '@instantdb/react'

// Get app ID from environment or use the provided one
const APP_ID = import.meta.env.VITE_INSTADB_APP_ID || import.meta.env.VITE_INSTADB_PUBLIC_ID || 'a95cda59-fec3-424a-a98d-a7740a45ddf9'

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('InstantDB Configuration:')
  console.log('- VITE_INSTADB_APP_ID:', import.meta.env.VITE_INSTADB_APP_ID || 'not set')
  console.log('- VITE_INSTADB_PUBLIC_ID:', import.meta.env.VITE_INSTADB_PUBLIC_ID || 'not set')
  console.log('- Using APP_ID:', APP_ID)
}

// Validate APP_ID
if (!APP_ID || APP_ID.length < 10) {
  console.error('Invalid InstantDB App ID. Please check your environment variables.')
}

// Define the database schema using InstantDB's schema builder
// Dynamic columns: We'll store column definitions and cell values as JSON
const schema = i.schema({
  entities: {
    columns: i.entity({
      name: i.string(), // Column header name
      order: i.number(), // Display order
      createdAt: i.number(), // Timestamp
    }),
    rows: i.entity({
      cells: i.json(), // Array of cell values matching column order
      createdAt: i.number(), // Timestamp
      updatedAt: i.number(), // Timestamp
    }),
  },
})

// Initialize InstantDB with schema
const db = init({
  appId: APP_ID,
  schema,
})

// Log the app ID to verify it's loaded correctly (only in development)
if (import.meta.env.DEV) {
  console.log('InstantDB initialized with App ID:', APP_ID)
}

export default db
export { schema }
