const SpinnerButton:React.FC<{disabled:boolean, loading:boolean, children:React.ReactNode}> = ({disabled, loading, children}) => {
    return (
        <button
            disabled={disabled}
            className="btn btn-primary border-white position-relative ps-5 pe-5 "
        >
            {children}
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
    );
}
 
export default SpinnerButton;