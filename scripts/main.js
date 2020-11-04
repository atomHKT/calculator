// handle ERROR message
// use data.value instead of innerHTML
// play sound
// on click : transform
// merge display input / total


const operations = {
    add: (a, b) => a + b,
    substract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};

const keyboardValues = [27, 8, 9 , 191, 55, 56, 57, 88, 52, 53, 54, 189, 49, 50, 51,
    187, 48, 190, 13];

const init = () => {
    strTotal = '', strInput = '', strOperator = '';
    displayInput(strInput);
    clearOpSignDec();
}

const checkSign = (str) => {
    if (((str.charAt(0) === '-') && (!nNegative.classList.contains('active'))) ||
        ((str.charAt(0) !== '-') && (!nPositive.classList.contains('active')))) {
        nPositive.classList.toggle('active');
        nNegative.classList.toggle('active');
    }
    console.log("checksign", "input", strInput, "total", strTotal, "operator", strOperator);
}

const displayTotal = strTotal => {
    checkSign(strTotal);
    if (strTotal === '') {
        nDisplay.innerHTML = '0';
    } else if (strTotal === '-') {
        nDisplay.innerHTML = '-0';
    } else if (strTotal.length > 14) {
        // Limit of display is 14 digits
        nDisplay.innerHTML = Number(strTotal).toPrecision(10).toString();
    } else {
        nDisplay.innerHTML = strTotal;
    }
    console.log("dspTotal", "input", strInput, "total", strTotal, "operator", strOperator);
}

const displayInput = strInput => {
    checkSign(strInput);
    if (strInput === '') {
        nDisplay.innerHTML = '0';
    } else if (strInput === '-') {
        nDisplay.innerHTML = '-0';
    } else if (strInput.length > 14) {
        // Limit of display is 14 digits
        // For greater length trunk the input it and add '...' in front
        nDisplay.innerHTML = '...' + strInput.slice(strInput.length - 14, strInput.length)
    } else {
        nDisplay.innerHTML = strInput;
    }
    console.log("dspInput", "input", strInput, "total", strTotal, "operator", strOperator);
}

const clearOpActive = () => {
    nOperator.forEach(op => {
        if (op.classList.contains('active')) {
            op.classList.toggle('active');
        }
    });
}

const clearSign = () => {
    if (!nPositive.classList.contains('active')) {
        nPositive.classList.toggle('active');
    }
    if (nNegative.classList.contains('active')) {
        nNegative.classList.toggle('active');
    }
}

const clearDecimal = () => {
    if (nDecimal.classList.contains('active')) {
        nDecimal.classList.toggle('active');
    }
}

const clearOpSignDec = () => {
    clearOpActive();
    clearSign();
    clearDecimal();
}

const backspace = () => {
    if (strInput !== '') {
        if (strInput.charAt(strInput.length - 1) === '.') {
            // If the last caracter is the decimal, reomve the .active class
            nDecimal.classList.toggle('active');
        }
        strInput = strInput.slice(0, -1);
        displayInput(strInput);
    } else if (strTotal !== '') {
        if (strTotal.charAt(strTotal.length - 1) === '.') {
            // If the last caracter is the decimal, reomve the .active class
            nDecimal.classList.toggle('active');
        }
        strTotal = strTotal.slice(0, -1);
        displayTotal(strTotal);
    }
}

const toggleSign = () => {
    if ((strInput === '') && (strOperator === '') && (strTotal !== '')) {
        // In this case we toggle sign on strTotal
        if (strTotal.charAt(0) === '-') {
            strTotal = strTotal.slice(1);
        } else {
            strTotal = '-' + strTotal;
        }
        displayTotal(strTotal);
    } else {
        // In this case we toggle sign on strInput
        if (strInput.charAt(0) === '-') {
            strInput = strInput.slice(1);
        } else {
            strInput = '-' + strInput;
        }
        displayInput(strInput);
    }
}

const computeTotal = () => {
    if ((strOperator !== '') && (strInput !== '')) {
        strTotal = operations[strOperator](Number(strTotal), Number(strInput)).toString();
    } else if (strInput !== '') {
        strTotal = strInput;
    }
    strInput = '';
    strOperator = '';
    displayTotal(strTotal);
    clearOpSignDec();
    console.log("computeTotal", "input", strInput, "total", strTotal, "operator", strOperator);
}

const getFigure = (e) => {
    if (strInput === '') {
        strInput = e.target.textContent;
    } else {
        strInput += e.target.textContent;
    }
    clearOpActive();
    displayInput(strInput);

}

const getOperator = (e) => {
    if ((e.target.classList.contains('active')) && (strInput === '')) {
        e.target.classList.toggle('active');
        strOperator = '';
    } else {
        if (strOperator !== '') {
            computeTotal();
        }
        e.target.classList.toggle('active');
        strOperator = e.target.id;
        if (strTotal === '') {
            strTotal = strInput;
            strInput = '';
        }
    }
    console.log("getOperator", "input", strInput, "total", strTotal, "operator", strOperator);
}

const toggleDecimal = () => {
    if (!nDecimal.classList.contains('active')) {
        // If strInput does not have decimal yet
        if (strInput === '') {
            strInput = '0.'
        } else {
            strInput += '.';
        }
        nDecimal.classList.toggle('active');
    } else if (strInput.charAt(strInput.length - 1) === '.') {
        // If strInput has decimal
        //  and last character from strInput is the decimal, remove it
        strInput = strInput.slice(0, -1);
        nDecimal.classList.toggle('active');
    }
    displayInput(strInput);
}

const getKeyboardInput = (e) => {
    if (keyboardValues.includes(e.keyCode)) {
        const node = document.querySelector(`button[data-key='${e.keyCode}']`);
        node.click();
    }
}

const createEventHandlers = () => {
    nClear.addEventListener('click', init);
    nBackspace.addEventListener('click', backspace);
    nSign.addEventListener('click', toggleSign);
    nFigures.forEach(elem => elem.addEventListener('click', getFigure));
    nOperator.forEach(elem => elem.addEventListener('click', getOperator));
    nDecimal.addEventListener('click', toggleDecimal);
    nEqual.addEventListener('click', computeTotal);
    window.addEventListener('keydown', getKeyboardInput);
}

const nDisplay = document.querySelector(".display-content");
const nClear = document.querySelector(".clear");
const nBackspace = document.querySelector(".backspace");
const nSign = document.querySelector(".sign");
const nPositive = document.querySelector(".positive");
const nNegative = document.querySelector(".negative");
const nFigures = document.querySelectorAll(".figure");
const nOperator = document.querySelectorAll(".operator");
const nDecimal = document.querySelector(".decimal");
const nEqual = document.querySelector(".equal");

let strTotal, strInput, strOperator;

init();
createEventHandlers();