import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import HashLoader from 'react-spinners/HashLoader';
import './SavedPieDashboard.css';
const SavedPieDashboard = () => {
    const email = useSelector(state => state.auth.user.email);
    const [pieData, setPieData] = useState();
    const [tickerList, setTickerList] = useState();
    const [shareList, setShareList] = useState();
    const [loading, setLoading] = useState(true);

    const getData = React.useCallback(async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ 'email': email });

        axios.post(`http://localhost:8000/api/all-pie-info/`, body, config)
            .then(res => {
                console.log(res.data);
                setPieData(res.data);
                let ticker_list = [];
                let share_list = [];
                for (let index = 0; index < res.data.length; index++) {
                    ticker_list.push(JSON.parse(res.data[index].dataArr)[0]);
                    share_list.push(JSON.parse(res.data[index].dataArr)[1]);
                }
                setTickerList(ticker_list);
                setShareList(share_list);
                setLoading(false);
            })
            .catch(err => {
                console.log(err, 'in fetch');
                setLoading(false);

            });

    }, [email]);
    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <>
            {loading && <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} />}
            <div className="saved-div-wrapper">

                {pieData && pieData.map((el) => (
                    <Link to={'/saved-pie-dashboard/' + el.id} >
                        <div className="saved-div">

                            <p>Name: {el.name}</p>
                            <table className='content-table'>
                                <thead>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th>Ticker</th>
                                        <th>Shares</th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {el.dataArr && JSON.parse(el.dataArr)[0].map((ele, i, arr) => (
                                        <tr>
                                            <td>{arr[i]}</td>
                                            <td>{JSON.parse(el.dataArr)[1][i]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Link>
                ))

                }
            </div>

        </>
    );
};

export default SavedPieDashboard;