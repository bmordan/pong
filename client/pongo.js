const color = '#'+Math.random().toString(16).substr(-6)
const updateBatPosition = function (e) { Streamy.emit('update', { data: e.pageX, color: color })}
const connections = new ReactiveVar(1)
const score = new ReactiveVar(0)

Streamy.on('connectedUpdate', (connected) => connections.set(connected.data))
Streamy.on('score', (scores) => score.set(scores.data))
Streamy.on('purge', (id) => $('#'+id.data).remove())
Streamy.on('motionUpdate', (deltas) => {
  _.each(deltas, (delta) => {
    for (k in delta) {
      var el = $('#'+k)
      if (!el.length) $('#bat-run').append('<span id="'+k+'" class="bats">-</span>')
      var v = delta[k].data - $(el).position().left
      el.css('left', delta[k].data+'px').css('color', delta[k].color).attr('velocity', v)
    }   
  })
})

Template.connected.onRendered( () => Meteor.call('broadcastConnections') )
Template.connected.helpers( {getConnected: () => connections.get()} )
Template.scores.helpers( {getScore: () => score.get()} )

Template.bat.onRendered( () => document.onmousemove = updateBatPosition )
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
             ball.left < $(paddle).position().left + 10 &&
             ball.top > window.innerHeight - 190
    })
    if (ball.top < -60) Streamy.emit('top')
    if (ball.left < 0) Streamy.emit('leftwall')
    if (ball.top > window.innerHeight - 60) Streamy.emit('out')
    if (ball.left > window.innerWidth - 20) Streamy.emit('rightwall')
    if (bounce) Streamy.emit('bounce')
  }, 16.6666)
})
