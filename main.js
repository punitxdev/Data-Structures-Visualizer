var currentInstance = null;
var isAnimating = false;

var scale = 1;
var translateX = 0;
var translateY = 0;
var isDragging = false;
var startX = 0;
var startY = 0;
var vizArea = document.querySelector('.visualization-area');

function applyTransform() {
    canvas.style.transform = "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
    canvas.style.transformOrigin = 'center top';
}

function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
}

function renderLayout(type) {
    canvas.innerHTML = '';
    canvas.className = 'canvas';
    resetTransform();
    
    if (type === 'stack') {
        canvas.classList.add('layout-stack');
    } else if (type === 'queue' || type === 'pq' || type === 'deque') {
        canvas.classList.add('layout-queue');
    } else if (type === 'sll' || type === 'dll') {
        canvas.classList.add('layout-list');
    } else if (type === 'bst' || type === 'avl') {
        canvas.classList.add('layout-tree');
    }
}

function initDS() {
    var type = dsSelect.value;
    renderLayout(type);
    
    if (type === 'stack') {
        currentInstance = new Stack();
    } else if (type === 'queue') {
        currentInstance = new Queue();
    } else if (type === 'sll') {
        currentInstance = new LinkedList(false);
    } else if (type === 'dll') {
        currentInstance = new LinkedList(true);
    } else if (type === 'bst') {
        currentInstance = new BinaryTree(false);
    } else if (type === 'avl') {
        currentInstance = new BinaryTree(true);
    } else if (type === 'pq') {
        currentInstance = new PriorityQueue();
    } else if (type === 'deque') {
        currentInstance = new Deque();
    }
    
    var dequePosSelect = document.getElementById('deque-pos-wrapper');
    var pqPrioritySelect = document.getElementById('pq-priority-wrapper');
    
    if (type === 'deque') {
        dequePosSelect.style.display = 'flex';
    } else {
        dequePosSelect.style.display = 'none';
    }
    
    if (type === 'pq') {
        pqPrioritySelect.style.display = 'flex';
    } else {
        pqPrioritySelect.style.display = 'none';
    }
    
    checkEmptyState();
}

dsSelect.addEventListener('change', initDS);

insertBtn.addEventListener('click', async function() {
    if (isAnimating === true) {
        return;
    }
    
    var val = parseInt(valInput.value);
    if (isNaN(val)) {
        showMessage("Please enter a valid number");
        return;
    }
    valInput.value = '';
    
    isAnimating = true;
    var type = dsSelect.value;
    
    if (type === 'deque') {
        var pos = document.getElementById('deque-pos').value;
        if (pos === 'front') {
            await currentInstance.insertFront(val);
        } else {
            await currentInstance.insertRear(val);
        }
    } else if (type === 'pq') {
        var priority = parseInt(document.getElementById('pq-priority').value);
        if (isNaN(priority)) {
            isAnimating = false;
            showMessage("Please enter a valid priority");
            return;
        }
        document.getElementById('pq-priority').value = '';
        await currentInstance.insert(val, priority);
    } else {
        await currentInstance.insert(val);
    }
    
    isAnimating = false;
});

deleteBtn.addEventListener('click', async function() {
    if (isAnimating === true) {
        return;
    }
    
    var val = null;
    var type = dsSelect.value;
    
    if (type === 'sll' || type === 'dll' || type === 'bst' || type === 'avl') {
        val = parseInt(valInput.value);
        if (isNaN(val)) {
            showMessage("Please enter a value to delete");
            return;
        }
        valInput.value = '';
    }
    
    isAnimating = true;
    
    if (type === 'deque') {
        var pos = document.getElementById('deque-pos').value;
        if (pos === 'front') {
            await currentInstance.deleteFront();
        } else {
            await currentInstance.deleteRear();
        }
    } else {
        await currentInstance.delete(val);
    }
    
    isAnimating = false;
});

vizArea.addEventListener('wheel', function(e) {
    e.preventDefault();
    scale = scale + (e.deltaY * -0.001);
    
    if (scale < 0.3) {
        scale = 0.3;
    }
    if (scale > 3) {
        scale = 3;
    }
    
    applyTransform();
}, { passive: false });

vizArea.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    vizArea.classList.add('grabbing');
});

window.addEventListener('mouseup', function() {
    isDragging = false;
    vizArea.classList.remove('grabbing');
});

window.addEventListener('mousemove', function(e) {
    if (isDragging === false) {
        return;
    }
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
});

var themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    var isLight = document.body.classList.contains('light-theme');
    
    if (isLight) {
        themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
        themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
});

initDS();
