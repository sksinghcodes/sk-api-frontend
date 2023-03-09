import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Context } from '../../context/ContextProvider';
import SignOut from '../authentication/SignOut';

const NavBar = () => {
    const context = useContext(Context)

    return ( 
        <nav className="navbar navbar-expand-md bg-primary navbar-dark sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/">SK API</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className='nav-item'><NavLink className="nav-link" to="/">Home</NavLink></li>
                        {context.isSignedIn ? <>
                            <li className='nav-item'><NavLink className="nav-link" to="/dashboard/data-sources">Data Sources</NavLink></li>
                            <li className='nav-item'><NavLink className="nav-link" to="/dashboard/data">Data</NavLink></li>
                        </> : <>
                            <li className='nav-item'><NavLink className="nav-link" to="/authentication/sign-in">Sign In</NavLink></li>
                            <li className='nav-item'><NavLink className="nav-link" to="/authentication/sign-up">Sign Up</NavLink></li>
                        </>}
                    </ul>

                    {context.isSignedIn && <>
                        <SignOut className="btn btn-outline-light" />
                    </>}
                </div>
            </div>
        </nav>
    );
}
 
export default NavBar;