const fs = require("fs");

require('dotenv').config();

prefix = require("./prefix.json")


// obj structuring { }
const { Client, WebSocketManager, MessageEmbed, Collection } = require('discord.js');
const { clear } = require( "console" );
const client = new Client();
const embed = new MessageEmbed();
const PREFIX = prefix.PREFIX;

client.commands = new Collection();

const Commands = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

//Commands Folder
for (const file of Commands) {
    const commandList = require(`./commands/${file}`);
    client.commands.set(commandList.help.name, commandList);
    client.commands.set(commandList.help.aliases, commandList);
}
console.log(Commands.length+' files loaded in [ commands ] folder')

client.on('ready', () => {
    console.log(`${client.user.tag} has Powered Up!!!`);
});

// Auto Role Assignment.

// Commands folder access.
client.on('message', async(message) => {
    if (message.author.bot) {
        return;
    }

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    await CommandHandler() 

    function CommandHandler(){
        let commandfile_1 = client.commands.get(cmd.slice(PREFIX.length));
        if(commandfile_1) {   commandfile_1.run(client,message,args, messageArray);  }
    }
});

client.on('guildMemberAdd', (member) => {
    const id = member.user.id;

    let channel = member.guild.channels.cache.find(ch => ch.id === '807262981657460776');
    if(!channel) return;

    embed
    .setTitle(":tada: Welcome to the GenXclub Server")
    .setColor(0xF1C40F)
    .setDescription(`<@${id}>\nYou're Set to get the "Chosen One" role in 1 Minute, Please be patient - Just Part of Standard Protocols.\n\nEven after few minutes if you aren't able to access Community Space <#806193348669866054>.\n\nPlease contact <@&806141565964648448> for Immediate Assistance.`);
    let role = member.guild.roles.cache.find(r => r.name === "Chosen One");

    setTimeout(setRole, 60000);
    channel.send(embed).then(msg => {
        msg.delete({ timeout: 30000 });
    });

    function setRole (embed) {
        if(member.roles.cache.has(role.id)) return channel.send("They have that Role.");
        member.roles.add(role).catch(console.error);
    }
    
});

// Ping for Devs
client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content === PREFIX+"ping" || message.content === PREFIX+"Ping") {
            const pg = Math.round(client.ws.ping)
            let emj;
            if (pg <= 100) {
                emj = ":green_circle:";
            }
            else {
                emj = ":red_circle:";
            }
            embed
            .setTitle("")
            .setColor(0x4c8dcf)
            .setDescription(`${emj} ${pg}ms`);
        message.channel.send(embed);
    }
});

client.login(process.env.BEBOT_TOKEN);
