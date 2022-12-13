'use strict';

// Проверка координаты на графике
function validCoordinate(value, min, max) {
    return value >= min && value <= max;
}

// Вставка блока с ошибкой (по умолчанию до элемента)
function insertError(message, element) {
    element.parentNode.insertBefore(createError(message), element.nextSibling);
}

// Создание блока с ошибкой (цвета, рамки и т.д. в CSS)
function createError(message) {
    let error = document.createElement('span');
    error.className = 'error';
    error.innerHTML = message;
    return error;
}

// Очистка ошибок (чтобы не появлялось несколько надписей подряд)
function removeErrors() {
    document.querySelectorAll('.error').forEach(error => {
        error.remove();
    });
}