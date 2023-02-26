import { createBrowserRouter, Navigate } from "react-router-dom";
import App from '../App';
import VerifyProfile from "../components/VerifyProfile";
import Datas from "../components/Datas";
import DataSources from "../components/DataSources";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Authentication from "../pages/Authentication";
import Dashboard from "../pages/Dashboard";
import RenderIf from "../private/RenderIf";
import ResetPassword from "../components/ResetPassword";

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
						element: <DataSources />,
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