const Discord = require('discord.js');
const { dev } = require('../../config.json');

exports.run = async (client, message, args) => {
    let autor = message.author.id;
    if (
        autor.includes(dev)
    ) {
        try {

            const { exec } = require('child_process');

            exec(args.slice(0).join(" "), (error, stdout, stderr) => {
                if (error) {
                    message.channel.send("```diff\n->ERRO: " + error.message + "```", {split:true});
                    return;
                }

                if (stderr) {
                    message.channel.send("```d\n" + stderr + "```", {split:true});
                    return;
                }
                message.channel.send("```d\n" + stdout + "```", {split:true});

            });
        } catch (err) {
            message.channel.send("```diff\n->ERRO: " + err + "```", {split:true});
        }
    } else {
        return
    }
}

module.exports.help = {
    name: 'terminal',
    category: 'test',
    //aliases: ['run']
}