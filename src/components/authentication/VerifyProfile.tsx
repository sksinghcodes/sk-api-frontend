import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import api from "../../api";
import ErrorText from "../helpers/ErrorText";
import SpinnerButton from "../helpers/SpinnerButton";
import SuccessText from "../helpers/SucessText";

const VerifyProfile = () => {
    const [ code, setCode ] = useState('');
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const location = useLocation();

    if(!location.state){
        return <Navigate to="../" replace/>
    }

    function validate(code:string){
        if(code.length === 6) {
            return true;
        } else {
            setError('Verification code must contain six digits')
            return false;
        }
    }

    function handleSubmit(e:React.SyntheticEvent){
        e.preventDefault();

        if(!validate(code)){
            return false;
        }

        setLoading(true)
        api.post('/user/verify-profile', {
            verificationId: location.state,
            code: code,
        }).then(({data}) => {
            setLoading(false);
            if(data.success){
                setSuccess(true);
                setError('');
            } else {
                setError(data.error);
            }
        }).catch(error => {
            setLoading(false);
            setError(error.message);
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="w-100">
                    <p className="form-label fw-semibold">A six digit code has been sent to you on your email address. Please enter it here to confirm your profile</p>
                    <input
                        className="form-control"
                        type="text"
                        name="usernameOrEmail"
                        placeholder="XXXXXX"
                        value={code}
                        onChange={e => setCode(e.target.value.trim())}
                        autoComplete="username"
                    />
                </label>
            </div>
            <div className="text-center">
                <SpinnerButton
                    disabled={loading}
                    loading={loading}
                >Verify</SpinnerButton>
            </div>
            {error && <>
                <div className="pb-3"></div>
                <ErrorText>{error}</ErrorText>
            </>}
            {success && <>
                <div className="pb-3"></div>
                <SuccessText>Your profile has has been verified. Now click on <Link to="/authentication/sign-in">Sign In</Link></SuccessText>
            </>}
        </form>
    );;
}
 
export default VerifyProfile;