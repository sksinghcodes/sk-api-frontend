import { useState } from "react";

const SignIn = () => {
    const [signInData, setSignInData] = useState({
        usernameOrEmail: '',
        password: '',
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setSignInData({
            ...signInData,
            [name]: value,
        })
    }
    
    return (
        <form onSubmit={e => e.preventDefault()} >
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