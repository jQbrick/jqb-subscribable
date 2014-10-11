jqb-subscribable
================

Implement a simple pub/sub mechanism.  
(take a look at the specs for a in-code usage documentation)

    var subscribable = require('jqb-subscribable');
    
    // channel instance
    var channel = subscribable.create();
    var ticket = channel.on('foo', function() {});
    channel.emit('foo', 'some', 'data', 'to', 'callback');
    ticket.dispose();
    channel.dispose(); // dispose all subscriptions within the channel
    
    // mixin a subscribable behavior
    function MyClass() {}
    subscribable.mixin(MyClass.prototype);
    
    var instance = new MyClass();
    instance.on('foo', function() {});
    
    
## Run Tests

If you want to run tests on this module you can prompt:

    npm install && grunt
    
    