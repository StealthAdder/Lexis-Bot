const http = require('http');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./api/config/db');
const dotenv = require('dotenv');
dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var server = require('http').createServer(app);

if (process.env.NODE_ENV === 'development') {
  // Middleware used to log requests.
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  console.log(Date.now() + ' Ping Received');
  res.sendStatus(200);
});

// Routes
app.use('/pokemon', require('./api/routes/pokemon'));

// const listener = server.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
server.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${server.address().port}`);
});

app.listen(3000, 'localhost', () => {
  console.log(`Express Server Running..`);
});

const fs = require('fs');

require('dotenv').config();

prefix = require('./prefix.json');

// obj structuring { }
const {
  Client,
  WebSocketManager,
  MessageEmbed,
  Collection,
} = require('discord.js');
const { clear } = require('console');
const client = new Client({
  partials: ['MESSAGE', 'REACTION'],
});
// {
//   partials: ['MESSAGE', 'REACTION'],
// }
const embed = new MessageEmbed();
const PREFIX = prefix.PREFIX;

client.commands = new Collection();

const Commands = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

//Commands Folder
for (const file of Commands) {
  const commandList = require(`./commands/${file}`);
  client.commands.set(commandList.help.name, commandList);
  client.commands.set(commandList.help.aliases, commandList);
}
console.log(Commands.length + ' files loaded in [ commands ] folder');

client.on('ready', () => {
  client.user.setActivity('GUARDIAN', { type: 'PLAYING' });
  console.log(`${client.user.tag} has Powered Up!!!`);
});

// Commands folder access.
client.on('message', (message) => {
  if (message.author.bot) {
    return;
  }

  let messageArray = message.content.split(' ');
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  CommandHandler();

  function CommandHandler() {
    let commandfile_1 = client.commands.get(cmd.slice(PREFIX.length));
    if (commandfile_1) {
      commandfile_1.run(client, message, args, messageArray);
    }
  }
});

client.on('guildMemberAdd', (member) => {
  const id = member.user.id;

  let channel = member.guild.channels.cache.find(
    (ch) => ch.id === '807262981657460776'
  );
  // let channel = member.guild.channels.cache.find(ch => ch.id === '807544047786000417');
  if (!channel) return;

  embed
    .setTitle(':tada: Welcome to the GenXclub Server')
    .setColor(0xf1c40f)
    .setDescription(
      `<@${id}>\nYou're Set to get the "Chosen One" role in 1 Minute, Please be patient - Just Part of Standard Protocols.\n\nEven after few minutes if you aren't able to access Community Space <#806193348669866054>.\n\nPlease contact **@Ninja** for Immediate Assistance.\n\n**In the Mean While Check out these links to know more about us and what we do!**\nGenXclub Instagram: https://www.instagram.com/genxclub/\nTelegram Invite link: https://t.me/genXclub\nYoutube: https://bit.ly/313CeK9\nGitHub: https://github.com/GenXclub\nWebSite: https://genxclub.github.io/index.html`
    );
  let role = member.guild.roles.cache.find((r) => r.name === 'Chosen One');

  setTimeout(setRole, 60000);
  member.send(embed);
  channel.send(embed).then((msg) => {
    msg.delete({ timeout: 50000 });
  });

  function setRole(embed) {
    if (member.roles.cache.has(role.id))
      return channel.send('They have that Role.');
    member.roles.add(role).catch(console.error);
  }
});

// Ping for Devs
client.on('message', (message) => {
  if (message.author.bot) return;

  if (message.content === 'Prefix' || message.content === 'prefix') {
    embed
      .setTitle('Prefix - ?')
      .setColor(0x4c8dcf)
      .setDescription(`\nStart exploration with ?help`);
    message.channel.send(embed);
  }

  // Ping
  if (
    message.content === PREFIX + 'ping' ||
    message.content === PREFIX + 'Ping'
  ) {
    const pg = Math.round(client.ws.ping);
    let emj;
    if (pg <= 100) {
      emj = ':green_circle:';
    } else {
      emj = ':red_circle:';
    }
    embed.setTitle('').setColor(0x4c8dcf).setDescription(`${emj} ${pg}ms`);
    message.channel.send(embed);
  }

  // Commands list
  if (message.content === PREFIX + 'help') {
    embed
      .setTitle('Command')
      .setColor(0x4c8dcf)
      .setDescription(
        `List of Commands \n\`\`\`?help - <List all the commands> \n?ping - <Latency Information>\n?role - <Self-Assignable Roles>\n?w City/pincode - <Get Weather Information>\`\`\` `
      );
    message.channel.send(embed);
  }
});

client.login(process.env.BEBOT_TOKEN);
