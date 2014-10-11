'use strict';

function createSubscription(event, callback){
    var subscription = {
        event: new RegExp(event),
        callback: callback,
        dispose: function () {
            var i = this.__subscriptions.indexOf(subscription);
            if (i >= 0) {
                this.__subscriptions.splice(i, 1);
            }
            subscription.isDisposed = true;
        }.bind(this)
    };
    return subscription;
} 

function publish(event) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();

    var filter = function(subscription) {
        return event.match(subscription.event);
    };

    var callSubscriber = function(subscription) {
        if (subscription.isDisposed) {
            return;
        }
        subscription.callback.apply(null, args);
    };

    this.__subscriptions.filter(filter).forEach(callSubscriber);
}

function subscribe(event, callback) {
    var subscription = createSubscription.call(this, event, callback);
    this.__subscriptions.push(subscription);
    return subscription;
}

function subscribeOnce(event, callback) {
    var subscription = subscribe.call(this, event, function() {
        subscription.dispose();
        callback.apply(null, arguments);
    });
}

function disposeSubscriptions(event) {
    var filter = function(subscription) {
        if (!event) {
            return true;
        }
        return event.match(subscription.event);
    };
    var disposeSubscription = function(subscription) {
        subscription.dispose();
    };
    this.__subscriptions.filter(filter).forEach(disposeSubscription);
}

exports.mixin = function(obj) {
    obj.__subscriptions = [];
    obj.on = subscribe;
    obj.one = subscribeOnce;
    obj.off = disposeSubscriptions;
    obj.emit = publish;
    return obj;
};

exports.create = function() {
    return this.mixin({
        dispose: function() {
            disposeSubscriptions.call(this);
        }
    });
};
