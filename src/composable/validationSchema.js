/*
import { useSSNvalidation } from "./validation/ssnValidation/ssnValidation";
//import { useCurrencyValidation } from "./currencyValidation";
//import { useEmailValidation } from "./validation/emailValidation/emailValidation";
//import { usePhoneValidation } from "./ssnvalidation/usePhoneValidation";
// Instantiate composables once for reuse
const ssnValidation = useSSNvalidation();
const currencyValidation = useCurrencyValidation();
const emailValidation = useEmailValidation();
const phoneValidation = usePhoneValidation();

const validationSchema = {
  ssn: {
    validator: (value, language) => ssnValidation.validateNationalId(value, language),
  },
  currency: {
  
    validator: (value, language, currency) => currencyValidation.onInputBlur(value, language, currency),
    formatter: (value, language, currency) => currencyValidation.currencyAmmount(value, language, currency),
    currencyFocus:(value, language, currency) => currencyValidation.onInputFocus(value, language, currency),
  },
  email: {
    validator: (value) => emailValidation.validateEmail(value),
    
  },
    tel: {
    validator: (value) => phoneValidation.validatePhone(value),
   
  },
  // Add more field types as needed
};

export default validationSchema;
*/
const validationSchema = {

}
export default validationSchema;