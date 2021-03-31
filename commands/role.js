module.exports.run = (client, message, args, messageArray) => {
  const prefix = require('../prefix.json');
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed();
  setTimeout(() => message.delete(), 3000);
  embed
    .setTitle('Self Assignable roles')
    .setColor(0x4c8dcf)
    .setDescription(`<:valorant:826889099994333224> Valorant Agent\n🎮 Player`);
  message.channel.send(embed).then((message) => {
    message
      .react(`<:valorant:826889099994333224>`)
      .then(() => message.react('🎮'))
      .catch(() => console.error('ERROR'));
  });

  client.on('messageReactionAdd', (reaction, user) => {
    // console.log(user.id);
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    // console.log(name);
    if (user.id == '806599974707527730') {
      return;
    } else {
      switch (name) {
        case 'valorant':
          console.log('Valorant');
          var role = message.guild.roles.cache.find(
            (r) => r.name === 'Valorant Agent'
          );
          if (
            member.roles.cache.some((r) => ['Valorant Agent'].includes(r.name))
          ) {
            console.log('Role Exists');
          } else {
            console.log('Role Given');
            member.roles.add(role).catch(console.error);
          }
          break;

        case '🎮':
          var role = message.guild.roles.cache.find((r) => r.name === 'Player');
          console.log('Player');
          if (member.roles.cache.some((r) => ['Player'].includes(r.name))) {
            console.log('Role Exists');
          } else {
            console.log('Role Given');
            member.roles.add(role).catch(console.error);
          }
          break;
      }
      setTimeout(() => reaction.message.delete(), 3000);
    }
  });
};
module.exports.help = {
  name: 'role',
  desc: 'role members can assign themselves',
  aliases: 'r',
};
