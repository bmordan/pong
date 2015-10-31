connections = {}

Meteor.startup(() => connections = {})

Meteor.methods({
  numberOfConnections: () => Streamy.broadcast('connections', { data: _.keys(connections).length })
})

Streamy.onConnect( (s) => { 
  connections[s.id] = { data: 0 }
  Meteor.call('numberOfConnections')
})
Streamy.onDisconnect( (s) => {
  delete connections[s.id]
  Meteor.call('numberOfConnections')
})

Streamy.on('update', function (data, from) {
  connections[from.id] = data
})
