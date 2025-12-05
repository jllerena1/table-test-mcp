import React, { useState, useEffect } from 'react'
import './DataTable.css'

const DataTable = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState(new Set([1])) // Row 1 is selected by default
  const [itemsPerPage, setItemsPerPage] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)

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
  
  const totalItems = 100
  const totalPages = 10
  const headers = ['Header', 'Header', 'Header', 'Header', 'Header', 'Header', 'Header', 'Header']
  const rows = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    cells: Array.from({ length: 8 }, () => 'Content')
  }))

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
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(rows.map((_, i) => i)))
    }
  }

  const isAllSelected = selectedRows.size === rows.length && rows.length > 0
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < rows.length

  return (
    <div className="data-table-container">
      {/* Header Section */}
      <div className="table-header-section">
        <div className="title-description">
          <h1 className="table-title">Title</h1>
          <p className="table-description">Description</p>
        </div>
        <div className="theme-toggle-container">
          <button 
            className="theme-toggle-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
            <span className="theme-toggle-label">{darkMode ? 'Light' : 'Dark'} Mode</span>
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
            <button className="batch-action-button">Button</button>
            <button className="batch-action-button">Button</button>
            <button className="batch-action-button">Button</button>
            <div className="batch-divider"></div>
            <button className="batch-action-button">Cancel</button>
          </div>
        </div>
      )}

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
              {headers.map((header, index) => (
                <th key={index} className="table-header-cell">
                  <div className="header-content">
                    {header}
                    <span className="sort-icon">↕</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const isSelected = selectedRows.has(rowIndex)
              return (
                <tr
                  key={rowIndex}
                  className={`table-row ${isSelected ? 'selected' : ''}`}
                >
                  <td className="select-cell">
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(rowIndex)}
                      />
                    </div>
                  </td>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="table-cell">
                      {cell}
                    </td>
                  ))}
                </tr>
              )
            })}
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
            {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
        </div>
        <div className="pagination-right">
          <div className="pagination-divider"></div>
          <div className="page-navigation">
            <select
              className="page-select"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
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

