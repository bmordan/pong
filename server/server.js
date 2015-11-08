connections = {}
ball = { x:50, y:0, xv:0, yv:1 }

const ballControl = () => {
  ball.x += ball.xv
  ball.y += ball.yv
  Streamy.broadcast('ball', { data: ball })
}

Meteor.startup(() => {
  connections = {}
  Meteor.setInterval(() => Meteor.call('broadcastLoop'), 16.6666)
  Meteor.setInterval(() => Meteor.call('ballControl'), 16.6666)
})

Meteor.methods({
  broadcastConnections: () => Streamy.broadcast('connectedUpdate', { data: _.keys(connections).length}),
  broadcastLoop: () => Streamy.broadcast('motionUpdate', { data: connections }),
  assignColor: () => _.keys(connections),
  ballControl: ballControl
})

Streamy.onConnect( (s) => { 
  connections[s.id] = {data: 0}
  Meteor.call('broadcastConnections')
})
Streamy.onDisconnect( (s) => {
  delete connections[s.id]
  Streamy.broadcast('purge', {data: s.id})
  Meteor.call('broadcastConnections')
})

Streamy.on('update', (data, from) => connections[from.id] = data)
Streamy.on('bounce', () => ball.yv = -1)
Streamy.on('top', () => ball.yv = 1)
Streamy.on('over', () => ball.y = 1)
