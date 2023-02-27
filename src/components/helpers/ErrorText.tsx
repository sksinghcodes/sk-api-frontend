const ErrorText:React.FC<{children:string}> = ({children}) => {
    return (
        <div 
            style={{
                marginTop: '0.25rem',
                fontSize: '.875em',
                color: '#cf2211',
                padding: '0.1em 0.4em',
                backgroundColor: '#ffecec6b',
                borderRadius: '0.4em',
            }}
        >
           {children}
        </div>
    );
}
 
export default ErrorText;