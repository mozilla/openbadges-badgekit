/**
 * Monkey-patch the Express router, to allow for route reversal.
 * There really is no excuse for having to hard-code URLs into views!
 */

const ExpressRouter = require('express').Router;
const path = require('path');

function Router (app) {
    if (!(this instanceof Router))
        return new Router(app);

    var router = this;
    app._router = router;

    app.use(function(req, res, next) {
        res.locals.url = function url (name, params) {
            return router.resolve.apply(router, arguments);
        }
        next();
    });

    app.__defineGetter__('mountPoint', function () {
        var parts = [];

        var app = this;
        while (app) {
            parts.push(app.route);
            app = app.parent;
        }

        return path.join.apply(path, parts.reverse());
    });

    router.__defineGetter__('mountPoint', function () {
        return app.mountPoint;
    });

    ExpressRouter.apply(router, app);

    router._lookup = {};
}

Router.prototype = new ExpressRouter();

Router.prototype.route = function (method, path, name, callbacks) {
    method = method.toLowerCase();

    if (!callbacks) {
        callbacks = name;
        name = null;
    }

    var ret = ExpressRouter.prototype.route.call(this, method, path, callbacks);

    if (name) {
        var dict = this.map[method];
        this._lookup[name] = dict[dict.length-1];
    }

    return ret;
}

Router.prototype.resolve = function (name, params) {
    var isKeyBased = ({}.toString.call(params) === '[object Object]');

    if (!isKeyBased)
        params = [].slice.call(arguments, 1);

    var lookup = this._lookup;

    if (!lookup.hasOwnProperty(name))
        throw new Error('Route named "' + name + '" not found');

    var route = lookup[name];
    var keys = route.keys;
    var uriPath = route.path;

    if (keys.length) {
        keys.forEach(function(key, index) {
            var value = isKeyBased ? params.hasOwnProperty(key.name) && params[key.name] : params[index];

            if (value === undefined) {
                if (!key.optional)
                    throw new Error('Expected parameter "' + key.name + '" missing');
                value = '';
            } else {
                value = '/' + value;
            }

            uriPath = uriPath.replace('/:'+key.name+(key.optional?'?':''), value);
        });
    }

    return path.join(this.mountPoint, uriPath);
}

exports = module.exports = Router;
