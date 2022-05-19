// calculation functions
function add(num1, num2) {
  return num1 + num2;
}

function substract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2; 
}

// takes 2 numbers and performs operation on them
function operate(operator, num1, num2) {
  switch(operator) {
    case "add":
      return add(num1, num2);
    case "substract":
      return substract(num1, num2);
    case "multiply":
      return multiply(num1, num2);
    case "divide":
      return divide(num1, num2);
  }
}