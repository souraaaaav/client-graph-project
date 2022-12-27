import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { companyData } from '../Dashboard/CompanyData/CompanyData';
import DashboardLoader from '../Dashboard/DashboardLoader/DashboardLoader';
import DoubleLineChart from './DoubleLineChart/DoubleLineChart';
import './MultipleLineDashboard.css';
import PentaLineChart from './PentaLineChart/PentaLineChart';
import QuadLineChart from './QuadLineChart/QuadLineChart';
import SingleLineChart from './SingleLineChart/SingleLineChart';
import TripleLineChart from './TripleLineChart/TripleLineChart';

const MultipleLineDashboard = () => {
    const [data, setData] = useState(null);
    const [tickerSeries, setTickerSeries] = useState(null);
    const [loading, setLoading] = useState(false);
    const [drip, setDrip] = useState(true);
    const [company, setCompany] = useState(null);
    const [investment, setInvestment] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartChange = (newValue) => {

        const finalDate = newValue["$y"] + "-" + (newValue["$M"] + 1) + "-" + newValue["$D"];
        console.log(startDate);
        setStartDate(finalDate);
    };
    const handleStopChange = (newValue) => {

        const finalDate = newValue["$y"] + "-" + (newValue["$M"] + 1) + "-" + newValue["$D"];
        console.log(finalDate);
        setEndDate(finalDate);
    };

    const handleDrip = () => {
        setDrip(prev => !prev);
    };

    const handleSearch = () => {
        setLoading(true);
        setData(null);
        let compArr = [];
        for (let i = 0; i < company.length; i++) {
            compArr.push(company[i].id);
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'ticker': compArr, 'start_date': startDate, 'end_date': endDate, 'investment': investment, 'drip': drip });
        console.log(body);
        axios.post('http://localhost:8000/api/stock-ticker-comparison/', body, config)
            .then(response => {
                setLoading(false);
                toast.success("successfully got the data");
                console.log(response.data);
                setData(response.data.data);
                setTickerSeries(response.data.ticker_serial);
            }).catch(err => {
                setLoading(false);
                toast.error("something went wrong");

            });
    };
    const options = companyData.map((option) => {
        const firstLetter = option.label[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });
    console.log(company);
    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Hypothetical Growth of Tickers</h2>
            <div className='search-component'>

                <Autocomplete
                    multiple
                    limitTags={2}
                    id="tags-standard"
                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.label}
                    getOptionDisabled={(options) => (company && company.length > 4 ? true : false)}


                    onChange={(_event, newValue) => {
                        console.log(newValue);
                        setCompany(newValue);
                    }}
                    sx={{ width: 400 }}
                    renderInput={(params) => <TextField
                        {...params} label="Select up to 5 tickers " />}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        label="Start Date"
                        inputFormat="MM/DD/YYYY"
                        value={startDate}
                        onChange={handleStartChange}
                        disableFuture={true}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <DesktopDatePicker
                        label="End Date"
                        inputFormat="MM/DD/YYYY"
                        value={endDate}
                        onChange={handleStopChange}
                        disableFuture={true}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <TextField id="outlined-basic" label="Investment ($)" variant="outlined" value={investment} onChange={(e) => {
                    console.log(e.target.value); setInvestment(e.target.value);
                }} />

                <FormControl sx={{ m: 1, minWidth: 100 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">DRIP</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={drip}
                        label="Age"
                        onChange={handleDrip}
                    >
                        <MenuItem value={false}>False</MenuItem>
                        <MenuItem value={true}>True</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" className='dashboard-button' onClick={handleSearch}>Create Graph</Button>
            </div>
            <div className='Linechart-wrapper'>
                {
                    loading === true ? <DashboardLoader /> :
                        data !== null && tickerSeries && tickerSeries.length === 2 ?
                            <SingleLineChart width={1200} height={600} stockData={data} tickerSeries={tickerSeries} /> :
                            data !== null && tickerSeries && tickerSeries.length === 3 ?
                                <DoubleLineChart width={1200} height={600} stockData={data} tickerSeries={tickerSeries} /> :
                                data !== null && tickerSeries && tickerSeries.length === 4 ?
                                    <TripleLineChart width={1200} height={600} stockData={data} tickerSeries={tickerSeries} /> :
                                    data !== null && tickerSeries && tickerSeries.length === 5 ?
                                        <QuadLineChart width={1200} height={600} stockData={data} tickerSeries={tickerSeries} /> :
                                        data !== null && tickerSeries && tickerSeries.length === 6 ?
                                            <PentaLineChart width={1200} height={600} stockData={data} tickerSeries={tickerSeries} /> :

                                            <p style={{ marginTop: '50px' }}> Select a Ticker</p>
                }
            </div>
        </div>
    );
};

export default MultipleLineDashboard;
