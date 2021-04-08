module.exports.run = async (client, message, args, messageArray) => {
  const prefix = require('../prefix.json');
  const { MessageEmbed } = require('discord.js');
  const fetch = require('node-fetch');
  const embed = new MessageEmbed();

  var PokemonName;
  console.log(args[0]);

  if (args[0] === 'random') {
    // The API says 898 count
    PokemonName = Math.floor(Math.random() * (898 - 1 + 1)) + 1;
    console.log(PokemonName);
  } else {
    PokemonName = args[0];
  }
  console.log(PokemonName);
  const api = `https://pokeapi.co/api/v2/pokemon/${PokemonName}`;
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const { sprites, abilities, name, base_experience } = data;

      embed
        .setAuthor(
          'Poké Ball Opened!',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
        )
        .setImage(sprites.front_default)
        .setDescription(
          `You're Pokémon is here!!!\nName: **${name.toUpperCase()}**\nBase Experience: **${base_experience}**\nBest-Ability: **${abilities[0].ability.name.toUpperCase()}**`
        )
        .setColor(0x00ae86);
      message.channel.send(embed).then((message) => {
        message.react('🛒').catch(() => console.error('ERROR'));

        client.on('messageReactionAdd', (reaction, user) => {
          const { name } = reaction.emoji;
          const member = reaction.message.guild.members.cache.get(user.id);
          if (member.user.bot === true) {
            console.log(`It's bot`);
          } else {
            console.log(`User`);
            // console.log(member);
          }
          // console.log(member);
        });
      });
    });
};
module.exports.help = {
  name: 'pokemon',
  desc: 'Pokemon Information',
  aliases: 'poke',
};
