const { ThreadChannel, MessageEmbed } = require('discord.js');
const mineflayer = require('mineflayer');



const defaultOptions = {
    username: "bot",
    password: "",
    host: "server.ip",
    thread: ""
}


module.exports = class botConnection {


    static async build(options, client, channel) {


        if (channel.threads.cache.find(x => x.name === options.host) === undefined)
            await channel.threads.create({
                name: options.host,
                autoArchiveDuration: 60,
                reason: "New server joined."
            })

        return new botConnection(options, client, channel)
    }

    constructor(options, client, channel) {
        Object.assign(this, defaultOptions, options)

        this.bot = mineflayer.createBot(this)
        this.client = client
        this.thread = channel.threads.cache.find(x => x.name === options.host)

        this.bot.on('login', () => {
            const embed = new MessageEmbed()
                .setColor("DARK_GOLD")
                .setTitle("Successfully joined server!")
                .addFields(
                    { name: 'Server', value: "- " + options.host, inline: true},
                    { name: 'Username', value: "- " + this.bot._client.username, inline: true},
                    { name: 'Version', value: "- " + this.bot._client.version, inline: true}
                )
                .setFooter("pugly#0001 | pugly.xyz")
                .setTimestamp()

            this.thread.send({ embeds: [embed] });
        })

        this.bot.on('kicked', (reason) => {
            const embed = new MessageEmbed()
                .setColor("DARK_RED")
                .setTitle("Bot was kicked from the server.")
                .addFields(
                    { name: 'Server', value: "- " + options.host, inline: true},
                    { name: 'Username', value: "- " + this.bot._client.username, inline: true},
                    { name: 'Version', value: "- " + this.bot._client.version, inline: true}
                )
                .setDescription("\nReason: \n" + reason)
                .setFooter("pugly#0001 | pugly.xyz")
                .setTimestamp()

            this.thread.send({ embeds: [embed] });
        })

        this.bot.on('messagestr', (message, messagePosition, jsonMsg) => {
            if (message.trim().length === 0) return
            this.thread.send(message)
        })
    }


    toString() {
        return (this.username + " | " + this.host + "  |  " + this.bot)
    }

    async sendChat(message) {
        this.bot.chat(message)
    }

    async quit() {

        if (this.bot._client.username === undefined)
            return

        const embed = new MessageEmbed()
            .setColor("DARK_RED")
            .setTitle("Disconnected from server...")
            .addFields(
                { name: 'Server', value: "- " + this.host, inline: true},
                { name: 'Username', value: "- " + this.bot._client.username, inline: true},
                { name: 'Version', value: "- " + this.bot._client.version, inline: true}
            )
            .setFooter("pugly#0001 | pugly.xyz")
            .setTimestamp()

        this.thread.send({ embeds: [embed] });

        this.bot.end()
    }
}
