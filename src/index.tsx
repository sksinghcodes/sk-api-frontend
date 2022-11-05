import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import Auth from './pages/Auth';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Protected from './components/Protected';
import Dashboard from './pages/Dashboard';

  
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "authenticate",
				element: <Protected isLoggedIn={true} showIfLoggedIn={false}>
							<Auth />
						</Protected>,
				children: [
					{
						path: "sign-up",
						element: <SignUp />,
					},
					{
						path: "sign-in",
						element: <SignIn />,
					}
				]
			},
			{
				path: "dashboard",
				element: <Protected isLoggedIn={true} showIfLoggedIn={true}>
						<Dashboard isAdmin={false} />
					</Protected>,
			}
		]
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)