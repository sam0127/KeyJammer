import { LinkedNode } from "./LinkedNode.js"
import { LinkedQueue } from "./LinkedQueue.js"
import { Signal } from "./Signal.js"

export class SignalQueue extends LinkedQueue<Signal> {
    private capacity: number
    protected size: number
    protected first: LinkedNode<Signal>
    protected last: LinkedNode<Signal>


    constructor(_capacity: number) {
        super()
        this.capacity = _capacity
    }

    getCapacity() {
        return this.capacity
    }

    isFull() {
        return this.size == this.capacity
    }

    has(freq: number) {
        let node = this.last
        while(node) {
            if(node.item.getFrequency() == freq) {
                return true
            }
            node = node.next
        }

        return false
    }

    push(signal: Signal) {
        if(!this.isFull()) {
            super.push(signal)
        }
    }

    removeFrequency(baseFrequency: number): Signal {
        if(!this.isEmpty()) {
            let node = this.last
            if(this.size == 1) {
                this.last = null
                this.first = null
                this.size = 0
                return node.item
            }
            
            while(node) {
                if(node.item.getFrequency() == baseFrequency) {
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
}