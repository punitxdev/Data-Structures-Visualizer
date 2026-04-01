class Queue {
    constructor() {
        this.items = [];
    }

    updateIndicators() {
        for (var i = 0; i < this.items.length; i = i + 1) {
            var el = this.items[i];
            var label = '';
            
            if (i === 0 && i === this.items.length - 1) {
                label = 'Front/Rear';
            } else if (i === 0) {
                label = 'Front';
            } else if (i === this.items.length - 1) {
                label = 'Rear';
            }
            
            el.setAttribute('data-label', label);
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
            showMessage("Cannot delete from an empty Queue");
            return;
        }
        
        var el = this.items.shift();
        this.updateIndicators();
        
        el.classList.add('deleted');
        await sleep(500);
        el.remove();
        checkEmptyState();
    }
}
