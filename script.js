const NUMBER_CHARS = "1234567890";
const PLUS_SIGN = "+";
const MINUS_SIGN = "\u2212";
const TIMES_SIGN = "\u00D7";
const DIVIDE_SIGN = "\u00f7";
const OPERATOR_CHARS = PLUS_SIGN + MINUS_SIGN + TIMES_SIGN + DIVIDE_SIGN;

let operator;
let operand1;
let operand2;

let currentNumber = "0";
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
  }
}

function handleOperator(button) {
  operatorButton = button;
  operatorButton.classList.add("button--highlight");

  operator = operatorButton.textContent;
  operand1 = parseFloat(currentNumber);
  currentNumber = "0";
}

function calculateResult() {
  operatorButton.classList.remove("button--highlight");
  operatorButton = null;

  operand2 = parseFloat(currentNumber);
  result = operate(operator, operand1, operand2);

  updateDisplay(result);
  currentNumber = "0";
}

function addDigit(digit) {
  const isFull = currentNumber.length == 9;
  const isZero = currentNumber == "0";
  const bothZero = isZero && digit == "0";

  if (isFull || bothZero) {
    return;
  }

  if (isZero) {
    currentNumber = digit;
  } else {
    currentNumber += digit;
  }

  updateDisplay(currentNumber);
}

function addDecimal() {
  const isFull = currentNumber.length == 9;
  const hasDecimal = currentNumber.includes(".");
  
  if (isFull || hasDecimal) {
    return;
  }

  currentNumber += ".";

  updateDisplay(currentNumber);
}

function changeSign() {
  const isFull = currentNumber.length == 9;
  const isZero = currentNumber == "0";
  const isNegative = !isZero && currentNumber.includes("-");
  const isFullPositive = isFull && !isNegative;
  
  if (isZero || isFullPositive) {
    return;
  }
  
  if (isNegative) {
    currentNumber = currentNumber.replace("-", "");
  } else {
    currentNumber = "-" + currentNumber;
  }

  updateDisplay(currentNumber);
}

function updateDisplay(text) {
  const display = document.querySelector(".calculator__display");
  display.textContent = text;
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
  return num1 / num2;
}