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
    const [company1, setCompany1] = useState(null);
    const [company2, setCompany2] = useState(null);
    const [company3, setCompany3] = useState(null);
    const [company4, setCompany4] = useState(null);
    const [company5, setCompany5] = useState(null);
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
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffTime = (date2 - date1);

    const handleSearch = () => {
        if (company1 === null || startDate.length === 0 || endDate.length === 0 || investment === null) {
            toast.warning('please fill all the value');
            return;
        }
        if (investment > 1000000) {
            toast.warning("investment value can't be greater than 1,000,000$");
            return;
        }
        if (diffTime <= 0) {
            toast.warning('end date have to greater than start date');
            return;
        }

        setLoading(true);
        setData(null);
        let compArr = [];
        console.log(company3?.length);
        if (company1 !== null && (company1 && company1.length !== 0)) compArr.push(company1);
        if (company2 !== null && (company2 && company2.length !== 0)) compArr.push(company2);
        if (company3 !== null && (company3 && company3.length !== 0)) compArr.push(company3);
        if (company4 !== null && (company4 && company4.length !== 0)) compArr.push(company4);
        if (company5 !== null && (company5 && company5.length !== 0)) compArr.push(company5);
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
                if (err.response.data.unavailable) {
                    toast.error("please type a valid ticker");
                }
                else
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
    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Hypothetical Growth of Tickers</h2>
            <div className='search-component investment-wrapper'>

                <div className='investment-outer-wrapper'>
                    <div className='investment-inner-wrapper'>
                        <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker 1" variant="outlined" value={company1} onChange={(e) => {
                            setCompany1(e.target.value.toUpperCase());
                        }} />
                        <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker 2" variant="outlined" value={company2} onChange={(e) => {
                            setCompany2(e.target.value.toUpperCase());
                        }} />
                        <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker 3" variant="outlined" value={company3} onChange={(e) => {
                            setCompany3(e.target.value.toUpperCase());
                        }} />
                        <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker 4" variant="outlined" value={company4} onChange={(e) => {
                            setCompany4(e.target.value.toUpperCase());
                        }} />
                        <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker 5" variant="outlined" value={company5} onChange={(e) => {
                            setCompany5(e.target.value.toUpperCase());
                        }} />
                    </div>
                    <div className='investment-inner-wrapper' style={{ alignItems: 'center' }}>
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
                    </div>
                </div>
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
            <br />
            <br />
            <h1 style={{ textDecoration: 'underline' }}>How to Use?</h1>
            <br />
            This tool will output an interactive line graph displaying the hypothetical growth of an investment over a specified period of time for a particular stock(s). Enter up to 5 stocks at a time to compare their performances.
            <br /><br />
            <b>Ticker: </b>
            Enter in a valid ticker symbol. Up to 5 ticker symbols can be entered. A ticker symbol is a unique series of letters that represents a publicly traded company's stock on a stock exchange. Some popular ticker symbols include “AAPL” = Apple, “MSFT” = Microsoft, “AMZN” = Amazon, or “TSLA” = Tesla.
            <br /><br />
            <b>Start Date: </b>
            Start date of the stock’s price history.
            <br /><br />
            <b>End Date: </b>
            End date of the stock’s price history.
            <br /><br />
            <b>Investment ($): </b>
            Enter the total amount of money invested at the “Start Date”.
            <br /><br />
            <b>DRIP: </b>
            DRIP stands for “Dividend Reinvestment Plan”. If DRIP is set to True, this will account for any dividends paid and any stock splits in the stock’s price history. If DRIP is set to False, this will NOT account for any dividends paid and stock splits in the stock’s price history.
            <br />
            <br />
            <p style={{ textAlign: 'center', textDecoration: 'underline' }} >
                <a href="/terms" className="terms">
                    Terms & Conditions

                </a>
            </p>
            <br />
        </div>
    );
};

export default MultipleLineDashboard;
