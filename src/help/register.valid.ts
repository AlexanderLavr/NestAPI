export const walidRegister = (registerObj:any):any=>{
    const errorObj = {
        errorFirstname: '',
        errorSecondname: '',
        errorEmail: '',
        errorPassword: ''
    }
    let stateValid = 0;

    const inpRegExpr = new RegExp(/^[a-zA-Z]{3,}$/);
    const passWordExpr = new RegExp(/^[0-9]{3,}$/);
    const emailRegExpr = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

    if(!inpRegExpr.test(registerObj.firstname)){
        errorObj.errorFirstname = 'Error: допустимы буквы латинского алфавита менее 3-х';
    }else{++stateValid}
    if(!inpRegExpr.test(registerObj.secondname)){
        errorObj.errorSecondname = 'Error: допустимы буквы латинского алфавита менее 3-х';
    }else{++stateValid}
    if(!emailRegExpr.test(registerObj.email)){
        errorObj.errorEmail = 'Error: uncorrectEmail value!';
    }else{++stateValid}
    if(!passWordExpr.test(registerObj.password)){
        errorObj.errorPassword = 'Error: допустимы цифры не менее 3-х';
    }else{++stateValid}

    return {
        stateValid: stateValid,
        errorObj: errorObj
    }
}

