var connections = new ReactiveVar(1)

Streamy.on('connections', (connected) => connections.set(connected.data) )

Template.bat.onRendered( () => Streamy.emit('update', { data: window.innerWidth }) )

Template.connected.onRendered( () => Meteor.call('numberOfConnections') )

Template.connected.helpers({
  getConnected: () => connections.get()
})
