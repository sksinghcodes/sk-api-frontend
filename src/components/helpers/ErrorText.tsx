const ErrorText:React.FC<{children:string}> = ({children}) => {
    return (
        <div className="invalid-feedback d-block">
           {children}
        </div>
    );
}
 
export default ErrorText;