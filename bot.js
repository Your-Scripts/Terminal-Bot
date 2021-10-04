//chamar liv do discord
const { Client, Intents } = require('discord.js');
const Discord = require("discord.js");
const fileUtils = require("./utils/fileUtils");
const config = require('./config.json');
const active = new Map();

//criar o client
const client = new Client({ ws: { intents: Intents.ALL }, disableMentions: 'everyone' });

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);

    console.log("atualizou")
    
    client.user.setPresence({ activity: { name: 'Terminal funcionando' }, status: 'WATCHING' });
});

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@${client.user.username}>`) || message.content.startsWith(`${message.guild.me}`)) {
       message.channel.send(`Meu prefixo é ${config.prefix}`)
    }

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.split(' ');
    const cmd = args.shift().toLowerCase();;
  
    const command = getCommand(client, cmd);
    if (command) {
        command.run(client, message, args)
    }

function getCommand(client, name) {
    name = name.slice(config.prefix.length);
    
    let command = client.commands.get(name);
    if (!command) {
        command = client.commands.get(client.aliases.get(name));
    }
    return command;
}})

function start() {

    console.log('Carregando comandos...');
    loadCommands('./commands');

    console.log('Conectando o bot...');
}
function loadCommands(dir) {
    for (const dirInfo of fileUtils.searchByExtension(dir, 'js')) {
        const dirList = dirInfo.directory.split('/');
        dirList.shift();
        dirList.shift();
        const commandCategory = dirList
            .join('/');

        for (const file of dirInfo.files) {
            let cmd = require(file);
            if(!cmd.help) {
                continue;
            }
    
            client.commands.set(cmd.help.name, cmd);
            if(cmd.help.aliases) {
                cmd.help.aliases
                .filter(alias => alias.trim() !== '')
                .forEach(alias => client.aliases.set(alias, cmd.help.name));
            }
        }
        const formatedFiles = dirInfo.files.map(file => file.split('/').pop().split('.').shift())
        console.log(`[COMANDO] Foram carregados ${dirInfo.files.length} comandos na categoria ${commandCategory}. ['${formatedFiles.join(', ')}']`)
    }
}
start();

client.login(config.discord_token);
