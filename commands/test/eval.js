const Discord = require('discord.js');
const { dev } = require('../../config.json');

exports.run = async (client, message, args) => {
    let autor = message.author.id;
    if (
        autor.includes(dev)
    ) {
        try {

            const result = eval(args.join(' '))
            message.channel.send(`\`\`\`${result}\`\`\``, {split:true})

        } catch (err) {
            message.channel.send("```diff\n->ERRO: " + err + "```");
        }
    } else {
        return
    }
}

module.exports.help = {
    name: 'eval',
    category: 'test',
    //aliases: ['run']
}