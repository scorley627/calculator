const NUMBER_CHARS = "1234567890";

let operator;
let operand1;
let operand2;

document.addEventListener("click", handleClick);

function handleClick(event) {
  const targetClass = event.target.className;
  const targetText = event.target.textContent;
  const isButton = targetClass.includes("button");
  const isNumberButton = isButton && NUMBER_CHARS.includes(targetText);
  if (isNumberButton) updateDisplay(targetText);
}

function updateDisplay(text) {
  const display = document.querySelector(".calculator__display");
  const isDisplayFull = display.textContent.length == 9;
  if (!isDisplayFull) {
    display.textContent += text;
    operand1 = parseFloat(display.textContent);
  }
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