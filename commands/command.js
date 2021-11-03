const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName("command")
        .setDescription("Sends a command through the bot!")
        .addStringOption(option => option.setName("command").setDescription("The command to be sent."))
};