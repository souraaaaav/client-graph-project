import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLoader from '../Dashboard/DashboardLoader/DashboardLoader';
import './InvestmentGrowth.css';
import InvestmentGrowthChart from './InvestmentGrowthChart/InvestmentGrowthChart';

const MultipleLineDashboard = () => {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(null);
    const [investment, setInvestment] = useState(null);
    const [growthRate, setGrowthRate] = useState(null);
    const [addContrib, setAddContrib] = useState(null);
    const [contribRate, setContribRate] = useState(null);




    const handleSearch = () => {
        if (year > 25) {
            toast.warning('Please select from 1-25 years');
            return;
        }
        setLoading(true);
        setData(null);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'investment': investment, 'year': year, 'growthRate': growthRate, 'addContrib': addContrib, 'contribRate': contribRate });
        console.log(body);
        axios.post('http://localhost:8000/api/investment-growth/', body, config)
            .then(response => {
                setLoading(false);
                toast.success("successfully got the data");
                console.log(response.data);
                setData(response.data);

            }).catch(err => {
                setLoading(false);
                toast.error("something went wrong");

            });
    };


    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center' }}>Stock Ticker Price History</h2>
            <div className='search-component'>

                <TextField id="outlined-basic" label="Initial Investment($)" variant="outlined" value={investment} onChange={(e) => {
                    setInvestment(e.target.value);
                }} />
                <TextField id="outlined-basic" label="Annual Growth Rate" variant="outlined" value={growthRate} onChange={(e) => {
                    setGrowthRate(e.target.value);
                }} />
                <TextField id="outlined-basic" label="Additional Contribution" variant="outlined" value={addContrib} onChange={(e) => {
                    setAddContrib(e.target.value);
                }} />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Contribution Rate</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={contribRate}
                        label="Contribution Rate"
                        onChange={(e) => { console.log(e.target.value); setContribRate(e.target.value); }}
                    >
                        <MenuItem value="annual">annual</MenuItem>
                        <MenuItem value="semi-annual">semi-annual</MenuItem>
                        <MenuItem value="monthly">monthly</MenuItem>
                        <MenuItem value="bi-weekly">bi-weekly</MenuItem>
                        <MenuItem value="weekly">weekly</MenuItem>
                    </Select>
                </FormControl>
                <TextField id="outlined-basic" label="Year" variant="outlined" value={year} onChange={(e) => {
                    setYear(e.target.value);
                }} />
                <Button variant="contained" onClick={handleSearch}>Create Graph</Button>
            </div>
            <div className='stack-chart-wrapper'>
                {
                    loading === true ? <DashboardLoader /> :
                        data !== null ? <InvestmentGrowthChart data={data} /> :
                            <p style={{ marginTop: '50px' }}> Select a Ticker</p>
                }
            </div>
        </div>
    );
};

export default MultipleLineDashboard;
