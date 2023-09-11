const got = require("got");
const fs = require("fs");
const path = require("path");
const { readcommands } = require("../System/ReadCommands.js");
const {
  pushPlugin, // -------------------- PUSH NEW INSTALLED PLUGIN IN DATABASE
  isPluginPresent, // --------------- CHECK IF PLUGIN IS ALREADY PRESENT IN DATABASE
  delPlugin, // --------------------- DELETE A PLUGIN FROM THE DATABASE
  getAllPlugins, // ----------------- GET ALL PLUGINS FROM DATABASE
  checkMod, // ---------------------- CHECK IF SENDER IS MOD
} = require("../System/MongoDB/MongoDb_Core.js");

let mergedCommands = ["install", "uninstall", "plugins", "pluginlist"];
module.exports = {
  name: "plugininstaller",
  alias: [...mergedCommands],
  uniquecommands: ["install", "uninstall", "plugins", "pluginlist"],
  description: "Install, Uninstall, List plugins",
  start: async (Atlas, m, { text, args, pushName, prefix, inputCMD, isCreator, isintegrated, doReact }) => {
    switch (inputCMD) {
      case "install":
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Atlas.sendMessage(m.from, {
            text: `Sorry, only *Owners* and *Mods* can use this command !`,
            quoted: m,
          });
        }
        try {
          var url = new URL(text);
        } catch (e) {
          console.log(e);
          return await client.sendMessage(
            m.from,
            { text: `Invalid URL !` },
            { quoted: m }
          );
        }

        if (url.host === "gist.github.com") {
          url.host = "gist.githubusercontent.com";
          url = url.toString() + "/raw";
        } else {
          url = url.toString();
        }
        var { body, statusCode } = await got(url);
        if (statusCode == 200) {
          try {
            var folderName = "Plugins";
            fileName = path.basename(url);

            // check if plugin is already installed and present in that Database array
            plugin = await isPluginPresent(fileName);
            if (plugin) {
              return m.reply(`*${fileName}* plugin is already Installed !`);
            }

            // Check if that file is present in same directory
            if (fs.existsSync(`./Plugins/${fileName}`)) {
              return m.reply(
                `*${fileName}* plugin is already Present Locally !`
              );
            }

            var filePath = path.join(folderName, fileName);
            fs.writeFileSync(filePath, body);
            console.log("Plugin saved successfully!");
          } catch (error) {
            console.log("Error:", error);
          }
          await m.reply(`Installing *${fileName}*... `);
          await readcommands();
          await pushPlugin(fileName, text);
          await m.reply(`*${fileName}* Installed Successfully !`);
        }
        break;

      case "plugins":
        await doReact("🧩");
        const plugins = await getAllPlugins();
        if (!plugins.length) {
          await Atlas.sendMessage(
            m.from,
            { text: `No additional plugins installed !` },
            { quoted: m }
          );
        } else {
          txt = "*『    Installed Plugins List    』*\n\n";
          for (var i = 0; i < plugins.length; i++) { 
            txt += `🔖 *Plugin ${i+1}*\n*🎀 Name:* ${plugins[i].plugin}\n*🧩 Url:* ${plugins[i].url}\n\n`;
          }
          txt += `⚜️ To uninstall a plugin type *uninstall* plugin-name !\n\nExample: *${prefix}uninstall* audioEdit.js`;
          await Atlas.sendMessage(m.from, { text: txt }, { quoted: m });
        }

        break;

      case "uninstall":
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Atlas.sendMessage(m.from, {
            text: `Sorry, only *Owners* and *Mods* can use this command !`,
            quoted: m,
          });
        }
        if (!text) {
          return await m.reply(
            `Please provide a plugin name !\n\nExample: *${prefix}uninstall* audioEdit.js`
          );
        }
        await doReact("🧩");
        fileName = text;
        plugin = isPluginPresent(fileName)

        if (!plugin) {
          await doReact("❌");
          return await m.reply(`*${fileName}* plugin is not installed !`);
        }

        if (fs.existsSync(`./Plugins/${fileName}`)) {
          fs.unlinkSync(`./Plugins/${fileName}`);
          await delPlugin(fileName);
          await readcommands();
          await m.reply(
            `*${fileName}* plugin uninstalled successfully !\n\nPlease restart the bot to clear cache !`
          );
        } else {
          await doReact("❌");
          return m.reply(`*${fileName}* plugin is not installed !`);
        }

        break;

        case "pluginlist":
          await doReact("🧩");
          textssf = `*『    Installable Plugins List    』*\n\n
*🎀 Name:* economy.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/63bcf78d6da0bce7d9f18343e3143fbc/raw/224c92477109f7082f698890fe510874da597d5c/economy.js\n\n
*🎀 Name:* rpg.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/151e440d351549c896042155c223c59c/raw/2fbced16ebd14300f917248801c707d9733118ad/rpg.js\n\n
*🎀 Name:* code-Runner.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/8c2b76e4ed2d96eb370379a56f0cf330/raw/d3322fab57c52afd83cf83fc3f5afa493dc4e88f/code-Runner.js\n\n
*🎀 Name:* audio-edit.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/4e097be1a35b9c00bf0bc9f6635e335b/raw/cc57a7780dd80612b62ded960af3d70d19662956/audio-edit.js\n\n
*🎀 Name:* image-Edit.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/9f6cb696d645a49a98abba00c570cfe9/raw/23154ec10c2ee08558a8aca44389f0a983aa4dea/image-Edit.js\n\n
*🎀 Name:* text-to-speech.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/998a3b2937080af7c30a2639544fa24c/raw/afc9ba94cbaea95e971e3aea3f80e492249c75d7/text-to-speech.js\n\n
*🎀 Name:* logo-maker.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/67035f308b809aaabad8faa001fe473d/raw/72c2b3c100471375755817119c7ab391985bd7f3/logo-maker.js\n\n
*🎀 Name:* chat-GPT.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/04507d2d7411996622513759ea05775d/raw/7d27fc2bb2f6d8a45d3e929e3904c66895d811ad/chat-GPT.js\n\n
*🎀 Name:* fun.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/e02ed98798e5cc73a0778d8bc04f0f03/raw/77293b2b35d875ce0c91357d879fe5d0881423b9/fun.js\n\n
*🎀 Name:* tiktokdl.js\n🔖 *Number of commads:* 8\n*🧩 Url:* https://gist.githubusercontent.com/FantoX/2de67bc72021805417cbd317385ea71a/raw/f70879fc861dadd440f4a4a7dbb01cdae44b3c56/tiktokdl.js\n\n

⚜️ To install a plugin type *install* _plugin-url_ !\n\nExample: *${prefix}install* https://gist.githubusercontent.com/FantoX001/xyz...\n\n⚜️ To uninstall a plugin type *uninstall* _plugin-name_ !\n\nExample: *${prefix}uninstall* audioEdit.js\n`;
          await Atlas.sendMessage(m.from, { image: {url: botImage1},caption: textssf }, { quoted: m });
          break;
      default:
        break;
    }
  },
};
