const { response } = require('express');

module.exports.run = async (client, message, args, messageArray) => {
  const prefix = require('../prefix.json');
  const { MessageEmbed } = require('discord.js');
  const fetch = require('node-fetch');
  const embed = new MessageEmbed();
  console.log(args);
  console.log(messageArray);
  const msg = message;
  setTimeout(() => message.delete(), 3000);

  // GET Pokemons
  const getPokemon = async (PokemonName, credits) => {
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

        if (credits <= energy) {
          var energylvlmsg = `⚠️Low Energy Level: ${credits}.\nIt's a risk to catch the pokémon now!`;
        } else {
          energylvlmsg = `You're Energy Level: ${credits}.\nTry to catch this pokémon!`;
        }

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
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          )
          .setFooter(`${energylvlmsg}`, msg.author.avatarURL());

        msg.channel.send(embed).then((msg) => {
          msg
            .react('<:PokeBall:829788143796224020>')
            .then(() => msg.react('❌'))
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
                  console.log(name);
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
                    if (energizeRes.captured === false) {
                      embed
                        .setAuthor(
                          `⚡Warning ${member.user.username}⚡`,
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
                        )
                        .setImage(sprites.front_default)
                        .setTitle('⚠️Low Energy Level!')
                        .setDescription(
                          `**Couldn't capture ${pokemonName.toUpperCase()}, It Escaped!!!**`
                        )
                        .setColor(
                          `#${Math.floor(Math.random() * 16777215).toString(
                            16
                          )}`
                        )
                        .setFooter('', '');
                    } else {
                      if (energizeRes.captured === true) {
                        embed
                          .setAuthor(
                            `⚡Nice Work ${member.user.username}⚡`,
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
                          )
                          .setImage(sprites.front_default)
                          .setTitle(`${pokemonName.toUpperCase()} Captured`)
                          .setDescription(
                            `**You have captured ${pokemonName.toUpperCase()} successfully.\nSpent Energy: ${energy}\nRemaining Energy: ${
                              energizeRes.info.credits
                            }**`
                          )
                          .setColor(
                            `#${Math.floor((Math.random() * 0xffffff) << 0)
                              .toString(16)
                              .padStart(6, '0')}`
                          )
                          .setFooter('', '');
                      }
                    }
                    msg.channel.send(embed);
                    reaction.message.delete();
                  };
                  energize({ id, energy, userid, pokemonName });
                  // console.log(member);
                  // var reactionMessage = await reaction.message;

                  break;
                case '❌':
                  reaction.message.delete();
                default:
                  reaction.message.delet();
              }
            }
          });
        });
      });
  };

  // SIGN UP
  if (args[0] === 'signup') {
    // SIGNUP command

    embed
      .setTitle('Sign Up - Pokémon Hunt')
      .setAuthor(
        `Welcome ${msg.author.username}!`,
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
      )
      .setColor(
        `#${Math.floor((Math.random() * 0xffffff) << 0)
          .toString(16)
          .padStart(6, '0')}`
      )
      .setDescription('React to Enter the Pokémon World');
    msg.channel.send(embed).then((msg) => msg.react('✅'));
    // On https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg
    client.on('messageReactionAdd', async (reaction, user) => {
      const { name } = reaction.emoji;
      const member = reaction.message.guild.members.cache.get(user.id);
      // console.log(member);
      if (member.user.bot) {
        return;
      }
      switch (name) {
        case '✅':
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
            // console.log(signupRes);
            if (signupRes.exists == true) {
              embed
                .setAuthor(
                  `Hey ${member.user.username}!`,
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
                )
                .setTitle('')
                .setDescription(
                  '**You are already a member of the Pokémon Universe!\n If lost type `?poke help`**'
                );
              msg.channel.send(embed);
            }
          };
          signup({ userid });
          console.log(`User ID: ${userid}`);
          // await deletion to reacted message.
          reaction.message.delete();
          break;
      }
    });
  } else if (args[0] === 'search') {
    // RANDOM POKEMON TO COLLECT

    let userid = msg.author.id;
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
        let credits = signinRes.info[0].credits;
        console.log(credits);
        var PokemonName;
        // The API says 898 count
        PokemonName = Math.floor(Math.random() * (898 - 1 + 1)) + 1;
        getPokemon(PokemonName, credits);
        // console.log(PokemonName);
      } else {
        embed
          .setDescription(
            "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
          )
          .setAuthor(
            `Welcome ${msg.author.username}!`,
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          );
        msg.channel.send(embed);
      }
    };
    signin({ userid });
  } else if (args[0] === 'help') {
    // HELP command

    let userid = msg.author.id;
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
        let credits = signinRes.info[0].credits;
        // console.log(credits);
        embed
          .setDescription(
            "**`?poke signup` Quickly Join the Pokémon Journey.\n\n`?poke search` Search for Pokémon near you & try to capture by spending Energy Currency.\n\n`?poke energy` 🛠️Search for food in the wild, Energy Currency is very important in you're quest to capture pokémon's.\n\n`?poke inv` 🛠️Get Information of Inventory,\ni.e. Energy LVL, Pokémon Collections, Supplies, etc.**"
          )
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          )
          .setTitle(`ℹ️ Help Section`)
          .setAuthor(
            `Hello ${msg.author.username}!`,
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setFooter(
            `Powered by JavaScript, Express-RESTful-API, MongoDB Cloud Cluster,\nDiscord.Js, PokéAPI, Hosted on - Repl.it`,
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          );
      } else {
        embed
          .setDescription(
            "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
          )
          .setAuthor(
            'Welcome Trainer!',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          );
      }
      msg.channel.send(embed);
    };
    signin({ userid });
  } else if (args[0] === 'energy') {
    // ENERGY command

    let userid = msg.author.id;
    // check if the user is a member
    const signin = async (info) => {
      let rechargeEmbed = new MessageEmbed();
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
        rechargeEmbed
          .setDescription('Recharging....')
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          )
          .setImage('https://i.gifer.com/Lc8U.gif')
          .setAuthor(
            `Hello ${msg.author.username}!`,
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          );
        let send = await msg.channel.send(rechargeEmbed);
        // Energy Requested.
        const getEnergy = async (info) => {
          let result = await fetch(`http://localhost:3000/pokemon/getEnergy`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(info),
          });
          let getEnergyRes = await result.json();
          // check for some ackn
          console.log(getEnergyRes);
          if (getEnergyRes.recharged === true) {
            embed
              .setDescription('Recharged!!!')
              .setColor(
                `#${Math.floor((Math.random() * 0xffffff) << 0)
                  .toString(16)
                  .padStart(6, '0')}`
              )
              .setImage('')
              .setTitle(`Energy Level: ${getEnergyRes.info.credits}`)
              .setAuthor(
                `Hello ${msg.author.username}!`,
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
              );
          } else {
            embed
              .setDescription('Recharging Failed!')
              .setColor(
                `#${Math.floor((Math.random() * 0xffffff) << 0)
                  .toString(16)
                  .padStart(6, '0')}`
              )
              .setTitle('Try Again...')
              .setAuthor(
                `Sorry ${msg.author.username}!`,
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
              );
          }

          setTimeout(() => {
            send.delete();
            msg.channel.send(embed);
          }, 5000);
        };
        getEnergy({ userid });
      } else {
        embed
          .setDescription(
            "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
          )
          .setAuthor(
            'Welcome Trainer!',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          );
        msg.channel.send(embed);
      }
    };
    signin({ userid });
  } else if (args[0] === 'help') {
    let userid = msg.author.id;
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
        let credits = signinRes.info[0].credits;
        // console.log(credits);
        embed
          .setDescription(
            "**`?poke signup` Quickly Join the Pokémon Journey.\n\n`?poke search` Search for Pokémon near you & try to capture by spending Energy Currency.\n\n`?poke energy` 🛠️Search for food in the wild, Energy Currency is very important in you're quest to capture pokémon's.\n\n`?poke inv` 🛠️Get Information of Inventory,\ni.e. Energy LVL, Pokémon Collections, Supplies, etc.**"
          )
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          )
          .setTitle(`ℹ️ Help Section`)
          .setAuthor(
            `Hello ${msg.author.username}!`,
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setFooter(
            `Powered by JavaScript, Express-RESTful-API, MongoDB Cloud Cluster,\nDiscord.Js, PokéAPI, Hosted on - Repl.it`,
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          );
      } else {
        embed
          .setDescription(
            "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
          )
          .setAuthor(
            'Welcome Trainer!',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          );
      }
      msg.channel.send(embed);
    };
    signin({ userid });
  } else {
    let userid = msg.author.id;
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
        let credits = signinRes.info[0].credits;
        console.log(credits);
        var PokemonName;
        // The API says 898 count
        PokemonName = args[0];
        getPokemon(PokemonName, credits);
      } else {
        embed
          .setDescription(
            "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
          )
          .setAuthor(
            'Welcome Trainer!',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
          )
          .setColor(
            `#${Math.floor((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`
          );
        msg.channel.send(embed);
      }
    };
    signin({ userid });
  }

  //
};
module.exports.help = {
  name: 'pokemon',
  desc: 'Pokemon Information',
  aliases: 'poke',
};
