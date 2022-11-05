import { NavLink, Outlet } from 'react-router-dom';

const Auth = () => {
    return ( 
        <div>
            <NavLink to="sign-up">Sign Up</NavLink>
            <NavLink to="sign-in">Sign In</NavLink>
            <div><Outlet /></div>
        </div>
    );
}
 
export default Auth;