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
        if (year === null || annualDiv === null || growthRate === null || divYeild === null || iniPrice === null || iniShare === null) {
            toast.warning('Please fill all the values.');
            return;
        }

        if (year > 50) {
            toast.warning('Please select from 1-50 years');
            return;
        }

        if (iniPrice > 1000) {
            toast.warning("The initial price can't be greater than $1000.");
            return;
        }
        if (iniShare > 1000) {
            toast.warning("The number of shares can't be greater than 1000.");
            return;
        }
        if (growthRate > 0.2) {
            toast.warning("Please select growth rate from 0.0-0.2");
            return;
        }
        if (divYeild > 0.25) {
            toast.warning("Please select div yield from 0.00-0.25");
            return;
        }
        if (annualDiv > 0.25) {
            toast.warning("Please select annual div growth rate from 0.00-0.25");
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
                toast.success("Successfully got the data.");
                console.log(response.data);
                setData(response.data);

            }).catch(err => {
                setLoading(false);
                toast.error("Something went wrong.");

            });
    };


    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Periodic Contribution Investment Growth</h2>
            <div className='search-component investment-wrapper'>
                <div className='investment-outer-wrapper'>
                    <div className='investment-inner-wrapper'>

                        <TextField id="outlined-basic" label="# of Shares" variant="outlined" value={iniShare} onChange={(e) => {
                            setIniShare(e.target.value);
                        }} />

                        <TextField id="outlined-basic" label="Share Price" variant="outlined" value={iniPrice} onChange={(e) => {
                            setIniPrice(e.target.value);
                        }} />

                        <TextField id="outlined-basic" label="Annual Growth Rate" variant="outlined" value={growthRate} onChange={(e) => {
                            setGrowthRate(e.target.value);
                        }} />
                    </div>
                    <div className='investment-inner-wrapper'>

                        <TextField id="outlined-basic" label="Div. Yield" variant="outlined" value={divYeild} onChange={(e) => {
                            setDivYeild(e.target.value);
                        }} />
                        <TextField id="outlined-basic" label="Annual Div. Growth Rate" variant="outlined" value={annualDiv} onChange={(e) => {
                            setAnnualDiv(e.target.value);
                        }} />
                        <TextField id="outlined-basic" label="# of Years" variant="outlined" value={year} onChange={(e) => {
                            setYear(e.target.value);
                        }} />
                    </div>
                </div>
                <Button variant="contained" className='dashboard-button' onClick={handleSearch}>Create Table</Button>
            </div>
            <div className='chart-wrapper'>
                <div className='mui-wrapper'>
                {
                    loading === true ? <DashboardLoader /> :
                        data !== null ? <GrowthOfShareTable data={data} /> :
                            null
                }
                </div>
            </div>
            <div className='info-text'>
                <br />
                <br />
                <h1 style={{ textDecoration: 'underline' }}>How to Use?</h1>
                <br />
                This tool will output a data table showing the growth of shares over a specified number of years with Dividend Reinvestment Plan (DRIP). The table will show the growth per year of the investment.
                <br /><br />
                <b># of Shares: </b>
                Total number of shares owned.
                <br /><br /><b>Share Price: </b>
                Cost per share of a particular security.
                <br /><br /><b>Annual Growth Rate: </b>
                This is an average measure of how much the price of the stock has increased on a yearly basis, expressed as a percentage. The value must be between 0.00-0.20.
                <br /><br /><b>Div. Yield: </b>
                A dividend yield is a financial ratio that shows how much a company pays out in dividends each year relative to its share price. It is calculated by dividing the annual dividend per share by the price per share. For example, if a company has a dividend yield of 0.03 (3%) and the current price per share is $50, it means that the company is paying out $1.50 in dividends per year for each share that is owned. The value must be between 0.00-0.25
                <br /><br /><b>
                    Annual Div. Growth Rate: </b>
                The annual dividend growth rate is the percentage by which a company's dividends per share (DPS) increase from one year to the next. It is calculated by dividing the change in DPS by the previous year's DPS and expressing the result as a percentage. For example, if a company paid a dividend of $1 per share in 2020 and $1.10 per share in 2021, its annual dividend growth rate would be: (1.10 - 1) / 1 = 0.10. Annual dividend growth rate = 10%.
                <br /><br /><b>
                    # of Years: </b>
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

export default GrowthOfShare;
