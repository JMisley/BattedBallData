import * as React from 'react'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import axios from 'axios'
import './Table.css'
import TablePagination from '@mui/material/TablePagination'
import { visuallyHidden } from '@mui/utils'
import TableSortLabel from '@mui/material/TableSortLabel'
import { FormControl, MenuItem, Select, styled, tableCellClasses, useTheme } from '@mui/material'
import baseballImg from './img/baseball.png'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import SearchBar from 'material-ui-search-bar'

// eslint-disable-next-line no-empty-pattern
const StyledTableCell = styled(TableCell)(({}) => ({
    [`&.${ tableCellClasses.head }`]: {
        background: 'linear-gradient(0deg, rgba(78,77,122,1) 15%, rgba(99,96,154,1) 15%)',
        zIndex: 100,
    },
    [`&.${ tableCellClasses.body }`]: {
        fontSize: 14,
        color: 'white'
    },
}))

// eslint-disable-next-line no-empty-pattern
const StyledTableRow = styled(TableRow)(({}) => ({
    '&:nth-of-type(even)': {
        background: 'linear-gradient(270deg, rgba(162,160,210,0.7) 0%, rgba(161,204,177,0.7) 80%)',
        color: 'white'
    },
    '&:nth-of-type(4n+1)': {
        backgroundColor: '#3f3f3f',
    },
    '&:nth-of-type(4n+3)': {
        backgroundColor: '#353535',
        color: 'white'
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

function Rows(props) {
    const {row} = props
    const [open, setOpen] = React.useState(false)

    return (
        <React.Fragment>
            <StyledTableRow sx={ {'& > *': {borderBottom: 'unset'}} }>
                <StyledTableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={ () => setOpen(!open) }
                    >
                        { open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">#{ row.BATTER_ID }</StyledTableCell>
                <StyledTableCell align="right">{ row.BATTER }</StyledTableCell>
                <StyledTableCell align="right">{ row.PITCHER }</StyledTableCell>
                <StyledTableCell align="right">{ evaluateDate(row.GAME_DATE) }</StyledTableCell>
                <StyledTableCell align="right">{ roundData(row.EXIT_SPEED) } mph</StyledTableCell>
                <StyledTableCell align="right">{ roundData(row.HIT_DISTANCE) } ft</StyledTableCell>
                <StyledTableCell align="right">{ roundData(row.HANG_TIME) } s</StyledTableCell>
                <StyledTableCell align="right">{ row.PLAY_OUTCOME }</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
                <StyledTableCell style={ {paddingBottom: 0, paddingTop: 0} } colSpan={ 12 }>
                    <Collapse in={ open } timeout="auto" unmountOnExit>
                        <Box sx={ {margin: 1} }>
                            <div>
                                <div className="adv-table">
                                    <Typography variant="h6" gutterBottom component="div">
                                        Advanced Stats
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell><h4>Pitcher ID</h4></StyledTableCell>
                                                <StyledTableCell><h4>Launch Angle</h4></StyledTableCell>
                                                <StyledTableCell align="right"><h4>Exit Direction</h4></StyledTableCell>
                                                <StyledTableCell align="right"><h4>Hit Spin Rate</h4></StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            <StyledTableRow key={ row.INDEX }>
                                                <StyledTableCell component="th"
                                                                 scope="row">#{ row.PITCHER_ID }</StyledTableCell>
                                                <StyledTableCell component="th"
                                                                 scope="row">{ asDegree(roundData(row.LAUNCH_ANGLE)) }
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    align="right">{ asDegree(roundData(row.EXIT_DIRECTION)) }</StyledTableCell>
                                                <StyledTableCell
                                                    align="right">{ roundData(row.HIT_SPIN_RATE) } rpm</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="adv-video">
                                    <video controls width="100%">
                                        <source src={ row.VIDEO_LINK } type="video/mp4"/>
                                    </video>
                                </div>

                            </div>
                        </Box>
                    </Collapse>
                </StyledTableCell>
            </StyledTableRow>
        </React.Fragment>
    )
}

Rows.propTypes = {
    row: PropTypes.shape({
        INDEX: PropTypes.number.isRequired,
        BATTER_ID: PropTypes.number.isRequired,
        BATTER: PropTypes.string.isRequired,
        PITCHER_ID: PropTypes.number.isRequired,
        PITCHER: PropTypes.string.isRequired,
        GAME_DATE: PropTypes.string.isRequired,
        LAUNCH_ANGLE: PropTypes.number.isRequired,
        EXIT_SPEED: PropTypes.number.isRequired,
        EXIT_DIRECTION: PropTypes.number.isRequired,
        HIT_DISTANCE: PropTypes.number.isRequired,
        HANG_TIME: PropTypes.number.isRequired,
        HIT_SPIN_RATE: PropTypes.number.isRequired,
        PLAY_OUTCOME: PropTypes.string.isRequired,
        VIDEO_LINK: PropTypes.string.isRequired,
    }).isRequired,
}

let mainColumnObject = [
    {
        id: 'BATTER_ID',
        align: 'left',
        label: 'Batter ID'
    },
    {
        id: 'BATTER',
        align: 'right',
        label: 'Batter Name'
    },
    {
        id: 'PITCHER',
        align: 'right',
        label: 'Pitcher Name'
    },
    {
        id: 'GAME_DATE',
        align: 'right',
        label: 'Game Date'
    },
    {
        id: 'EXIT_SPEED',
        align: 'right',
        label: 'Exit Speed'
    },
    {
        id: 'HIT_DISTANCE',
        align: 'right',
        label: 'Hit Distance'
    },
    {
        id: 'HANG_TIME',
        align: 'right',
        label: 'Hang Time'
    },
    {
        id: 'PLAY_OUTCOME',
        align: 'right',
        label: 'Play Outcome'
    }
]

const sheetID = '1OzWBsRY8rOVJzqfD-pihzgMM-rsGB7RL'
const base = `https://docs.google.com/spreadsheets/d/${ sheetID }/gviz/tq?`

function toObject(keys, values) {
    let object = {}
    for (let i = 0; i < keys.length; i++)
        object[keys[i]] = values[i]
    return object
}

function evaluateDate(dateStringFunction) {
    const options = {year: 'numeric', month: 'numeric', day: 'numeric'}
    return eval('new ' + dateStringFunction).toLocaleString('en-US', options)
}

function roundData(data) {
    return Math.round(data * 100) / 100
}

function asDegree(number) {
    return number.toString().concat('\u00b0')
}

function TablePaginationActions(props) {
    const theme = useTheme()
    const {count, page, rowsPerPage, onPageChange} = props

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <Box sx={ {flexShrink: 0, ml: 2.5} }>
            <IconButton
                onClick={ handleFirstPageButtonClick }
                disabled={ page === 0 }
                aria-label="first page"
            >
                { theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/> }
            </IconButton>
            <IconButton
                onClick={ handleBackButtonClick }
                disabled={ page === 0 }
                aria-label="previous page"
            >
                { theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/> }
            </IconButton>
            <IconButton
                onClick={ handleNextButtonClick }
                disabled={ page >= Math.ceil(count / rowsPerPage) - 1 }
                aria-label="next page"
            >
                { theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/> }
            </IconButton>
            <IconButton
                onClick={ handleLastPageButtonClick }
                disabled={ page >= Math.ceil(count / rowsPerPage) - 1 }
                aria-label="last page"
            >
                { theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/> }
            </IconButton>
        </Box>
    )
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) {
            return order
        }
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

export default function CollapsibleTable() {
    const [data, setData] = useState(null)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('BATTER_ID')
    const [allRows, setAllRows] = useState([])
    const [rows, setRows] = useState([])
    const [searched, setSearched] = useState('')
    const [searchBy, setSearchBy] = useState('BATTER')

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    function createData() {
        if (data !== null) {
            const cols = ['INDEX']
            let mainRows = []
            let objArray = []

            let index = 0
            for (let x = 0; x < data.rows.length; x++) {
                mainRows.push(index)
                for (let y = 0; y < data.cols.length; y++) {
                    if (data.rows[x].c[y] === null)
                        mainRows.push('N/A')
                    else
                        mainRows.push(data.rows[x].c[y].v)

                    if (x === 0)
                        cols.push(data.cols[y].label)
                }
                index++
                objArray.push(toObject(cols, mainRows))
                mainRows = []
            }
            return objArray
        }
    }

    useEffect(() => {
        async function fetchData() {
            await axios.get(base)
                .then(response => {
                    setData(JSON.parse(response.data.substring(47).slice(0, -2)).table)
                })
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (data !== null) {
            const allData = createData()
            setRows(allData)
            setAllRows(allData)
        }
    }, [data])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property)
    }

    const requestSearch = (searchedVal) => {
        if (searchedVal === '') {
            setRows(allRows)
            return
        }

        const filteredRows = allRows.filter((row) => {
            return row[searchBy].toString().toLowerCase().includes(searchedVal.toLowerCase())
        })
        setRows(filteredRows)
    }

    const cancelSearch = () => {
        setSearched('')
        requestSearch(searched)
    }

    const changeSearchBy = (e) => {
        setSearchBy(e.target.value)
    }

    return (
        <>
            <div style={{display: 'flex', width: '100%'}}>
                <FormControl size={ 'small' } style={ {flex:'1', backgroundColor: '#5e996c'} }>
                    <Select value={ searchBy } onChange={ changeSearchBy }>
                        <MenuItem value={ 'BATTER' }>Batter</MenuItem>
                        <MenuItem value={ 'BATTER_ID' }>Batter ID</MenuItem>
                        <MenuItem value={ 'PITCHER' }>Pitcher</MenuItem>
                        <MenuItem value={ 'PITCHER_ID' }>Pitcher ID</MenuItem>
                        <MenuItem value={ 'PLAY_OUTCOME' }>Play Outcome</MenuItem>
                    </Select>
                </FormControl>
                <SearchBar
                    style={ {flex: '5', height: '40px'} }
                    value={ searched }
                    onChange={ (searchVal) => requestSearch(searchVal) }
                    onCancelSearch={ () => cancelSearch() }
                />
            </div>
            <Paper sx={ {width: '100%', overflow: 'hidden'} }>
                <TableContainer sx={ {maxHeight: 724} } component={ Paper }>
                    <Table aria-label="collapsible table sticky">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell
                                    style={ {top: 0, position: 'sticky'} }>
                                    <img src={ baseballImg } alt="baseball"/>
                                </StyledTableCell>
                                { mainColumnObject.map((column) => (
                                    <StyledTableCell
                                        key={ column.id }
                                        align={ column.align }
                                        style={ {
                                            top: 0,
                                            position: 'sticky',
                                            paddingTop: 30,
                                            paddingBottom: 30,
                                        } }
                                    >
                                        <TableSortLabel
                                            active={ orderBy === column.id }
                                            direction={ orderBy === column.id ? order : 'asc' }
                                            onClick={ createSortHandler(column.id) }
                                        >
                                            <h2>{ column.label }</h2>
                                            { orderBy === column.id ? (
                                                <Box component="span" sx={ visuallyHidden }>
                                                    { order === 'desc' ? 'sorted descending' : 'sorted ascending' }
                                                </Box>
                                            ) : null }
                                        </TableSortLabel>
                                    </StyledTableCell>
                                )) }
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            { rows && stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <Rows key={ index } row={ row }/>
                                    )
                                }) }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={ [10, 25, 50, 100] }
                    component="div"
                    count={ rows.length }
                    rowsPerPage={ rowsPerPage }
                    page={ page }
                    onPageChange={ handleChangePage }
                    onRowsPerPageChange={ handleChangeRowsPerPage }
                    ActionsComponent={ TablePaginationActions }
                    style={ {backgroundColor: 'rgba(130,202,157,0.7)'} }
                />
            </Paper>
        </>
    )
}
