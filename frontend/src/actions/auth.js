import axios from "axios";
import { toast } from 'react-toastify';
import * as actionTypes from './types';

export const create_student_user = ({ fullname, email, password, password2 }) => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ fullname, email, password, password2 });
    console.log('inside');
    axios.post('http://localhost:8000/api/signup/user/', body, config)
        .then(res => {
            dispatch({
                type: actionTypes.REGISTER_STUDENT_USER_SUCCESS,
                payload: res.data
            });
            toast.success('confirm your account from mail');
            console.log(res.data);
        }).catch(err => {
            dispatch({
                type: actionTypes.REGISTER_STUDENT_USER_FAILED
            });
            toast.error('something went wrong');
            console.log(err.response.data);
        });

};

export const forget_password = ({ email }) => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    localStorage.setItem('userEmail', email);
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ email });
    axios.post('http://localhost:8000/api/password-change-request/', body, config)
        .then(response => {

            dispatch({
                type: actionTypes.PASSWORD_CHANGE_REQUEST_SUCCESS,
                payload: response.data
            });

            toast.success("enter the code sent to your email");

        }).catch(err => {

            dispatch({
                type: actionTypes.PASSWORD_CHANGE_REQUEST_FAILED
            });
            localStorage.removeItem('userEmail');
            toast.error("please enter correct email address", err);
            console.log("i am here", err);
        });
};

export const forget_password_confirm = ({ token, password1, password2 }) => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    const userEmail = localStorage.getItem('userEmail');
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ 'email': userEmail, 'token': token, 'password1': password1, 'password2': password2 });
    axios.post('http://localhost:8000/api/password-change-confirm/', body, config)
        .then(response => {
            dispatch({
                type: actionTypes.PASSWORD_CHANGE_CONFIRM_REQUEST_SUCCESS,
                payload: response.data
            });
            localStorage.removeItem('userEmail');
            toast.success("successfully changed the password");
        }).catch(err => {
            dispatch({
                type: actionTypes.PASSWORD_CHANGE_CONFIRM_REQUEST_FAILED
            });
            toast.error("Token is not correct", err);
        });
};


export const login = ({ email, password }) => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ email, password });
    console.log(body);
    axios.post('http://localhost:8000/api/login/', body, config)
        .then(response => {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: response.data
            });
            toast.success("login success");
        }).catch(err => {
            dispatch({
                type: actionTypes.LOGIN_FAILED
            });
            toast.error("login failed");
        });

};

export const check_continuous_auth = () => (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
        dispatch(logout);
    }
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    };
    axios.get('http://localhost:8000/api/checkauth/', config)
        .then(response => {
            dispatch({
                type: actionTypes.CONTINUOUS_USER_AUTH_SUCCESS,
                payload: response.data
            });
        }).catch(err => {
            dispatch({
                type: actionTypes.CONTINUOUS_USER_AUTH_FAILED
            });
        });
};

export const logout = () => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    localStorage.removeItem("token");
    dispatch({ type: actionTypes.AUTH_LOGOUT });
    toast.success("logout success");
};
