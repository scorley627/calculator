const PLUS_SIGN = "+";
const MINUS_SIGN = "\u2212";
const TIMES_SIGN = "\u00D7";
const DIVIDE_SIGN = "\u00f7";
const RANGE_TOP = 999999999;
const RANGE_BOTTOM = -99999999;
const NUMBER_CHARS = "1234567890";
const OPERATOR_CHARS = "+-*/";

let operator;
let operand1;
let operand2;

let inputNumber = "";
let operatorButton;

document.addEventListener("click", handleClick);
document.addEventListener("keydown", handleKeyDown);

function handleClick(event) {
  if (event.target.className.includes("button")) {
    handleButtonClick(event.target);
  }
}

function handleKeyDown(event) {
  const isNumberKey = NUMBER_CHARS.includes(event.key);
  const isOperatorKey = OPERATOR_CHARS.includes(event.key);
  const isDecimalKey = event.key == ".";
  const isEqualsKey = event.key == "Enter" || event.key == "=";
  const isBackKey = event.key == "Backspace";

  if (isNumberKey) {
    addDigit(event.key);
  } else if (isDecimalKey) {
    addDecimal();
  } else if (isOperatorKey) {
    event.preventDefault();
    const operatorButton = getOperatorButtonFromKey(event.key);
    handleOperator(operatorButton);
  } else if (isEqualsKey) {
    calculateResult();
  } else if (isBackKey) {
    removeChar();
  }
}

function handleButtonClick(button) {
  const isNumberButton = button.className.includes("number");
  const isDecimalButton = button.className.includes("decimal");
  const isSignButton = button.className.includes("sign");
  const isOperatorButton = button.className.includes("operator");
  const isEqualsButton = button.className.includes("equals");
  const isClearButton = button.className.includes("clear");
  const isBackButton = button.className.includes("back");

  if (isNumberButton) {
    addDigit(button.textContent);
  } else if (isDecimalButton) {
    addDecimal();
  } else if (isSignButton) {
    changeSign();
  } else if (isOperatorButton) {
    handleOperator(button);
  } else if (isEqualsButton) {
    calculateResult();
  } else if (isClearButton) {
    clear();
  } else if (isBackButton) {
    removeChar();
  }
}

function handleOperator(button) {
  const hasOperator = operatorButton != null;
  const hasInput = inputNumber != "";
  const hasSameOperator = operatorButton == button;

  if (hasOperator && hasInput) {
    // Calculate current result to be used as new operand1
    calculateResult();
  } else if (!hasInput && hasOperator && !hasSameOperator) {
    // Changing operator button; remove current highlight
    operatorButton.classList.remove("button--highlight");
  }

  operatorButton = button;
  operatorButton.classList.add("button--highlight");

  const display = document.querySelector(".calculator__display");
  operand1 = parseFloat(display.textContent);
  operator = operatorButton.textContent;
  inputNumber = "";
}

function calculateResult() {
  const hasOperator = operatorButton != null;
  const hasInput = inputNumber != "";
  if (!hasOperator || !hasInput) {
    return;
  }

  const display = document.querySelector(".calculator__display");
  operand2 = parseFloat(display.textContent);
  result = operate(operator, operand1, operand2);
  display.textContent = sanitizeResult(result);

  operatorButton.classList.remove("button--highlight");
  operatorButton = null;
  inputNumber = "";
}

function sanitizeResult(result) {
  const isTooLong = result.toString().length > 9;
  const isOutsideRange = result < RANGE_BOTTOM || result > RANGE_TOP;
  const isPositive = result > 0;

  let numDigits;
  if (Math.abs(result) > 1) {
    // Number of digits before the decimal place is log base 10 + 1
    numDigits = Math.floor(Math.log(Math.abs(result)) * Math.LOG10E) + 1;
  } else {
    numDigits = 1;
  }

  if (isTooLong && !isOutsideRange) {
    let numDecimals;
    if (isPositive) {
      numDecimals = 8 - numDigits;
    } else {
      numDecimals = 7 - numDigits;
    }

    if (numDecimals < 1) {
      result = Math.round(result);
    } else {
      result = result.toFixed(numDecimals);
    }
  } else if (isOutsideRange) {
    // The exponent in scientific notation is number of digits - 1
    const exponentLength = String(numDigits - 1).length;

    let numDecimals;
    if (isPositive) {
      numDecimals = 5 - exponentLength;
    } else {
      numDecimals = 4 - exponentLength;
    }

    result = result.toExponential(numDecimals);

    // We sometimes round up and add a new digit, which could cause overflow
    // E.g. 999999999 * 10 = 9999999990 rounds to 10000000000 as 1.0000e+10
    const newNumDigits =
      Math.floor(Math.log(Math.abs(result)) * Math.LOG10E) + 1;
    if (newNumDigits > numDigits) {
      result = parseFloat(result).toExponential(numDecimals - 1);
    }
  }

  return result;
}

function clear() {
  operator = null;
  operand1 = 0;
  operand2 = 0;
  inputNumber = ""
  if (operatorButton != null) {
    operatorButton.classList.remove("button--highlight");
    operatorButton = null;
  }
  const display = document.querySelector(".calculator__display");
  display.textContent = "0";
}

function removeChar() {
  if (inputNumber == "") {
    return;
  }

  inputNumber = inputNumber.slice(0, -1);
  const display = document.querySelector(".calculator__display");
  if (inputNumber == "" && operatorButton == null) {
    display.textContent = "0";
  } else {
    display.textContent = inputNumber;
  }
}

function addDigit(digit) {
  const isFull = inputNumber.length == 9;
  const isZero = inputNumber == "0";
  const bothZero = isZero && digit == "0";

  if (isFull || bothZero) {
    return;
  }

  if (isZero) {
    inputNumber = digit;
  } else {
    inputNumber += digit;
  }

  const display = document.querySelector(".calculator__display");
  display.textContent = inputNumber;
}

function addDecimal() {
  const isFull = inputNumber.length == 9;
  const hasDecimal = inputNumber.includes(".");
  const hasInput = inputNumber != "";
  
  if (isFull || hasDecimal) {
    return;
  }

  if (hasInput) {
    inputNumber += ".";
  } else {
    inputNumber = "0.";
  }

  const display = document.querySelector(".calculator__display");
  display.textContent = inputNumber;
}

function changeSign() {
  const isFull = inputNumber.length == 9;
  const isZero = inputNumber == "0";
  const hasInput = inputNumber != "";
  const isNegative = !isZero && inputNumber.includes("-");
  const isFullPositive = isFull && !isNegative;
  
  if (isZero || isFullPositive || !hasInput) {
    return;
  }
  
  if (isNegative) {
    inputNumber = inputNumber.replace("-", "");
  } else {
    inputNumber = "-" + inputNumber;
  }

  const display = document.querySelector(".calculator__display");
  display.textContent = inputNumber;
}

function getOperatorButtonFromKey(key) {
  switch (key) {
    case "+": return document.querySelector(".button--add");
    case "-": return document.querySelector(".button--minus");
    case "*": return document.querySelector(".button--times");
    case "/": return document.querySelector(".button--divide");
  }
}

function operate(op, num1, num2) {
  switch(op) {
    case PLUS_SIGN: return add(num1, num2);
    case MINUS_SIGN: return subtract(num1, num2);
    case TIMES_SIGN: return multiply(num1, num2);
    case DIVIDE_SIGN: return divide(num1, num2);
  }
}

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 == 0) {
    return NaN;
  }
  return num1 / num2;
}