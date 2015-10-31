connections = {}

Meteor.startup(() => {
  connections = {}
  Meteor.setInterval(() => Meteor.call('broadcastLoop'), 16.6666)
})

Meteor.methods({
  broadcastConnections: () => Streamy.broadcast('connections', { data: _.keys(connections).length}),
  broadcastLoop: () => Streamy.broadcast('motionUpdate', { data: connections }),
  assignColor: () => _.keys(connections)
})

Streamy.onConnect( (s) => { 
  connections[s.id] = {data: 0}
  Meteor.call('broadcastConnections')
})
Streamy.onDisconnect( (s) => {
  delete connections[s.id]
  Meteor.call('broadcastConnections')
})

Streamy.on('update', (data, from) => {
  connections[from.id] = data
})
