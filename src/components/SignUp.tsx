import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Context } from "../context/ContextProvider";
import { AvailabilityIF, SignUpDataIF, SignUpValidationIF, ValidationRuleIF, SignUpValidationRulesIF } from "../types";
import { validationFunctions } from "../utils/validation";
import ErrorText from "./ErrorText";

const SignUp = () => {

    const context = useContext(Context)

    const navigate = useNavigate();

    const [ error, setError ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);

    const [ signUpData, setSignUpData ] = useState<SignUpDataIF>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [ signUpValidation, setSignUpValidation ] = useState<SignUpValidationIF>({
        username: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
        email: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
        password: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
        confirmPassword: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
    });

    const [ usernameAvailability, setUsernameAvailability ] = useState<AvailabilityIF>({
        checkingUnique: false,
        isUnique: null,
    });

    const [ emailAvailability, setEmailAvailability ] = useState<AvailabilityIF>({
        checkingUnique: false,
        isUnique: null,
    });
    
    const validationRules:SignUpValidationRulesIF = {
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
            {function: 'isSameAsPassword', args: [signUpData.password]},
        ],
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setSignUpValidation({
            ...signUpValidation,
            [name]: {
                ...signUpValidation[name as keyof SignUpValidationIF],
                touched: true,
            },
        })

        setSignUpData({
            ...signUpData,
            [name]: value
        })
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();

        if(
            signUpValidation.username.isValid &&
            signUpValidation.email.isValid &&
            signUpValidation.password.isValid &&
            signUpValidation.confirmPassword.isValid &&
            emailAvailability.isUnique &&
            (!emailAvailability.checkingUnique) &&
            usernameAvailability.isUnique &&
            (!usernameAvailability.checkingUnique)
        ) {
            setLoading(true);
            api.post('/user/sign-up', signUpData)
                .then(({data}) => {
                    setLoading(false);

                    if(data.success){
                        navigate('/authentication/verify-profile', {state: data.confirmationCodeId})
                    }
                    
                    if(!data.success && data.validation) {
                        const keys = Object.keys(validationRules);
                        let signUpValidationCopy:SignUpValidationIF = {} as SignUpValidationIF;
                        
                        keys.forEach(key => {
                            signUpValidationCopy[key as keyof SignUpValidationIF] = {
                                ...signUpValidation[key as keyof SignUpValidationIF]
                            }
                        });

                        keys.forEach(key => {
                            signUpValidationCopy[key as keyof SignUpValidationIF] = {
                                ...signUpValidationCopy[key as keyof SignUpValidationIF],
                                isValid: data.validation[key].isValid,
                                errorMessage: data.validation[key].errorMessage,
                            }
                        })

                        setSignUpValidation(signUpValidationCopy);

                        setUsernameAvailability({
                            ...usernameAvailability,
                            isUnique: data.validation.username.isUnique,
                        })

                        setEmailAvailability({
                            ...emailAvailability,
                            isUnique: data.validation.email.isUnique,
                        })
                    }
                    
                    if(!data.success && data.error){
                        setError(data.error);
                    }
                })
                .catch(error => {
                    setError(error.message);
                    setLoading(false);
                });
        } else {
            validate(validationRules, true);
        }
    }

    const checkUnique = (key:'email' | 'username', availability:AvailabilityIF , setAvailability:React.Dispatch<React.SetStateAction<AvailabilityIF>>) => {

        if(signUpData[key as keyof SignUpValidationIF].trim()){

            setAvailability({
                ...availability,
                checkingUnique: true,
            })

            const timoutId = setTimeout(() => {
                api.get(`/user/check-unique`, {
                    params: {
                        [key]: signUpData[key as keyof SignUpDataIF],
                    }
                })
                    .then(response => {
                        if(response.data.success){

                            setAvailability({
                                isUnique: response.data.isUnique,
                                checkingUnique: false
                            })
                        }
                    })
                    .catch(error => {
                        setError(error.message)
                        console.log(error)
                    })
            }, 1000);

            return () => {
                clearTimeout(timoutId);
            }
        }
    }

    const validate = (validationRules:SignUpValidationRulesIF, fromSubmit:boolean = false) => {
        const keys = Object.keys(validationRules);
        let signUpValidationCopy:SignUpValidationIF = {} as SignUpValidationIF;
        
        keys.forEach(key => (
            signUpValidationCopy[key as keyof SignUpValidationIF] = {
                ...signUpValidation[key as keyof SignUpValidationIF]
            }
        ));
        
        for(const [key, validations] of Object.entries(validationRules)){

            if(signUpValidation[key as keyof SignUpValidationIF].touched || fromSubmit) {

                for(const [index, validation] of Object.entries(validations)){

                    const message = validationFunctions[(validation as ValidationRuleIF).function](
                        signUpData[key as keyof SignUpDataIF],
                        ...((validation as ValidationRuleIF).args || [])
                    )

                    if(message){
                        signUpValidationCopy[key as keyof SignUpValidationIF].errorMessage = message;
                        signUpValidationCopy[key as keyof SignUpValidationIF].isValid = false;
                        break;
                    } else {
                        if(+index === validations.length - 1){
                            signUpValidationCopy[key as keyof SignUpValidationIF].isValid = true;
                        }
                        signUpValidationCopy[key as keyof SignUpValidationIF].errorMessage = message;
                    }
                }
            }
        }

        setSignUpValidation(signUpValidationCopy);
    }

    useEffect(() => {
        validate(validationRules);
    }, [
        signUpData.username,
        signUpData.email,
        signUpData.password,
        signUpData.confirmPassword,
    ]);

    useEffect(() => {
        return checkUnique('email', emailAvailability, setEmailAvailability);
    }, [ signUpData.email, signUpValidation.email.isValid ]);


    useEffect(() => {
        return checkUnique('username', usernameAvailability, setUsernameAvailability);
    }, [ signUpData.username, signUpValidation.email.isValid ]);

    return (
        <form onSubmit={handleSubmit}>

            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Choose a Username</p>
                    <input
                        className="form-control"
                        autoComplete="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={signUpData.username}
                        onChange={handleChange}
                    />
                </label>
                {usernameAvailability.checkingUnique && signUpValidation.username.isValid && 
                    <div className="text-end">
                        <div className="text-white spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {signUpValidation.username.errorMessage &&
                    <ErrorText>{signUpValidation.username.errorMessage}</ErrorText>
                }
                {usernameAvailability.isUnique === false && signUpValidation.username.isValid &&
                    <ErrorText>username is already taken</ErrorText>
                }
            </div>
            
            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Email Address</p>
                    <input
                        className="form-control"
                        autoComplete="email"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={signUpData.email}
                        onChange={handleChange}
                    />
                </label>
                {emailAvailability.checkingUnique && signUpValidation.email.isValid &&
                    <div className="text-end">
                        <div className="text-white spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {signUpValidation.email.errorMessage &&
                    <ErrorText>{signUpValidation.email.errorMessage}</ErrorText>
                }
                {emailAvailability.isUnique === false && signUpValidation.email.isValid &&
                    <ErrorText>Email already exists in an account</ErrorText>
                }
            </div>
            
            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Password</p>
                    <input
                        className="form-control"
                        autoComplete="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={signUpData.password}
                        onChange={handleChange}
                    />
                </label>
                {signUpValidation.password.errorMessage &&
                    <ErrorText>{signUpValidation.password.errorMessage}</ErrorText>
                }
            </div>
            
            <div className="mb-4">
                <label className="w-100">
                    <p className="form-label text-white fw-semibold">Confirm Password</p>
                    <input
                        className="form-control"
                        autoComplete="password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={signUpData.confirmPassword}
                        onChange={handleChange}
                    />
                </label>
                {
                    signUpValidation.confirmPassword.errorMessage &&
                    <ErrorText>{signUpValidation.confirmPassword.errorMessage}</ErrorText>
                }
            </div>

            <div className="text-center">
                <button
                    className="btn btn-primary border-white position-relative ps-5 pe-5 "
                >
                    Sign Up
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
 
export default SignUp;