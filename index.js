const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const mineflayer = require('mineflayer');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ChatMessage } = require('prismarine-chat');
const fs = require('fs');

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
const { token, username, password, clientID, guildID } = require('./config.json');
const { brotliCompress } = require('zlib');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const rest = new REST({ version: '9' }).setToken(token);

const botMap = new Map()

client.on("ready", async => {
    console.log("discord ready")

    setup()
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

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    if (interaction.commandName === 'join') {
        const server = interaction.options.getString("server", true)

        await addBot(server)
        await interaction.reply('Bot added to server ' + server)
    }
});

client.on('messageCreate', async interaction => {

    if (interaction.member.user.bot)
        return

    if (!interaction.channel.isThread)
        return
    
    if (!botMap.has(interaction.channel.name))
        return


    if (interaction.cleanContent.startsWith("!")) {

        const command = interaction.cleanContent.toLowerCase().substring(1).trim();

        console.log(command)

        if (command == "quit") {
            botMap.get(interaction.channel.name).quit()
        }

        if (command == "join") {
            addBot(interaction.channel.name)
            interaction.channel.send("Rejoining server, please wait...")
        }

        return
    }
    
    botMap.get(interaction.channel.name).sendChat(interaction.cleanContent)
})


const Bot = require('./bot.js');
const { resourceUsage } = require('process');

async function addBot(server) {

    console.log("started adding bot")

    if (botMap.has(server)) {
        
        botMap.get(server).quit()
        botMap.delete(server)

        console.log("Bot is already on server " + server + ", reconnecting...")
    }

    console.log("checked has server")
    
    const channel = client.channels.cache.get("534976099508289540")

    const bot = await Bot.build({
        username: username,
        password: password,
        host: server
    }, client, channel)

    botMap.set(server, bot)
}


async function setup() {
    await addBot("minehut.com")
}