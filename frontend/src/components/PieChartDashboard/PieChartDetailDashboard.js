import Autocomplete from '@mui/material/Autocomplete';
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

        axios.post(`http://localhost:8000/api/detail-pie-info/${params.id}/`, body, config)
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
                    tickerUpdate.push({ 'company': { 'id': response.data.data[i][0] }, 'share': parseFloat(response.data.data[i][3]).toFixed(2) });
                }
                setLabelList(labelArr);
                setSeriesList(seriesArr);
                setShareList(shareArr);
                console.log('tickerupdateee'.tickerUpdate);
                setTickerList(tickerUpdate);
                setBigLoading(false);

            }).catch(err => {

                setBigLoading(false);


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
    const handleRemoveLast = () => {
        let arr = [...tickerList];
        arr.pop();
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
                setGraphData(response.data);
                let labelArr = [];
                let seriesArr = [];
                let shareArr = [];
                for (let i = 0; i < response.data.length; i++) {
                    labelArr.push(response.data[i][0]);
                    seriesArr.push(response.data[i][4]);
                    shareArr.push(parseFloat(response.data[i][3]).toFixed(2));
                }
                setLabelList(labelArr);
                setSeriesList(seriesArr);
                setShareList(shareArr);
                setTickerList(arr);
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

        axios.post(`http://localhost:8000/api/update-pie/${params.id}/`, body, config)
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

        axios.post(`http://localhost:8000/api/delete-pie/${params.id}/`, body, config)
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
                        <TextField id="outlined-basic" label="# of Shares" variant="outlined" value={share} onChange={(e) => setShare(e.target.value)} />



                        <Button variant="contained" className='dashboard-button' onClick={handleAddList}>Add to List</Button>
                        <Button variant="contained" className='dashboard-button' onClick={handleRemoveLast}>Remove last</Button>
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

                        <table className='content-table'>
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Price</th>
                                    <th>Annual Div Per Share ($)</th>
                                    <th>Total Shares</th>
                                    <th>Annual Total Dividend ($)</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading === true ? <tr><td colSpan="5"><DashboardLoader /></td></tr> : (labelList && seriesList && labelList.length > 0 && seriesList.length > 0) ?
                                    graphData && graphData.map((el) => (
                                        <tr>
                                            <td>{el[0] ? el[0] : 'none'}</td>
                                            <td>{el[1] ? el[1].toFixed(2) : 'none'}</td>
                                            <td>{el[2] ? el[2].toFixed(2) : 'none'}</td>
                                            <td>{el[3] ? el[3] : 'none'}</td>
                                            <td>{el[4] ? el[4].toFixed(2) : 'none'}</td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan="5">select a valid ticker</td></tr>}
                            </tbody>
                        </table>
                        {
                            loading === true ? <DashboardLoader /> : (labelList && seriesList && labelList.length > 0 && seriesList.length > 0) ? <div>
                                <Chart options={config.options} series={config.series} type="pie" width="380" />

                            </div> : <p>select a valid ticker</p>

                        }

                    </div>
                </>
            }

        </div>

    );
};

export default PieChartDetailDashboard;
