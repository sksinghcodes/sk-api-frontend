import { useContext } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Context } from '../context/ContextProvider';

const Authentication = () => {
    const showNav = useLocation().pathname === '/authentication/sign-up' || useLocation().pathname === '/authentication/sign-in';
    return (
        <div
            className="Authentication d-flex justify-content-center align-items-center px-4 py-5"
        >
                <div className='auth_block'>
                    {showNav && 
                        <div className='auth_nav'>
                            <NavLink to="/authentication/sign-in">Sign In</NavLink>
                            <NavLink to="/authentication/sign-up">Sign Up</NavLink>
                        </div>
                    }
                    <div className='auth_wrap'><Outlet /></div>
                </div>
        </div> 
    );
}
 
export default Authentication;