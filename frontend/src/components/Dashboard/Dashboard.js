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
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';
import DashboardLoader from './DashboardLoader/DashboardLoader';
import LineChart from './LineChart/LineChart';


const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState(null);
    const [topText, setTopText] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [drip, setDrip] = useState(true);

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
        setLoading(true);
        if (company === null || startDate.length === 0 || endDate.length === 0) {
            toast.warning('please fill all the value');
            setLoading(false);
            return;
        }

        if (diffTime <= 0) {
            toast.warning('end date have to greater than start date');
            setLoading(false);
            return;
        }


        setData(null);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'ticker': company, 'start_date': startDate, 'end_date': endDate, 'drip': drip });
        axios.post('http://35.173.177.244:8000/api/stock-ticker-history/', body, config)
            .then(response => {
                toast.success("successfully got the data");
                setData(response.data.data);
                setTopText(response.data.top);
                setLoading(false);

            }).catch(err => {
                setLoading(false);
                if (err.response.data.unavailable) {
                    toast.error("please type a valid ticker");
                }
                else
                    toast.error("something went wrong");
                console.log(err);
            });
    };



    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Stock Ticker Price History</h2>
            <div className='search-component'>

                <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker" variant="outlined" value={company} onChange={(e) => {
                    setCompany(e.target.value.toUpperCase());
                }} />
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
                        data !== null ?
                            <>
                                <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', marginLeft: '9vw' }}>

                                    <br />
                                    <p>Total return over the specified time period = <b> ${topText[0]} ({topText[1]}%) </b></p>
                                    <p>Annualized return over the specified time period = <b> {topText[2]}% </b></p>
                                </div>
                                <LineChart width={1000} height={600} stockData={data} />

                                {/* <LineChart width={1200} height={600} stockData={data} /> */}
                            </>
                            : <p style={{ marginTop: '50px' }}> Select a Ticker</p>


                }
            </div>
            <div className='info-text'>
                <br />
                <br />
                <h1 style={{ textDecoration: 'underline' }}>How to Use?</h1>
                <br />
                This tool will output an interactive line graph of a particular stock???s price history.
                <br />
                <br />
                <b>Ticker: </b> Enter in a valid ticker symbol. A ticker symbol is a unique series of letters that represents a publicly traded company's stock on a stock exchange. Some popular ticker symbols include ???AAPL??? = Apple, ???MSFT??? = Microsoft, ???AMZN??? = Amazon, or ???TSLA??? = Tesla.
                <br />
                <br />
                <b>Start Date: </b> Start date of the stock???s price history.
                <br />
                <br />
                <b>End Date: </b>  End date of the stock???s price history.
                <br />
                <br />
                <b>DRIP: </b> DRIP stands for ???Dividend Reinvestment Plan???. If DRIP is set to True, this will account for any dividends paid and any stock splits in the stock???s price history. If DRIP is set to False, this will NOT account for any dividends paid and stock splits in the stock???s price history.
                <br />
                <br />
                <p style={{ textAlign: 'center', textDecoration: 'underline' }} >
                    <Link to="/terms" className="terms">
                        Terms & Conditions

                    </Link>
                </p>
                <br />
            </div>
        </div>
    );
};

export default Dashboard;
