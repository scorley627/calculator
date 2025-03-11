const NUMBER_CHARS = "1234567890";

let operator;
let operand1;
let operand2;

document.addEventListener("click", handleClick);

function handleClick(event) {
  if (event.target.className.includes("button")) {
    handleButtonClick(event.target.textContent, event.target.className);
  }
}

function handleButtonClick(buttonText, buttonClass) {
  const isNumberButton = NUMBER_CHARS.includes(buttonText);
  const isDecimalButton = buttonText == ".";
  const isSignButton = buttonClass.includes("sign");

  if (isNumberButton) {
    addDigit(buttonText);
  } else if (isDecimalButton) {
    addDecimal();
  } else if (isSignButton) {
    changeSign();
  }
}

function addDigit(digit) {
  const display = document.querySelector(".calculator__display");
  const isFull = display.textContent.length == 9;
  const isZero = display.textContent == "0";
  const bothZero = isZero && digit == "0";

  if (isFull || bothZero) {
    return;
  }

  if (isZero) {
    display.textContent = digit;
  } else {
    display.textContent += digit;
  }

  operand1 = parseFloat(display.textContent);
}

function addDecimal() {
  const display = document.querySelector(".calculator__display");
  const isFull = display.textContent.length == 9;
  const hasDecimal = display.textContent.includes(".");

  if (isFull || hasDecimal) {
    return;
  }

  display.textContent += ".";
}

function changeSign() {
  const display = document.querySelector(".calculator__display");
  const isFull = display.textContent.length == 9;
  const isZero = display.textContent == "0";
  const isNegative = !isZero && display.textContent.includes("-");
  const isFullPositive = isFull && !isNegative;

  if (isZero || isFullPositive) {
    return;
  }

  if (isNegative) {
    display.textContent = display.textContent.replace("-", "");
  } else {
    display.textContent = "-" + display.textContent;
  }
  
  operand1 = parseFloat(display.textContent);
}

function operate(op, num1, num2) {
  switch(op) {
    case "+": return add(num1, num2);
    case "-": return subtract(num1, num2);
    case "*": return multiply(num1, num2);
    case "/": return divide(num1, num2);
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