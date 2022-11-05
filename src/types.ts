export interface GlobalContextInterface {
    isAdmin: boolean | null;
	isLoggedIn: boolean;
	setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean|null>>;
}