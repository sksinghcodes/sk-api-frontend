import { useContext, useState } from "react";
import api from "../../api";
import { Context } from "../../context/ContextProvider";

const SignOut:React.FC<any> = (props) => {
    const [ loading, setLoading ] = useState<boolean>(false);

    const { checkSignedInStatus } = useContext(Context)

    function signOut(){
        setLoading(true);
        api.post('/user/sign-out')
            .then(response => {
                if(response.data.success) {
                    checkSignedInStatus()
                } else {
                    setLoading(false)
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return <button onClick={signOut} {...props}>
        {loading ? 'Signing Out...' : 'Sign Out'}
    </button>
}

export default SignOut;