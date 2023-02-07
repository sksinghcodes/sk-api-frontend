import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const Dashboard:React.FC = () => {
    return <>
        <NavBar />
        <div className="container">
            <Outlet />
        </div>
    </>;
}
 
export default Dashboard;