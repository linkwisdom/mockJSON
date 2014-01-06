define(function(require, exports, module) {
    function formatJSON(obj, indent) {
        var result = [];
        indent = (indent || '') + '    ';
        var type = $.isArray(obj)
            ? 'array' 
            : (obj === null)
                ? 'null'
                : typeof obj;
                
        switch (type) {
            case 'object':
                result.push('{ ');
                for (var i in obj) {
                    result.push('"' + i + '" : ' + formatJSON(obj[i], indent) + ',');
                }
                var last = result.pop();
                result.push(last.substr(0, last.length - 1));
                result.push('}');
                break;
                
            case 'array':
                result.push('[ ');
                for (var i = 0; i < obj.length; i++) {
                    result.push(formatJSON(obj[i], indent) + ',');
                }
                var last = result.pop();
                result.push(last.substr(0, last.length - 1));
                result.push(']');
                break;
                
            case 'string':
                result.push('"' + obj + '"');
                break;
                
            default:
                result.push(obj + '');
                break;
        }
        
         return result.join('\n' + indent);
    }
    
    module.exports = formatJSON;
});