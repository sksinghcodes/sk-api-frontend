import './App.css';
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './components/navbar/NavBar';

function App() {

	const routeTitles = [
		{
			url: '/authentication/sign-in',
			title: 'Sign In',
		},
		{
			url: '/authentication/sign-up',
			title: 'Sign Up',
		},
		{
			url: '/authentication/verify-profile',
			title: 'Verify Profile',
		},
		{
			url: '/authentication/reset-password',
			title: 'Reset Password',
		},
		{
			url: '/dashboard/data-sources',
			title: 'Data Sources',
		},
		{
			url: '/dashboard/data',
			title: 'Data',
		},
		{
			url: '/',
			title: 'Home',
		},
	]
	const { pathname } = useLocation();

	for (let { url, title } of routeTitles){
		if(pathname.startsWith(url)){
			document.title = title + ' | SK API';
			break;
		}
	}

	return (
		<div className="App">
			<NavBar />
			<div className="container">
				<Outlet />
			</div>
		</div>
	)
}

export default App;
