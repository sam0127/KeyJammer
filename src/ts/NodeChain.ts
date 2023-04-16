export class NodeChain {
    nodes: Array<AudioNode>
    size: number

    constructor(nodes: Array<AudioNode>) {
        this.nodes = nodes;
        this.size = nodes.length
        for(var i = 0; i < nodes.length - 1; i++) {
            this.nodes[i].connect(this.nodes[i+1])
        }
    }

    get(index: number) {
        return this.nodes[index]
    }

    first() {
        return this.nodes[0]
    }

    last() {
        return this.nodes[this.size - 1]
    }
}