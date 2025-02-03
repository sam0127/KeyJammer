export class LinkedNode<T> {
    item: T
    next: LinkedNode<T>
    prev: LinkedNode<T>

    constructor(_item: T, _next: LinkedNode<T>) {
        this.item = _item
        this.next = _next
        this.prev = null
    }
}