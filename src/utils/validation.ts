export const validationFunctions:any = {
    isRequired: function(value:string){
        return !!value.trim() ? '' : 'This field is required';
    },
    checkLength: function(value:string, min:number, max: number){
        return value.trim().length >= min && value.trim().length <= max ? '' : `Input must be minimum ${min} and maximum ${max} in length`;
    },
    noSpaces: function(value:string){
        return !value.includes(' ') ? '' : `Input must not contain spaces`;
    },
    isUsername: function(value:string){
        return /^[a-zA-Z0-9_.]+$/.test(value) ? '' : `Only alphanumeric characters, underscore (_), and period (.) are allowed`
    },
    isEmail: function (value:string) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? '' : 'Enter a valid email address';
    },
    isPassword: function(value:string){
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_+-=,.<>?/;:'"])[a-zA-Z\d!@#$%^&*_+-=,.<>?/;:'"]{6,30}$/
        .test(value) ? '' : 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
    },
    isSameAsPassword: function(value:string, password:string){
        return value === password ? '' : 'Passwords do not match';
    }
}