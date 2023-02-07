import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Context } from '../context/ContextProvider';

const Authentication = () => {
    const { deviceHeight } = useContext(Context);
    return (
        <div
            className="Authentication position-absolute d-flex justify-content-center align-items-center w-100 px-4 py-5"
            style={{
                left: 0,
                top: 0,
                minHeight: deviceHeight,
                backgroundColor: '#0a58ca',
            }}
        >
                <div className='auth_block'>
                    <div className='auth_nav'>
                        <NavLink to="/authentication/sign-up">Sign Up</NavLink>
                        <NavLink to="/authentication/sign-in">Sign In</NavLink>
                    </div>
                    <div className='auth_wrap'><Outlet /></div>
                </div>
        </div> 
    );
}
 
export default Authentication;