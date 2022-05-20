// start writing numbers into first number buffer
let currentNumberBuffer = 1;
// changes depending on whether first number was already entered
let nextInputType = "";

// numbers and operator buffers
let number1 = "";
let number2 = "";
let operator = "";
// current number being displayed
let currNumber = "";

// calculation functions
function add(num1, num2) {
  return +num1 + +num2;
}

function substract(num1, num2) {
  return +num1 - +num2;
}

function multiply(num1, num2) {
  return +num1 * +num2;
}

function divide(num1, num2) {
  return +num1 / +num2; 
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

// writes to "currentNumber" element
function writeCurrent(text) {
  const currentNumberBtn = document.querySelector(".currentNumber");
  currentNumberBtn.textContent = text;
}


// number buttons
const numberBtns = document.querySelectorAll(".numberBtn");
numberBtns.forEach((button) => {
  button.addEventListener("click", (event) => {
    // if first number was already entered
    if (nextInputType === "secondNumber") {
      // next click on operator will push the number into buffer 2
      // and will calculate the result
      currentNumberBuffer = 2;
    }

    // appends clicked buttons number to current number
    currNumber += event.target.id;
    writeCurrent(currNumber);
    console.log(currNumber);
  })
})


// operator buttons
const operatorsBtns = document.querySelectorAll(".operatorBtn")
operatorsBtns.forEach((button) => {
  button.addEventListener("click", (event) => {
    // "clear eveything" button
    if (event.target.id === "CE") {
      currentNumberBuffer = 1;
      nextInputType = "";
      number1 = "";
      number2 = "";
      operator = "";
      currNumber = "";
      writeCurrent("0");
      console.log("CE");
      return;
    }


    // "clear" button (backspace)
    if (event.target.id === "C") {
      // slices off the end of current number
      currNumber = currNumber.substring(0, currNumber.length - 1);
      writeCurrent(currNumber);
      console.log(currNumber);
      return;
    }
    

    // "equal" button
    if (event.target.id === "equal") {
      // pushes current number into buffer 2
      number2 = currNumber;
      // calculates
      let result = operate(operator, number1, number2)
      writeCurrent(result);
      console.log("result: " + result);
      // pushes the result to buffer 1 so you can keep
      // calculating with the result
      number1 = result;
      // makes sure you can change the operator on next operation
      // instead of just doing equal again
      currentNumberBuffer = 1;
      // to prevent the other 2 operator checks from being done
      return;
    }


    // if numbers are still being entered to buffer 1
    // (if you are still entering only numbers)
    if (currentNumberBuffer === 1) {
      // prevents overwriting buffer 1 if you want to change operator
      // before second number is entered
      if (number1 === "") {
        // pushes current number into number buffer 1
        number1 = currNumber;     
      }
      currNumber = "";
      // changes operator
      operator = event.target.id;
      console.log(operator);
      // makes sure next number will go into buffer 2
      nextInputType = "secondNumber";
    }

    // if numbers are being entered to buffer 2
    // (if there is a number in buffer 1 already
    // because you already did some operation before)
    else if (currentNumberBuffer === 2) {



      // pushes current number into buffer 2
      number2 = currNumber;
      currNumber = "";

      // calculates
      let result = operate(operator, number1, number2)
      writeCurrent(result);
      console.log("result: " + result);

      // pushes the result to buffer 1 so you can keep
      // calculating with the result
      number1 = result;
      // resets second buffer to be ready for new number input
      number2 = "";
      // changes operator
      operator = event.target.id;
      console.log(operator);
    }
  })
})