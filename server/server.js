v = 5
score = 0
connections = {}
ball = { x:50, y:0, xv:v, yv:v }

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
  broadcastConnections: () => Streamy.broadcast('connectedUpdate', { data: _.keys(connections).length }),
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

Streamy.on('update',    (data, from) => connections[from.id] = data)
Streamy.on('bounce',    (bat) => {
  ball.yv = -v
  score = score +1
  Streamy.broadcast('score', { data: score })
})
Streamy.on('top',       () => ball.yv = v)
Streamy.on('leftwall',  () => ball.xv = v)
Streamy.on('rightwall', () => ball.xv = -v)
Streamy.on('out',       () => { ball.y = v; score = 0 })
