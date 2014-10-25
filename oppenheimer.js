#!/usr/bin/env node

"use strict";

var request = require("request"),
    _ = require("lodash"),
    q = require("q"),
    format = require("util").format,
    fs = require("fs");
require("colors");

var args = _.rest(process.argv, 2);

if (args.length > 0) {

    var routes = [args[0]];

    var configs = [],
        obj = {
            headers: {}
        };

    if (args.length > 1) {
        _.assign(obj, JSON.parse(fs.readFileSync(args[1])));
        console.log(obj);
    }

    routes.forEach(function(route) {
        obj.url = route;
        ["GET", "PUT", "POST", "DELETE", "OPTIONS"].forEach(function(method) {
            obj.method = method;
            ["text/html", "garbage/type", "*/*", "application/octet-stream", "image/png", "application/json"].forEach(function(accept) {
                obj.headers["Accept"] = accept;
                ["text/html", "garbage/type", "application/octet-stream", "image/png", "application/json"].forEach(function(type) {
                    obj.headers["Content-Type"] = type;
                    ["{}", "skjdflksjhdkjhf", "", null].forEach(function(body) {
                        obj.body = body;
                        configs.push(_.cloneDeep(obj))
                    });
                });
            });
        });
    });

    var testcount = configs.length,
    failures = [];

    var test = function() {
        var obj = configs.shift();
        return q.nfcall(request, obj)
        .spread(function(response, body) {
            if (Math.floor(response.statusCode / 100) == 5) {
                process.stdout.write("F");
                failures.push(obj);
            } else {
                process.stdout.write(".");
            }

            if (configs.length > 0) {
                return q.nfcall(test);
            } else {
                process.stdout.write("\n\n");
                console.log(format("Tests run: %d", testcount));
                console.log("Failures:", ("" + failures.length)[failures.length > 0 ? "red" : "green"]);
            }
        });
    };

    q.nfcall(test)
    .catch(console.err);
} else {
    console.err("Usage: oppenheimer <routes> [<path-to-base-json>]");
}
