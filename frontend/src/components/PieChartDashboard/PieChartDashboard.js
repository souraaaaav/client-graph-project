import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyData } from '../Dashboard/CompanyData/CompanyData';
import DashboardLoader from '../Dashboard/DashboardLoader/DashboardLoader';
import './PieChartDashboard.css';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const PieChartDashboard = () => {
    const user = useSelector(state => state.auth.user);

    const [company, setCompany] = useState(null);
    const [share, setShare] = useState(null);
    const [pieName, setPieName] = useState(null);
    const [tickerList, setTickerList] = useState([]);
    const [graphData, setGraphData] = useState(null);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(null);
    const [labelList, setLabelList] = useState([]);
    const [shareList, setShareList] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
        handleGraph(arr);

    };
    const handleRemove = (ind) => {
        let arr = [...tickerList];
        console.log('array b', arr);
        console.log(ind);
        arr.splice(ind, 1);
        console.log('array a', arr);

        handleGraph(arr);

    };

    const handleGraph = (arr) => {
        if (company === null || share === null) {
            toast.warning('please fill all the value');
            return;
        }
        setLoading(true);
        const ticker_list = [];
        const share_list = [];
        arr.forEach((el, i) => {
            ticker_list.push(el.company);
            share_list.push(el.share);
        });
        console.log('ticker', ticker_list, share_list);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'ticker_list': ticker_list, 'share_list': share_list });
        axios.post('http://localhost:8000/api/annual-portfolio/', body, config)
            .then(response => {
                setGraphData(response.data.data);
                let labelArr = [];
                let seriesArr = [];
                let shareArr = [];
                for (let i = 0; i < response.data.data.length; i++) {
                    labelArr.push(response.data.data[i][0]);
                    seriesArr.push(response.data.data[i][4]);
                    shareArr.push(parseFloat(response.data.data[i][3]).toFixed(2));
                }
                setLabelList(labelArr);
                setSeriesList(seriesArr);
                setShareList(shareArr);
                setTickerList(arr);
                setTotal(response.data.total);
                setLoading(false);
                toast.success("successfully got the data");

            }).catch(err => {

                setLoading(false);

                if (err.response.data.unavailable) {
                    toast.error("please type a valid ticker");
                }
                else
                    toast.error("something went wrong");

            });

    };
    const handleSave = () => {
        if (labelList.length === 0 || shareList.length === 0) {
            toast.warning('please fill all the value');
            handleClose();

            return;
        }
        handleClose();
        setLoading(true);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'email': user.email, 'name': pieName, 'dataArr': [labelList, shareList] });

        axios.post('http://localhost:8000/api/save-pie/', body, config)
            .then(response => {
                setLoading(false);
                response.data.overflow ?
                    toast.warn("you have already saved 5 graph ") :
                    toast.success("successfully Saved the pie chart");
                console.log(response.data);
            })
            .catch(err => {
                setLoading(false);
                toast.error("something went wrong in saving");
                console.log(err);

            });

    };
    const config = {
        options: {
            labels: labelList,
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "Annual total dividend ($) = " + parseFloat(val).toFixed(2);
                    },
                }
            },
        },
        series: seriesList,

    };
    console.log('share', share);
    return (
        <div className="App">
            <h2 style={{ marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 400 }}>Annual Portfolio Dividends
            </h2>
            <div className='search-component'>

                <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker" variant="outlined" value={company} onChange={(e) => {
                    setCompany(e.target.value.toUpperCase());
                }} />

                <TextField id="outlined-basic" label="# of Shares" variant="outlined" value={share} onChange={(e) => setShare(e.target.value)} />



                <Button variant="contained" className='dashboard-button' onClick={handleAddList}>Add to List</Button>
                {user &&
                    <Button variant="contained" className='dashboard-button' onClick={handleOpen}>Save PieChart</Button>
                }

            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box textAlign='center'>
                        <TextField sx={{ width: 500, marginBottom: 5 }} id="outlined-basic" label="Name of PieChart" variant="outlined" value={pieName} onChange={(e) => setPieName(e.target.value)} />
                    </Box>
                    <Box textAlign='center'>
                        <Button variant="contained" onClick={handleSave}>Save</Button>
                    </Box>

                </Box>
            </Modal>

            <div className='inner-pie-wrapper'>
                <div className="table-wrapper">

                    {total && <p>Total amount of dividends collected per year: {loading ? <DashboardLoader /> : <b>${total}</b>}</p>}
                    <table className='content-table'>
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Price</th>
                                <th>Div. Yield (%)</th>
                                <th>Annual Div Per Share ($)</th>
                                <th>Total Shares</th>
                                <th>Annual Total Dividend ($)</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading === true ? <tr><td colSpan="6"><DashboardLoader /></td></tr> : (labelList && seriesList && labelList.length > 0 && seriesList.length > 0) ?
                                graphData && graphData.map((el, ind) => (
                                    <tr>
                                        <td>{el[0] ? el[0] : 'none'}</td>
                                        <td>{el[1] ? el[1].toFixed(2) : 'none'}</td>
                                        <td>{el[5] ? el[5].toFixed(2) : 'none'}</td>
                                        <td>{el[2] ? el[2].toFixed(2) : 'none'}</td>
                                        <td>{el[3] ? el[3] : 'none'}</td>
                                        <td>{el[4] ? el[4].toFixed(2) : 'none'}</td>
                                        <td onClick={() => handleRemove(ind)}><i class='bx bxs-trash remove-row'></i></td>
                                    </tr>
                                ))
                                : <tr><td colSpan="6">Select a Ticker</td></tr>}
                        </tbody>
                    </table>
                </div>
                {
                    loading === true ? <DashboardLoader /> : (labelList && seriesList && labelList.length > 0 && seriesList.length > 0) ? <div className="pie-wrapper">
                        <Chart options={config.options} series={config.series} type="pie" width="380" />

                    </div> : null

                }

            </div>
            <div className='info-text'>
                <br />
                <br />
                <h1 style={{ textDecoration: 'underline' }}>How to Use?</h1>
                <br />
                This tool will output a data table and interactive pie chart displaying the amount of dividends that will be paid annually (per year) for owning a particular portfolio of stocks. There is a limit of 15 stocks per table. In order to save the table the user must register an account. There is a save limit of 5 total tables per account. The saved tables will be found under the “Saved Tables” icon in the side-bar.
                <br /><br />
                <b>Ticker: </b>   Enter in a valid ticker symbol. A ticker symbol is a unique series of letters that represents a publicly traded company's stock on a stock exchange. Some popular ticker symbols include “AAPL” = Apple, “MSFT” = Microsoft, “AMZN” = Amazon, or “TSLA” = Tesla.
                <br /><br />
                <b># of Shares: </b> Enter the total number of shares owned for the specified ticker.
                <br />
                <br />
                <p style={{ textAlign: 'center', textDecoration: 'underline' }} >
                    <a href="/terms" className="terms">
                        Terms & Conditions

                    </a>
                </p>
                <br />
            </div>
        </div >
    );
};

export default PieChartDashboard;
