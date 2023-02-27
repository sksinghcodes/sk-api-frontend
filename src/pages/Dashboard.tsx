import NavBar from "../components/navbar/NavBar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../context/ContextProvider";

const Dashboard:React.FC = () => {
    const { deviceHeight } = useContext(Context);

    return <div 
        style={{
            left: 0,
            top: 0,
            minHeight: deviceHeight,
            backgroundColor: '#eee',
        }}
    >
        <NavBar />
        <div className="container">
            <Outlet />
        </div>
    </div>;
}
 
export default Dashboard;