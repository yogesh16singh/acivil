import React, { useState, useEffect } from 'react'
import './style.css'

const Grid = () => {
    const [rowc, setRowc] = useState(6);
    const [colc, setcolc] = useState(6);
    const initialCells = Array.from({ length: rowc }, () =>
        Array(colc).fill({ value: '', formula: '' })
    )
    const [cells, setCells] = useState(initialCells)
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 })

    useEffect(() => {
        // Focus on the input when the selected cell changes
        const inputElement = document.getElementById(
            `cell-${selectedCell.row}-${selectedCell.col}`
        )
        if (inputElement) {
            inputElement.focus()
        }
        const savedGridState = localStorage.getItem('gridState')
        console.log('saveGridState :', savedGridState)
    }, [selectedCell])

    useEffect(() => {
        if (localStorage.getItem('gridState'))
            localStorage.removeItem('gridState');
    }, [])

    const loadSaveState = () => {
        // Load the saved state from localStorage when the component mounts
        const savedGridState = localStorage.getItem('gridState')

        if (savedGridState) {
            setCells(JSON.parse(savedGridState))
            alert('Grid state loaded successfully!')
        }
    }
    const handleInputChange = (event, row, col) => {
        const newCells = [...cells]
        newCells[row][col] = { ...newCells[row][col], formula: event.target.value }
        setCells(newCells)
    }

    const handleKeyPress = (event, row, col) => {
        if (event.key === 'Enter') {
            evaluateFormula(row, col)
        } else {
            switch (event.key) {
                case 'ArrowUp':
                    setSelectedCell((prev) => ({
                        row: (prev.row - 1 + rowc) % rowc,
                        col: prev.col,
                    }))
                    break
                case 'ArrowDown':
                    setSelectedCell((prev) => ({
                        row: (prev.row + 1) % rowc,
                        col: prev.col,
                    }))
                    break
                case 'ArrowLeft':
                    setSelectedCell((prev) => ({
                        row: prev.row,
                        col: (prev.col - 1 + colc) % colc,
                    }))
                    break
                case 'ArrowRight':
                    setSelectedCell((prev) => ({
                        row: prev.row,
                        col: (prev.col + 1) % colc,
                    }))
                    break
                default:
                    break
            }
        }
    }

    const evaluateFormula = (row, col) => {
        let formula = cells[row][col].formula

        try {

            const result = eval(
                formula.replace(/[A-Z]\d+/g, (match) => {
                    const cellValue = getCellValue(match)
                    return cellValue !== undefined ? cellValue : 0
                })
            )
            const newCells = [...cells]
            newCells[row][col] = { value: result, formula: result }
            setCells(newCells)
        } catch (error) {
            console.error('Invalid formula')
        }


    }

    const getCellValue = (cellReference) => {
        const [colStr, rowStr] = cellReference.match(/([A-Z]+)(\d+)/).slice(1)
        const col =
            colStr
                .split('')
                .reduce(
                    (acc, char) => acc * 26 + char.charCodeAt(0) - 'A'.charCodeAt(0) + 1,
                    0
                ) - 1
        const row = parseInt(rowStr, 10) - 1

        if (cells[row] && cells[row][col] && cells[row][col].value !== undefined) {
            return cells[row][col].value
        }

        return undefined
    }

    const saveGridState = () => {
        // Save the current state of the grid to localStorage
        localStorage.setItem('gridState', JSON.stringify(cells))
        alert('Grid state saved successfully!')
    }

    return (
        <div>
            <h1 className='heading-name'> Spreadsheet</h1>
            <div className='grid-controls'>
                <button onClick={saveGridState} className='control-button save'>
                    Save Current State
                </button>
                <p>Formula eg : A1 + A2 </p>
                <button onClick={loadSaveState} className='control-button load'>
                    Load Prev State
                </button>
            </div>
            <div className='grid-container'>
                <div className='grid-wrapper'>
                    <table className='grid-table'>
                        <tbody>
                            {cells.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className='grid-cell'
                                            style={{
                                                width: `calc(100% / ${cells[0].length})`,
                                                height: `calc(60vh / ${cells.length})`,
                                                backgroundColor:
                                                    selectedCell.row === rowIndex &&
                                                        selectedCell.col === colIndex
                                                        ? 'rgb(138, 138, 202)'
                                                        : '#ffffff',
                                            }}
                                            onClick={() => {
                                                setSelectedCell({ row: rowIndex, col: colIndex })
                                            }}
                                        >
                                            <input
                                                type='text'
                                                id={`cell-${rowIndex}-${colIndex}`}
                                                value={cell.formula}
                                                onChange={(event) =>
                                                    handleInputChange(event, rowIndex, colIndex)
                                                }
                                                onKeyDown={(event) =>
                                                    handleKeyPress(event, rowIndex, colIndex)
                                                }
                                                onBlur={() => evaluateFormula(rowIndex, colIndex)}
                                                style={{
                                                    height: '80%', textAlign: 'center',
                                                    backgroundColor:
                                                        selectedCell.row === rowIndex &&
                                                            selectedCell.col === colIndex
                                                            ? 'rgb(138, 138, 202)'
                                                            : '#ffffff',
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>


        </div>
    )
}

export default Grid
