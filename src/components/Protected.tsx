import { Navigate } from "react-router-dom";

const Protected:React.FC<ComponentPropsInterface> = ({isLoggedIn, showIfLoggedIn, children}) => {
    if(isLoggedIn === showIfLoggedIn){
        return children;
    }

    if(showIfLoggedIn){
        return <Navigate to="authenticate/sign-up" replace />;
    } else {
        return <Navigate to="/" replace />;
    }
}
 
interface ComponentPropsInterface {
    isLoggedIn:boolean,
    showIfLoggedIn:boolean,
    children:React.ReactElement
}

export default Protected;