// 暂不打算使用
export class LinkedListNode<T> {

    item: T;
    next?: LinkedListNode<T>;

    constructor(item: T) {
        this.item = item;
    }

}

export class LinkedList<T> {

    head?: LinkedListNode<T>;
    tail?: LinkedListNode<T>;
    
    private _length: number = 0;

    get length(): number {
        return this._length;
    }

    get(index: number): LinkedListNode<T> | void {
        if (index == 0) {
            return this.head;
        } else if (index > 0 && index < this._length) {
            const pre = this.get(index - 1);
            if (!pre) { return }
            return pre.next;
        }
    }

    push(item: T): void {
        const node = new LinkedListNode<T>(item);
        if (this.tail) {
            this.tail.next = node;
            this.tail = node;
        } else {
            this.head = node;
            this.tail = this.head;
        }
    }

    [Symbol.iterator](): Iterator<T> {
        let index = 0;
        let node = this.head;
    
        return {
            next(): IteratorResult<T> {
                if (node !== undefined) {
                    return { value: node.item, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }

}

*/