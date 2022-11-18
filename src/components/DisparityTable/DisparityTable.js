import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled, tableCellClasses } from '@mui/material'

const StyledTableCell = styled(TableCell)(({}) => ({
    [`&.${ tableCellClasses.head }`]: {
        background: '#3c3c3c',
        zIndex: 100,
    },
}))

const StyledTableRow = styled(TableRow)(({}) => ({
    '&:nth-of-type(1)': {
        background: 'rgba(136,132,216,0.7)',
        color: 'white'
    },
    '&:nth-of-type(2)': {
        backgroundColor: 'rgba(130,202,157,0.7)',
    },
}))

export default function DisparityTable({rows}) {
    return (
        <TableContainer component={ Paper }>
            <Table sx={ {minWidth: 650} } aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">Value</StyledTableCell>
                        <StyledTableCell align="left">HomeRun and Triple</StyledTableCell>
                        <StyledTableCell align="left">Triple and Double</StyledTableCell>
                        <StyledTableCell align="left">Double and Single</StyledTableCell>
                        <StyledTableCell align="left">Single and Out</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rows.map((row) => (
                        <StyledTableRow
                            key={ row.cause }
                            sx={ {'&:last-child td, &:last-child th': {border: 0}} }
                        >
                            <TableCell align="left">{ row.cause }</TableCell>
                            <TableCell align="left">{ row.homeTriple }%</TableCell>
                            <TableCell align="left">{ row.tripleDouble }%</TableCell>
                            <TableCell align="left">{ row.doubleSingle }%</TableCell>
                            <TableCell align="left">{ row.singleOut }%</TableCell>
                        </StyledTableRow>
                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    )
}