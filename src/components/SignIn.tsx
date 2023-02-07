import { useState, useContext, useEffect } from "react";
import { Context } from "../context/ContextProvider";
import api from "../api";
import { SignInDataIF } from "../types";
import ErrorText from "./ErrorText";
import { validate } from "uuid";

const SignIn = () => {
    const context = useContext(Context);
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);

    const [ signInData, setSignInData ] = useState<SignInDataIF>({
        usernameOrEmail: {
            value: '',
            errorMessage: '',
            touched: false,
        },
        password: {
            value: '',
            errorMessage: '',
            touched: false,
        },
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setSignInData({
            ...signInData,
            [name]: value,
        })
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();

        api.post('user/sign-in', signInData)
            .then(response => {
                if(response.data.success){
                    context?.checkSignedInStatus()
                } else {
                    console.log(response.data.error);
                }
            })
            .catch(err => console.log(err))
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Username or Email Address</p>
                    <input
                        className="form-control"
                        type="text"
                        name="usernameOrEmail"
                        placeholder="Username or Email Address"
                        onChange={handleChange}
                        autoComplete="username"
                    />
                </label>
            </div>
            <div className="mb-4">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Password</p>
                    <div className="input-group">
                        <input
                            className="form-control"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i
                                className={`bi bi-eye${showPassword ? '' : '-slash'}`}
                            ></i>
                        </button>
                    </div>
                </label>
            </div>
            <div className="text-center">
                <input
                    className="btn btn-outline-light"
                    type="submit"
                    value="Sign In"
                />
            </div>
        </form>
    );
}
 
export default SignIn;