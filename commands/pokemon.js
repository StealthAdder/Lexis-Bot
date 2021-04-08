const { response } = require('express');

module.exports.run = async (client, message, args, messageArray) => {
  const prefix = require('../prefix.json');
  const { MessageEmbed } = require('discord.js');
  const fetch = require('node-fetch');
  const embed = new MessageEmbed();
  console.log(args);
  console.log(messageArray);
  // message.delete();

  // GET Pokemons
  const getPokemon = (PokemonName) => {
    const api = `https://pokeapi.co/api/v2/pokemon/${PokemonName}`;
    fetch(api)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        let {
          sprites,
          abilities,
          name,
          base_experience,
          types,
          weight,
          height,
          id,
        } = data;
        let powers = [];
        for (i of types) {
          let slot = i.slot;
          let type = i.type.name;
          powers.push(type);
        }
        weight = weight / 10;
        height = height / 10;
        const pokemonName = name;
        // Energy to catch the pokemon
        const energy = Math.floor(base_experience + weight / height);
        console.log(energy);
        embed
          .setAuthor(
            '⚡Poké Ball Ready!⚡',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setImage(sprites.front_default)
          .setTitle('Found one pokémon near you!!!')
          .setDescription(
            `Name: **${name.toUpperCase()}**\nBase Experience: **${base_experience}**\nBest-Ability: **${abilities[0].ability.name.toUpperCase()}**\nWeight: **${weight} lbs**\nHeight: **${height} m**\nType: **${powers
              .toString()
              .toUpperCase()}**\nEnergy Needed to Catch: **${energy}**`
          )
          .setColor(0x00ae86);

        message.channel.send(embed).then((message) => {
          message
            .react('<:PokeBall:829788143796224020>')
            .catch(() => console.error('ERROR'));

          client.on('messageReactionAdd', async (reaction, user) => {
            const { name } = reaction.emoji;
            let userid = user.id;
            const member = reaction.message.guild.members.cache.get(userid);

            // Now Purchase processing
            if (member.user.bot === true) {
              return;
            } else {
              switch (name) {
                case 'PokeBall':
                  // console.log(name);
                  // console.log(`User: ${userid}`);
                  // console.log(`PokemonID: ${id}`);
                  // console.log(`Energy: ${energy}`);
                  const energize = async (info) => {
                    let result = await fetch(
                      `http://localhost:3000/pokemon/energize`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(info),
                      }
                    );
                    const energizeRes = await result.json();
                    console.log(energizeRes);
                  };
                  energize({ id, energy, userid, pokemonName });
                  // console.log(member);
                  await reaction.message.delete();
                  break;
              }
            }
          });
        });
      });
  };

  // SIGN UP
  if (args[0] === 'signup') {
    embed
      .setTitle('Sign Up - Pokemon Hunt')
      .setAuthor(
        'Welcome Trainer!',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
      )
      .setColor(0x00ae86)
      .setDescription('React to Enter the Pokemon World');
    message.channel.send(embed).then((message) => message.react('✅'));
    // On https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg
    client.on('messageReactionAdd', async (reaction, user) => {
      const { name } = reaction.emoji;
      const member = reaction.message.guild.members.cache.get(user.id);
      if (member.user.bot) {
        return;
      }
      switch (name) {
        case 'PokeBall':
          let userid = user.id;
          const signup = async (info) => {
            let result = await fetch(`http://localhost:3000/pokemon/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(info),
            });
            const signupRes = await result.json();
            console.log(signupRes);
            if (signupRes.exists == true) {
              embed
                .setAuthor(
                  'Hey Trainer!',
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
                )
                .setTitle('')
                .setDescription(
                  '**You are already a member of the Pokemon Universe!\n If lost type `?poke help`**'
                );
              message.channel.send(embed);
            }
            await reaction.message.delete();
          };

          signup({ userid });
          console.log(`User ID: ${userid}`);
          break;
      }
    });
  }

  // RANDOM POKEMON TO COLLECT

  if (args[0] === 'search') {
    let userid = message.author.id;
    // check if the user is a member
    const signin = async (info) => {
      let result = await fetch(`http://localhost:3000/pokemon/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });
      let signinRes = await result.json();
      // console.log(signinRes);
      if (signinRes.exists === true) {
        var PokemonName;
        // The API says 898 count
        PokemonName = Math.floor(Math.random() * (898 - 1 + 1)) + 1;
        getPokemon(PokemonName);
        // console.log(PokemonName);
      } else {
        embed
          .setDescription(
            "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
          )
          .setAuthor(
            'Welcome Trainer!',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setColor(0x00ae86);
        message.channel.send(embed);
      }
    };
    signin({ userid });
  } else {
    // console.log(args[0]);
    let userid = message.author.id;
    let pokemonName = args[0];
    const signin = async (info) => {
      let result = await fetch(`http://localhost:3000/pokemon/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });
      let signinRes = await result.json();
      // console.log(signinRes);
      if (signinRes.exists === true) {
        // The API says 898 count
        getPokemon(pokemonName);
        // console.log(PokemonName);
      }
    };
    signin({ userid });
  }

  //CREDIT CHECK
  // if (args[0] === 'cred') {
  //   let username = message.author.username;
  //   let userid = message.author.id;

  //   const getCredInfo = async (info) => {
  //     let result = await fetch(`http://localhost:3000/pokemon/signin`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(info),
  //     });
  //     let signinRes = await result.json();
  //     let credit = signinRes.result[0].credits;
  //     embed
  //       .setAuthor(
  //         `Welcome ${username}!,`,
  //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
  //       )
  //       .setColor(0x00ae86)
  //       .setDescription(`**Credit Balance: ${credit}**`);
  //     message.channel.send(embed);
  //   };

  //   getCredInfo({ userid });
  // }

  //
};
module.exports.help = {
  name: 'pokemon',
  desc: 'Pokemon Information',
  aliases: 'poke',
};
