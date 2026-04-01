class LinkedList {
    constructor(isDoubly) {
        if (isDoubly === undefined) {
            isDoubly = false;
        }
        this.isDoubly = isDoubly;
        this.nodes = [];
    }

    updateArrows() {
        for (var i = 0; i < this.nodes.length; i = i + 1) {
            var n = this.nodes[i];
            if (i === this.nodes.length - 1) {
                n.arrow.style.visibility = 'hidden';
            } else {
                n.arrow.style.visibility = 'visible';
            }
        }
    }

    async insert(val) {
        var wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';

        var el = document.createElement('div');
        el.className = 'node node-circle inserted';
        el.textContent = val;
        
        var arrowContainer = document.createElement('div');
        arrowContainer.style.margin = '0 10px';
        
        if (this.isDoubly) {
            arrowContainer.innerHTML = '<svg class="list-arrow-svg" width="40" height="20" viewBox="0 0 40 20"><line x1="0" y1="5" x2="35" y2="5" stroke="currentColor" stroke-width="2"/><polygon points="35,2 40,5 35,8" fill="currentColor"/><line x1="5" y1="15" x2="40" y2="15" stroke="currentColor" stroke-width="2"/><polygon points="5,12 0,15 5,18" fill="currentColor"/></svg>';
        } else {
            arrowContainer.innerHTML = '<svg class="list-arrow-svg" width="40" height="20" viewBox="0 0 40 20"><line x1="0" y1="10" x2="35" y2="10" stroke="currentColor" stroke-width="2"/><polygon points="35,5 40,10 35,15" fill="currentColor"/></svg>';
        }

        wrapper.appendChild(el);
        wrapper.appendChild(arrowContainer);
        
        var nodeObj = {
            val: parseInt(val),
            wrapper: wrapper,
            el: el,
            arrow: arrowContainer
        };
        this.nodes.push(nodeObj);
        
        canvas.appendChild(wrapper);
        this.updateArrows();
        checkEmptyState();

        await sleep(500);
        el.classList.remove('inserted');
    }

    async delete(val) {
        if (this.nodes.length === 0) {
            showMessage("List is empty");
            return;
        }
        
        var numVal = parseInt(val);
        var targetIndex = -1;
        
        for (var i = 0; i < this.nodes.length; i = i + 1) {
            if (this.nodes[i].val === numVal) {
                targetIndex = i;
                break;
            }
        }
        
        if (targetIndex === -1) {
            showMessage("Value " + val + " not found");
            return;
        }

        var target = this.nodes[targetIndex];
        target.el.classList.add('deleted');
        
        await sleep(500);
        target.wrapper.remove();
        
        this.nodes.splice(targetIndex, 1);
        this.updateArrows();
        checkEmptyState();
    }
}
