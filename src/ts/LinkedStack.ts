export class LinkedStack<T> {
    //private capacity: number
    protected size: number
    protected first: Node<T>
    protected last: Node<T>


    constructor() {
        //this.capacity = _capacity
        this.size = 0
        this.first = null
        this.last = null
        //this.storage = []
    }

    getSize() {
        return this.size
    }

    isEmpty() {
        return this.size == 0
    }

    push(item: T) {
        if(this.isEmpty()) {
            var node = new Node<T>(item, null)
            this.first = node
        } else {
            var node = new Node<T>(item, this.last)
            this.last.prev = node
        }
        this.last = node
        this.size++
    }

    pop(): T {
        if(!this.isEmpty()) {
            let node = this.last
            this.last = node.next
            if(this.last) {
                this.last.prev = null
                node.next = null
            } else {
                this.first = null
            }
            this.size--
            return node.item
        } else {
            return null
        }
    }

    peakFirst(): T {
        return this.first.item
    }

    peakLast(): T {
        return this.last.item
    }

    peakLastNot(condition: T) {
        let node = this.last
        while(node != null && node != condition) {
            node = node.next
        }

        return node ? node.item : null
    }

    remove(item: T): T {
        if(!this.isEmpty()) {
            let node = this.last
            if(this.size == 1) {
                this.last = null
                this.first = null
                this.size = 0
                return node.item
            }
            
            while(node) {
                if(node.item == item) {
                    if(node.prev && node.next) { // in middle
                        node.prev.next = node.next
                        node.next.prev = node.prev
                        node.next = null
                        node.prev = null
                        this.size--
                        return node.item
                    } else if(node.prev) { //first node
                        this.first = node.prev
                        this.first.next = null
                        node.prev = null
                        this.size--
                        return node.item
                    } else { //last node
                        this.last = node.next
                        this.last.prev = null
                        node.next = null
                        this.size--
                        return node.item
                    }
                }
                node = node.next
            }
        } else {
            return null
        }
    }

    forEach(callback: Function) {
        let node = this.last
        while(node) {
            callback(node.item)
            node = node.next
        }
    }

    toString(): string {
        let collectionString = `n = ${this.size} | null <-> `
        let node = this.last
        while(node) {
            collectionString += `{${node.item.toString()}} <-> `
            node = node.next
        }
        collectionString += `null | first=${this.first ? this.first.item.toString() : 'null'} last=${this.last ? this.last.item.toString() : 'null'}`
        return collectionString
    }
}

class Node<T> {
    item: T
    next: Node<T>
    prev: Node<T>

    constructor(_item: T, _next: Node<T>) {
        this.item = _item
        this.next = _next
        this.prev = null
    }
}