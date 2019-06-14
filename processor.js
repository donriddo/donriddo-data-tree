const fs = require('fs');

let rawDataTree = require('./raw.data');
const expectedDataTree = [];

rawDataTree = rawDataTree.sort((a, b) => a.start - b.start);
let output = [];

function isChild(parent, child) {
    return child.start > parent.start;
}

function isNode(obj1, obj2) {
    return obj2.tier.startsWith(obj1.tier) && (obj2.start - obj1.start) <= 5;
}

function buildParentTree(stack) {
    let pile = [...stack];
    const parent = pile.shift();
    parent.children = [];
    pile.forEach((child) => {
        if (isChild(parent, child)) parent.children.push(child);
    });
    return [pile, parent];
}

function buildDataTree(stack, tree) {
    let trash = [];
    function isInTrash(el) {
        const element = trash.find(
            d => d.start === el.start && d.tier === el.tier
        );
        return !!element;
    }

    let pile = [...stack];
    let obj = {...tree, children: []};

    pile.forEach((element) => {
        if (isNode(obj, element)) {
            obj.children.push(element);
            trash.push(element);
        }
    });
    pile = pile.filter(el =>  !isInTrash(el));

    return [pile, obj];
}

let [pile, parent] = buildParentTree(rawDataTree);

function processData(pile, parent) {
    let tree = {...parent};
    tree.children.forEach((child) => {
        let [newPile, obj] = buildDataTree(pile, child);
        if (obj.children.length) {
            obj = processData(newPile, obj);
        }
        tree.children.push(obj);
    });
    return tree;
}

parent = processData(pile, parent);


fs.writeFileSync('output.json', JSON.stringify(parent, null, 4));