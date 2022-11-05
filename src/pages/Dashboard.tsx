import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard:React.FC<{isAdmin: boolean}> = ({ isAdmin }) => {
    return (
        <div>
            {isAdmin} ?
            <AdminDashboard />
            :
            <UserDashboard />
        </div>
    );
}
 
export default Dashboard;