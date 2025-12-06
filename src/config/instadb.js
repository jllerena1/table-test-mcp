import { init, i } from '@instantdb/react'

// Get app ID from environment or use the provided one
const APP_ID = import.meta.env.VITE_INSTADB_APP_ID || import.meta.env.VITE_INSTADB_PUBLIC_ID || 'a95cda59-fec3-424a-a98d-a7740a45ddf9'

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

// Initialize InstantDB
// For now, initialize without schema to avoid initialization errors
// Schema can be added later once the app is working
const db = init({
  appId: APP_ID,
  // schema, // Commented out temporarily to debug
})

export default db
export { schema }
