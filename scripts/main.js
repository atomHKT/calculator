const operations = {
    add: (a, b) => a + b,
    substract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};

const keyboardValues = [
    "Escape", "Backspace", "`", "/", "7", "8", "9", "*", "4", "5", "6", "-",
    "1", "2", "3", "+", "0", ".", "Enter"
];

const init = () => {
    strTotal = '', strInput = '', strOperator = '';
    display(strInput, 'input');
    clearOpSignDec();
}

const checkSign = (str) => {
    if (((str.charAt(0) === '-') && (!nNegative.classList.contains('active'))) ||
        ((str.charAt(0) !== '-') && (!nPositive.classList.contains('active')))) {
        nPositive.classList.toggle('active');
        nNegative.classList.toggle('active');
    }
}

const checkDecimal = str => {
    if ((str.includes('.') && !nDecimal.classList.contains('active')) ||
        (!str.includes('.') && nDecimal.classList.contains('active'))) {
        nDecimal.classList.toggle('active');
    }
}

const display = (str, type) => {
    checkSign(str);
    checkDecimal(str);
    if (str === '') {
        nDisplay.innerHTML = '0';
    } else if (str === '-') {
        nDisplay.innerHTML = '-0';
    } else if (str.length > 14) {
        // Limit of display is 14 digits
        if (type === 'total') {
            nDisplay.innerHTML = Number(str).toPrecision(10).toString();
        } else if (type === 'input') {
            // We trunk the input it and add '...' in front
            nDisplay.innerHTML = '...' + str.slice(str.length - 14, str.length)
        }
    } else {
        nDisplay.innerHTML = str;
    }
    console.log("input", strInput, "total", strTotal, "operator", strOperator)
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
            // If the last caracter is the decimal, remove the .active class
            nDecimal.classList.toggle('active');
        }
        strInput = strInput.slice(0, -1);
        display(strInput, 'input');
    } else if (strTotal !== '') {
        if (strTotal.charAt(strTotal.length - 1) === '.') {
            // If the last caracter is the decimal, remove the .active class
            nDecimal.classList.toggle('active');
        }
        strTotal = strTotal.slice(0, -1);
        display(strTotal, 'total');
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
        display(strTotal, 'total');
    } else {
        // In this case we toggle sign on strInput
        if (strInput.charAt(0) === '-') {
            strInput = strInput.slice(1);
        } else {
            strInput = '-' + strInput;
        }
        display(strInput, 'input');
    }
}

const addLeadZero = (str) => {
    if (str === '') {
        return '0';
    } else if (str === '-') {
        return '-0';
    } else {
        return str;
    }
}

const computeTotal = () => {
    if ((strOperator !== '') && (strInput !== '')) {
        console.log(strTotal, addLeadZero(strTotal), "totot", strInput, addLeadZero(strInput))
        strTotal = operations[strOperator](Number(addLeadZero(strTotal)), Number(addLeadZero(strInput))).toString();
    } else if (strInput !== '') {
        strTotal = strInput;
    }
    strInput = '';
    strOperator = '';
    if ((strTotal === 'Infinity') || (strTotal === 'NaN')) {
        nDisplay.innerHTML = 'Error';
        strTotal = '';
    } else {
        display(strTotal, 'total');
    }
    clearOpSignDec();
}

const getFigure = (e) => {
    if ((strTotal !== '') && (strOperator === '')) {
        strTotal = '';
    }
    if (strInput === '') {
        strInput = e.target.value;
    } else {
        strInput += e.target.value;
    }
    clearOpActive();
    display(strInput, 'input');
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
}

const toggleDecimal = () => {
    if (!nDecimal.classList.contains('active')) {
        // If strInput does not have decimal yet
        if (strInput === '') {
            strInput = '0.'
        } else if (strInput === '-') {
            strInput = '-0.'
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
    display(strInput, 'input');
}

const getKeyboardInput = (e) => {
    if (keyboardValues.includes(e.key)) {
        const node = document.querySelector(`button[value='${e.key}']`);
        node.click();
    }
}

function removeTransition(e) {
    e.target.classList.remove('clicked');
}

function playSound(e) {
    const audio = document.querySelector('audio');
    e.target.classList.add('clicked');
    audio.currentTime = 0;
    audio.play();
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
    nButtons.forEach(button => button.addEventListener('click', playSound));
    nButtons.forEach(button => button.addEventListener('transitionend', removeTransition));
}

const nDisplay = document.querySelector(".display-content");
const nButtons = document.querySelectorAll("button");
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