import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import { GlobalContext } from "../App";
import { useContext } from "react";

const Dashboard:React.FC = () => {
    return (
        <GlobalContext.Consumer>
            {globalContext => <>
                {
                    globalContext?.isAdmin === true &&
                    <AdminDashboard />
                }
                {
                    globalContext?.isAdmin === false &&
                    <UserDashboard />
                }
            </>}
        </GlobalContext.Consumer>
    );
}
 
export default Dashboard;