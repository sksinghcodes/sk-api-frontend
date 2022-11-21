import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import { GlobalContext } from "../App";

const SignIn = () => {
    const context = useContext(GlobalContext);
    const navigate = useNavigate();

    const [signInData, setSignInData] = useState({
        usernameOrEmail: '',
        password: '',
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setSignInData({
            ...signInData,
            [name]: value,
        })
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        axios.post('user/sign-in', signInData)
            .then(response => {
                if(response.data.success){
                    context?.setLoginStatus(true);
                    navigate('/');
                } else {
                    console.log(response.data.error);
                }
            })
            .catch(err => console.log(err))
    }
    
    return (
        <form onSubmit={handleSubmit} >
            <div>
                <input type="text" name="usernameOrEmail" placeholder="Username or Email Address" onChange={handleChange} />
            </div>
            <div>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            </div>
            <div>
                <input type="submit" value="Sign In" />
            </div>
        </form>
    );
}
 
export default SignIn;