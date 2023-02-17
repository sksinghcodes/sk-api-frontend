import { useState, useContext, useEffect } from "react";
import { Context } from "../context/ContextProvider";
import api from "../api";
import { SignInDataIF, SignInValidationIF, SignInValidationRulesIF, ValidationRuleIF } from "../types";
import ErrorText from "./ErrorText";
import { validate } from "uuid";
import { validationFunctions } from "../utils/validation";

const SignIn = () => {
    const context = useContext(Context);
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);

    const [ signInData, setSignInData ] = useState<SignInDataIF>({
        usernameOrEmail: '',
        password: '',
    });

    const [ signInValidation, setSignInValidation ] = useState<SignInValidationIF>({
        usernameOrEmail: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
        password: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
    });

    const validationRules:SignInValidationRulesIF = {
        usernameOrEmail: [
            {function: 'isRequired'},
        ],
        password: [
            {function: 'isRequired'},
        ],
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setSignInValidation({
            ...signInValidation,
            [name]: {
                ...signInValidation[name as keyof SignInValidationIF],
                touched: true,
            },
        })

        setSignInData({
            ...signInData,
            [name]: value,
        })
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();

        if(
            signInValidation.usernameOrEmail.isValid &&
            signInValidation.password.isValid
        ) {
            setLoading(true);
            api.post('user/sign-in', signInData)
                .then(({data}) => {
                    console.log(data)

                    setLoading(false);

                    if(data.success){
                        context?.checkSignedInStatus()
                    }
                    
                    if(!data.success && data.validation){
                        setSignInValidation({
                            usernameOrEmail: {
                                ...signInValidation.usernameOrEmail,
                                errorMessage: data.validation.usernameOrEmail.errorMessage,
                                isValid: data.validation.usernameOrEmail.isValid,
                            },
                            password: {
                                ...signInValidation.usernameOrEmail,
                                errorMessage: data.validation.usernameOrEmail.errorMessage,
                                isValid: data.validation.usernameOrEmail.isValid,
                            }
                        })
                    }

                    if(!data.success && data.error){
                        setError(data.error)
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err)
                })
        } else {
            validate(validationRules, true);
        }
    }

    const validate = (validationRules:SignInValidationRulesIF, fromSubmit:boolean = false) => {
        const keys = Object.keys(validationRules);
        let signInValidationCopy:SignInValidationIF = {} as SignInValidationIF;
        
        keys.forEach(key => (
            signInValidationCopy[key as keyof SignInValidationIF] = {
                ...signInValidation[key as keyof SignInValidationIF]
            }
        ));
        
        for(const [key, validations] of Object.entries(validationRules)){

            if(signInValidation[key as keyof SignInValidationIF].touched || fromSubmit) {

                for(const [index, validation] of Object.entries(validations)){

                    const message = validationFunctions[(validation as ValidationRuleIF).function](
                        signInData[key as keyof SignInDataIF],
                        ...((validation as ValidationRuleIF).args || [])
                    )

                    if(message){
                        signInValidationCopy[key as keyof SignInValidationIF].errorMessage = message;
                        signInValidationCopy[key as keyof SignInValidationIF].isValid = false;
                        break;
                    } else {
                        if(+index === validations.length - 1){
                            signInValidationCopy[key as keyof SignInValidationIF].isValid = true;
                        }
                        signInValidationCopy[key as keyof SignInValidationIF].errorMessage = message;
                    }
                }
            }
        }

        setSignInValidation(signInValidationCopy);
    }

    useEffect(() => {
        validate(validationRules);
    }, [
        signInData.usernameOrEmail,
        signInData.password,
    ]);
    
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
                {signInValidation.usernameOrEmail.errorMessage &&
                    <ErrorText>{signInValidation.usernameOrEmail.errorMessage}</ErrorText>
                }
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
                {signInValidation.password.errorMessage &&
                    <ErrorText>{signInValidation.password.errorMessage}</ErrorText>
                }
            </div>
            <div className="text-center">
            <button
                    className="btn btn-primary border-white position-relative ps-5 pe-5 "
                >
                    Sign In
                    {loading &&
                        <div
                            style={{
                                top: '50%',
                                right: 25,
                                transform: 'translateY(-50%)',
                                position: 'absolute',
                            }}
                        >
                            <div
                                className="text-white spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </button>
            </div>
            {error && <>
                <div className="pb-3"></div>
                <ErrorText>{error}</ErrorText>
            </>}
        </form>
    );
}
 
export default SignIn;