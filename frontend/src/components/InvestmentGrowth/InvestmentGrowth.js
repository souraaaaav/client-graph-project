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
        if (year === null || investment === null || growthRate === null || addContrib === null || contribRate === null) {
            toast.warning('please fill all the value');
            return;
        }
        if (year > 50) {
            toast.warning('Please select from 1-50 years');
            return;
        }
        if (investment > 1000000) {
            toast.warning("investment value can't be greater than 1,000,000$");
            return;
        }
        if (growthRate > 0.2) {
            toast.warning("Please select growth rate from 0-0.2");
            return;
        }
        if (addContrib > 10000) {
            toast.warning("additional contribution can't be greater than 10,000$");
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
        axios.post('http://35.173.177.244:8000/api/investment-growth/', body, config)
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
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Growth of Shares with DRIP</h2>
            <div className='search-component investment-wrapper'>
                <div className='investment-outer-wrapper'>
                    <div className='investment-inner-wrapper'>
                        <TextField id="outlined-basic" label="Initial Investment ($)" variant="outlined" value={investment} onChange={(e) => {
                            setInvestment(e.target.value);
                        }} />
                        <TextField id="outlined-basic" label="Annual Growth Rate" variant="outlined" value={growthRate} onChange={(e) => {
                            setGrowthRate(e.target.value);
                        }} />
                        <TextField id="outlined-basic" label="Additional Contribution" variant="outlined" value={addContrib} onChange={(e) => {
                            setAddContrib(e.target.value);
                        }} />
                    </div>
                    <div className='investment-inner-wrapper'>


                        <FormControl sx={{ minWidth: 270 }}>
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
                        <TextField sx={{ minWidth: 270 }} id="outlined-basic" label="# of Years" variant="outlined" value={year} onChange={(e) => {
                            setYear(e.target.value);
                        }} />
                    </div>
                </div>
                <Button variant="contained" className='dashboard-button' onClick={handleSearch}>Create Graph</Button>

            </div>

            <div className='stack-chart-wrapper'>
                {
                    loading === true ? <DashboardLoader /> :
                        data !== null ? <InvestmentGrowthChart data={data} /> :
                            null
                }
            </div>
            <div className='info-text'>
                <br />
                <br />
                <h1 style={{ textDecoration: 'underline' }}>How to Use?</h1>
                <br />

                This tool will output an interactive bar chart showing the growth of an initial investment with periodic contributions over a specified number of years.
                <br /><br />
                <b>Initial Investment ($): </b>
                Enter an initial investment amount up to $1,000,000.
                <br /><br /><b>Annual Growth Rate: </b>
                This is an average measure of how much the price of the stock has increased on a yearly basis, expressed as a percentage. The value must be between 0.00-0.20.
                <br /><br /><b>Additional Contribution: </b>
                Amount of money that will be invested after the “Initial Investment”.
                <br /><br /><b>Contribution Rate: </b>
                This is how often the “Additional Contribution” amount is made per year. For example, if “semi-annually” is chosen for “Contribution Rate” and $100 is entered for the “Additional Contribution”, then an additional investment of $100 will be made twice a year ($200 total per year).
                <br /><br /><b># of Years: </b>
                The number of years the investment will have to grow.
                <br />
                <br />
                <p style={{ textAlign: 'center', textDecoration: 'underline' }} >
                    <a href="/terms" className="terms">
                        Terms & Conditions

                    </a>
                </p>
                <br />
            </div>
        </div>
    );
};

export default MultipleLineDashboard;
