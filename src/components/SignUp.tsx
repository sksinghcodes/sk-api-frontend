import { useState } from "react";

const SignUp = () => {
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

    return (
        <form onSubmit={e => e.preventDefault()}>
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