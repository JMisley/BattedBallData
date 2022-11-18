import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import * as React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FormControl, MenuItem, Select } from '@mui/material'
import DisparityTable from '../DisparityTable/DisparityTable'

function toObject(keys, values) {
    let object = {}
    for (let i = 0; i < keys.length; i++) {
        if (typeof values[i] === 'number')
            values[i] = roundData(values[i])
        object[keys[i]] = values[i]
    }
    return object
}

function roundData(data) {
    return Math.round(data * 100) / 100
}

export default function BarGraph() {
    const [data, setData] = useState(null)
    const [rows, setRows] = useState([])
    const [disparityRows, setDisparityRows] = useState([])
    const [causeOne, setCauseOne] = useState('LAUNCH_ANGLE')
    const [causeTwo, setCauseTwo] = useState('EXIT_SPEED')

    const causeHashMap = new Map([
        ['LAUNCH_ANGLE', 'F'],
        ['EXIT_SPEED', 'G'],
        ['EXIT_DIRECTION', 'H'],
        ['HIT_DISTANCE', 'I'],
        ['HANG_TIME', 'J'],
        ['HIT_SPIN_RATE', 'K']
    ])

    function causeToTitle(cause) {
        cause = cause.replaceAll('_', ' ')
        return cause.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
            }
        )
    }

    const query = `
    SELECT AVG(${ causeHashMap.get(causeOne) }), AVG(${ causeHashMap.get(causeTwo) }), L 
    WHERE L = \'HomeRun\' or L = \'Triple\' or L = \'Double\' or L = \'Single\' or L = \'Out\' 
    GROUP BY L
    `

    const sheetID = '1OzWBsRY8rOVJzqfD-pihzgMM-rsGB7RL'
    const base = `https://docs.google.com/spreadsheets/d/${ sheetID }/gviz/tq?tq=${ query }`

    useEffect(() => {
        async function fetchData() {
            await axios.get(base)
                .then(response => {
                    setData(JSON.parse(response.data.substring(47).slice(0, -2)).table)
                })
        }

        fetchData()
    }, [base])

    useEffect(() => {
        if (data !== null) {
            let temp = createRows()
            if (!arraysEqual(temp, rows)) {
                setRows(createRows)
            }
            if (rows !== []) {
                setDisparityRows(createDisparityRows)
            }
        }
    }, [data, rows])

    function createRows() {
        if (data !== null) {
            const cols = []
            let mainRows = []
            let objArray = []

            for (let x = 0; x < data.rows.length; x++) {
                for (let y = 0; y < data.cols.length; y++) {
                    if (data.rows[x].c[y] === null)
                        mainRows.push('N/A')
                    else
                        mainRows.push(data.rows[x].c[y].v)

                    if (x === 0)
                        cols.push(data.cols[y].label)
                }
                objArray.push(toObject(cols, mainRows))
                mainRows = []
            }
            const organizedArray = ['HomeRun', 'Triple', 'Double', 'Single', 'Out']
            objArray = objArray.sort((x, y) => {
                return organizedArray.indexOf(x.PLAY_OUTCOME) - organizedArray.indexOf(y.PLAY_OUTCOME)
            })
            return objArray
        }
    }

    function createDisparityRows() {
        let disparityRows = []
        let objArray = []
        let cols = ['cause', 'homeTriple', 'tripleDouble', 'doubleSingle', 'singleOut']
        let causes = [causeOne, causeTwo]
        for (let y = 0; y < causes.length; y++) {
            disparityRows.push(causeToTitle(causes[y]))
            for (let x = 0; x < rows.length - 1; x++) {
                let disparity = getDisparityPercent(rows[x][Object.keys(rows[x])[y]], rows[x + 1][Object.keys(rows[x])[y]])
                disparityRows.push(disparity)
            }
            objArray.push(toObject(cols, disparityRows))
            disparityRows = []
        }
        return objArray
    }

    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={ {
                    color: 'gray',
                    textAlign: 'left',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '20px'
                } }>
                    <p className="label">{ `${ label }` }</p>
                    <p className="label" style={ {color: '#82ca9d'} }>{ `${ payload[0].value } mph` }</p>
                    <p className="label" style={ {color: '#8884d8'} }>{ `${ payload[1].value }\u00b0` }</p>
                </div>
            )
        }
        return null
    }

    const changeCauseOne = (e) => {
        setCauseOne(e.target.value)
    }

    const changeCauseTwo = (e) => {
        setCauseTwo(e.target.value)
    }

    return (
        <>
            <h1>How
                <FormControl size={ 'small' } style={ {
                    flex: '1',
                    backgroundColor: '#65619e',
                    marginRight: 7,
                    marginLeft: 7
                } }>
                    <Select value={ causeOne } onChange={ changeCauseOne }>
                        { Array.from(causeHashMap.keys()).map((causeValue) => {
                            if (causeTwo !== causeValue)
                                return (
                                    <MenuItem value={ causeValue }>{ causeToTitle(causeValue) }</MenuItem>
                                )
                        }) }
                    </Select>
                </FormControl>
                and
                <FormControl size={ 'small' } style={ {
                    flex: '1',
                    backgroundColor: '#467259',
                    marginRight: 7,
                    marginLeft: 7
                } }>
                    <Select value={ causeTwo } onChange={ changeCauseTwo }>
                        { Array.from(causeHashMap.keys()).map((causeValue) => {
                            if (causeOne !== causeValue)
                                return (
                                    <MenuItem value={ causeValue }>{ causeToTitle(causeValue) }</MenuItem>
                                )
                        }) }
                    </Select>
                </FormControl>
                Correlate to Play Outcome</h1>
            <BarChart
                width={ 1100 }
                height={ 400 }
                data={ rows }
                margin={ {
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                } }
            >
                <CartesianGrid strokeDasharray="0 0"/>
                <XAxis dataKey="PLAY_OUTCOME"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey={ `avg ${ causeOne }` } name= { `Average ${causeToTitle(causeOne)}` } fill="#8884d8"/>
                <Bar dataKey={ `avg ${ causeTwo }` } name={ `Average ${causeToTitle(causeTwo)}` } fill="#82ca9d"/>
            </BarChart>
            <br/>
            <br/>
            <h1>Percentage Difference Table</h1>
            <DisparityTable rows={ disparityRows }/>
        </>
    )
}

function getDisparityPercent(value1, value2) {
    let numerator = Math.abs(Math.abs(value1) - Math.abs(value2))
    let denominator = (value1 + value2) / 2
    return Math.abs(Math.round(((numerator / denominator) * 100) * 100) / 100)
}

const objectsEqual = (o1, o2) =>
    typeof o1 === 'object' && Object.keys(o1).length > 0
        ? Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
        : o1 === o2

const arraysEqual = (a1, a2) =>
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]))
