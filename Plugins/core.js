const fs = require("fs");
const axios = require("axios");
const path = require("path");
const package = require("../package.json");
let mergedCommands = [
  "help",
  "h",
  "menu",
  "sc",
  "support",
  "supportgc",
  "script",
  "system",
  "info",
  "about",
];

module.exports = {
  name: "systemcommands",
  alias: [...mergedCommands],
  uniquecommands: ["script", "support", "help", "system", "about"],
  description: "All system commands",
  start: async (
    Atlas,
    m,
    { pushName, prefix, inputCMD, doReact, text, args }
  ) => {
    const pic = fs.readFileSync("./Assets/Atlas.jpg");
    switch (inputCMD) {
      case "script":
      case "sc":
        await doReact("🧣");
        return m.reply(
          `*Lolz*, this repo is private bruv.`
            );
        /*
        let txt = `*Lolz*, this repo is private bruv.`;
        Atlas.sendMessage(m.from, { image: pic, caption: txt }, { quoted: m });
        break;
        */

      case "support":
      case "supportgc":
        await doReact("🙅‍♂️");
        return m.reply(
          `*_The only support I know is child support. 😔_*`
            );
        /*
        let txt2 = `*_The only support I know is child support. 😔_*`;
        Atlas.sendMessage(m.from, { image: pic, caption: txt2 }, { quoted: m });
        break;
        */

      case "help":
      case "h":
      case "menu":
        await doReact("💁‍♂️");
        await Atlas.sendPresenceUpdate("composing", m.from);
        function readUniqueCommands(dirPath) {
          const allCommands = [];

          const files = fs.readdirSync(dirPath);

          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              const subCommands = readUniqueCommands(filePath);
              allCommands.push(...subCommands);
            } else if (stat.isFile() && file.endsWith(".js")) {
              const command = require(filePath);

              if (Array.isArray(command.uniquecommands)) {
                const subArray = [file, ...command.uniquecommands];
                allCommands.push(subArray);
              }
            }
          }

          return allCommands;
        }

        function formatCommands(allCommands) {
          let formatted = "";

          for (const [file, ...commands] of allCommands) {
            const capitalizedFile =
              file.replace(".js", "").charAt(0).toUpperCase() +
              file.replace(".js", "").slice(1);

            formatted += `╟   🏮 *${capitalizedFile}* 🏮   ╢\n\n`;
            formatted += `\`\`\`${commands
              .map((cmd) => `⥼   ${prefix + cmd}`)
              .join("\n")}\`\`\`\n\n\n`;
          }

          return formatted.trim();
        }

        const pluginsDir = path.join(process.cwd(), "Plugins");

        const allCommands = readUniqueCommands(pluginsDir);
        const formattedCommands = formatCommands(allCommands);
        var helpText = `\nYo my nigga *${pushName}*,\n\nI am *${botName}* and I am here to make your boring ass life more entertaining.\n\n*🔖 My Prefix is:*  ${prefix}\n\n${formattedCommands}\n\n\n*©️ Galaxy - 2023*`;
        await Atlas.sendMessage(
          m.from,
          { video: { url: botVideo }, gifPlayback: true, caption: helpText },
          { quoted: m }
        );

        break;

      case "system":
      case "info":
      case "about":
        await doReact("🔰");
        let xyz = await axios.get(
          "https://api.github.com/repos/FantoX/Atlas-MD/releases"
        );
        let latest = xyz.data[0].tag_name;
        const version2 = package.version;
        let nodeVersion = process.version;
        let os = process.platform;
        let osVersion = process.release.lts;
        let architecture = process.arch;
        let computername = process.env.COMPUTERNAME;
        let os2 = process.env.OS;
        let cpu2 = process.env.PROCESSOR_IDENTIFIER;
        let core = process.env.NUMBER_OF_PROCESSORS;

        let txt4 = `            🧣 *System Info* 🧣


*〄 Node Version:* ${nodeVersion}

*〄 OS:* ${os2}

*〄 Platform:* ${os}

*〄 Os Version:* ${osVersion}

*〄 Computer Name:* ${computername}

*〄 CPU:* ${cpu2}

*〄 CPU Core:* ${core}

*〄 CPU Architecture:* ${architecture}

*〄 Current Bot version:* ${latest}

*〄 Latest Bot version:* ${latest}
`;

        if (latest.includes(version2) || version2.includes(latest)) {
          txt4 += `\n\n*⚠️ Bot Update Available:*`;
        } else txt4 += `\n\n*🔰 Bot is up to date.*`;
        Atlas.sendMessage(m.from, { image: pic, caption: txt4 }, { quoted: m });

        break;

      default:
        break;
    }
  },
};
