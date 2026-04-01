class PriorityQueue extends Queue {
    async insert(val, priority) {
        var el = document.createElement('div');
        el.className = 'node node-rect inserted';
        el.textContent = val;
        
        el.setAttribute('data-priority', priority);
        
        var insertIndex = -1;
        for (var i = 0; i < this.items.length; i = i + 1) {
            var existingPriority = parseInt(this.items[i].getAttribute('data-priority'));
            if (existingPriority > priority) {
                insertIndex = i;
                break;
            }
        }
        
        if (insertIndex === -1) {
            this.items.push(el);
            canvas.appendChild(el);
        } else {
            this.items.splice(insertIndex, 0, el);
            canvas.insertBefore(el, this.items[insertIndex + 1]);
        }
        
        this.updateIndicators();
        checkEmptyState();
        
        await sleep(500);
        el.classList.remove('inserted');
    }
}
