
//------------------------------------------  EMAIL VALIDATION  ----------------------------------------------------


const isValidEmail = (value) => {
    if (typeof value === "undefined" || value === null) return false
    const regex= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(value)
}


//------------------------------------------  PASSWORD VALIDATION  ----------------------------------------------------


const isValidPassword = (value) =>{
    if (typeof value === "undefined" || value === null) return false
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    return regex.test(value)
}

//-------------------------------------------  NAME TYPE VALIDATION  ----------------------------------------------------


const isValidName = function (value) {
    if (typeof value === undefined || typeof value === null || value === "" ) {
      return false;
    }
    if (typeof value === "string" && value.trim().length > 0 ) {
      return true;
    }}


//-------------------------------------------  NAME  VALIDATION  ----------------------------------------------------
  
  const forName = function (value) {
    return /^[A-Z][a-z]{1,}(?: [A-Z][a-z]+){0,}$/.test(value);
  };



module.exports.isValidEmail = isValidEmail
module.exports.isValidPassword= isValidPassword
module.exports.isValidName= isValidName
module.exports.forName=forName

