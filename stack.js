class Stack {
    constructor() {
        this.items = [];
    }

    updateIndicators() {
        for (var i = 0; i < this.items.length; i = i + 1) {
            var el = this.items[i];
            if (i === this.items.length - 1) {
                el.setAttribute('data-label', 'Top');
            } else {
                el.setAttribute('data-label', '');
            }
        }
    }

    async insert(val) {
        var el = document.createElement('div');
        el.className = 'node node-rect inserted';
        el.textContent = val;
        
        this.items.push(el);
        canvas.appendChild(el);
        
        this.updateIndicators();
        checkEmptyState();

        await sleep(500);
        el.classList.remove('inserted');
    }

    async delete() {
        if (this.items.length === 0) {
            showMessage("Cannot delete from an empty Stack");
            return;
        }
        
        var el = this.items.pop();
        this.updateIndicators();
        
        el.classList.add('deleted');
        await sleep(500);
        el.remove();
        checkEmptyState();
    }
}
