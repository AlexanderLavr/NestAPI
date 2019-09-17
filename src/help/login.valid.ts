
export const validLogin = (loginObj) =>{
      const errorObj = {
        logErrorEmail: '',
        logErrorPassword: ''
      }
      let stateValid = 0;
      const passWordExpr = new RegExp(/^[0-9]{3,}$/);
      const emailRegExpr = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

      if(!emailRegExpr.test(loginObj.email)){
          errorObj.logErrorEmail = 'Error: uncorrectEmail value!';
      }else{++stateValid}
      if(!passWordExpr.test(loginObj.password)){
          errorObj.logErrorPassword = 'Error: допустимы буквы латинского алфавита и цифры не менее 3-х';
      }else{++stateValid}

      return{
        errorObj: errorObj,
        stateValid: stateValid
    }
}
