import { createBrowserRouter, Navigate } from "react-router-dom";
import App from '../App';

import VerifyProfile from "../components/authentication/VerifyProfile";
import ResetPassword from "../components/authentication/ResetPassword";
import SignIn from "../components/authentication/SignIn";
import SignUp from "../components/authentication/SignUp";

import DataWrapper from "../components/dashboard/DataWrapper";

import Authentication from "../pages/Authentication";
import Dashboard from "../pages/Dashboard";
import RenderIf from "../private/RenderIf";


const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
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
				path: '',
				element: <RenderIf signedInIs={true}><Dashboard/></RenderIf>,
				children: [
					{
						path: '',
						element: <Navigate to="data-sources" replace />,
					},
					{
						path: 'data-sources',
						element: <DataWrapper />,
					},
					{
						path: 'data',
						element: <DataWrapper />,
					},
					{
						path: 'data/:dataSourceId',
						element: <DataWrapper />,
					},
				],
			},
		],
	},
]);

export default router;