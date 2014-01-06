var mock = require('../src/index');

mock.data.MALE_FIRST_NAME = [
    'json', 'java', 'js'
];

mock.data.LAST_NAME = [
    'one', 'two', 'three'
];

var tpl = {
   "fathers|5-10": [{
       "id|+1": 120,
       "married|0-1": true,
       "name": "@MALE_FIRST_NAME @LAST_NAME",
       "sons": null,
       "daughters|0-3": [{
           "age|0-31": 0,
           "name": "FEMALE_FIRST_NAME"
       }]
   }]
};

 var tpl = mock.generate(tpl);
 
 console.log(tpl);

// mock.set('GET/nikon/detail', {
//     "fathers|5-10":[{"id|+1": 120}]
// });

// var data = mock.get('GET/nikon/detail', {});
// console.log(data);