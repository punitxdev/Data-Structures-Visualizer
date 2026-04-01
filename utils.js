function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

var canvas = document.getElementById('canvas');
var dsSelect = document.getElementById('ds-select');
var valInput = document.getElementById('val-input');
var insertBtn = document.getElementById('btn-insert');
var deleteBtn = document.getElementById('btn-delete');
var msgContainer = document.getElementById('message-container');
var emptyState = document.getElementById('empty-state');

function showMessage(msg, type) {
    if (type === undefined) {
        type = 'error';
    }
    msgContainer.textContent = msg;
    msgContainer.className = 'message-container message-' + type;
    setTimeout(function() {
        msgContainer.className = 'message-container hidden';
    }, 3000);
}

function checkEmptyState() {
    if (canvas.children.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}
