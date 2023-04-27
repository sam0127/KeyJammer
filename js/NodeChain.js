export class NodeChain {
    constructor(nodes) {
        this.nodes = nodes;
        this.size = nodes.length;
        for (var i = 0; i < nodes.length - 1; i++) {
            this.nodes[i].connect(this.nodes[i + 1]);
        }
    }
    get(index) {
        return this.nodes[index];
    }
    first() {
        return this.nodes[0];
    }
    last() {
        return this.nodes[this.size - 1];
    }
}
