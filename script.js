const NUMBER_CHARS = "1234567890";
const PLUS_SIGN = "+";
const MINUS_SIGN = "\u2212";
const TIMES_SIGN = "\u00D7";
const DIVIDE_SIGN = "\u00f7";
const OPERATOR_CHARS = PLUS_SIGN + MINUS_SIGN + TIMES_SIGN + DIVIDE_SIGN;

let operator;
let operand1;
let operand2;

let inputNumber = "";
let operatorButton;

document.addEventListener("click", handleClick);

function handleClick(event) {
  if (event.target.className.includes("button")) {
    handleButtonClick(event.target);
  }
}

function handleButtonClick(button) {
  const isNumberButton = NUMBER_CHARS.includes(button.textContent);
  const isOperatorButton = OPERATOR_CHARS.includes(button.textContent);
  const isSignButton = button.className.includes("sign");
  const isEqualsButton = button.className.includes("equals");
  const isDecimalButton = button.textContent == ".";
  const isClearButton = button.textContent == "C";

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
  }
}

function handleOperator(button) {
  const hasOperator = operatorButton != null;
  const hasInput = inputNumber != "";
  const hasSameOperator = operatorButton == button;

  if (hasOperator && hasInput) {
    calculateResult();
  } else if (!hasInput && hasOperator && !hasSameOperator) {
    operatorButton.classList.remove("button--highlight");
  }

  operatorButton = button;
  operatorButton.classList.add("button--highlight");

  const display = document.querySelector(".calculator__display");
  operator = operatorButton.textContent;
  operand1 = parseFloat(display.textContent);
  inputNumber = "";
}

function calculateResult() {
  const hasOperator = operatorButton != null;
  const hasInput = inputNumber != "";
  if (!hasOperator || !hasInput) {
    return;
  }

  operatorButton.classList.remove("button--highlight");
  operatorButton = null;

  const display = document.querySelector(".calculator__display");
  operand2 = parseFloat(display.textContent);
  result = operate(operator, operand1, operand2);

  const isTooLong = result.toString().length > 9;
  const isOutsideRange = result > 999999999 || result < -99999999;
  const isPositive = result > 0;

  // To get the number of digits before the decimal place in a number,
  // calculate the log base 10 of the number and add 1.
  const numDigits = Math.floor(Math.log(Math.abs(result)) * Math.LOG10E) + 1;

  if (isTooLong && !isOutsideRange) {
    const maxDecimals = isPositive ? 8 - numDigits : 7 - numDigits;
    if (maxDecimals < 1) {
      result = Math.round(result);
    } else {
      result = result.toFixed(maxDecimals);
    }
  } else if (isOutsideRange) {
    // The exponent of a number in scientific notation is number of digits - 1
    let exponentLength = String(numDigits - 1).length;
    const maxDecimals = isPositive ? 5 - exponentLength : 4 - exponentLength;
    result = result.toExponential(maxDecimals);

    // We sometimes round up and add a new digit, which could cause overflow.
    // For example multiplying 999999999 * 10
    let newNumDigits = Math.floor(Math.log(Math.abs(result)) * Math.LOG10E) + 1;
    let newExponentLength = String(newNumDigits - 1).length;
    if (newExponentLength > exponentLength) {
      result = parseFloat(result).toExponential(maxDecimals - 1);
    }
  }

  display.textContent = result;
  inputNumber = "";
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