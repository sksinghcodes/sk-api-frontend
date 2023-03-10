const SuccessText:React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <div className="valid-feedback d-block">
           {children}
        </div>
    );
}
 
export default SuccessText;