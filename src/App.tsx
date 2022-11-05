import { createContext, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar';
import { GlobalContextInterface } from './types';

export const GlobalContext = createContext<GlobalContextInterface|null>(null)

function App() {
	const [isLoggedIn, setLoginStatus] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean|null>(null);

	return (
		<GlobalContext.Provider value={{
			isAdmin: isAdmin,
			isLoggedIn:isLoggedIn,
			setLoginStatus:setLoginStatus,
			setIsAdmin:setIsAdmin,
		}}>
			<div className="App">
				<NavBar />
				<Outlet />
			</div>
		</GlobalContext.Provider>
	)
}

export default App;
