define(function(require, exports, module) {
    var mock = require('mockjson');
    var mockData = require('js/mockData');
    var formatJSON = require('js/formatJSON');
    var ao = require('js/aopackage');

    function start() {
        mock.data = $.extend(mock.data, mockData);

        mock.include(ao);

        var template1 = {
            "condition|1-2": [{
                "word": "@KEYWORD",
                "idea": "@PROVINCE"
            }]
        };

        $('#template textarea').val(formatJSON(template1));
        $('#result textarea').val(''); // reset

        $.each(mock.data, function(keyword) {
            $('#keywords').append('<li><code>@' + keyword + '</code></li>');
        });

        for (var item in ao) {
            if (item != 'name') {
                $('#mock-api').append('<li>' + item + '</li>');
            }
        }

        $('#mock-api li').click(function(event) {
            var item = $(this).text();
            if (item in ao) {
                $('#template textarea').val(formatJSON(ao[item]));
                if (item != 'data') {
                    parseData(item);
                }
            }
        });


        $('#button-generate').click(function() {
            parseData();
        });

        function parseData(path) {
            try {
                var json = jQuery.parseJSON($('#template textarea').val());

                mock.set('mockme.json', json);

                var data = mock.get(path || 'mockme.json', {userid: '12344'});
                $('#result textarea').val(formatJSON(data));

            } catch (e) {
                alert('Invalid JSON');
            }
        }

        $('#button-generate').click();
    };

    module.exports = start;
});