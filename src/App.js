import './App.css'
import CollapsibleTable from './components/CollapsibleTable/CollapsibleTable'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { grey } from '@mui/material/colors'
import BarGraph from './components/BarGraph/BarGraph'

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'dark' && {
            background: {
                default: grey[900],
                paper: grey[900],
            },
        }),
    },
})

function App() {
    const darkModeTheme = createTheme(getDesignTokens('dark'))

    return (
        <div className="App">
            <ThemeProvider theme={ darkModeTheme }>
                <CssBaseline/>
                <div className={'container1'}>
                    <BarGraph/>
                </div>
                <div className={ 'container' }>
                    <div className={ 'title' }>
                        <h1>Batted Ball Data</h1>
                    </div>
                    <CollapsibleTable/>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default App
