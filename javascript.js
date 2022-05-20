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
// for carrying over the result when equal button is pressed
let overwriteNext = false;

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

// writes to "currentNumber" box
function writeCurrent(text) {
  const currentNumberBox = document.querySelector(".currentNumber");
  currentNumberBox.textContent = text;
}

// appends to "buffer" box
function appendBuffer(text) {
  const bufferBox = document.querySelector(".buffer");

  if (text === "wipe") {
    bufferBox.textContent = "";
    return;
  }

  // if equal was pressed and then operator was pressed after
  if (overwriteNext) {
    // wipes the buffer and start with result of the equal operation
    bufferBox.textContent = number1;
    overwriteNext = false;
  }

  // if text is operator and
  // if last character is operator (is not number) 
  if (isNaN(text) && isNaN(bufferBox.textContent.slice(-1))) {
    // overwrite last operator
    bufferBox.textContent = bufferBox.textContent.slice(0, -1) + text;
    return;
  }

  // appends text
  bufferBox.textContent = (bufferBox.textContent + " " + text); 
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

    // if you press number after you pressed equal
    if (operator === "equal") {
      number1 = "";
      currentNumberBuffer = 1;
      overwriteNext = false;
      appendBuffer("wipe");
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
    // "clear" button (backspace)
    if (event.target.id === "C") {
      // slices off the end of current number
      currNumber = currNumber.substring(0, currNumber.length - 1);
      writeCurrent(currNumber);
      console.log(currNumber);
      return;
    }


    // "clear eveything" button
    if (event.target.id === "CE") {
      currentNumberBuffer = 1;
      nextInputType = "";
      number1 = "";
      number2 = "";
      operator = "";
      currNumber = "";
      overwriteNext = false;
      appendBuffer("wipe");
      writeCurrent("0");
      console.log("CE");
      return;
    }
    

    // "equal" button
    if (event.target.id === "equal") {
      // pushes current number into buffer 2
      number2 = currNumber;
      appendBuffer(currNumber);
      // calculates
      let result = operate(operator, number1, number2)
      writeCurrent(result);
      appendBuffer(event.target.textContent);
      console.log("result: " + result);
      // pushes the result to buffer 1 so you can keep
      // calculating with the result
      number1 = result;
      currNumber = "";
      operator = event.target.id;
      // makes sure you can change the operator on next operation
      // instead of just doing equal again
      currentNumberBuffer = 1;
      // overwrites buffer on operater press right after pressing equal 
      overwriteNext = true;      
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
        appendBuffer(currNumber);     
      }
      currNumber = "";
      // changes operator
      operator = event.target.id;
      appendBuffer(event.target.textContent);
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
      appendBuffer(currNumber);
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
      appendBuffer(event.target.textContent);
      console.log(operator);
    }
  })
})