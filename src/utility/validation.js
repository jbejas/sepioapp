const validate = (val, rules) => {
  let isValid = true;
  for (let rule in rules) {
    switch (rule) {
      case "isEmail":
        isValid = isValid && emailVaidator(val);
        console.log("Email Validation -> " + isValid);
        break;
      case "minLength":
        isValid = isValid && minLengthValidator(val, rules[rule]);
        console.log(
          "Min Length Validation -> " + isValid + " / Length -> " + rules[rule]
        );
        break;
      default:
        isValid = true;
    }
  }
  console.log("Validation Result -> " + isValid);
  return isValid;
};

const emailVaidator = val => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    val
  );
};

const minLengthValidator = (val, minLength) => {
  return val.length >= minLength;
};

export default validate;
