const SuccessText:React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <div 
            style={{
                marginTop: '0.25rem',
                fontSize: '.875em',
                color: '#004c11',
                padding: '0.1em 0.4em',
                backgroundColor: '#94ffd16b',
                borderRadius: '0.4em',
            }}
        >
           {children}
        </div>
    );
}
 
export default SuccessText;