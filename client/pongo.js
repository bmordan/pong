const color = '#'+Math.random().toString(16).substr(-6)
const updateBatPosition = function (e) { Streamy.emit('update', { data: e.pageX, color: color })}
const connections = new ReactiveVar(1)

Streamy.on('connectedUpdate', (connected) => connections.set(connected.data))
Streamy.on('purge', (id) => $('#'+id.data).remove())
Streamy.on('motionUpdate', (deltas) => {
  _.each(deltas, (delta) => {
    for (k in delta) {
      var el = $('#'+k)
      if (!el.length) $('#bat-run').append('<span id="'+k+'" class="bats">---</span>')
      el.css('left', delta[k].data+'px').css('color', delta[k].color)
    }   
  })
})

Template.bat.onRendered( () => document.onmousemove = updateBatPosition )

Template.connected.onRendered( () => Meteor.call('broadcastConnections') )
Template.connected.helpers( {getConnected: () => connections.get()} )

Template.ball.onRendered( () => {
  Streamy.on('ball', (ball) => {
    $('#ball')
      .css('left', ball.data.x+'px')
      .css('top', ball.data.y+'px')
  })
  Meteor.setInterval(() => {
    let ball = $('#ball').position()
    let paddles = $('.bats')
    let bounce = _.some(paddles, function (paddle) {
      return ball.left > $(paddle).position().left &&
             ball.left < $(paddle).position().left + 92 &&
             ball.top > window.innerHeight - 130
    })
    if (ball.top < -25) Streamy.emit('top')
    if (ball.top > window.innerHeight) Streamy.emit('over')
    if (bounce) Streamy.emit('bounce')
  }, 16.6666)
})
