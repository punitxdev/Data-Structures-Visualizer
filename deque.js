class Deque extends Queue {
    async insertFront(val) {
        var el = document.createElement('div');
        el.className = 'node node-rect inserted';
        el.textContent = val;
        
        this.items.unshift(el);
        
        if (canvas.firstChild) {
            canvas.insertBefore(el, canvas.firstChild);
        } else {
            canvas.appendChild(el);
        }
        
        this.updateIndicators();
        checkEmptyState();
        
        await sleep(500);
        el.classList.remove('inserted');
    }
    
    async insertRear(val) {
        await super.insert(val);
    }
    
    async deleteFront() {
        await super.delete();
    }
    
    async deleteRear() {
        if (this.items.length === 0) {
            showMessage("Cannot delete from an empty Deque");
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
