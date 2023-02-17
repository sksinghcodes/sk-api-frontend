import React, { createContext, useEffect, useState } from "react";
import api from "../api";
import LoadingScreen from "../components/LoadingScreen";
import { ContextInterface } from "../types";

export const Context = createContext<ContextInterface>({} as ContextInterface)

const ContextProvider:React.FC<{children:JSX.Element}> = ({children}) => {
    const [ isSignedIn, setIsSignedIn ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    const [ deviceHeight, setDeviceHeight ] = useState<string>(`${window.visualViewport?.height}px`);

    useEffect(() => {
        window.visualViewport?.addEventListener('scroll', () => setDeviceHeight(`${window.visualViewport?.height}px`));
        window.visualViewport?.addEventListener('resize', () => setDeviceHeight(`${window.visualViewport?.height}px`));
        checkSignedInStatus();
    }, [])

    function checkSignedInStatus(){
        setLoading(true);
		api.get('/user/check-signed-in-status')
			.then(response => {
                setLoading(false);
				if(response.data.success){
					setIsAdmin(response.data.user.role === 0);
					setIsSignedIn(true)
				} else {
					setIsSignedIn(false)
				}
			})
			.catch(err => {
                setLoading(false);
				console.log(err);
				setIsSignedIn(false);
			})
		
	}

    return (
        <Context.Provider
            value={{
                isSignedIn: isSignedIn,
                isAdmin: isAdmin,
                checkSignedInStatus: checkSignedInStatus,
                deviceHeight: deviceHeight,
            }}
        > 
            {
                loading 
                ? 
                <LoadingScreen />
                :
                children
            }
        </Context.Provider>
    );
}
 
export default ContextProvider;