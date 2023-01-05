import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import { companyData } from '../Dashboard/CompanyData/CompanyData';
import DashboardLoader from '../Dashboard/DashboardLoader/DashboardLoader';
import './PieChartDashboard.css';


import { useParams } from 'react-router-dom';


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


const PieChartDetailDashboard = () => {
    const user = useSelector(state => state.auth.user);
    const params = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [share, setShare] = useState(null);
    const [pieName, setPieName] = useState(null);
    const [tickerList, setTickerList] = useState([]);
    const [graphData, setGraphData] = useState(null);
    const [total, setTotal] = useState(null);
    const [editableShareArr, setEditableShareArr] = useState(null);
    const [loading, setLoading] = useState(null);
    const [bigLoading, setBigLoading] = useState(true);
    const [labelList, setLabelList] = useState([]);
    const [shareList, setShareList] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [open, setOpen] = useState(false);


    const getData = React.useCallback(async () => {
        setBigLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ 'email': user.email });

        axios.post(`http://35.173.177.244:8000/api/detail-pie-info/${params.id}/`, body, config)
            .then(response => {
                setGraphData(response.data.data);
                setPieName(response.data.name);
                console.log('inner detail effect', response.data);
                let labelArr = [];
                let seriesArr = [];
                let shareArr = [];
                let tickerUpdate = [];
                for (let i = 0; i < response.data.data.length; i++) {
                    labelArr.push(response.data.data[i][0]);
                    seriesArr.push(response.data.data[i][4]);
                    shareArr.push(parseFloat(response.data.data[i][3]).toFixed(2));
                    tickerUpdate.push({ 'company': response.data.data[i][0], 'share': parseFloat(response.data.data[i][3]).toFixed(2) });
                }
                setLabelList(labelArr);
                setSeriesList(seriesArr);
                setShareList(shareArr);
                setEditableShareArr(shareArr);
                console.log('tickerupdateee'.tickerUpdate);
                setTickerList(tickerUpdate);
                setTotal(response.data.total);

                setBigLoading(false);

            }).catch(err => {

                setBigLoading(false);
                if (err.response.data.unavailable) {
                    toast.error("please type a valid ticker");
                }
                else
                    toast.error("something went wrong");

            });

    }, [user, params]);
    useEffect(() => {
        getData();
    }, [getData]);




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

        console.log(arr, 'arraaaaaaay');
        handleGraph(arr);

    };
    const handleRemove = (ind) => {
        let arr = [...tickerList];
        arr.splice(ind, 1);

        handleGraph(arr, false);

    };

    const handlePreviousEdit = (val, ind) => {

        let arr = [...editableShareArr];
        arr[ind] = val;
        setEditableShareArr(arr);
        // handleGraph(arr, false);

    };
    const handleEdit = (ind) => {
        let mainArr = [...tickerList];
        let arr = [...editableShareArr];
        mainArr[ind].share = arr[ind];
        handleGraph(mainArr, false);
    };
    const handleGraph = (arr, check = true) => {
        if (check === true) {
            if (company === null || share === null) {
                toast.warning('Please fill all the values.');
                return;
            }
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
        axios.post('http://35.173.177.244:8000/api/annual-portfolio/', body, config)
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
                setEditableShareArr(shareArr);

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
        handleClose();
        setLoading(true);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'email': user.email, 'name': pieName, 'dataArr': [labelList, shareList] });

        axios.post(`http://35.173.177.244:8000/api/update-pie/${params.id}/`, body, config)
            .then(response => {
                setLoading(false);
                toast.success("successfully updated the pie chart");
                console.log(response.data);
            })
            .catch(err => {
                setLoading(false);
                toast.error("something went wrong in updating");
                console.log(err);

            });

    };
    const handleDelete = () => {
        setBigLoading(true);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'email': user.email });

        axios.post(`http://35.173.177.244:8000/api/delete-pie/${params.id}/`, body, config)
            .then(response => {
                setBigLoading(false);
                toast.success("successfully deleted the pie chart");
                navigate(`/saved-pie-dashboard`);
            })
            .catch(err => {
                setBigLoading(false);
                toast.error("something went wrong in deleting");
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
            {bigLoading ? <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} /> :
                <>
                    <div className='search-component'>

                        <TextField style={{ textTransform: 'uppercase' }} id="outlined-basic" label="Ticker" variant="outlined" value={company} onChange={(e) => {
                            setCompany(e.target.value.toUpperCase());
                        }} />
                        <TextField id="outlined-basic" label="# of Shares" variant="outlined" value={share} onChange={(e) => setShare(e.target.value)} />



                        <Button variant="contained" className='dashboard-button' onClick={handleAddList}>Add to List</Button>

                        <Button variant="contained" className='dashboard-button' onClick={handleOpen}>Update Table</Button>
                        <Button variant="contained" className='dashboard-button' onClick={handleDelete}>Delete Table</Button>

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
                                <Button variant="contained" onClick={handleSave}>Update</Button>
                            </Box>

                        </Box>
                    </Modal>

                    <div className='inner-pie-wrapper'>
                        <div className='table-wrapper'>

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
                                                {/* {el[3] ? el[3] : 'none'} */}
                                                <td><input className='edited-column' type='number' value={parseInt(editableShareArr[ind])} onChange={(e) => handlePreviousEdit(e.target.value, ind)} /></td>
                                                <td>{el[4] ? el[4].toFixed(2) : 'none'}</td>
                                                <td><i onClick={() => handleRemove(ind)} class='bx bxs-trash remove-row'></i>
                                                    <i onClick={() => handleEdit(ind)} class='bx bx-refresh edit-row'></i>
                                                </td>
                                            </tr>

                                        ))
                                        : <tr><td colSpan="6">Select a Ticker</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        {
                            loading === true ? <DashboardLoader /> : (labelList && seriesList && labelList.length > 0 && seriesList.length > 0) ? <div className='pie-wrapper'>
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
                </>
            }

        </div>

    );
};

export default PieChartDetailDashboard;
