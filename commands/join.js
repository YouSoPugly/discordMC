const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName("join")
        .setDescription("Join a server using the bot.")
        .addStringOption(option => option.setName("server").setDescription("The ip of the server to be joined.").setRequired(true))
};