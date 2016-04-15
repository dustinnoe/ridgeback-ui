/*
 *  API module
 */
module.exports = {
    "get" : function(endPoint){
        var path = endPoint.split('/');
        var apiObject = api;

        for (var i = 2; i < path.length; i++){
            if (path[i] != "") {
                apiObject = apiObject[path[i]];
                if (apiObject == undefined){
                    return JSON.stringify({"error" : "Endpoint does not exist!"});
                }
            }
        }

        return JSON.stringify(apiObject);
    }
};

var api = {
    "version" : "ridgeback-ui 0.1",
    "this" : {"is" : {"getting" : "deep"}}
}