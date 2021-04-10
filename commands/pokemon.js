const { response } = require('express');

module.exports.run = async (client, message, args, messageArray) => {
  const prefix = require('../prefix.json');
  const { MessageEmbed } = require('discord.js');
  const fetch = require('node-fetch');
  const embed = new MessageEmbed();
  // console.log(args);
  // console.log(messageArray);
  const msg = message;
  setTimeout(() => message.delete(), 5000);

  const userid = msg.author.id;

  // GET Pokemons
  const getPokemon = async (PokemonName) => {
    const api = `https://pokeapi.co/api/v2/pokemon/${PokemonName}`;
    fetch(api)
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        console.log(data);
        const { sprites, name, base_experience } = data;
        console.log(sprites);
        console.log(name);
        console.log(base_experience);
        embed.setTitle(`test`);
        let seed = await msg.channel.send(embed);
        await seed.react('<:PokeBall:829788143796224020>');
        await seed.react('❌');
        // console.log(seed);
        channel = seed.channel.id;
        var messageid = seed.id;
        console.log(channel);
        console.log(messageid);
        client.on('messageReactionAdd', async (reaction, user) => {
          if (reaction.message.partial) await reaction.message.fetch();
          if (reaction.partial) await reaction.fetch();
          if (user.bot) return;

          if (reaction.message.channel.id === channel) {
            if (reaction.message.id === messageid) {
              if (reaction.emoji.name === 'PokeBall') {
                console.log(name);
              }
            }
          }
        });
      });
    data = '';
  };

  // SIGN UP
  if (args[0] === 'signup') {
    // // SIGNUP command
    // embed
    //   .setTitle('Sign Up - Pokémon Hunt')
    //   .setAuthor(
    //     `Welcome ${msg.author.username}!`,
    //     'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //   )
    //   .setColor(
    //     `#${Math.floor((Math.random() * 0xffffff) << 0)
    //       .toString(16)
    //       .padStart(6, '0')}`
    //   )
    //   .setDescription('React to Enter the Pokémon World');
    // msg.channel.send(embed).then((msg) => msg.react('✅'));
    // // On https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg
    // client.on('messageReactionAdd', async (reaction, user) => {
    //   const { name } = reaction.emoji;
    //   const member = reaction.message.guild.members.cache.get(user.id);
    //   // console.log(member);
    //   if (member.user.bot) {
    //     return;
    //   }
    //   switch (name) {
    //     case '✅':
    //       let userid = user.id;
    //       const signup = async (info) => {
    //         let result = await fetch(`http://localhost:3000/pokemon/signup`, {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify(info),
    //         });
    //         const signupRes = await result.json();
    //         // console.log(signupRes);
    //         if (signupRes.exists == true) {
    //           embed
    //             .setAuthor(
    //               `Hey ${member.user.username}!`,
    //               'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //             )
    //             .setTitle('')
    //             .setDescription(
    //               '**You are already a member of the Pokémon Universe!\n If lost type `?poke help`**'
    //             );
    //           msg.channel.send(embed);
    //         }
    //       };
    //       signup({ userid });
    //       console.log(`User ID: ${userid}`);
    //       // await deletion to reacted message.
    //       reaction.message.delete();
    //       break;
    //   }
    // });
  } else if (args[0] === 'search') {
    // RANDOM POKEMON TO COLLECT

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
      console.log(signinRes);
      if (signinRes.exists === true) {
        let credits = signinRes.info[0].credits;
        // console.log(credits);
        let PokemonName = Math.floor(Math.random() * (898 - 1 + 1)) + 1;
        getPokemon(PokemonName);
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
    // // HELP command
    // let userid = msg.author.id;
    // // check if the user is a member
    // const signin = async (info) => {
    //   let result = await fetch(`http://localhost:3000/pokemon/signin`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(info),
    //   });
    //   let signinRes = await result.json();
    //   // console.log(signinRes);
    //   if (signinRes.exists === true) {
    //     let credits = signinRes.info[0].credits;
    //     // console.log(credits);
    //     embed
    //       .setDescription(
    //         "**`?poke signup` Quickly Join the Pokémon Journey.\n\n`?poke search` Search for Pokémon near you & try to capture by spending Energy Currency.\n\n`?poke energy` 🛠️Search for food in the wild, Energy Currency is very important in you're quest to capture pokémon's.\n\n`?poke inv` 🛠️Get Information of Inventory,\ni.e. Energy LVL, Pokémon Collections, Supplies, etc.**"
    //       )
    //       .setColor(
    //         `#${Math.floor((Math.random() * 0xffffff) << 0)
    //           .toString(16)
    //           .padStart(6, '0')}`
    //       )
    //       .setTitle(`ℹ️ Help Section`)
    //       .setAuthor(
    //         `Hello ${msg.author.username}!`,
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       )
    //       .setFooter(
    //         `Powered by JavaScript, Express-RESTful-API, MongoDB Cloud Cluster,\nDiscord.Js, PokéAPI, Hosted on - Repl.it`,
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       );
    //   } else {
    //     embed
    //       .setDescription(
    //         "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
    //       )
    //       .setAuthor(
    //         'Welcome Trainer!',
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       )
    //       .setColor(
    //         `#${Math.floor((Math.random() * 0xffffff) << 0)
    //           .toString(16)
    //           .padStart(6, '0')}`
    //       );
    //   }
    //   msg.channel.send(embed);
    // };
    // signin({ userid });
  } else if (args[0] === 'energy') {
    // ENERGY command
    // let userid = msg.author.id;
    // // check if the user is a member
    // const signin = async (info) => {
    //   let rechargeEmbed = new MessageEmbed();
    //   let result = await fetch(`http://localhost:3000/pokemon/signin`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(info),
    //   });
    //   let signinRes = await result.json();
    //   // console.log(signinRes);
    //   if (signinRes.exists === true) {
    //     rechargeEmbed
    //       .setDescription('Recharging....')
    //       .setColor(
    //         `#${Math.floor((Math.random() * 0xffffff) << 0)
    //           .toString(16)
    //           .padStart(6, '0')}`
    //       )
    //       .setImage('https://i.gifer.com/Lc8U.gif')
    //       .setAuthor(
    //         `Hello ${msg.author.username}!`,
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       );
    //     let send = await msg.channel.send(rechargeEmbed);
    //     // Energy Requested.
    //     const getEnergy = async (info) => {
    //       let result = await fetch(`http://localhost:3000/pokemon/getEnergy`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(info),
    //       });
    //       let getEnergyRes = await result.json();
    //       // check for some ackn
    //       console.log(getEnergyRes);
    //       if (getEnergyRes.recharged === true) {
    //         embed
    //           .setDescription('Recharged!!!')
    //           .setColor(
    //             `#${Math.floor((Math.random() * 0xffffff) << 0)
    //               .toString(16)
    //               .padStart(6, '0')}`
    //           )
    //           .setImage('')
    //           .setTitle(`Energy Level: ${getEnergyRes.info.credits}`)
    //           .setAuthor(
    //             `Hello ${msg.author.username}!`,
    //             'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //           );
    //       } else {
    //         embed
    //           .setDescription('Recharging Failed!')
    //           .setColor(
    //             `#${Math.floor((Math.random() * 0xffffff) << 0)
    //               .toString(16)
    //               .padStart(6, '0')}`
    //           )
    //           .setTitle('Try Again...')
    //           .setAuthor(
    //             `Sorry ${msg.author.username}!`,
    //             'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //           );
    //       }
    //       setTimeout(() => {
    //         send.delete();
    //         msg.channel.send(embed);
    //       }, 5000);
    //     };
    //     getEnergy({ userid });
    //   } else {
    //     embed
    //       .setDescription(
    //         "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
    //       )
    //       .setAuthor(
    //         'Welcome Trainer!',
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       )
    //       .setColor(
    //         `#${Math.floor((Math.random() * 0xffffff) << 0)
    //           .toString(16)
    //           .padStart(6, '0')}`
    //       );
    //     msg.channel.send(embed);
    //   }
    // };
    // signin({ userid });
  } else if (args[0] === 'help') {
    // let userid = msg.author.id;
    // // check if the user is a member
    // const signin = async (info) => {
    //   let result = await fetch(`http://localhost:3000/pokemon/signin`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(info),
    //   });
    //   let signinRes = await result.json();
    //   // console.log(signinRes);
    //   if (signinRes.exists === true) {
    //     let credits = signinRes.info[0].credits;
    //     // console.log(credits);
    //     embed
    //       .setDescription(
    //         "**`?poke signup` Quickly Join the Pokémon Journey.\n\n`?poke search` Search for Pokémon near you & try to capture by spending Energy Currency.\n\n`?poke energy` 🛠️Search for food in the wild, Energy Currency is very important in you're quest to capture pokémon's.\n\n`?poke inv` 🛠️Get Information of Inventory,\ni.e. Energy LVL, Pokémon Collections, Supplies, etc.**"
    //       )
    //       .setColor(
    //         `#${Math.floor((Math.random() * 0xffffff) << 0)
    //           .toString(16)
    //           .padStart(6, '0')}`
    //       )
    //       .setTitle(`ℹ️ Help Section`)
    //       .setAuthor(
    //         `Hello ${msg.author.username}!`,
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       )
    //       .setFooter(
    //         `Powered by JavaScript, Express-RESTful-API, MongoDB Cloud Cluster,\nDiscord.Js, PokéAPI, Hosted on - Repl.it`,
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       );
    //   } else {
    //     embed
    //       .setDescription(
    //         "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
    //       )
    //       .setAuthor(
    //         'Welcome Trainer!',
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
    //       )
    //       .setColor(
    //         `#${Math.floor((Math.random() * 0xffffff) << 0)
    //           .toString(16)
    //           .padStart(6, '0')}`
    //       );
    //   }
    //   msg.channel.send(embed);
    // };
    // signin({ userid });
  } else {
    console.log('else triggered');
  }
  //   let userid = msg.author.id;
  //   // check if the user is a member
  //   const signin = async (info) => {
  //     let result = await fetch(`http://localhost:3000/pokemon/signin`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(info),
  //     });
  //     let signinRes = await result.json();
  //     // console.log(signinRes);
  //     if (signinRes.exists === true) {
  //       let credits = signinRes.info[0].credits;
  //       console.log(credits);
  //       var PokemonName;
  //       // The API says 898 count
  //       PokemonName = args[0];
  //       getPokemon(PokemonName, credits);
  //     } else {
  //       embed
  //         .setDescription(
  //           "**It seems you are lost in the wild.\nLet's get you you're Trainer ID.\nThis ID helps universe to know you're collections and credit Information\n Let's start by Sending.**\n`?poke signup`"
  //         )
  //         .setAuthor(
  //           'Welcome Trainer!',
  //           'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png'
  //         )
  //         .setColor(
  //           `#${Math.floor((Math.random() * 0xffffff) << 0)
  //             .toString(16)
  //             .padStart(6, '0')}`
  //         );
  //       msg.channel.send(embed);
  //     }
  //   };
  //   signin({ userid });
  // }

  //
};
module.exports.help = {
  name: 'pokemon',
  desc: 'Pokemon Information',
  aliases: 'poke',
};
