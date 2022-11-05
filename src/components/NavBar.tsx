import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return ( <ul>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
        <li><NavLink to='/authenticate/sign-up'>Sign Up</NavLink></li>
        <li><NavLink to='/authenticate/sign-up'>Sign In</NavLink></li>
    </ul> );
}
 
export default NavBar;