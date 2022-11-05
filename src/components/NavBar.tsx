import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return ( <ul>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='dashboard'>Dashboard</NavLink></li>
        <li><NavLink to='authenticate'>Authenticate</NavLink></li>
    </ul> );
}
 
export default NavBar;