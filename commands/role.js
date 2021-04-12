module.exports.run = async (client, message, args, messageArray) => {
  const prefix = require('../prefix.json');
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed();

  const msg = message;
  message.delete({ timeout: 2000 });
  embed
    .setTitle('Self Assignable roles')
    .setColor(0x4c8dcf)
    .setDescription(`<:valorant:826889099994333224> Valorant Agent\n🎮 Player`);

  let seed = await msg.channel.send(embed);
  await seed.react('<:valorant:826889099994333224>');
  await seed.react('🎮');

  var channelid = seed.channel.id;
  var messageid = seed.id;

  client.on('messageReactionAdd', async (reaction, user) => {
    // console.log(user.id);
    const member = reaction.message.guild.members.cache.get(user.id);

    if (user.bot) return;
    if (user.id === msg.author.id) {
      if (reaction.message.channel.id === channelid) {
        if (reaction.message.id === messageid) {
          var requestInfo = new MessageEmbed();
          if (reaction.emoji.name === 'valorant') {
            var role = message.guild.roles.cache.find(
              (r) => r.name === 'Valorant Agent'
            );
            if (
              member.roles.cache.some((r) =>
                ['Valorant Agent'].includes(r.name)
              )
            ) {
              requestInfo.setTitle('Role Already Exists').setColor(
                `#${Math.floor((Math.random() * 0xffffff) << 0)
                  .toString(16)
                  .padStart(6, '0')}`
              );
              await seed.delete();
              var seed1 = await msg.channel.send(requestInfo);
            } else {
              member.roles.add(role).catch((error) => console.error(error));
              requestInfo.setTitle('Role Assigned').setColor(
                `#${Math.floor((Math.random() * 0xffffff) << 0)
                  .toString(16)
                  .padStart(6, '0')}`
              );
              await seed.delete();
              var seed1 = await msg.channel.send(requestInfo);
            }

            await seed1.delete({ timeout: 4000 });
          }
          if (reaction.emoji.name === '🎮') {
            var role = message.guild.roles.cache.find(
              (r) => r.name === 'Player'
            );
            console.log('Player');
            if (member.roles.cache.some((r) => ['Player'].includes(r.name))) {
              requestInfo.setTitle('Role Already Exists').setColor(
                `#${Math.floor((Math.random() * 0xffffff) << 0)
                  .toString(16)
                  .padStart(6, '0')}`
              );
              await seed.delete();
              var seed1 = await msg.channel.send(requestInfo);
            } else {
              member.roles.add(role).catch((error) => console.error(error));
              requestInfo.setTitle('Role Assigned').setColor(
                `#${Math.floor((Math.random() * 0xffffff) << 0)
                  .toString(16)
                  .padStart(6, '0')}`
              );
              await seed.delete();
              var seed1 = await msg.channel.send(requestInfo);
            }
            await seed1.delete({ timeout: 4000 });
          }
        }
      }
    }
  });
};
module.exports.help = {
  name: 'role',
  desc: 'role members can assign themselves',
  aliases: 'r',
};
