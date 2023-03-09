import './App.css';
import { Outlet, useLocation } from 'react-router-dom'

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
			url: '/data-sources',
			title: 'Data Sources',
		},
		{
			url: '/data',
			title: 'Data',
		},
		{
			url: '/',
			title: 'SK API',
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
			<Outlet />
		</div>
	)
}

export default App;
