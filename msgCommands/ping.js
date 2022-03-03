module.exports = {
  name: 'ping',
  description: 'Pongs',
  execute(receivedMessage) {
      return receivedMessage.channel.send("Pong!");
  }
}