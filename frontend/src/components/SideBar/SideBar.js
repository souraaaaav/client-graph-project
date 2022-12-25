import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { logout } from '../../actions/auth';
import testImage from '../../assets/images/iit.jfif';

import './SideBar.css';
const SideBar = ({ children, logout, isAuthenticated, isLoading, token, user }) => {

    const navigate = useNavigate();
    // following are the code to change sidebar button(optional)
    function menuBtnChange() {
        let sidebar = document.querySelector(".sidebar");
        let closeBtn = document.querySelector("#btn");
        let homeSec = document.querySelector('.home-section');
        sidebar.classList.toggle("open");
        homeSec.classList.toggle("home-blur");
        if (sidebar.classList.contains("open")) {
            closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns class
        } else {
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns class
        }
    }

    const closeModal = () => {
        let sidebar = document.querySelector(".sidebar");
        let closeBtn = document.querySelector("#btn");
        let homeSec = document.querySelector('.home-section');

        if (sidebar.classList.contains("open") & homeSec.classList.contains("home-blur")) {
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns class
            sidebar.classList.remove("open");
            homeSec.classList.remove("home-blur");
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <div>
            <div class="sidebar">

                <div class="logo-details">
                    {/* <i class='bx bxl-c-plus-plus icon'></i> */}
                    <Link to="/" onClick={closeModal}>
                        <i class='bx bx-receipt icon'></i>
                    </Link>
                    <Link to="/" onClick={closeModal}><div class="logo_name">Stock Market <br /> Supervisor</div>
                    </Link>

                    <i class='bx bx-menu' id="btn" onClick={menuBtnChange} ></i>

                </div>

                <ul class="nav-list">
                    <li>
                        <Link to='/'>
                            <i class='bx bx-grid-alt'></i>
                            <span class="links_name">Dashboard</span>
                        </Link>
                        <span class="tooltip">Dashboard</span>
                    </li>
                    {isAuthenticated && !user.isVerified ?
                        <>
                            <>
                                <li>
                                    <Link to="/user/email-confirm">
                                        <i class='bx bxs-user' ></i>
                                        <span class="links_name" onClick={closeModal}>Confirm email</span>

                                    </Link>
                                    <span class="tooltip">Confirm email</span>
                                </li>
                                <li>
                                    <Link to="">
                                        <i class='bx bx-log-out' id="log_out" onClick={(e) => handleLogout(e)} ></i>
                                        <span class="links_name" onClick={handleLogout}>Log out</span>
                                    </Link>
                                    <span class="tooltip">Log out</span>
                                </li>
                            </>
                        </>
                        : null}
                    {(!token && !isAuthenticated) ?
                        <>
                            <li>
                                <Link to="/login">
                                    <i class='bx bxs-user' ></i>
                                    <span class="links_name" onClick={closeModal}>Log in</span>

                                </Link>
                                <span class="tooltip">Log in</span>
                            </li>
                            <li>
                                <Link to="/registration">
                                    <i class='bx bxs-user-plus' ></i>
                                    <span class="links_name" onClick={closeModal}>Registration</span>
                                </Link>
                                <span class="tooltip">Registration</span>
                            </li>
                        </>
                        : null}

                    {token && isAuthenticated && user.isVerified ?
                        <>

                            <li>
                                <Link to='/annual-portfolio'>
                                    <i class='bx bxs-buildings' ></i>
                                    <span class="links_name">Portfolio</span>
                                </Link>
                                <span class="tooltip">Annual Portfolio</span>
                            </li>
                            <li>
                                <Link to='/stock-ticker-comparison'>
                                    <i class='bx bxs-bank'></i>
                                    <span class="links_name">Stock ticker</span>
                                </Link>
                                <span class="tooltip">Stock ticker</span>
                            </li>
                            <li>
                                <Link to='/investment-growth'>
                                    <i class='bx bxs-credit-card-front' ></i>
                                    <span class="links_name">Investment Growth</span>
                                </Link>
                                <span class="tooltip">Investment Growth</span>
                            </li>
                            <li>
                                <Link to='/growth-of-share'>
                                    <i class='bx bxs-notepad'></i>
                                    <span class="links_name">Growth of Share</span>
                                </Link>
                                <span class="tooltip">Growth of Share</span>
                            </li>
                            <li>
                                <Link to='/saved-pie-dashboard'>
                                    <i class='bx bxs-save'></i>
                                    <span class="links_name">Saved profile</span>
                                </Link>
                                <span class="tooltip">Saved Profile</span>
                            </li>

                            <li class="profile">
                                <div class="profile-details">
                                    <img src={testImage} alt="profileImg" />
                                    <div class="name_job">
                                        <div class="name">{user.fullname}</div>
                                        <div class="job">{user.email.substr(0, 4) + '*********' + user.email.substr(user.email.length - 6)}</div>
                                    </div>
                                </div>
                                <i class='bx bx-log-out' id="log_out" onClick={(e) => handleLogout(e)} ></i>

                            </li>
                        </> : null
                    }
                </ul>
            </div>
            <section class="home-section" onClick={closeModal}>
                {isLoading ? <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} /> : children}
            </section>
            <footer style={{ height: '80px', textAlign: 'center' }}>
                <hr />
                <hr />
                <p style={{ "position": "relative", "top": "50%", "WebkitTransform": "translateY(-50%)", "MsTransform": "translateY(-50%)", "transform": "translateY(-50%)" }}>All rights reserved by <b>&copy;CR3W</b></p>
                {/* <p style={{ height: '10px' }}></p> */}
            </footer>
        </div >
    );
};
SideBar.propTypes = {
    logout: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, { logout })(SideBar);