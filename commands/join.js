const { SlashCommandBuilder } = require('@discordjs/builders');
const { option } = require('commander');

module.exports = {
    data: new SlashCommandBuilder().setName("join")
        .setDescription("Join a server using the bot.")
        .addStringOption(option => option.setName("server").setDescription("The ip of the server to be joined.").setRequired(true))
        //.addStringOption(option => option.setName("version").setDescription("The version for the bot to join on.").setRequired(false)
};