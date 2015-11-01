var color = '#'+Math.random().toString(16).substr(-6)
var updateBatPosition = function (e) { Streamy.emit('update', { data: e.pageX, color: color })}
var connections = new ReactiveVar(1)

Streamy.on('connectedUpdate', (connected) => connections.set(connected.data))
Streamy.on('purge', (id) => $('#'+id.data).remove())
Streamy.on('motionUpdate', (deltas) => {
  _.each(deltas, (delta) => {
    for (k in delta) {
      var el = $('#'+k)
      if (!el.length) $('#bat-run').append('<span id="'+k+'">---</span>')
      el.css('left', delta[k].data+'px').css('color', delta[k].color)
    }   
  })
})

Template.bat.onRendered( () => document.onmousemove = updateBatPosition)

Template.connected.onRendered( () => Meteor.call('broadcastConnections'))
Template.connected.helpers({
  getConnected: () => connections.get()
})
