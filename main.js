const Discord = require('discord.io');
const Danbooru = require('danbooru');
const Allbooru = require('booru');
const _u = require('underscore')

const logger = require('winston');
const auth = require('./auth.json');


logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, 
{
    colorize: true
});
logger.level = 'debug';

const bot = new Discord.Client(
{
   token: auth.token,
   autorun: true
});

const booru = new Danbooru()

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
async function attsea(site, tags, channel, limit = 1, random = true)
{
	const ifres = boorus[site]
    var tags = tags.concat("rating:explicit")
	if (ifres)
	{	
        var posts = null
        try 
        {
            posts =  await ifres.search(tags, {limit, random})
		}
        catch(error)
        {
            bot.sendMessage({
                to: channel,
                message: "`" + error + "`"
            })    
		    return
		}

		const index = Math.floor(Math.random())
		const post = posts[index]
		
        if (post)
        {
		    bot.sendMessage({
			    to: channel,
			    message: "`id: " + post.id + "`\n`tags: [" + post.tags.join(", ") + "]`\n`rating: " + post.rating  + "` `score: " + post.score + "`\n" + post.fileUrl  
		    })
        }
        else
        {
            bot.sendMessage({
			    to: channel,
			    message: "Sorry, could not find a post with the following tags: [" + tags.join(", ") + "] "   
		    })
		}
	}
	else
	{
		bot.sendMessage({
			to: channel,
			message: "No such site with alias: " + site
		})
	}
}

//
bot.on('ready', async function (evt) 
{
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

var Prefix = "~"
bot.on('message', async function (user, userID, channelID, message, evt) 
{
    if (message.substring(0, 1) == Prefix) 
    {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        // check if site
        var ifSite = boorus[cmd]
        if (ifSite)
        {
        	attsea(cmd, args, channelID)

        	return
        }

        const limit = 1
        const random = true
        switch(cmd) 
        {
            // help
            case "help":
                bot.sendMessage({
                    to: channelID,
                    message: "**CLORO**\n**Prefix**: `" + Prefix + "` **[UNCHANGEABLE]**\nI am a bot that gives you randomized NSFW from the Booru kingdom.\n\n`danb [tags]` - danbooru.donmai.us [can only support 1 tag!]\n`gelb [tags]` - gelbooru.com\n`e621 [tags]` - e621.net\n`e926 [tags] - e926.net`\n`hypno [tags]` - hypnohub.net\n`konac [tags]` - konachan.com\n`yandere [tags]` - yande.re\n`r34 [tags]` - rule34.xxx\n`xbooru [tags]` - xbooru.com\n`loli [tags]` - lolibooru.moe\n`r34pa [tags]` - rule34.paheal.net\n`derp [tags]` - derpibooru.org\n`fur [tags]` - furry.booru.org\n`real [tags]` - realbooru.com\n`xbo [tags]` - xbooru"
		        })
            break
            
            // default
            default:
                bot.sendMessage({
                    to: channelID,
                    message: "<@" + userID + "> Sorry, that isn't a command. Please type `" + prefix + "help` for a list of commands."
		        })
            break
         }
     }
     else if (message.indexOf("<@!" + bot.id + ">") != -1) 
     {
        bot.sendMessage({
            to: channelID,
            message :"Hi there! Please type `" + prefix + "help` for a list of commands."
		})
	 }
});

// init
bot.setPresence({
    idle_since: Date.now(),
    game: "https://paypal.me/CloroSphere"
})