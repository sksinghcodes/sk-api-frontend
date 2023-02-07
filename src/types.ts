export interface ContextInterface {
	isSignedIn: boolean;
    isAdmin: boolean;
	checkSignedInStatus: () => void,
	deviceHeight: string,
}

export interface DataSourceIFLocal {
	source: string,
	headings: {id:string, value:string}[],
}

export interface DataSourceIF {
	_id?: string,
	key?: string,
	source: string,
	headings: string[],
}

export interface AuthFormSingleFieldIF {
	value: string,
	errorMessage: string,
	touched: boolean,
	validating?: boolean,
}

export interface SignUpDataIF {
	username: AuthFormSingleFieldIF,
	email: AuthFormSingleFieldIF,
	password: AuthFormSingleFieldIF,
	confirmPassword: AuthFormSingleFieldIF,
}

export interface SignInDataIF {
	usernameOrEmail: AuthFormSingleFieldIF,
	password: AuthFormSingleFieldIF,
}