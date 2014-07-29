define(['jquery'], function ($) {

    function get(url, data) {
        return ajax(url, "GET", data);
    }

    function post(url, data) {
        return ajax(url, "POST", data);
    };

    function ajax(url, method, data) {
        var deferred = $.Deferred();
        $.ajax({
            url: url,
            data: data,
            type: method,
            dataType: "json"
        }).done(function (data) {
            return deferred.resolve(data);
        }).fail(function () {
            return deferred.reject();
        });
        return deferred;
    };

    return {
        post: post,
        get: get
    };
});
