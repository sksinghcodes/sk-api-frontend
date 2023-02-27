import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { ResetPasswordDataIF, ResetPasswordValidationIF, ResetPasswordValidationRulesIF, ValidationRuleIF } from "../../types";
import { validationFunctions } from "../../utils/validation";
import ErrorText from "../helpers/ErrorText";
import SpinnerButton from "../helpers/SpinnerButton";
import SuccessText from "../helpers/SucessText";

const ResetPassword = () => {
    const [ email, setEmail ] = useState('');
    const [ emailError, setEmailError ] = useState('');

    const [ passwordResetId, setPasswordResetId ] = useState('');

    const [ resetPasswordData, setResetPasswordData ] = useState<ResetPasswordDataIF>({
        code: '',
        newPassword: '',
        confirmNewPassword: '',
    })

    const [ resetPasswordValidation, setResetPasswordValidation ] = useState<ResetPasswordValidationIF>({
        code: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
        newPassword: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
        confirmNewPassword: {
            errorMessage: '',
            touched: false,
            isValid: false,
        },
    })

    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const validationRules:ResetPasswordValidationRulesIF = {
        code: [
            {function: 'isRequired'},
            {function: 'noSpaces'},
            {function: 'checkLength', args: [6,6]},
        ],
        newPassword: [
            {function: 'isRequired'},
            {function: 'noSpaces'},
            {function: 'checkLength', args: [6,30]},
            {function: 'isPassword'},
        ],
        confirmNewPassword: [
            {function: 'isRequired'},
            {function: 'isSameAsPassword', args: [resetPasswordData.newPassword]},
        ],
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;
        setResetPasswordValidation({
            ...resetPasswordValidation,
            [name]: {
                ...resetPasswordValidation[name as keyof ResetPasswordValidationIF],
                touched: true,
            },
        })

        setResetPasswordData({
            ...resetPasswordData,
            [name]: value
        })
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault()
        if(!passwordResetId) {
            if(email.trim()) {
                setLoading(true);
                setEmailError('');
                setError('')
                api.get('/user/reset-password', {
                    params: { email: email }
                }).then(response => {
                    setLoading(false);
                    if(response.data.success){
                        setPasswordResetId(response.data.passwordResetId)
                    } else {
                        setEmailError(response.data.error)
                    }
                }).catch(error => {
                    setLoading(false);
                    setError(error.message);
                })
            } else {
                setEmailError('Please enter email');
            }

        } else {
            if(
                resetPasswordValidation.newPassword.isValid &&
                resetPasswordValidation.confirmNewPassword.isValid
            ) {
                setLoading(true);
                api.post('/user/reset-password', {...resetPasswordData, passwordResetId})
                    .then(({data}) => {
                        setLoading(false);

                        if(data.success){
                            setSuccess(true);
                        }
                        
                        if(!data.success && data.validation) {
                            const keys = Object.keys(validationRules);
                            let resetPasswordValidation:ResetPasswordValidationIF = {} as ResetPasswordValidationIF;
                            
                            keys.forEach(key => {
                                resetPasswordValidation[key as keyof ResetPasswordValidationIF] = {
                                    ...resetPasswordValidation[key as keyof ResetPasswordValidationIF]
                                }
                            });

                            keys.forEach(key => {
                                resetPasswordValidation[key as keyof ResetPasswordValidationIF] = {
                                    ...resetPasswordValidation[key as keyof ResetPasswordValidationIF],
                                    isValid: data.validation[key].isValid,
                                    errorMessage: data.validation[key].errorMessage,
                                }
                            })

                            setResetPasswordValidation(resetPasswordValidation);
                        }
                        
                        if(!data.success && data.error){
                            setError(data.error);
                        }
                    })
                    .catch(error => {
                        setError(error.message)
                        setLoading(false);
                    });
            } else {
                validate(validationRules, true);
            }
        }
    }

    const validate = (validationRules:ResetPasswordValidationRulesIF, fromSubmit:boolean = false) => {
        const keys = Object.keys(validationRules);
        let resetPasswordValidationCopy:ResetPasswordValidationIF = {} as ResetPasswordValidationIF;

        keys.forEach(key => (
            resetPasswordValidationCopy[key as keyof ResetPasswordValidationIF] = {
                ...resetPasswordValidation[key as keyof ResetPasswordValidationIF]
            }
        ));
        
        for(const [key, validations] of Object.entries(validationRules)){

            if(resetPasswordValidationCopy[key as keyof ResetPasswordValidationIF].touched || fromSubmit) {

                for(const [index, validation] of Object.entries(validations)){

                    const message = validationFunctions[(validation as ValidationRuleIF).function](
                        resetPasswordData[key as keyof ResetPasswordDataIF],
                        ...((validation as ValidationRuleIF).args || [])
                    )

                    if(message){
                        resetPasswordValidationCopy[key as keyof ResetPasswordValidationIF].errorMessage = message;
                        resetPasswordValidationCopy[key as keyof ResetPasswordValidationIF].isValid = false;
                        break;
                    } else {
                        if(+index === validations.length - 1){

                            resetPasswordValidationCopy[key as keyof ResetPasswordValidationIF].isValid = true;
                        }
                        resetPasswordValidationCopy[key as keyof ResetPasswordValidationIF].errorMessage = message;
                    }
                }
            }
        }

        setResetPasswordValidation(resetPasswordValidationCopy);
    }

    useEffect(() => {
        validate(validationRules);
    }, [
        resetPasswordData.code,
        resetPasswordData.newPassword,
        resetPasswordData.confirmNewPassword,
    ]);

    return (
        <form onSubmit={handleSubmit}>
            {!passwordResetId ? <>
                <div className="mb-3">
                    <label className="w-100">
                        <p className="form-label text-white fw-semibold">Enter the email address that you used in your profile</p>
                        <input
                            className="form-control"
                            type="text"
                            name="email"
                            value={email}
                            placeholder="Email Address"
                            onChange={e => setEmail(e.target.value.trim())}
                        />
                    </label>
                    {emailError &&
                        <ErrorText>{emailError}</ErrorText>
                    }
                </div>
            </> : <>
                <div className="mb-3">
                    <label className="w-100">
                        <p className="form-label text-white fw-semibold">A six digit code has been sent to you on your email address. Please enter it here to reset you password</p>
                        <input
                            className="form-control"
                            type="text"
                            name="code"
                            placeholder="XXXXXX"
                            value={resetPasswordData.code}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                    </label>
                </div>
                {resetPasswordValidation.code.errorMessage &&
                    <ErrorText>{resetPasswordValidation.code.errorMessage}</ErrorText>
                }
                <div className="mb-3">
                    <label className="w-100">
                        <p className="form-label text-white fw-semibold">New Password</p>
                        <input
                            className="form-control"
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={resetPasswordData.newPassword}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                {resetPasswordValidation.newPassword.errorMessage &&
                    <ErrorText>{resetPasswordValidation.newPassword.errorMessage}</ErrorText>
                }
                <div className="mb-3">
                    <label className="w-100">
                        <p className="form-label text-white fw-semibold">Confirm new passsword</p>
                        <input
                            className="form-control"
                            type="password"
                            name="confirmNewPassword"
                            placeholder="Confirm new password"
                            value={resetPasswordData.confirmNewPassword}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                {resetPasswordValidation.confirmNewPassword.errorMessage &&
                    <ErrorText>{resetPasswordValidation.confirmNewPassword.errorMessage}</ErrorText>
                }
            </>}
            <div className="text-center">
                <SpinnerButton
                    disabled={loading}
                    loading={loading}
                >{!passwordResetId ? 'Get confirmation code' : 'Reset Password'}</SpinnerButton>
            </div>
            {error && <>
                <div className="pb-3"></div>
                <ErrorText>{error}</ErrorText>
            </>}
            {success && <>
                <div className="pb-3"></div>
                <SuccessText>Your password has been changed. Now you can <Link to="/authentication/sign-in">Sign In</Link></SuccessText>
            </>}
        </form>
    );;
}
 
export default ResetPassword;