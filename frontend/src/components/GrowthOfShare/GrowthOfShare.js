import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLoader from '../Dashboard/DashboardLoader/DashboardLoader';
import './GrowthOfShare.css';
import GrowthOfShareTable from './GrowthOfShareTable/GrowthOfShareTable';

const GrowthOfShare = () => {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(null);
    const [annualDiv, setAnnualDiv] = useState(null);
    const [divYeild, setDivYeild] = useState(null);
    const [growthRate, setGrowthRate] = useState(null);
    const [iniPrice, setIniPrice] = useState(null);
    const [iniShare, setIniShare] = useState(null);




    const handleSearch = () => {
        if (year > 50) {
            toast.warning('Please select from 1-50 years');
            return;
        }
        setLoading(true);
        setData(null);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'divYeild': divYeild, 'year': year, 'growthRate': growthRate, 'iniPrice': iniPrice, 'iniShare': iniShare, 'annualDiv': annualDiv });
        console.log(body);
        axios.post('http://localhost:8000/api/growth-of-share/', body, config)
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
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Stock Ticker Price History</h2>
            <div className='search-component'>

                <TextField id="outlined-basic" label="Initial Share" variant="outlined" value={iniShare} onChange={(e) => {
                    setIniShare(e.target.value);
                }} />

                <TextField id="outlined-basic" label="Share Price" variant="outlined" value={iniPrice} onChange={(e) => {
                    setIniPrice(e.target.value);
                }} />

                <TextField id="outlined-basic" label="Annual Growth Rate" variant="outlined" value={growthRate} onChange={(e) => {
                    setGrowthRate(e.target.value);
                }} />

                <TextField id="outlined-basic" label="Div Yield" variant="outlined" value={divYeild} onChange={(e) => {
                    setDivYeild(e.target.value);
                }} />
                <TextField id="outlined-basic" label="Annual Div Growth Rate" variant="outlined" value={annualDiv} onChange={(e) => {
                    setAnnualDiv(e.target.value);
                }} />
                <TextField id="outlined-basic" label="Year" variant="outlined" value={year} onChange={(e) => {
                    setYear(e.target.value);
                }} />
                <Button variant="contained" onClick={handleSearch}>Create Table</Button>
            </div>
            <div className='chart-wrapper'>
                {
                    loading === true ? <DashboardLoader /> :
                        data !== null ? <GrowthOfShareTable data={data} /> :
                            <p style={{ marginTop: '50px' }}> Select a Ticker</p>
                }
            </div>
        </div>
    );
};

export default GrowthOfShare;
