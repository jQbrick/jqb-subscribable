
var subscribable = require('../index');

describe('subscribable', function() {

    describe('channel', function() {
        
        var channel;
        
        beforeEach(function() {
            channel = subscribable.create();
        });
        
        it('can emit events and trigger callbacks', function() {
            var spy = sinon.spy();
            var ticket = channel.on('foo', spy);
            channel.emit('foo');
            expect(spy.calledOnce).to.be.true;
        });
        
        it('subscriptions can be disposed', function() {
            var spy = sinon.spy();
            var ticket = channel.on('foo', spy);
            ticket.dispose();
            channel.emit('foo');
            expect(spy.called).to.be.false;
        });
        
        it('should dispose all subscriptions', function() {
            var spy = sinon.spy();
            var ticket = channel.on('foo', spy);
            channel.dispose();
            channel.emit('foo');
            expect(spy.called).to.be.false;
        });
        
        it('should subscribe once', function() {
            var spy = sinon.spy();
            var ticket = channel.one('foo', spy);
            channel.emit('foo');
            channel.emit('foo');
            expect(spy.calledOnce).to.be.true;
        });
        
        it('should dispose a single event subscriptions', function() {
            var i = 0;
            var callback = function() { i++; };
            channel.on('foo', callback);
            channel.on('foo', callback);
            channel.on('faa', callback);
            channel.emit('foo');
            channel.emit('faa');
            channel.off('foo');
            channel.emit('foo');
            channel.emit('faa');
            expect(i).to.equal(4);
        });
        
        it('event name can match many more specific events', function() {
            var spy = sinon.spy();
            channel.on('foo', spy);
            channel.emit('foo:aa');
            channel.emit('foo:bb');
            expect(spy.calledTwice).to.be.true;
        });
        
        it('event name can match many more specific events', function() {
            var spy = sinon.spy();
            channel.on('^foo$', spy);
            channel.emit('foo:aa');
            channel.emit('foo:bb');
            channel.emit('aaa:foo');
            channel.emit('foo');
            expect(spy.calledOnce).to.be.true;
        });
    
    });

});
