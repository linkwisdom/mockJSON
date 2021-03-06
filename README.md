# mockjson
- 解决前后端ajax数据构造问题

# 使用方法

## 安装
### 服务端nodejs安装

    npm install mockjson

    var mock = require('mockjson');

### 客户端
  
   require by requireJS, seaJS or esl, any standary client amd loader

    var mock = require('../mockJSON');

## 创建变量

    
    mock.data.USERNAME = ['jack', 'willian', 'jerry'];
    mock.data.GENDER = ['boy', 'girl', 'other'];
  
## 创建模板
    
    
    var temp = {
        "id|+1": 10000,
        "name": "@USERNAME",
        "gender|0-1": "@GENDER",
        "vip|0-1": false
    }


## 生成数据

   var json = mock.generate(temp);
   
## 通过set/get设置及生成构造数据

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

## 高级方法

### 使用方法设置变量

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

## 导入模板包

    var pkg = require('./mypackage');
    mock.include(pkg);
    var fruit = mock.get('fruit');
    var orange = mock.get('orange');

-- `mypackage.js` 的内容如下:

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


## 测试示例

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

