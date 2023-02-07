import { createBrowserRouter, Navigate } from "react-router-dom";
import App from '../App';
import Datas from "../components/Datas";
import DataSources from "../components/DataSources";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
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
						element: <Navigate to='sign-up' replace />,
					},
					{
						path: 'sign-up',
						element: <SignUp />,
					},
					{
						path: 'sign-in',
						element: <SignIn />,
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