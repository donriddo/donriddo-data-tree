const fs = require('fs');

let rawDataTree = require('./raw.data');
const expectedDataTree = [];

rawDataTree = rawDataTree.sort((a, b) => a.start - b.start);
let output = [];

function getFirstChild(stack, parent) {
    return stack.find(d => d.tier === parent.tier && d.start > parent.start);
}

function getSiblings(stack, child) {
    return stack.filter(
        d => d.tier.startsWith(child.tier) && d.tier !== child.tier
    );
}

let parent = rawDataTree.shift();

function buildDataTree(stack, tree) {
    let parent = Object.assign({}, tree);
    let firstChild = getFirstChild(stack, tree);
    let siblings = [];

    if (!parent.children) parent.children = [];
    
    if (firstChild) {
        siblings = getSiblings(stack, firstChild)
        parent.children.push(firstChild);
    }

    if (siblings.length) parent.children = parent.children.concat(siblings);

    if (parent.children.length) {
        parent.children = parent.children.map(
            child => buildDataTree(stack, child)
        );
    }
    console.log(parent);
    return parent;
}
console.log('initially: ', parent);

parent = buildDataTree(rawDataTree, parent);


fs.writeFileSync('output.json', JSON.stringify(parent, null, 4));