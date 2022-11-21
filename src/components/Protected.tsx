import { Navigate } from "react-router-dom";
import { GlobalContext } from "../App";

const Protected:React.FC<ComponentPropsInterface> = ({showIfLoggedIn, children}) => {
    const render = (globalContext:any) => {
        if(globalContext?.isLoggedIn === showIfLoggedIn) {
            return children
        }
    }
    
    return (
        <GlobalContext.Consumer>
            {globalContext => <>
                {
                    globalContext?.isLoggedIn === showIfLoggedIn 
                    ?
                    children
                    :
                    (showIfLoggedIn ? <Navigate to="/authenticate/sign-up" replace /> : <Navigate to="/" replace/>)
                }
            </>}
        </GlobalContext.Consumer>
    )
}
 
interface ComponentPropsInterface {
    showIfLoggedIn:boolean,
    children:React.ReactElement
}

export default Protected;