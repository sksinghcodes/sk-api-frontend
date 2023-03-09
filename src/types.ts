export interface ContextInterface {
	isSignedIn: boolean;
    isAdmin: boolean;
	checkSignedInStatus: () => void,
	deviceHeight: string,
	user: UserIF
}

export interface UserIF {
	_id: string
	email: string,
	username: string,
	role: number,
}

export interface DataSourceLocalIF {
	source: string,
	headings: {id:string, value:string}[],
}

export interface DataSourceIF {
	_id?: string,
	key?: string,
	source: string,
	headings: string[],
}

export interface ValidationIF {
	errorMessage: string,
	touched: boolean,
	isValid: boolean,
}

export interface SignUpDataIF {
	username: string,
	email: string,
	password: string,
	confirmPassword: string,
}

export interface SignInDataIF {
	usernameOrEmail: string,
	password: string,
}

export interface ResetPasswordDataIF {
	code: string,
	newPassword: string,
	confirmNewPassword: string,
}

export interface SignUpValidationIF {
	username: ValidationIF,
	email: ValidationIF,
	password: ValidationIF,
	confirmPassword: ValidationIF,
}

export interface SignInValidationIF {
	usernameOrEmail: ValidationIF,
	password: ValidationIF,
}

export interface ResetPasswordValidationIF {
	code: ValidationIF,
	newPassword: ValidationIF,
	confirmNewPassword: ValidationIF,
}

export interface AvailabilityIF {
	checkingUnique: boolean,
	isUnique: boolean | null,
}

export interface ValidationRuleIF {
    function: string,
    args?: any[]
}

export interface SignUpValidationRulesIF {
    username: ValidationRuleIF[],
    email: ValidationRuleIF[],
    password: ValidationRuleIF[],
    confirmPassword: ValidationRuleIF[],
}

export interface SignInValidationRulesIF {
    usernameOrEmail: ValidationRuleIF[],
    password: ValidationRuleIF[],
}

export interface ResetPasswordValidationRulesIF {
	code: ValidationRuleIF[],
	newPassword: ValidationRuleIF[],
	confirmNewPassword: ValidationRuleIF[],
}

export interface DataSourceFormErrors {
	source: string,
    headings: string[],
}

export enum FormMode {
	UPDATE,
	CREATE,
}