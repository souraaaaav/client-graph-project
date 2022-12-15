import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { check_continuous_auth } from './actions/auth';

import Login from "./components/Login/Login";
import Layout from './hoc/Layout/Layout';

import ForgetPasswordConfirm from './components/ForgetPassword/ForgetPasswordConfirm/ForgetPasswordConfirm.js';
import ForgetPasswordStart from './components/ForgetPassword/ForgetPasswordStart/ForgetPasswordStart';

import Registration from "./components/Registration/Registration";
import UserEmailConfirm from "./components/UserEmailConfirm/UserEmailConfirm";
import Dashboard from "./components/Dashboard/Dashboard";


const App = ({ check_continuous_auth }) => {
  useEffect(() => {
    check_continuous_auth();
  }, [check_continuous_auth]);


  return (
    <Layout>
      <div className="App">
        <Routes>
          <Route exact path='/registration' element={<Registration />} />
          <Route exact path='/user/email-confirm' element={<UserEmailConfirm />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/forget-password' element={<ForgetPasswordStart />} />
          <Route exact path='/forget-password/confirm' element={<ForgetPasswordConfirm />} />
          <Route exact path='/' element={<Dashboard />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

    </Layout>
  );

};
App.propTypes = {
  check_continuous_auth: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  token: PropTypes.string,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  token: state.auth.token,
  user: state.auth.user
});
export default connect(mapStateToProps, { check_continuous_auth })(App);
