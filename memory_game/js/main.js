"use strict";

/* Global vars */
let transitionDuration = "0.5s";
/* End of global vars */

function shuffleArray(arr) {
    /* Function shuffles the input array arr and returns the result. */
    let ln = arr.length;
    let tmpArr = arr.slice(0, ln);
    const newArray = new Array(ln);
    for (let i = 0; i < ln; i++) {
        let newLn = tmpArr.length;
        let elementIndex = generateRandomInteger(0, newLn - 1);
        newArray[i] = tmpArr[elementIndex];
        tmpArr.splice(elementIndex, 1);
    }
    return newArray;
}

function generateRandomInteger(lowerEdge, upperEdge) {
    /* Function generates random integer values 
       in range (lowerEdge, upperEdge) */
    let intNumber;
    let withinInterval = false;
    while (withinInterval != true) {
        intNumber = Math.round(Math.random() * upperEdge);
        if (intNumber >= lowerEdge) {
            withinInterval = true;
        }
    }
    return intNumber;
}


function createField(fieldSize) {
    /* Function creates and returns an array which stores
       data about game field (each cell includes link to it's DOM representation).
       Field size is fieldSize x fieldSize elements */
    if (fieldSize % 2 != 0) {
        console.log('Error: Field size should be an odd number.');
        return null;
    }
    const field = [];
    let x_coords = [];
    let y_coords = [];
    const vals = [];
    let contIndex = 0;
    for (let i = 0; i < fieldSize ** 2 / 2; i++) {
        vals.push(i);
        vals.push(i);
    }
    for (let i = 0; i < fieldSize ** 2; i++) {
        x_coords.push(i);
        y_coords.push(i);
    }
    x_coords = shuffleArray(x_coords);
    y_coords = shuffleArray(y_coords);
    for (let i = 0; i < fieldSize ** 2; i++) {
        field.push(
            {
                x: x_coords[i],
                y: y_coords[i],
                value: vals[contIndex],
                node: null,
                opened: false,
            }
        );
        contIndex += 1;
    }
    const fieldCellsNodes = createFieldDOM(field);
    const reducer = (accumulator, element) => {
        element.node = fieldCellsNodes[accumulator];
        accumulator += 1;
        return accumulator
    };
    field.reduce(reducer, 0);
    setStyles(field);
    setFunctionallity(field);
    return field;
}

function createFieldDOM(field) {
    const sortedfield = field.sort((el1, el2) => {
        return el1.y - el2.y || el1.x - el2.x;
    }
    );
    const fieldCellsArr = [];
    const fieldWrapper = document.querySelector(".field");
    for (let item of sortedfield) {
        const fieldCell = document.createElement("div");
        fieldCell.className = "field-cell";
        fieldWrapper.appendChild(fieldCell);
        const innerFrontElement = document.createElement("div");
        const innerBackElement = document.createElement("div");
        innerFrontElement.className = "cell-content-front";
        innerBackElement.className = "cell-content-end";
        fieldCell.appendChild(innerFrontElement);
        fieldCell.appendChild(innerBackElement);
        innerFrontElement.innerHTML = item.value;
        fieldCellsArr.push(fieldCell);
    }
    return fieldCellsArr;
}

function setStyles(field) {
    const fieldSize = Math.sqrt(field.length);
    const cellSize = (100 - (fieldSize+1)) / fieldSize;
    const fieldDOM = document.querySelector(".field");
    const gridStyle = `repeat(${fieldSize}, ${cellSize}%)`;
    fieldDOM.style.height = document.defaultView.getComputedStyle(fieldDOM).width;
    window.addEventListener('resize', () => {
        fieldDOM.style.height = document.defaultView.getComputedStyle(fieldDOM).width;
    });
    fieldDOM.style.gridTemplateColumns = gridStyle;
    fieldDOM.style.gridTemplateRows = gridStyle;
}

function setFunctionallity(field) {
    let toggled = [];
    const clickFunction = function (event) {
        let el = event.composedPath().find(el => el.classList.contains("field-cell"));
        el = field.find(element => element.node == el);
        console.log(el);
        el.node.classList.toggle("rotated");
        const delayedPushCheck = () => {
            toggled.push(el);
            if (toggled.length == 2) {
                if (toggled[0].node != toggled[1].node) {
                    if (toggled[0].value == toggled[1].value) {
                        console.log("equal")
                        console.log(toggled[0], toggled[1]);
                        toggled[0].node.removeEventListener("click", clickFunction);
                        toggled[1].node.removeEventListener("click", clickFunction);
                        toggled[0].opened = true;
                        toggled[1].opened = true;
                        toggled = [];

                    }
                    else {
                        console.log("Not equal")
                        toggled[0].node.classList.toggle("rotated");
                        toggled[1].node.classList.toggle("rotated");
                        toggled = [];
                    }
                }
                else {
                    console.log('equal links')
                    toggled = [];
                }
            }
            const opened = field.filter(el => el.opened == true);
            if (opened.length == field.length) {
                alert("You won!");
            }
        };
        const transDurationNum = Number(transitionDuration.split("s")[0]) * 1000;
        setTimeout(delayedPushCheck, transDurationNum);
    };
    field.forEach(el => {
        el.node.addEventListener("click", clickFunction);
    });
}

function initSession() {
    let fieldSize = 0;
    while (!(fieldSize >= 2 && fieldSize <= 12 && fieldSize % 2 == 0)) {
        fieldSize = prompt("Укажите размер поля (чётное число; будет создано поле размером n x n)", 4);
    }
    const field = createField(fieldSize);
    const cells = document.querySelectorAll(".field-cell");
    cells.forEach(el => { el.style.transitionDuration = transitionDuration });
}

initSession();