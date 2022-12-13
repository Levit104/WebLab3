'use strict';

let form = document.querySelector('#form');
let graph = document.querySelector('#graph');
let htmlTableRows = document.querySelectorAll('#results_container tr');
let resultsContainer = [];

let elementsX = document.querySelectorAll('.x_value');
let elementR = document.querySelector('.r_value');
let hiddenElementX = document.querySelector('.hidden_x input[type=hidden]');
let buttonValueContainer = document.querySelector('#current_value');
let currentButtonValue = '';

// Сохранение позиции курсора и его возврат после перезагрузки страницы
// (чисто для себя, раздражает, когда слетает)
window.addEventListener('scroll',function() {
    localStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load',function() {
    let scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
    }
});

// Заполнение таблицы и отрисовка графика при загрузке страницы
// (если R было выбрано до этого - оно останется на графике)
document.addEventListener('DOMContentLoaded', function () {
    // Возврат предыдущего значения радиуса после перезагрузки
    let prevRadiusValue = localStorage.getItem('prevRadiusValue');
    if (prevRadiusValue) {
        elementR.value = prevRadiusValue
        drawGraph(elementR.value);
    } else {
        drawGraph();
    }

    collectData(htmlTableRows, resultsContainer);
    drawData(resultsContainer, elementR.value);
});


form.addEventListener('submit', function () {
    hiddenElementX.value = currentButtonValue;
});

// Очистка полей и графика при нажатии кнопки "Сбросить"
form.addEventListener('reset', function () {
    // Обнуление сохранённого значения радиуса
    localStorage.removeItem('prevRadiusValue');

    removeErrors();
    resetButtonValue();
    displayButtonValue();

    drawGraph();
});

// Присвоение значения выбранной кнопки переменной
elementsX.forEach(element => {
    element.addEventListener('click', function () {
        currentButtonValue = element.value;
        displayButtonValue();
    });
})

// Перерисовка графика при изменении R
elementR.addEventListener('change', function () {
    // Сохранение значения радиуса
    localStorage.setItem('prevRadiusValue', this.value);

    drawGraph(this.value);
    drawData(resultsContainer, this.value);
});

// Валидация и отправка координат точки при нажатии на график
graph.onmousedown = function (event) {
    // 1 - левая кнопка мыши (игнор клика правой кнопкой)
    if (event.which === 1) {
        removeErrors();

        let r = elementR.value;

        if (r) {
            let coordinates= getDotCoordinates(event, r);
            let x = coordinates.roundX;
            let y = coordinates.roundY;

            if (!validCoordinate(x, -3, 5)) {
                insertError('Координата X вне диапазона [-3, 5]', this);
                return;
            }

            if (!validCoordinate(y, -3, 3)) {
                insertError('Координата Y вне диапазона [-3, 3]', this);
                return;
            }

            sendValues([{name: 'x', value: x}, {name: 'y', value: y}, {name: 'r', value: r}]).then(() => {
                drawGraph(r);
                drawData(resultsContainer, r);
                window.location = window.location;
            });

        } else {
            insertError('Выберите радиус!', this);
        }
    }
}

// Двойной клик по графику не будет выделять текст ошибки
graph.onselectstart = function () {
    return false;
}

//Сбор данных из HTML таблички в массив JS объектов
function collectData(htmlTableRows, resultsContainer) {
    htmlTableRows.forEach((tr, i) => {
        if (i === 0) return; // Пропуск заголовков
        let x, y, hitFactor;
        for (let j = 0; j < tr.cells.length; j++) {
            let cell = tr.cells[j];
            if (cell.className === 'x_cell') x = cell.innerText;
            else if (cell.className === 'y_cell') y = cell.innerText;
            else if (cell.className === 'hitFactor_cell') hitFactor = cell.innerText;
        }
        let result = {
            x: x,
            y: y,
            isInside: (hitFactor.trim() === 'Попадание')
        };
        resultsContainer.push(result);
    });
}

//Отрисовка точек на графике
function drawData(resultsContainer, radius) {
    resultsContainer.forEach(result => {
        drawDot(result.x, result.y, result.isInside, radius)
    });
}

// Очистка таблицы и перерисовка графика при нажатии кнопки "Очистить таблицу"
function clearContainerAndRedrawGraph(radius) {
    resultsContainer = [];
    radius ? drawGraph(radius) : drawGraph();
}

// Отображение значения выбранной кнопки
function displayButtonValue() {
    buttonValueContainer.innerHTML = currentButtonValue;
}

// Сброс текущего значения кнопки (переменной)
function resetButtonValue() {
    currentButtonValue = '';
}
