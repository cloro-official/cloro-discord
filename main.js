const Discord = require('discord.js');
const Allbooru = require('Booru');

const logger = require('winston');

const display = require('./display.json');
const auth = require('./auth.json');

const Admin = 295544075237588992
const Admin2 = 270831355775025152

const client = new Discord.Client();
//
const wait = (s) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000))
}

//
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
    "loli": Allbooru.forSite('lolibooru'),
    "r34pa": Allbooru.forSite('pa'),
    "derp": Allbooru.forSite('derpibooru'),
    "fur": Allbooru.forSite('fb'),
    "real": Allbooru.forSite('realbooru'),
    "xbo": Allbooru.forSite('xb')
}

// global function
async function attsea(channel, site, tags, limit = 1, random = true) {
    const ifres = boorus[site]

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
            channel.send("", {
                embed: {
                    color: 1811926,
                    fields: [{
                        name: "Contents",
                        value: "**Tags**: `" + post.tags.join(', ') + "`\n**ID:** " + post.id + "\n**Score:** " + post.score + "\n**Source:** " + post.source + ""
                    }],
                    image: {
                        url: post.fileUrl || post.source
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
client.on('message', async function(message) {
    if (!message.content.startsWith(prefix)) {
        return
    } else {
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
            }
        }

        const limit = 1
        const random = true
        // server specifics

        switch (cmd) {
            // help
            case "help":
                message.channel.send(display.help)
                break

                // nospamming
            case "nospamming":
                if (message.author.id == Admin || message.author.id == Admin2) {    
                    for (let i = 0; i <= 15; i++) {
                        message.channel.send("https://media1.tenor.com/images/51bf86a65720d6f8184bb3c5e032a5be/tenor.gif?itemid=14805929")
                    }
                }
                break

                // spam
            case "spam":
                if (message.guild == 695909609524691004 || message.author.id == Admin || message.author.id == Admin2) {
                    if (args.length > 0) {
                        for (let i = 0; i <= 10; i++) {
                            let str = args.join(' ') + " "

                            message.channel.send(str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str + str)
                            await wait(.25)
                        }
                    }
                }
                break

                // extract
            case "extract":
                if (message.author.id == Admin || message.author.id == Admin2) {
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
                                try {
                                    message.channel.send("", {
                                        embed: {
                                            color: 1811926,
                                            fields: [{
                                                name: "Contents",
                                                value: "**Tags**: `" + post.tags.join(', ') + "`\n**ID:** " + post.id + "\n**Score:** " + post.score + "\n**Source:** " + post.source + ""
                                            }],
                                            image: {
                                                url: post.fileUrl || post.source
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
                        } else {
                            message.channel.send("No post found with tags:  " + args.join(" "))
                            break
                        }
                    }

                    message.channel.send("Extraction complete.")
                }
                break

                // nuke
            case "nuke":
                if (isNuking == false && message.author.id == Admin || message.author.id == Admin2) {
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

                        var posts = await boorus['danb'].search(['rating:explicit'], {
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

                // nuke
            case "supernuke":
                if (isNuking == false && message.author.id == Admin || message.author.id == Admin2) {
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
                message.channel.send("<@" + message.author.id + "> Sorry, that isn't a command. Please type `" + Prefix + "help` for a list of commands.")
                break
        }
    }
})

//
client.on('ready', async function() {
    logger.info('[CLORO] Connected')
})

//
client.login(auth.token)