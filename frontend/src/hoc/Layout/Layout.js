
import SideBar from '../../components/SideBar/SideBar';
const Layout = ({ children }) => {
    return (
        <SideBar >
            {children}
        </SideBar>
    );
};

export default Layout;