import { id } from '@instantdb/react'
import db from '../config/instadb'

/**
 * Custom hook for managing table data with InstantDB
 * Handles columns and rows for a shared table
 */
export const useTableData = () => {
  // Query columns and rows with error handling
  let data, isLoading, error
  
  try {
    const queryResult = db.useQuery({
      columns: {},
      rows: {},
    })
    data = queryResult.data
    isLoading = queryResult.isLoading
    error = queryResult.error
  } catch (err) {
    console.error('Error in useQuery:', err)
    data = null
    isLoading = false
    error = err
  }
  
  const columns = (data?.columns || []).sort((a, b) => (a.order || 0) - (b.order || 0))
  const rows = (data?.rows || []).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  
  // Create a new column
  const addColumn = async (columnName) => {
    const maxOrder = columns.length > 0 
      ? Math.max(...columns.map(c => c.order || 0))
      : -1
    
    db.transact([
      db.tx.columns[id()].update({
        name: columnName,
        order: maxOrder + 1,
        createdAt: Date.now(),
      })
    ])
  }
  
  // Update column name
  const updateColumn = async (columnId, newName) => {
    db.transact([
      db.tx.columns[columnId].update({ name: newName })
    ])
  }
  
  // Delete column
  const deleteColumn = async (columnId) => {
    // Also need to remove this column's data from all rows
    const columnIndex = columns.findIndex(c => c.id === columnId)
    if (columnIndex === -1) return
    
    // Update all rows to remove the cell at this index
    const updates = rows.map(row => {
      const newCells = [...(row.cells || [])]
      newCells.splice(columnIndex, 1)
      return db.tx.rows[row.id].update({ cells: newCells })
    })
    
    // Delete the column
    updates.push(db.tx.columns[columnId].delete())
    
    db.transact(updates)
  }
  
  // Create a new row
  const addRow = async (cells = []) => {
    // Ensure cells array matches column count
    const cellsArray = Array.isArray(cells) ? cells : []
    while (cellsArray.length < columns.length) {
      cellsArray.push('')
    }
    
    db.transact([
      db.tx.rows[id()].update({
        cells: cellsArray,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    ])
  }
  
  // Update a row's cells
  const updateRow = async (rowId, cells) => {
    db.transact([
      db.tx.rows[rowId].update({
        cells,
        updatedAt: Date.now(),
      })
    ])
  }
  
  // Update a single cell
  const updateCell = async (rowId, columnIndex, value) => {
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    
    const newCells = [...(row.cells || [])]
    // Ensure array is long enough
    while (newCells.length <= columnIndex) {
      newCells.push('')
    }
    newCells[columnIndex] = value
    
    db.transact([
      db.tx.rows[rowId].update({
        cells: newCells,
        updatedAt: Date.now(),
      })
    ])
  }
  
  // Delete a row
  const deleteRow = async (rowId) => {
    db.transact([
      db.tx.rows[rowId].delete()
    ])
  }
  
  // Delete multiple rows
  const deleteRows = async (rowIds) => {
    const deletes = rowIds.map(rowId => db.tx.rows[rowId].delete())
    db.transact(deletes)
  }
  
  return {
    columns,
    rows,
    isLoading,
    error,
    // Column operations
    addColumn,
    updateColumn,
    deleteColumn,
    // Row operations
    addRow,
    updateRow,
    updateCell,
    deleteRow,
    deleteRows,
  }
}
