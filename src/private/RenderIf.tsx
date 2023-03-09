import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../context/ContextProvider";

const RenderIf:React.FC<ComponentPropsInterface> = ({signedInIs, children}) => {
    const context = useContext(Context)

    if(signedInIs === context.isSignedIn){
        return children;
    }

    if(context.isSignedIn){
        return <Navigate to="/dashboard" replace/>
    } else {
        return <Navigate to="/authentication" replace />
    }
}
 
interface ComponentPropsInterface {
    signedInIs:boolean,
    children:React.ReactElement
}

export default RenderIf;