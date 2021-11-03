const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const mineflayer = require('mineflayer');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ChatMessage } = require('prismarine-chat');
const fs = require('fs');

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS]});
const { token, username, password, server, clientID, guildID } = require('./config.json');
const { channel } = require('diagnostics_channel');
const { brotliCompress } = require('zlib');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const rest = new REST({ version: '9' }).setToken(token);

var bot = mineflayer.createBot({
    host: server,
    username: username,
    password: password
})

client.on("ready", async => {
    console.log("discord ready")
})

bot.on("login", () => {
    console.log("minecraft ready")

    let channel = client.channels.cache.get("534976099508289540")
    if (!channel) return

    const embed = new MessageEmbed()
        .setColor("DARK_GOLD")
        .setTitle("MC to Discord")
        .addFields(
            { name: 'Server', value: server, inline: true},
            { name: 'Username', value: bot._client.username, inline: true},
            { name: 'Version', value: bot._client.version, inline: true}
        )

        channel.send({ embeds: [embed] });
})

bot.on('messagestr', (message, messagePosition, jsonMsg) => {
    let channel = client.channels.cache.get("534976099508289540")
    if (!channel || message.trim().length === 0) return
    channel.send(message)
})

client.login(token)

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    const data = command.data.toJSON()
	commands.push(data)
}

(async() => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientID, guildID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();


// LIST OF BOTS EACH ON DIFF SERVER WITH CHANNEL IN DISCORD
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'command') {
        const command = interaction.options.getString("command", true)

        bot.chat("/" + command)

		await interaction.reply('Sent command ' + command);
	}

    if (interaction.commandName === 'join') {
        const server = interaction.options.getString("server", true)

        bot.quit()
        bot = mineflayer.createBot({
            host: server,
            username: username,
            password: password
        })
    }
});