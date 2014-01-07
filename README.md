# mockjson
- mock json data on both client side and server side

# Usage

## include


    var mock = require('mockjson');
  
## create/add vaiables

    
    mock.data.USERNAME = ['jack', 'willian', 'jerry'];
    mock.data.GENDER = ['jack', 'willian', 'jerry'];
  
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
    

