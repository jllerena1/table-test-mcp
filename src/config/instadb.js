import { init, i } from '@instantdb/react'

// Get app ID from environment or use the provided one
const APP_ID = import.meta.env.VITE_INSTADB_APP_ID || import.meta.env.VITE_INSTADB_PUBLIC_ID || 'a95cda59-fec3-424a-a98d-a7740a45ddf9'

// Log configuration (works in both dev and production for debugging)
const envAppId = import.meta.env.VITE_INSTADB_APP_ID
const envPublicId = import.meta.env.VITE_INSTADB_PUBLIC_ID

console.log('[InstantDB] Configuration check:')
console.log('[InstantDB] - VITE_INSTADB_APP_ID:', envAppId ? `${envAppId.substring(0, 8)}...` : 'not set')
console.log('[InstantDB] - VITE_INSTADB_PUBLIC_ID:', envPublicId ? `${envPublicId.substring(0, 8)}...` : 'not set')
console.log('[InstantDB] - Using APP_ID:', APP_ID ? `${APP_ID.substring(0, 8)}...` : 'MISSING')

// Validate APP_ID
if (!APP_ID || APP_ID.length < 10) {
  console.error('[InstantDB] ERROR: Invalid App ID. Please check your environment variables.')
  console.error('[InstantDB] APP_ID length:', APP_ID?.length || 0)
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
let db
try {
  db = init({
    appId: APP_ID,
    schema,
  })
  console.log('[InstantDB] Successfully initialized with schema')
} catch (error) {
  console.error('[InstantDB] ERROR: Failed to initialize:', error)
  // Re-throw to prevent silent failures
  throw error
}

// Validate db object
if (!db) {
  console.error('[InstantDB] ERROR: db object is null or undefined after initialization')
} else if (typeof db.useAuth !== 'function') {
  console.error('[InstantDB] ERROR: db.useAuth is not a function. db object:', Object.keys(db))
} else {
  console.log('[InstantDB] db object validated successfully')
}

export default db
export { schema }
