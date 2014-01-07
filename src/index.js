var mockMap = {};

// context
exports.context = null;

// source meta data
exports.data = {
    NUMBER: '0123456789'.split(''),
    LETTER_UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    LETTER_LOWER: 'abcdefghijklmnopqrstuvwxyz'.split('')
};

function getRandomData(key, index, pkgData) {
    key = key.substr(1);
    var tpl = key;

    if (pkgData && (key in pkgData)) {
        tpl = pkgData[key];
    } else if (key in exports.data) {
        tpl = exports.data[key];
    } else {
        return key;
    }

    switch (type(tpl)) {
        case 'array':
            var index = Math.floor(tpl.length * rand());
            return tpl[index];

        case 'function':
            return tpl(exports.context || {}, index);
    }
}

function rand() {
    return Math.random();
}

function isArray(object) {
    return object && typeof object == 'object' 
        && 'splice' in object 
        && 'join' in object;
}


function type(obj) {
    return isArray(obj)
        ? 'array'
        : (obj === null) ? 'null' : typeof obj;
}

/**
 * generate
 * @param  {Object/JSON} template template content
 * @param  {Object/JSON} pkgData  variables for template
 * @param {string} name like 'key|0-5'
 * @return {Object/JSON}          target content
 */
exports.generate = function(template, pkgData, name) {
    var me = this;
    var length = 0;

    var matches = (name || '').match(/\w+\|(\d+)-(\d+)/);
    if (matches) {
        var min = parseInt(matches[1], 10);
        var max = parseInt(matches[2], 10);
        length = Math.round(rand() * (max - min)) + min;
    }
    
    var generated = null;
    switch (type(template)) {
        case 'array':
            generated = [];
            for (var i = 0; i < length; i++) {
                generated[i] = me.generate(template[0], pkgData);
            }
            break;

        case 'object':
            generated = {};
            for (var p in template) {
                var kstr = p.replace(/\|(\d+-\d+|\+\d+)/, '');
                generated[kstr] = me.generate(template[p], pkgData, p);
                var matches = p.match(/\w+\|\+(\d+)/);
                if (matches && type(template[p]) == 'number') {
                    var increment = parseInt(matches[1], 10);
                    template[p] += increment;
                }
            }
            break;

        case 'number':
            generated = (matches) ? length : template;
            break;

        case 'boolean':
            generated = (matches) ? rand() >= 0.5 : template;
            break;

        case 'string':
            if (template.length) {
                generated = '';
                length = length || 1;

                for (var i = 0; i < length; i++) {
                    generated += template;
                }

                var keys = generated.match(/@([A-Z_0-9\(\),]+)/g) || [];
                var rst = [];

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var randomData = getRandomData(key, i, pkgData);
                    
                    var tp = type(randomData);

                    if (tp == 'number') {
                        generated = Number(generated);
                    } else if (tp == 'string' || tp == 'boolean') {
                        generated = generated.replace(key, randomData);
                    } else {
                        generated = randomData;
                        rst.push(generated);
                    }    
                }

                if (rst.length > 1) {
                    generated = rst;
                }

            } else {
                generated = '';
                for (var i = 0; i < length; i++) {
                    var ch = Math.floor(rand() * 255);
                    generated += String.fromCharCode(ch);
                }
            }
            break;

        default:
            generated = template;
            break;
    }
    return generated;
};

/**
 * hijact request
 * @param  {string|regexp} request
 * @param  {Object/JSON} template
 */
exports.set = function(request, template, pkgData) {
    var keyStr = request.toString();

    mockMap[keyStr] = {
        request: request,
        template: template,
        pkgData: pkgData
    };
};

/**
 * get mock data
 * @param  {string} path  path/url or anything
 * @param  {Object} param args/context or anything
 * @return {Object/string/array} 
 */
exports.get = function(path, param) {
    var me = this;

    exports.context = {
        path: path,
        param: param
    };

    for (var item in mockMap) {
        var mock = mockMap[item];
        var req = mock.request;

        if (('string' == typeof req && req == path)
                || (req.test && req.test(path))) {
            return me.generate(mock.template, mock.pkgData);
        }
    }
};

// auto batch include templates and pakage data
exports.include = function(pkg) {
    var me = this;
    if ('object' != typeof pkg) {
        return;
    }

    for (var item in pkg) {
        if (item == 'name' || item == 'data') {
            continue;
        }

        me.set(item, pkg[item], pkg.data);
    }
};