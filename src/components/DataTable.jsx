import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTableData } from '../hooks/useTableData'
import './DataTable.css'

const DataTable = () => {
  const { logout, user } = useAuth()
  const { columns, rows, isLoading, updateCell, deleteRow, deleteRows, addRow } = useTableData()
  const [darkMode, setDarkMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [itemsPerPage, setItemsPerPage] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingCell, setEditingCell] = useState(null) // { rowId, columnIndex }
  const [editValue, setEditValue] = useState('')

  // Apply dark mode class to container and body
  useEffect(() => {
    const container = document.querySelector('.data-table-container')
    const body = document.body
    
    if (darkMode) {
      container?.classList.add('dark-mode')
      body?.classList.add('dark-mode')
    } else {
      container?.classList.remove('dark-mode')
      body?.classList.remove('dark-mode')
    }
  }, [darkMode])
  
  // Initialize columns if empty (create default columns)
  useEffect(() => {
    if (!isLoading && columns.length === 0) {
      // Create default columns
      const defaultColumns = ['Header', 'Header', 'Header', 'Header', 'Header', 'Header', 'Header', 'Header']
      defaultColumns.forEach((name, index) => {
        // We'll need to add columns through the hook, but for now let's handle it in the component
        // This will be handled by the user adding columns manually or we can add an init function
      })
    }
  }, [columns.length, isLoading])
  
  // Pagination calculations
  const totalItems = rows.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return rows.slice(start, end)
  }, [rows, currentPage, itemsPerPage])
  
  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleRowSelect = (rowId) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId)
    } else {
      newSelected.add(rowId)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedRows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedRows.map(row => row.id)))
    }
  }

  const isAllSelected = selectedRows.size === paginatedRows.length && paginatedRows.length > 0
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < paginatedRows.length
  
  // Cell editing handlers
  const handleCellClick = (rowId, columnIndex) => {
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    const cellValue = (row.cells && row.cells[columnIndex]) || ''
    setEditingCell({ rowId, columnIndex })
    setEditValue(cellValue)
  }
  
  const handleCellSave = async () => {
    if (!editingCell) return
    try {
      await updateCell(editingCell.rowId, editingCell.columnIndex, editValue)
      setEditingCell(null)
      setEditValue('')
    } catch (error) {
      console.error('Error updating cell:', error)
      alert('Failed to update cell: ' + error.message)
    }
  }
  
  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }
  
  // Handle key presses in edit mode
  const handleCellKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCellSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCellCancel()
    }
  }
  
  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedRows.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedRows.size} row(s)?`)) return
    
    try {
      await deleteRows(Array.from(selectedRows))
      setSelectedRows(new Set())
    } catch (error) {
      console.error('Error deleting rows:', error)
      alert('Failed to delete rows: ' + error.message)
    }
  }
  
  // Add new row
  const handleAddRow = async () => {
    try {
      const emptyCells = new Array(columns.length).fill('')
      await addRow(emptyCells)
    } catch (error) {
      console.error('Error adding row:', error)
      alert('Failed to add row: ' + error.message)
    }
  }
  
  // Get cell value helper
  const getCellValue = (row, columnIndex) => {
    if (!row.cells || !Array.isArray(row.cells)) return ''
    return row.cells[columnIndex] || ''
  }
  
  if (isLoading) {
    return (
      <div className="data-table-container" style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading data...</div>
      </div>
    )
  }

  return (
    <div className="data-table-container">
      {/* Header Section */}
      <div className="table-header-section">
        <div className="title-description">
          <h1 className="table-title">Title</h1>
          <p className="table-description">Description</p>
        </div>
        <div className="theme-toggle-container">
          {user && (
            <div className="user-info" style={{ marginRight: '16px', fontSize: '14px', color: darkMode ? '#a8a8a8' : '#6f6f6f' }}>
              {user.email}
            </div>
          )}
          <button 
            className="theme-toggle-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
            <span className="theme-toggle-label">{darkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
          <button 
            className="logout-button"
            onClick={logout}
            aria-label="Logout"
            style={{
              marginLeft: '12px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: darkMode ? '#f4f4f4' : '#161616',
              backgroundColor: 'transparent',
              border: `1px solid ${darkMode ? '#525252' : '#d1d1d1'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Batch Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="batch-actions-bar">
          <div className="selected-items-label">
            {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
          </div>
          <div className="batch-actions-buttons">
            <button 
              className="batch-action-button"
              onClick={handleBatchDelete}
              style={{ color: '#d32f2f' }}
            >
              Delete Selected
            </button>
            <div className="batch-divider"></div>
            <button 
              className="batch-action-button"
              onClick={() => setSelectedRows(new Set())}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Add Row Button */}
      <div style={{ padding: '16px', borderBottom: darkMode ? '1px solid #525252' : '1px solid #d1d1d1' }}>
        <button
          onClick={handleAddRow}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#fff',
            backgroundColor: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          + Add Row
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr className="table-header-row">
              <th className="select-cell">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              {columns.length === 0 ? (
                <th colSpan={8} className="table-header-cell" style={{ textAlign: 'center', color: darkMode ? '#a8a8a8' : '#6f6f6f' }}>
                  No columns yet. Add columns to get started.
                </th>
              ) : (
                columns.map((column, index) => (
                  <th key={column.id || index} className="table-header-cell">
                    <div className="header-content">
                      {column.name || 'Header'}
                      <span className="sort-icon">↕</span>
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={(columns.length || 8) + 1} style={{ textAlign: 'center', padding: '40px', color: darkMode ? '#a8a8a8' : '#6f6f6f' }}>
                  No rows yet. Click "Add Row" to create your first row.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => {
                const isSelected = selectedRows.has(row.id)
                const isEditing = editingCell?.rowId === row.id
                
                return (
                  <tr
                    key={row.id}
                    className={`table-row ${isSelected ? 'selected' : ''}`}
                  >
                    <td className="select-cell">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowSelect(row.id)}
                        />
                      </div>
                    </td>
                      {columns.length === 0 ? (
                        <td colSpan={8} style={{ textAlign: 'center', color: darkMode ? '#a8a8a8' : '#6f6f6f' }}>
                          No columns defined
                        </td>
                      ) : (
                        columns.map((column, columnIndex) => {
                          const cellValue = getCellValue(row, columnIndex)
                          const isCellEditing = isEditing && editingCell.columnIndex === columnIndex
                          
                          return (
                            <td 
                              key={column.id || columnIndex} 
                              className="table-cell"
                              onClick={() => handleCellClick(row.id, columnIndex)}
                              style={{ cursor: 'pointer', position: 'relative' }}
                            >
                              {isCellEditing ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={handleCellSave}
                                  onKeyDown={handleCellKeyDown}
                                  autoFocus
                                  style={{
                                    width: '100%',
                                    padding: '4px 8px',
                                    border: '2px solid #1976d2',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    outline: 'none'
                                  }}
                                />
                              ) : (
                                <span>{cellValue || ''}</span>
                              )}
                            </td>
                          )
                        })
                      )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Slot Component (Optional) */}
      <div className="slot-component">
        <div className="slot-icon">🔄</div>
        <div className="slot-content">
          <h3 className="slot-title">Slot component</h3>
          <p className="slot-description">
            Optional placeholder component. Replace it with any component using the "Component Instance" swapper, or delete if not needed.
          </p>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-bar">
        <div className="pagination-left">
          <div className="items-per-page">
            <label>Items per page:</label>
            <select
              className="page-select"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="pagination-divider"></div>
        </div>
        <div className="pagination-center">
          <span className="items-range">
            {totalItems === 0 ? '0 items' : `${((currentPage - 1) * itemsPerPage) + 1}–${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
          </span>
        </div>
        <div className="pagination-right">
          <div className="pagination-divider"></div>
          <div className="page-navigation">
            <select
              className="page-select"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              disabled={totalPages === 0}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>
            <span className="total-pages">of {totalPages} pages</span>
          </div>
          <div className="pagination-divider"></div>
          <div className="pagination-buttons">
            <button
              className="nav-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              ←
            </button>
            <div className="pagination-divider"></div>
            <button
              className="nav-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable

