import { Signal } from "./Signal"

export class SignalCollection {
    private capacity: number
    private size: number
    //private storage: Array<Signal>
    private first: SignalNode
    private last: SignalNode


    constructor(_capacity: number) {
        this.capacity = _capacity
        this.size = 0
        this.first = null
        this.last = null
        //this.storage = []
    }

    getSize() {
        return this.size
    }

    getCapacity() {
        return this.capacity
    }

    isFull() {
        return this.size == this.capacity
    }

    isEmpty() {
        return this.size == 0
    }

    has(freq: number) {
        let node = this.last
        while(node) {
            if(node.signal.getFrequency() == freq) {
                return true
            }
            node = node.next
        }

        return false
    }

    push(signal: Signal) {
        if(!this.isFull()) {
            if(this.isEmpty()) {
                var node = new SignalNode(signal, null)
                this.first = node
            } else {
                var node = new SignalNode(signal, this.last)
                this.last.prev = node
            }
            this.last = node
            this.size++
        }
    }

    pop(): Signal {
        if(!this.isEmpty()) {
            let node = this.first
            this.first = node.prev
            if(this.first) {
                this.first.next = null
                node.prev = null
            } else {
                this.last = null
            }
            this.size--
            return node.signal
        } else {
            return null
        }
    }

    take(): Signal {
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
            return node.signal
        } else {
            return null
        }
    }

    remove(baseFrequency: number): Signal {
        if(!this.isEmpty()) {
            let node = this.last
            if(this.size == 1) {
                this.last = null
                this.first = null
                this.size = 0
                return node.signal
            }
            
            while(node) {
                if(node.signal.getFrequency() == baseFrequency) {
                    if(node.prev && node.next) { // in middle
                        node.prev.next = node.next
                        node.next.prev = node.prev
                        node.next = null
                        node.prev = null
                        this.size--
                        return node.signal
                    } else if(node.prev) { //first node
                        this.first = node.prev
                        this.first.next = null
                        node.prev = null
                        this.size--
                        return node.signal
                    } else { //last node
                        this.last = node.next
                        this.last.prev = null
                        node.next = null
                        this.size--
                        return node.signal
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
            callback(node.signal)
            node = node.next
        }
    }

    toString(): string {
        let collectionString = `n = ${this.size} / ${this.capacity} | null <-> `
        let node = this.last
        while(node) {
            collectionString += `{${node.signal.getFrequency()}} <-> `
            node = node.next
        }
        collectionString += "null"
        return collectionString
    }
}

class SignalNode {
    signal: Signal
    next: SignalNode
    prev: SignalNode

    constructor(_signal: Signal, _next: SignalNode) {
        this.signal = _signal
        this.next = _next
        this.prev = null
    }
}