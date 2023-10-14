require("dotenv").config();

let gg = process.env.MODS;
if (!gg) {
  gg = "22548132639";   // You can replace this number with yours //
}


global.owner = gg.split(",");
global.mongodb = process.env.MONGODB || "";
global.sessionId = process.env.SESSION_ID || "";
global.prefa = process.env.PREFIX || "!";
global.tenorApiKey = process.env.TENOR_API_KEY || "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c";
global.packname = process.env.PACKNAME || `meme`;
global.author = process.env.AUTHOR || "nigger";
global.port = process.env.PORT || "10000";
global.openAiAPI = process.env.OPENAI_API || "";
global.owner = gg.split(",");

module.exports = {
  mongodb: global.mongodb,
};
