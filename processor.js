const fs = require('fs');

let rawDataTree = require('./raw.data');

rawDataTree = rawDataTree.sort((a, b) => a.start - b.start);
let hoisted = [];

function getFirstChild(stack, parent) {
    const firstChild = stack.find(
        d => d.tier === parent.tier && d.start > parent.start
    );
    if (firstChild) hoisted.push(`${firstChild.start}-${firstChild.tier}`);
    return firstChild ? { ...firstChild, children: [] } : firstChild;
}

function getSiblings(stack, child) {
    const siblings = [];
    stack.forEach(
        (d) => {
            const truthy = d.tier.startsWith(child.tier) 
            && d.tier !== child.tier
            && !hoisted.includes(`${d.start}-${d.tier}`);

            if (truthy) {
                hoisted.push(`${d.start}-${d.tier}`);
                siblings.push(buildDataTree(stack, d));
            }
        }
    );

    return siblings;
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

    return parent;
}

parent = buildDataTree(rawDataTree, parent);

fs.writeFileSync('output.json', JSON.stringify([parent], null, 4));