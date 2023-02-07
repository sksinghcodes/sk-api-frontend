import { useContext, useEffect, useState } from "react";
import api from "../api";
import axios from '../api';
import { Context } from "../context/ContextProvider";
import { SignUpDataIF } from "../types";
import { validationFunctions } from "../utils/validation";
import ErrorText from "./ErrorText";



interface ValidationInterface {
    function: string,
    args?: any[]
}

interface ValidationObjInterface {
    username: ValidationInterface[],
    email: ValidationInterface[],
    password: ValidationInterface[],
    confirmPassword: ValidationInterface[],
}


const SignUp = () => {
    const context = useContext(Context);
    const [ error, setError ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);

    const [ signUpData, setSignUpData ] = useState<SignUpDataIF>({
        username: {
            value: '',
            errorMessage: '',
            touched: false,
            validating: false,
        },
        email: {
            value: '',
            errorMessage: '',
            touched: false,
            validating: false,
        },
        password: {
            value: '',
            errorMessage: '',
            touched: false,
        },
        confirmPassword: {
            value: '',
            errorMessage: '',
            touched: false,
        },
    });

    const validationObj:ValidationObjInterface = {
        username: [
            {function: 'isRequired'},
            {function: 'noSpaces'},
            {function: 'checkLength', args: [2,30]},
            {function: 'isUsername'},
        ],
        email: [
            {function: 'isRequired'},
            {function: 'noSpaces'},
            {function: 'isEmail'},
        ],
        password: [
            {function: 'isRequired'},
            {function: 'noSpaces'},
            {function: 'checkLength', args: [6,30]},
            {function: 'isPassword'},
        ],
        confirmPassword: [
            {function: 'isRequired'},
            {function: 'isSameAsPassword', args: [signUpData.password.value]},
        ],
    }

    function validate(validationObject:ValidationObjInterface) {
        const keys = Object.keys(signUpData);
        keys.forEach(key => {
            for(let i = 0; i < validationObject[key as keyof ValidationObjInterface].length; i++){


                if(signUpData[key as keyof SignUpDataIF].touched) {

                    const validation = validationObject[key as keyof ValidationObjInterface][i];

                    setSignUpData({
                        ...signUpData,
                        [key]: {
                            ...signUpData[key as keyof SignUpDataIF],
                            validating: true,
                        }
                    })

                    const message = validationFunctions[validation.function as string](
                        signUpData[key as keyof SignUpDataIF].value,
                        ...(validation.args || [])
                    )

                    if(message){
                        setSignUpData({
                            ...signUpData,
                            [key]: {
                                ...signUpData[key as keyof SignUpDataIF],
                                validating: false,
                                errorMessage: message
                            }
                        })
                        
                        return;
                    } else {
                        setSignUpData({
                            ...signUpData,
                            [key]: {
                                ...signUpData[key as keyof SignUpDataIF],
                                validating: false,
                                errorMessage: message
                            }
                        })
                    }
                }
            };
        });
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setSignUpData({
            ...signUpData,
            [name]: {
                ...signUpData[name as keyof SignUpDataIF],
                value: value,
                touched: true,
            },
        })
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        api.post('user/sign-up', signUpData)
            .then(response => {
                if(response.data.success){
                    context?.checkSignedInStatus()
                } else {
                    console.log(response.data.error);
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        validate(validationObj);
    }, [
        signUpData.username.value,
        signUpData.email.value,
        signUpData.password.value,
        signUpData.confirmPassword.value,
    ]),

    function checkUnique(key:string, message:string) {
        
    }

    useEffect(() => {
        const { value, touched, errorMessage } = signUpData.username;

        if(value.trim() && touched && !errorMessage){

            setSignUpData({
                ...signUpData,
                username: {
                    ...signUpData.username,
                    validating: true,
                }
            })

            const timeOutId = setTimeout(() => {
                api.get(`/user/check-unique/username/${signUpData.username.value}`)
                    .then(response => {
                        let errorMessage = '';
                        if(response.data.success && response.data.isUnique){
                            errorMessage = '';
                        } else {
                            errorMessage = 'Username already exists';
                        }
                        setSignUpData({
                            ...signUpData,
                            username: {
                                ...signUpData.username,
                                errorMessage,
                                validating: false
                            }
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }, 1000)

            return () => clearTimeout(timeOutId);
        }
    }, [signUpData.username.value])

    useEffect(() => {
        const { value, touched, errorMessage } = signUpData.email;

        if(value.trim() && touched && !errorMessage){

            setSignUpData({
                ...signUpData,
                email: {
                    ...signUpData.email,
                    validating: true,
                }
            })

            const timeOutId = setTimeout(() => {
                api.get(`/user/check-unique/email/${signUpData.email.value}`)
                    .then(response => {
                        let errorMessage = '';
                        if(response.data.success && response.data.isUnique){
                            errorMessage = '';
                        } else {
                            errorMessage = 'Username already exists';
                        }
                        setSignUpData({
                            ...signUpData,
                            email: {
                                ...signUpData.email,
                                errorMessage,
                                validating: false,
                            }
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }, 1000)

            return () => clearTimeout(timeOutId);
        }
    }, [signUpData.email.value])

    return (
        <form onSubmit={handleSubmit}>

            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Choose a Username</p>
                    <input
                        className="form-control"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={signUpData.username.value}
                        onChange={handleChange}
                    />
                </label>
                {signUpData.username.validating && 
                    <div className="text-end">
                        <div className="text-white spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {signUpData.username.errorMessage &&
                    <ErrorText>{signUpData.username.errorMessage}</ErrorText>
                }
            </div>
            
            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Email Address</p>
                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={signUpData.email.value}
                        onChange={handleChange}
                    />
                </label>
                {signUpData.email.validating &&
                    <div className="text-end">
                        <div className="text-white spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {signUpData.email.errorMessage &&
                    <ErrorText>{signUpData.email.errorMessage}</ErrorText>
                }
            </div>
            
            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Password</p>
                    <input
                        className="form-control"
                        type="passowrd"
                        name="password"
                        placeholder="Password"
                        value={signUpData.password.value}
                        onChange={handleChange}
                    />
                </label>
                {signUpData.password.errorMessage &&
                    <ErrorText>{signUpData.password.errorMessage}</ErrorText>
                }
            </div>
            
            <div className="mb-4">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Confirm Password</p>
                    <input
                        className="form-control"
                        type="passowrd"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={signUpData.confirmPassword.value}
                        onChange={handleChange}
                    />
                </label>
                {
                    signUpData.confirmPassword.errorMessage &&
                    <ErrorText>{signUpData.confirmPassword.errorMessage}</ErrorText>
                }
            </div>

            <div className="text-center">
                <input
                    className="btn btn-outline-light"
                    type="submit"
                    value="Sign Up"
                />
            </div>
        </form>
    );
}
 
export default SignUp;