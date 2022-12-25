import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const SavedPieDashboard = () => {
    const email = useSelector(state => state.auth.user.email);
    const [pieData, sePieData] = useState({});

    // const getData = React.useCallback(async () => {
    //     const config = {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     };
    //     const body = JSON.stringify({ 'email': email });
    //     axios.post(`http://localhost:8000/api/is-email-chanaged/`, body, config)
    //         .then(res => {
    //             axios.post(`http://localhost:8000/api/student-details/`, body, config)
    //                 .then(res => {
    //                     console.log(res.data);
    //                     setCertificateData(res.data);


    //                 })
    //                 .catch(err => {
    //                 });
    //             console.log(res.data);
    //         })
    //         .catch(err => {
    //         });
    // }, [email]);
    // useEffect(() => {
    //     getData();
    // }, [getData]);

    console.log('redux', email);
    return (
        <div>SavedPieDashboard</div>
    );
};

export default SavedPieDashboard;