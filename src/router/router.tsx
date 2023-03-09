import { createBrowserRouter, Navigate } from "react-router-dom";
import App from '../App';

import VerifyProfile from "../components/authentication/VerifyProfile";
import ResetPassword from "../components/authentication/ResetPassword";
import SignIn from "../components/authentication/SignIn";
import SignUp from "../components/authentication/SignUp";

import Authentication from "../pages/Authentication";
import Dashboard from "../pages/Dashboard";
import RenderIf from "../private/RenderIf";
import Home from "../pages/Home";
import DataSources from "../components/dashboard/DataSources";
import Datas from "../components/dashboard/Datas";


const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '',
				element: <Home />,
			},
			{
				path: 'authentication',
				element: <RenderIf signedInIs={false}><Authentication /></RenderIf>,
				children: [
					{
						path: '',
						element: <Navigate to='sign-in' replace />,
					},
					{
						path: 'sign-up',
						element: <SignUp />,
					},
					{
						path: 'sign-in',
						element: <SignIn />,
					},
					{
						path: 'verify-profile',
						element: <VerifyProfile />,
					},
					{
						path: 'reset-password',
						element: <ResetPassword />,
					}
				]
			},
			{
				path: 'dashboard',
				element: <RenderIf signedInIs={true}><Dashboard/></RenderIf>,
				children: [
					{
						path: '',
						element: <Navigate to="data-sources" replace />,
					},
					{
						path: 'data-sources',
						element: <DataSources />,
					},
					{
						path: 'data',
						element: <Datas />,
					},
					{
						path: 'data/:dataSourceId',
						element: <Datas />,
					},
				],
			},
		],
	},
]);

export default router;