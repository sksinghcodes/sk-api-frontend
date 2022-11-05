import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {
	createBrowserRouter,
	Navigate,
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
				element: <Protected showIfLoggedIn={false}><Auth /></Protected>,
				children: [
					{
						path: '',
						element: <Navigate to="sign-up" replace />,
					},
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
				element: <Protected showIfLoggedIn={true}><Dashboard/></Protected>,
			}
		]
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)