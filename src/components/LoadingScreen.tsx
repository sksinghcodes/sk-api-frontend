import { useContext } from "react";
import { Context } from "../context/ContextProvider";

const LoadingScreen = () => {
    const context = useContext(Context)

    return ( <div className="Authentication position-absolute d-flex justify-content-center align-items-center w-100 px-4 py-5"
    style={{
        left: 0,
        top: 0,
        minHeight: context.deviceHeight,
        backgroundColor: '#0a58ca',
    }}
>
    <div className="text-white text-center">
        <h1>SK API</h1>
        <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
</div> );
}
 
export default LoadingScreen;