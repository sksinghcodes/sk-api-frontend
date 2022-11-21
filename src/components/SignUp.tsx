import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../App";
import axios from '../api/axios';

const SignUp = () => {
    const context = useContext(GlobalContext);

    const navigate = useNavigate();

    const [signUpData, setSignUpData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setSignUpData({
            ...signUpData,
            [name]: value,
        })
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        axios.post('user/sign-in', signUpData)
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
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
            </div>
            <div>
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
            </div>
            <div>
                <input type="text" name="username" placeholder="Username"  onChange={handleChange}/>
            </div>
            <div>
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
            </div>
            <div>
                <input type="password" name="password" placeholder="Password"  onChange={handleChange}/>
            </div>
            <div>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
            </div>
            <div>
                <input type="submit" value="Sign Up" />
            </div>
        </form>
    );
}
 
export default SignUp;