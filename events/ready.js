module.exports = {
  name: "ready",
  once: true,
  async execute(bot) {
    console.log('Connected as ' + bot.user.tag);
  }
}