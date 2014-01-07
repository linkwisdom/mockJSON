# mockjson
- mock json data on both client side and server side

# Usage

## install and include
### require by npm and run by node apps

    npm install mockjson

    var mock = require('mockjson');

### require on client browser
  
   require by requireJS, seaJS or esl, any standary client amd loader

    var mock = require('../mockJSON');

## create/add vaiables

    
    mock.data.USERNAME = ['jack', 'willian', 'jerry'];
    mock.data.GENDER = ['boy', 'girl', 'other'];
  
## create/add template
    
    
    var temp = {
        "id|+1": 10000,
        "name": "@USERNAME",
        "gender|0-1": "@GENDER",
        "vip|0-1": false
    }


## render the template

   var json = mock.generate(temp);
   
## bind or render by `set` & `get`

    var userList = {
        "data|1-30": [
            {
                "id|1000-5000": 1000,
                "name": "@USERNAME",
                "budy|0-200": ["@NUMBER"]
            }
        ]
    };
    
    mock.set('GET/user/list', userList);
    
    
    function response(path, param, callback) {
        var result = mock.get('GET/user/list', {
            path: path,
            param: param
        });
    }

## Advanced methods

### setting variables' attributes  with function

    /**
     * generate attributes with function;
     * @param {Objects} context depends on args passed to `mock.get`
     * @param {number} idx   the index of temperary generating 
     */
    mock.data.IDEA = function(context, idx) {
        context || (context = {param: {ideaid: idx}});

        var param = context.param;

        var idea = {
            index: idx,
            ideaid: param.ideaid,
            title: mock.generate("BUY BEST @KEYWORDS @PROVINCE"),
            content: ""
        };

        param.unitid && (idea.unitid == param.unitid);

        return idea;
    }

    mock.set(/GET\/idea\/.*/, {
            "idea|0-10": "@IDEA"
    });

    var data = mock.get("GET/idea/list", {param: {
            userid: 1233,
            unitid: 111,
            ideaid: 1333
    }});

## include template package

    var pkg = require('./mypackage');
    mock.include(pkg);
    var fruit = mock.get('fruit');
    var orange = mock.get('orange');

-- the content of `mypackage.js` is listed as:

    // local variables
    exports.data = {
        'COLOR': ['red', 'green', 'blue'],
        'SHAPE': ['rect', 'triangle', 'circle', 'ball'],
        'FRUIT': ['apple', 'orangle', 'peach', 'berry']
    };
    
    // template fruit
    exports.fruit = {
        "name": "@FRUIT",
        "color": "@COLOR",
        "shape": "@SHAPE",
        "number|0-5": "@NUMBER"
    };

    // template orange
    exports.orange = {
        "color": "@COLOR",
        "shape": "@SHAPE",
        "number|0-5": "@NUMBER"
    };


including the template file can auto loading all the `exports.xxx` object as tamplate; 
and `exports.data` as local variable in package


## test demo

    > mock.generate("@NUMBER") 
     12

    > {"list|0-9": "@NUMBER"}

    { 
        "list" : "863802"
    }

    > {"list|1-9": ["@NUMBER"]}

    {
        "list" : [ "5", "6", "8"]
    }

    > {"list|0-1": true}

    {"list" : false}

    > {"user|3-3": [{"id|+1": 13}]}

    { 
        "user" : [ 
            {"id" : 13},
            {"id" : 14},
            {"id" : 15}
        ]
    }

