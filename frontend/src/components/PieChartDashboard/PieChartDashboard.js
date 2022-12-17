import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { companyData } from '../Dashboard/CompanyData/CompanyData';


const PieChartDashboard = () => {
    const [company, setCompany] = useState(null);
    const [share, setShare] = useState(null);
    const [tickerList, setTickerList] = useState([]);
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(null);
    const options = companyData.map((option) => {
        const firstLetter = option.label[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });
    const handleAddList = () => {
        let arr = [...tickerList];
        arr.push({ 'company': company, 'share': share });
        console.log(arr);
        setTickerList(arr);

    };
    const handleRemoveLast = () => {
        let arr = [...tickerList];
        arr.pop();
        setTickerList(arr);
    };
    const handleShare = (e) => {
        console.log(e.target.value);
        setShare(e.target.value);
    };
    const handleGraph = () => {
        setLoading(true);

    };
    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center' }}>Stock Ticker Price History</h2>
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
                    renderInput={(params) => <TextField {...params} label="With categories" />}
                />
                <TextField id="outlined-basic" label="Share" variant="outlined" value={share} onChange={(e) => handleShare(e)} />



                <Button variant="contained" onClick={handleAddList}>Add to List</Button>
                <Button variant="contained" onClick={handleRemoveLast}>Remove last</Button>
                <Button variant="contained">Create Graph</Button>
            </div>
            <div>
                <table border={1}>
                    <tr>
                        <th>Ticker</th>
                        <th>Ticker label</th>
                        <th>Ticker label</th>
                    </tr>
                    {
                        tickerList && tickerList.map((el) => (
                            <tr>

                                <td>{el.company.id}</td>
                                <td> {el.company.label}</td>
                                <td>{el.share}</td>
                            </tr>

                        ))
                    }
                </table>

            </div>
        </div>
    );
};

export default PieChartDashboard;
