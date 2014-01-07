exports.data = {
    'COLOR': ['red', 'green', 'blue'],
    'SHAPE': ['rect', 'triangle', 'circle', 'ball'],
    'FRUIT': ['apple', 'orangle', 'peach', 'berry']
};

exports.fruit = {
    "name": "@FRUIT",
    "color": "@COLOR",
    "shape": "@SHAPE",
    "number|0-5": "@NUMBER"
};

exports.orange = {
    "color": "@COLOR",
    "shape": "@SHAPE",
    "number|0-5": "@NUMBER"
};