const Discord = require('discord.js');
const Allbooru = require('booru');
const YoMama = require('yo-mamma').default;
const fs = require('fs-extra');

const logger = require('winston');

const display = require('./display.json');
const auth = require('./auth.json');
const tomaranai = require('./tomaranai.json');
const flirt = require('./flirt.json');

const Admin = 295544075237588992
const Admin2 = 240254307306307584

const client = new Discord.Client();
//
const wait = (s) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000))
}

//
var d = new Date()

const prefix = "~";
const Prefix = prefix;
//
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// declare all boorus
const boorus = {
    "danb": Allbooru.forSite('danbooru'),
    "e621": Allbooru.forSite('e6'),
    "e926": Allbooru.forSite('e9'),
    "hypno": Allbooru.forSite('hypnohub'),
    "konac": Allbooru.forSite('konac'),
    "yandere": Allbooru.forSite('yandere'),
    "gelb": Allbooru.forSite('gelbooru'),
    "r34": Allbooru.forSite('rule34'),
    // "loli": Allbooru.forSite('lolibooru'),
    "r34pa": Allbooru.forSite('pa'),
    "derp": Allbooru.forSite('derpibooru'),
    "fur": Allbooru.forSite('fb'),
    "real": Allbooru.forSite('realbooru'),
    "xbo": Allbooru.forSite('xb')
}

// global function
async function attsea(channel, site, tags, limit = 1, random = true) {
    const ifres = boorus[site]
    if (channel.guild == 728459950468104284) {
        if (tags.includes("loli") || tags.includes("shota") || tags.includes("cub") || tags.includes("lolicon") || tags.includes("shotacon")) {
            // channel.send(`Debug:\`${tags.join(' ')}\``)
            channel.send("No.")
            return
        }
    }

    var tags = tags.concat("rating:explicit")
    if (ifres) {
        var posts = null
        try {
            posts = await ifres.search(tags, {
                limit,
                random
            })
        } catch (error) {
            channel.send("`" + error + "`")
            return
        }

        const index = Math.floor(Math.random())
        const post = posts[index]

        if (post) {
            var ToUrl = post.fileUrl
            if (post.fileUrl == "undefined") {
                if (post.source != "undefined") {
                    ToUrl = post.source 
                } else {
                   // recursive
                   attsea(channel, site, tags)
                   return           
				}
			}

            var ltags = post.tags;
            if (channel.guild == 728459950468104284) {
                if (ltags.includes("loli") || ltags.includes("shota") || ltags.includes("cub") || ltags.includes("lolicon") || ltags.includes("shotacon")) {
                    attsea(channel, site, tags); // recursive
                    return
                }
            }

            channel.send("", {
                embed: {
                    color: 1811926,
                    fields: [{
                        name: "Contents",
                        value: "**Tags**: `" + post.tags.join(', ') + "`\n**ID:** " + post.id + "\n**Score:** " + post.score + "\n**Source:** " + post.source + ""
                    }],
                    image: {
                        url: ToUrl
                    },
                    description: "If you like this bot, please donate to my [PayPal](https://paypal.me/CloroSphere)!",
                    footer: {
                        text: "Created by CLORO (Twitter: @cloro_2nd)"
                    }
                }
            })
        } else {
            channel.send("`Sorry, could not find a post with the following tags: [" + tags.join(", ") + "]`")
        }
    } else {
        channel.send("No such site with alias: " + site)
    }
}
//

var Reset = false
var isNuking = false
var Tomaranai = false
var MessagesSent = 0

var RecordedMessages = 0
var Recording = false
var TextFile = ""
var File

var Greetings = [
    "hi~",
    "nyahello~",
    "hello!",
    "konnichiwa~!",
    "ohayo~",
    "wasshoi~"
]

var TomaranaiActivate = [
    "I can sense sadness deep within your eyes... Don't worry, I am here! uwu",
    "I can see whoever's feeling down deep in there eyes. I am here to cheer you up!"
]

client.on('message', async function (message) {
    if (message.channel.type == "dm") {
        if (message.author.id == client.user.id) { return }
        console.log(`Got DM from: ${message.author.username}#${message.author.discriminator} | ${message.author.id}\n${message.content}`)

        client.channels.cache.get("739171712234684446").send(`**Got a DM from:** ${message.author.username}#${message.author.discriminator} | <@${message.author.id}> \n\`\`\`${message.content}\`\`\``)
    }

    // Recording
    if (Recording == true) {
        if (message.author.id != Admin && message.author.id != Admin2) {
            try {
                console.log(`Writing to log: [${message.channel.guild.name}] [#${message.channel.name}] ${message.author.username}#${message.author.discriminator} : ${message.content}`)
                var TextDate = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
                var String = ""

                String = `\n[${TextDate}] [${message.channel.guild.name}] [#${message.channel.name}] [${message.author.username}] ${message.cleanContent}`
                fs.appendFile(TextFile, String)

                RecordedMessages++
            } catch(error) {
                console.log("There was an error trying to record message.\n", error)
            }
		}
    }

    // Tomaranai
    if (Tomaranai) {
        if (message.guild.id == 621966613951938560) {return}
        let user = message.author

        if (user.bot == false) {
            let rng = Math.floor(Math.random() * 5000) + 1
            let penis = message.author.id == 202650165549596672 && 5 || 1

            console.log(rng, user.username)
            if (rng <= 200 * penis) {
                if (MessagesSent >= 30) { Tomaranai = false; MessagesSent = 0; return }

                let msg = tomaranai.messages[Math.floor(Math.random() * tomaranai.messages.length)]

                console.log(`Sending message to: ${user.username}#${user.discriminator}`)
                console.log(`With message: ${msg}`)

                MessagesSent++
                message.react("💗")
                message.author.send(msg)
                // message.author.send(`\`debug\`\n\`Got message at ${Date.now}\`\n\`${message.content}\``)
                // message.author.send(`\`This message is automated to allow friend requesting.\``)
            }
        }
    }

    if (!message.content.startsWith(prefix)) {
        // mention
        if (message.content.indexOf("<@!" + client.user.id + ">") != -1) {
            if (message.author.id == client.user.id) {return}
            if (message.guild == 728459950468104284) {
                if (message.content.indexOf("choke me") != -1 || message.content.indexOf("step on me") != -1) {
                    message.reply("what the fuck's wrong with you?")
                }

                return
            }

            if (message.content.indexOf("give") != -1) {
                message.reply("no.")
                return
            } else if (message.content.indexOf("shut up") != -1) {
                message.reply("no u")
                return
            } else if (message.content.indexOf("no u") != -1) {
                message.reply("no u")
                return
            } else if (message.content.indexOf("u suck") != -1) {
                message.reply("shut up")
                return
            } else if (message.content.indexOf("who") != -1) {
                message.reply("your worst nightmare.")
                return
            } else if (message.content.indexOf("fuck") != -1) {
                message.reply("shut the fuck up.")
                return
            }

            message.reply("please type `~help` for a list of commands!")            
            return
        }

        // mention with text
        if (message.content.indexOf("kuroro") != -1 || message.content.indexOf("KURORO") != -1) {
            if (message.author.id == client.user.id) { return }
            if (message.content.indexOf("give") != -1) {
                message.reply("no.")
                return
            } else if (message.content.indexOf("shut up") != -1) {
                message.reply("no u")
                return
            }

            return
        }
        return
    } else {
        if (message.author.id == client.user.id) {return}
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        // check if site
        var ifSite = boorus[cmd]
        if (ifSite) {
            if (message.channel.nsfw == true || message.author.id == Admin || message.author.id == Admin2) {
                attsea(message.channel, cmd, args)

                return
            } else {
                message.channel.send("This channel doesn't have NSFW enabled!")
                return
            }
        }

        const limit = 1
        const random = true

        switch (cmd) {
            // Simp
            case "simp":
                if (args[0] == "send") {
                    message.channel.send(`Sending money to https://paypal.me/CloroSphere... [Amount: $${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}]`)
                    return
                }

                message.channel.send("Here you go: https://paypal.me/CloroSphere");

                break

            // Flirt
            case "flirt":

                break

            // gmsg
            case "gmsg":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let str = args.join(' ')
                    let lolasinigang = client.guilds.cache.find(guild => guild.name === "Lola Lyrica's SiniGANG")

                    console.log(`${lolasinigang} if exist`)
                    if (lolasinigang) {
                        let General = lolasinigang.channels.cache.find(general => general.name.indexOf("general") !== -1)

                        wait(.1)
                        if (General) {
                            if (General.type == "text") {

                                try {
                                    General.send(str)
                                    console.log(`Successful initiator sent to runtime.`)
                                } catch (error) {
                                    console.log(`Attempted to send initiator to.`)
                                }
                            }
                        }
                    }
                }

                break

            case "tmsg":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let str = args.join(' ')
                    let lolasinigang = client.guilds.cache.find(guild => guild.name === "Lola Lyrica's SiniGANG")

                    console.log(`${lolasinigang} if exist`)
                    if (lolasinigang) {
                        let General = lolasinigang.channels.cache.find(general => general.name.indexOf("tagalog-chat") !== -1)

                        wait(.1)
                        if (General) {
                            if (General.type == "text") {

                                try {
                                    General.send(str)
                                    console.log(`Successful initiator sent to runtime.`)
                                } catch (error) {
                                    console.log(`Attempted to send initiator to.`)
                                }
                            }
                        }
                    }
                }

                break

            case "mdmsg":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let str = args.join(' ')
                    let lolasinigang = client.guilds.cache.find(guild => guild.name === "Lola Lyrica's SiniGANG")

                    console.log(`${lolasinigang} if exist`)
                    if (lolasinigang) {
                        let General = lolasinigang.channels.cache.find(general => general.name.indexOf("mod-discord") !== -1)

                        wait(.1)
                        if (General) {
                            if (General.type == "text") {

                                try {
                                    General.send(str)
                                    console.log(`Successful initiator sent to runtime.`)
                                } catch (error) {
                                    console.log(`Attempted to send initiator to.`)
                                }
                            }
                        }
                    }
                }

                break

            // Join VC
            case "joinvc":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let lolasinigang = client.guilds.cache.find(guild => guild.name === "Lola Lyrica's SiniGANG")

                    console.log(`${lolasinigang} if exist`)
                    if (lolasinigang) {
                        let General = lolasinigang.channels.cache.find(general => general.name.indexOf("General") !== -1)

                        wait(.1)
                        if (General) {
                            if (General.type == "voice") {

                                try {
                                    General.join()
                                    console.log(`Successful join behavior sent to runtime.`)
                                } catch (error) {
                                    console.log(`Attempted to send initiator to.`)
                                }
                            }
                        }
                    }
                }

                break

            // Tomaranai
            case "tomaranai":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    Tomaranai = !Tomaranai

                    MessagesSent = 0
                    message.channel.send(Tomaranai && "Backdoor loaded, sending everyone motivational messages." || "Backdoor stop.")

                    if (Tomaranai) {
                        client.guilds.cache.forEach(guild => {
                            let General = guild.channels.cache.find(general => general.name.indexOf("general") !== -1)

                            wait(.1)
                            if (General) {
                                if (General.type == "text") {
                                    console.log(`Has general for guild: ${guild.name}`)

                                    try {
                                        General.send(TomaranaiActivate[Math.floor(Math.random() * TomaranaiActivate.length)])
                                        console.log(`Successful initiator sent to runtime: ${guild.name} ${General.type}`)
                                    } catch (error) {
                                        console.log(`Attempted to send initiator to: ${guild.name}`)
                                    }
                                }
                            }
                        })
                    }
                }

                break

            // dm guild member
            case "dm":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let toFind = args[0]
                    args.shift()

                    let msg = args.join(' ')

                    console.log(`Finding user ID: ${toFind}`)
                    let member = message.guild.members.cache.find(user => user.id === toFind)
                    if (member) {
                        let user = member.user
                        console.log(`Got ${user.username}#${user.discriminator}`)

                        user.send(msg)
                            .then(message => {
                                console.log(`Has sent message to ${user.username}#${user.discriminator} with message: ${msg}`)
                            })
                    }
                }

                break

            // global dm
            case "gdm":
                // search through all kuroro guilds
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let toFind = args[0]
                    args.shift()

                    let msg = args.join(' ')
                    let hasSent = false

                    console.log(`Finding user ID: ${toFind}`)
                    client.guilds.cache.each(guild => {
                        if (hasSent) {return}
                        let member = guild.members.cache.find(member => member.user.id === toFind)

                        if (member) {
                            console.log(`Got User: ${member.username}#${member.discriminator}`)
                            member.send(msg)
                                .then(message => {
                                    console.log(`Has sent message to ${member.username}#${member.discriminator} with message: ${msg}`)
                                })

                            hasSent = !hasSent
                            return
                        }
                    })
                }

                break

            case "send": 
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let toFind = args[0]
                    args.shift()

                    let msg = args.join(' ')
                    client.channels.cache.get(toFind).send(msg)
                    console.log("Sent message to runtime.")
                }

                break

            case "snipeguild":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let toFind = args[0]

                    if (toFind) {
                        let guild = client.guilds.cache.find(guild => guild.id === toFind)

                        if (guild) {
                            console.log(`[GUILD] ${guild.name}\n[ID] ${guild.id}\n[OWNER] ${guild.owner.user.username}#${guild.owner.user.discriminator}\n[MEMBER COUNT] ${guild.memberCount}\n[SHARD ID] ${guild.shardID}\n[CREATED]: ${guild.createdTimestamp}`)
                        }
                    }
                }

                break

            case "snipeguildmembers":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    let toFind = args[0]

                    if (toFind) {
                        let guild = client.guilds.cache.find(guild => guild.id === toFind)

                        if (guild) {
                            let memberInt = 1;

                            console.log(`GUILD MEMBERS FOR: ${guild.name}`)
                            guild.members.cache.forEach(member => {
                                console.log(`[${memberInt}] ${member.nickname} -- ${member.user.username}#${member.user.discriminator}`)
                                memberInt++
                            })
                        }
                    }
                }

                break

            case "getallguild":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    console.log("Collecting guild cache...")

                    client.guilds.cache.forEach(guild => {
                        console.log(`[GUILD] Server: ${guild.name} | ID: ${guild.id} | Owner: ${guild.owner.user.username}#${guild.owner.user.discriminator}`)
                    })
                }

                break

            // record 
            case "record":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    Recording = !Recording

                    switch (Recording) {
                        case true:
                            message.reply("I will now record every message in every channel in every server I am in.")

                            TextFile = `./logs/[LOGS] ${d.getMonth()}-${d.getDate()}-${d.getFullYear()}.txt`
                            File = await fs.createWriteStream(TextFile, "utf8")

                            fs.appendFile(TextFile, `LOGS FOR DATE: ${d.getMonth()}-${d.getDate()}-${d.getFullYear()}\n`)
                            message.channel.send("TextFile Path: `" + TextFile + "`")
                            break

                        case false:
                            message.reply("Done recording.")
                            message.channel.send(`Messages recorded: ${RecordedMessages}`)
                            message.channel.send("TextFile Path: `" + TextFile + "`")

                            RecordedMessages = 0
                            TextFile = null
                            File = null
                            break
                    }
                }
                break

            // yo mama
            case "yomama":
                let str = YoMama()

                message.channel.send(str)
                break

            // sniperole
            case "sniperole":
                var allRoles = message.guild.roles.cache

                console.log("Sniping role...")
                allRoles.each(role => console.log(`${role.name} | ${role.id}`))

                break

            case "unbanall":
                if (message.author.id != Admin || message.author.id != Admin2) {return}
                console.log("unbanning all")

                try {
                    var unbans = await message.guild.fetchBans()

                    unbans.each(ban => {
                        var user = ban.user

                        console.log(`Unbanning: ${user.username}#${user.discriminator} | ${user.id}`)

                        message.guild.members.unban(user)
                    })
                } catch(error) {
                    console.log("Collection may have undefined.")
                    console.log(error)
                }

                break

            // serverrules
            case "serverrules":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (message.guild == 728459950468104284) {
                        message.reply("shut up. Go fuck yourself.")
                        return
                    }

                    for (let i = 0; i <= 15; i++) {
                        message.channel.send("https://cdn.discordapp.com/attachments/670667946540007464/713756471141335081/image0.gif")
                    }
                }

                break

            // serverstaff
            case "serverstaff":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (message.guild == 728459950468104284) {
                        message.reply("you don't want to get cancelled, right?")
                        return
                    }

                    for (let i = 0; i <= 15; i++) {
                        message.channel.send("https://cdn.discordapp.com/attachments/557327188311932959/713839493534449744/FUCKING_STOP_READING_MY_TITLES_YOU_TWAT.gif")
                    }
                }

                break

            // help
            case "help":
                if (message.guild == 728459950468104284) {
                    if (message.channel.nsfw == false) {
                        // message.reply("you're not supposed to use me here... <:LyricaYandere:731115553791672352>")
                        return
                    }
                }

                message.channel.send(display.help)
                break

            // nospamming
            case "nospamming":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (message.guild == 728459950468104284) {
                        message.reply("don't.")
                        return
                    }

                    for (let i = 0; i <= 15; i++) {
                        message.channel.send("https://media1.tenor.com/images/51bf86a65720d6f8184bb3c5e032a5be/tenor.gif?itemid=14805929")
                    }
                }
                break

            // messagecase
            case "msg":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (args.length > 0) {
						let str = args.join(' ')

                        console.log(str)
                        message.channel.send(str)
                    }
                }
                break
                // spam
            case "spam":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (args.length > 0) {
                        for (let i = 0; i <= 10; i++) {
                            let str = args.join(' ') + " "

                            message.channel.send(str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str)
                            await wait(.25)
                        }
                    }
                }
                break

                // ospam
            case "ospam":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (args.length > 0) {
                        for (let i = 0; i <= 10; i++) {
                            let str = args.join(' ') + " "

                            message.channel.send(str)
                            await wait(.25)
                        }
                    }
                }
                break

                // extract
            case "extract":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (message.guild == 728459950468104284) {
                        message.reply("no. NO. NO!!!")
                        return
                    }

                    message.channel.send("Preparing extraction...")
                    await wait(3)

                    for (let i = 0; i <= 10; i++) {
                        if (Reset == true) {
                            Reset = false
                            message.channel.send("I've reset.")
                            break
                        }

                        try {
                            var posts = await boorus['danb'].search(['rating:explicit'].concat(args), {
                                limit,
                                random
                            })
                        } catch (error) {
                            message.channel.send(error)
                            break
                        }

                        if (posts) {
                            var index = Math.floor(Math.random())
                            var post = posts[index]

                            if (post) {
                                var ToUrl = post.fileUrl
                                if (post.fileUrl == "undefined") {
                                    if (post.source != "undefined") {
                                        ToUrl = post.source 
                                    } else {
                                        // ignore 
                                        ToUrl = null
		                		    }
                                }

                              
                                if (ToUrl != null) {
                                    try {
                                        message.channel.send("", {
                                            embed: {
                                                color: 1811926,
                                                fields: [{
                                                    name: "Contents",
                                                    value: "**Tags**: `" + post.tags.join(', ') + "`\n**ID:** " + post.id + "\n**Score:** " + post.score + "\n**Source:** " + post.source + ""
                                                }],
                                                image: {
                                                    url: ToUrl
                                                },
                                                description: "If you like this bot, please donate to my [PayPal](https://paypal.me/CloroSphere)!",
                                                footer: {
                                                    text: "Created by CLORO (Twitter: @cloro_2nd)"
                                                }
                                            }
                                        })
                                    } catch (error) {
                                        message.channel.send(post.fileUrl || post.source)
                                    }
                                }
                            }
                        } else {
                            message.channel.send("No post found with tags:  " + args.join(" "))
                            break
                        }
                    }

                    message.channel.send("Extraction complete.")
                }
                break

                // 

                // rawextract
            case "rawextract":
                if (message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (message.guild == 728459950468104284) {
                        message.reply("no. NO. NO!!!")
                        return
                    }

                    message.channel.send("Preparing raw extraction...")
                    await wait(3)

                    for (let i = 0; i <= 10; i++) {
                        if (Reset == true) {
                            Reset = false
                            message.channel.send("I've reset.")
                            break
                        }

                        try {
                            var posts = await boorus['danb'].search(['rating:explicit'].concat(args), {
                                limit,
                                random
                            })
                        } catch (error) {
                            message.channel.send(error)
                            break
                        }

                       
   
                        if (ToUrl != null) {
                            if (posts) {
                                var index = Math.floor(Math.random())
                                var post = posts[index]

                                if (post) {
                                    try {
                                        if (message.guild == 728459950468104284) {
                                            var ltags = post.tags;

                                            if (ltags.includes("loli") || ltags.includes("shota") || ltags.includes("cub") || ltags.includes("lolicon") || ltags.includes("shotacon")) { } else {
                                                message.channel.send(post.fileUrl || post.source)
                                            }
                                        } else {
                                            message.channel.send(post.fileUrl || post.source)
                                        }
                                    } catch (error) {
                                        message.channel.send("An error occured. " + error)
                                    }
                                }
                            } else {
                                message.channel.send("No post found with tags: " + args.join(" "))
                                break
                            }
                        }
                    }

                    message.channel.send("Extraction complete.")
                }
                break

                // nuke
            case "nuke":
                if (isNuking == false && message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (message.guild == 728459950468104284) {
                        message.reply("no. NO. NO!!!")
                        return
                    }

                    isNuking = true

                    for (let i = 3; i > 0; i--) {
                        message.channel.send("Nuking in " + i + "...")
                        await wait(1)
                    }

                    for (let i = 0; i <= 50; i++) {
                        if (Reset == true) {
                            Reset = false
                            message.channel.send("I've reset.")
                            break
                        }

                        var posts = await boorus['gelb'].search(['rating:explicit'], {
                            limit,
                            random
                        })

                        if (posts) {
                            var index = Math.floor(Math.random())
                            var post = posts[index]

                            if (post) {
                                try {
                                    message.channel.send(post.fileUrl || post.source)
                                    /*
		                        message.channel.send("", {
                                files: [post.fileUrl || post.source]})*/
                                } catch {
                                    message.channel.send(post.fileUrl || post.source)
                                }
                            }
                        }
                    }

                    message.channel.send("Nuke ended.")
                    isNuking = false
                } else {
                    message.reply("there may be a nuke already ongoing or you're not CLORO.")
                }
                break

                // supernuke
            case "supernuke":
                if (isNuking == false && message.author.id == Admin || message.author.id == Admin2 || /*void*/ message.author.id == 240254307306307584) {
                    if (message.guild == 728459950468104284) {
                        message.reply("no. NO. NO!!!")
                        return
                    }

                    isNuking = true

                    for (let i = 5; i > 0; i--) {
                        message.channel.send("Super nuke activating in " + i + "...")
                        await wait(1)
                    }

                    for (let i = 0; i <= 50; i++) {
                        if (Reset == true) {
                            Reset = false
                            message.channel.send("I've reset.")
                            break
                        }

                        var posts = await boorus['r34'].search(['gay', 'rating:explicit'], {
                            limit,
                            random
                        })

                        if (posts) {
                            var index = Math.floor(Math.random())
                            var post = posts[index]

                            if (post) {
                                try {
                                    message.channel.send(post.fileUrl || post.source)
                                    /*
		                        message.channel.send("", {
                                files: [post.fileUrl || post.source]})*/
                                } catch {
                                    message.channel.send(post.fileUrl || post.source)
                                }
                            }
                        }
                    }

                    message.channel.send("Nuke ended.")
                    isNuking = false
                } else {
                    message.reply("there may be a nuke already ongoing or you're not CLORO.")
                }
                break

            case "reset":
                if (message.author.id == Admin || message.author.id == Admin2) {
                    Reset = true
                }
                break

                // server specifics
            case "klos":
                if (message.guild == 695909609524691004) {
                    message.channel.send({
                        files: ['https://cdn.discordapp.com/attachments/704364603395539035/704670852784062474/unknown.png']
                    })
                }
                break

            default:
                /*
                message.channel.send("<@" + message.author.id + "> Sorry, that isn't a command. Please type `" + Prefix + "help` for a list of commands.")*/
                break
        }
    }
})

//
client.on('ready', async function () {
    console.log("Runtime created")
})

//
client.login(auth.token)