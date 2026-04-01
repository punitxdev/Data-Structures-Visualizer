class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.height = 1;
        
        this.el = document.createElement('div');
        this.el.className = 'tree-node-wrapper';
        
        this.nodeDiv = document.createElement('div');
        this.nodeDiv.className = 'node node-circle inserted';
        this.nodeDiv.textContent = val;
        
        this.el.appendChild(this.nodeDiv);
        canvas.appendChild(this.el);
        
        this.edge = document.createElement('div');
        this.edge.className = 'tree-edge';
        canvas.appendChild(this.edge);
    }
}

class BinaryTree {
    constructor(isAVL) {
        if (isAVL === undefined) {
            isAVL = false;
        }
        this.root = null;
        this.isAVL = isAVL;
    }

    getHeight(node) {
        if (node === null) {
            return 0;
        } else {
            return node.height;
        }
    }
    
    updateHeight(node) {
        if (node !== null) {
            var leftHeight = this.getHeight(node.left);
            var rightHeight = this.getHeight(node.right);
            if (leftHeight > rightHeight) {
                node.height = leftHeight + 1;
            } else {
                node.height = rightHeight + 1;
            }
        }
    }
    
    getBalance(node) {
        if (node === null) {
            return 0;
        } else {
            return this.getHeight(node.left) - this.getHeight(node.right);
        }
    }
    
    rightRotate(y) {
        var x = y.left;
        var T2 = x.right;
        
        x.right = y;
        y.left = T2;
        
        this.updateHeight(y);
        this.updateHeight(x);
        
        return x;
    }
    
    leftRotate(x) {
        var y = x.right;
        var T2 = y.left;
        
        y.left = x;
        x.right = T2;
        
        this.updateHeight(x);
        this.updateHeight(y);
        
        return y;
    }

    search(node, val) {
        if (node === null) {
            return null;
        }
        if (val === node.val) {
            return node;
        }
        if (val < node.val) {
            return this.search(node.left, val);
        } else {
            return this.search(node.right, val);
        }
    }

    insertNodeHelper(node, key, duplicateObj) {
        if (node === null) {
            return new TreeNode(key);
        }
        
        if (key < node.val) {
            node.left = this.insertNodeHelper(node.left, key, duplicateObj);
        } else if (key > node.val) {
            node.right = this.insertNodeHelper(node.right, key, duplicateObj);
        } else {
            duplicateObj.found = true;
            return node;
        }

        if (this.isAVL === true) {
            this.updateHeight(node);
            var balance = this.getBalance(node);
            
            if (balance > 1 && key < node.left.val) {
                return this.rightRotate(node);
            }
            if (balance < -1 && key > node.right.val) {
                return this.leftRotate(node);
            }
            if (balance > 1 && key > node.left.val) {
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
            if (balance < -1 && key < node.right.val) {
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }
        return node;
    }

    async insert(val) {
        var duplicateObj = { found: false };

        if (this.root === null) {
            this.root = new TreeNode(val);
            this.render();
            checkEmptyState();
            await sleep(500);
            this.root.nodeDiv.classList.remove('inserted');
            return;
        }

        this.root = this.insertNodeHelper(this.root, val, duplicateObj);
        
        if (duplicateObj.found === true) {
            showMessage("Value already exists in tree");
            return;
        }
        
        this.render();
        checkEmptyState();
        
        var insertedNode = this.search(this.root, val);
        if (insertedNode !== null) {
            await sleep(500);
            insertedNode.nodeDiv.classList.remove('inserted');
        }
    }

    removeNodeHelper(node, key, resultObj) {
        if (node === null) {
            return null;
        }
        
        if (key < node.val) {
            node.left = this.removeNodeHelper(node.left, key, resultObj);
        } else if (key > node.val) {
            node.right = this.removeNodeHelper(node.right, key, resultObj);
        } else {
            if (node.left === null || node.right === null) {
                resultObj.targetDOMObj = { el: node.el, nodeDiv: node.nodeDiv, edge: node.edge };
                var temp = null;
                if (node.left !== null) {
                    temp = node.left;
                } else {
                    temp = node.right;
                }
                node = temp;
            } else {
                var temp2 = node.right;
                while (temp2.left !== null) {
                    temp2 = temp2.left;
                }
                
                node.val = temp2.val;
                node.nodeDiv.textContent = temp2.val;
                node.right = this.removeNodeHelper(node.right, temp2.val, resultObj);
            }
        }
        
        if (node === null) {
            return node;
        }
        
        if (this.isAVL === true) {
            this.updateHeight(node);
            var balance = this.getBalance(node);
            
            if (balance > 1 && this.getBalance(node.left) >= 0) {
                return this.rightRotate(node);
            }
            if (balance > 1 && this.getBalance(node.left) < 0) {
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
            if (balance < -1 && this.getBalance(node.right) <= 0) {
                return this.leftRotate(node);
            }
            if (balance < -1 && this.getBalance(node.right) > 0) {
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }
        return node;
    }

    async delete(val) {
        if (this.root === null) {
            showMessage("Tree is empty");
            return;
        }

        var found = this.search(this.root, val);
        if (found === null) {
            showMessage("Value " + val + " not found");
            return;
        }

        var resultObj = { targetDOMObj: null };
        this.root = this.removeNodeHelper(this.root, val, resultObj);
        
        if (resultObj.targetDOMObj !== null) {
            resultObj.targetDOMObj.nodeDiv.classList.add('deleted');
            await sleep(500);
            resultObj.targetDOMObj.el.remove();
            resultObj.targetDOMObj.edge.remove();
        }
        
        this.render();
        checkEmptyState();
    }

    positionNodeHelper(node, x, y, dx, levelHeight) {
        if (node === null) {
            return;
        }
        node.el.style.left = x + 'px';
        node.el.style.top = y + 'px';
        node.x = x;
        node.y = y;
        
        var nextDx = dx / 2;
        if (nextDx < 30) {
            nextDx = 30;
        }
        
        this.positionNodeHelper(node.left, x - dx, y + levelHeight, nextDx, levelHeight);
        this.positionNodeHelper(node.right, x + dx, y + levelHeight, nextDx, levelHeight);
    }

    drawEdgesHelper(node, parentX, parentY) {
        if (node === null) {
            return;
        }
        if (parentX !== null && parentY !== null) {
            var x1 = parentX + 25;
            var y1 = parentY + 25;
            var x2 = node.x + 25;
            var y2 = node.y + 25;
            
            var a = x2 - x1;
            var b = y2 - y1;
            var length = Math.sqrt((a * a) + (b * b));
            var angle = Math.atan2(b, a) * 180 / Math.PI;
            
            node.edge.style.width = length + 'px';
            node.edge.style.left = x1 + 'px';
            node.edge.style.top = y1 + 'px';
            node.edge.style.transform = 'rotate(' + angle + 'deg)';
        } else {
            node.edge.style.width = '0px';
        }
        
        this.drawEdgesHelper(node.left, node.x, node.y);
        this.drawEdgesHelper(node.right, node.x, node.y);
    }

    render() {
        var vizArea = document.querySelector('.visualization-area');
        var canvasWidth = canvas.clientWidth;
        if (vizArea !== null) {
            canvasWidth = vizArea.clientWidth;
        }
        
        var levelHeight = 70;
        
        if (this.root !== null) {
            var startX = (canvasWidth / 2) - 25;
            var startY = 20;
            var initialDx = canvasWidth / 4;
            this.positionNodeHelper(this.root, startX, startY, initialDx, levelHeight);
        }
        
        this.drawEdgesHelper(this.root, null, null);
    }
}
