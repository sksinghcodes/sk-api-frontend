export interface GlobalContextInterface {
    isAdmin: boolean | null;
	isLoggedIn: boolean;
	setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean|null>>;
}

export interface DataSourceIFLocal {
	source: string,
	headings: {id:string, value:string}[],
}

export interface DataSourceIF {
	id?: string,
	key?: string,
	source: string,
	headings: string[],
}