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
import { companyData } from './CompanyData/CompanyData';
import './Dashboard.css';
import DashboardLoader from './DashboardLoader/DashboardLoader';
import LineChart from './LineChart/LineChart';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState(null);
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

    const handleSearch = () => {
        if (company === null || startDate.length === 0 || endDate.length === 0) {
            toast.warning('please fill all the value');
            return;
        }
        setLoading(true);
        setData(null);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'ticker': company.id, 'start_date': startDate, 'end_date': endDate, 'drip': drip });
        axios.post('http://localhost:8000/api/stock-ticker-history/', body, config)
            .then(response => {
                setLoading(false);
                toast.success("successfully got the data");
                setData(response.data);
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

    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Stock Ticker Price History</h2>
            <div className='search-component'>

                <Autocomplete
                    id="grouped-demo"
                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.label}
                    value={company}
                    onChange={(_event, newValue) => {
                        console.log(newValue);
                        setCompany(newValue);
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Ticker" />}
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
                            <LineChart width={1200} height={600} stockData={data} /> : <p style={{ marginTop: '50px' }}> Select a Ticker</p>
                }
            </div>
        </div>
    );
};

export default Dashboard;
