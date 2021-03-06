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

let decimalpointDisabled = false;

let operatorPrevious = "";


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

function square(num1, num2) {
  return (+num1) ** (+num2); 
}

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
    case "square":
      return square(num1, num2);   
  }
}

function writeCurrent(text) {
  const currentNumberBox = document.querySelector(".currentNumber");

  if (text === "Division by 0") {
    // skip number checks
  }
  // prevents too long numbers
  else if (text.toString().length > 12) {
    text = Number.parseFloat(text).toExponential(8);
  }
  // puts space between every 3 numbers
  else {
    let parts = text.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    text = parts.join(".");
  }
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

  // appends text to buffer
  bufferBox.textContent = (bufferBox.textContent + " " + text); 
}


function resetAll() {
  currentNumberBuffer = 1;
  nextInputType = "";
  number1 = "";
  number2 = "";
  operator = "";
  currNumber = "";
  overwriteNext = false;
  decimalpointDisabled = false;
  operatorPrevious = "";
  appendBuffer("wipe");
  writeCurrent("0");
}

function divBy0() {
  resetAll();
  writeCurrent("Division by 0");
}




// number buttons functionality
function numbersInput(element) {
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

  // . button
  if (element.textContent === ".") {
    // prevents more than 1 decimal points in a number
    if (decimalpointDisabled) {
      return;
    }
    else {
      decimalpointDisabled = true;
    }
  }

  // makes it impossible to enter multiple zeroes
  if (currNumber === "0" && element.textContent === "0") {
    return;
  }
  // prevents extra 0 at the start if you pressed 0 before
  // to prevent numbers like 0123
  // but still allows to enter . after 0 (without removing the 0)
  else if (currNumber === "0" && element.textContent !== "0" && element.textContent !== ".") {
    currNumber = "";
  }

  // appends clicked buttons number to current number
  currNumber += element.textContent;
  writeCurrent(currNumber);
}


// operator buttons functionality
function operatorsInput(element) {
  // "clear" button (backspace)
  if (element.id === "C") {
    // reeneables . button only if you deleted the . at the end
    if (currNumber.slice(-1) === ".") {
      decimalpointDisabled = false;
    }
    // slices off the end of current number
    currNumber = currNumber.substring(0, currNumber.length - 1);
    // if you sliced off the last number
    if (currNumber === "") {
      writeCurrent("0");
    }
    else {
      writeCurrent(currNumber);
    }
    return;
  }

  // reenables . button
  decimalpointDisabled = false;

  // "clear eveything" button
  if (element.id === "AC") {
    resetAll();
    return;
  }

  // "equal" button
  if (element.id === "equal") {    
    // prevents overwriting buffer 2 when pressing enter continuously
    if (currNumber !== "") {
      // pushes current number into buffer 2
      number2 = currNumber;
    }

    // prevents errors if you are pressing enter without any numbers
    if (currNumber === "" && number1 === "" && number2 === "") {
      return;
    }

    // if no second number was entered, repeat previous number
    if (currNumber === "") {
      // prevents bugs when you keep pressing enter
      if (operatorPrevious === "") {
        operatorPrevious = operator;
      }
      operator = operatorPrevious;
      appendBuffer("wipe");
      appendBuffer(number1);
      // text of the previous operator's button
      appendBuffer(document.querySelector(`#${operator}`).textContent);
      // if theres no number 2 because you are chaining operations
      if (number2 === "") {
        number2 = number1;
      }
      currNumber = number2;
    }

    appendBuffer(currNumber);

    let result = operate(operator, number1, number2);
    // if you entered number and then pressed enter (you get undefined)
    if (result === undefined) {
      result = +currNumber;

    }

    // division by 0
    if (!Number.isFinite(result)) {
      divBy0();
      return;
    }

    writeCurrent(result);
    appendBuffer(element.textContent);
    // pushes the result to buffer 1 so you can keep
    // calculating with the result
    number1 = result;
    currNumber = "";
    operator = element.id;
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
      appendBuffer(currNumber);     
    }
    currNumber = "";
    if (operator === "equal" && operatorPrevious !== "equal") {
      // overwrites buffer on operator press right after pressing equal 
      overwriteNext = true;
    }
    operator = operatorPrevious = element.id;
    appendBuffer(element.textContent);
    // makes sure next number will go into buffer 2
    nextInputType = "secondNumber";
  }

  // if numbers are being entered to buffer 2
  // (if there is a number in buffer 1 already
  // because you already did some operation before)
  else if (currentNumberBuffer === 2) {
    // if you want to change operator before continuing the chaining
    if (currNumber === "") {
      operator = operatorPrevious = element.id;
      appendBuffer(element.textContent);
      return;
    }

    // pushes current number into buffer 2
    number2 = currNumber;
    appendBuffer(currNumber);
    currNumber = "";

    let result = operate(operator, number1, number2);

    // division by 0
    if (!Number.isFinite(result)) {
      divBy0();
      return;
    }

    writeCurrent(result);

    // pushes the result to buffer 1 so you can keep
    // calculating with the result
    number1 = result;
    // resets second buffer to be ready for new number input
    number2 = "";
    operator = element.id;
    appendBuffer(element.textContent);
  }
}


// mouse inputs
const numberBtns = document.querySelectorAll(".numberBtn");
numberBtns.forEach((button) => {
  button.addEventListener("click", (event) => {
    createRipple(event);
    numbersInput(event.target)});
})

const operatorsBtns = document.querySelectorAll(".operatorBtn")
operatorsBtns.forEach((button) => {
  button.addEventListener("click", (event) => {
    createRipple(event);
    operatorsInput(event.target)});
})

// keyboard inputs
document.addEventListener("keydown", (event) => {
  let pressedKey = event.key;

  if (pressedKey === ",") {
    pressedKey = ".";
  }
  
  const pressedNumberBtn = document.querySelector(`button[data-key="${pressedKey}"].numberBtn`);
  const pressedOperatorBtn = document.querySelector(`button[data-key="${pressedKey}"].operatorBtn`);

  if (pressedNumberBtn) {
    pressedNumberBtn.classList.add("pressed");
    // using 32ms delay, same as default windows keyboard delay
    // to prevent getting stuck in pressed state
    setTimeout(() => {removeTransition(pressedNumberBtn)}, 32);
    numbersInput(pressedNumberBtn); 
  }
  else if (pressedOperatorBtn) {
    pressedOperatorBtn.classList.add("pressed");
    setTimeout(() => {removeTransition(pressedOperatorBtn)}, 32);
    operatorsInput(pressedOperatorBtn);
  }
})


// Removes pressed effect.
// Using this after transitionend and also with set delay after keypress
// to avoid having the button "stuck" in pressed state (with javascript)
// but also to have more consistent transitions (with css).
function removeTransition(button) {
  button.classList.remove("pressed");
}

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("transitionend", (event) => {
    removeTransition(event.target)
  });
})


// ripple effect
function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
  circle.classList.add("ripple");

  button.appendChild(circle);
}