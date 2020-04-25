const Discord = require('discord.js');
const Allbooru = require('Booru');

const logger = require('winston');
const auth = require('./auth.json');

const Admin = 295544075237588992
const client = new Discord.Client();
//
const prefix = "kr!";
const Prefix = prefix;
//
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, 
{
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
async function attsea(channel, site, tags, limit = 1, random = true)
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
            channel.send("`" + error + "`")    
		    return
		}

		const index = Math.floor(Math.random())
		const post = posts[index]
		
        if (post)
        {
		    channel.send("", {
                embed: {
                    color: 1811926,
                    fields: [
                       {
                            name: "Contents",
                            value: "**Tags**: `" + post.tags.join(', ') + "`\n**ID:** " + post.id + "\n**Score:** " + post.score + "\n**Source:** "+ post.source + "" 
					   }
					],
                    image: {url: post.fileUrl || post.source},
                    description: "If you like this bot, please donate to my [PayPal](https://paypal.me/CloroSphere)!",
                    footer: {
                        text: "Created by CLORO (Twitter: @cloro_2nd)"           
					}
				}
            })    
        }
        else
        {
            channel.send("`Sorry, could not find a post with the following tags: [" + tags.join(", ") + "]`")
		}
	}
	else
	{
		channel.send("No such site with alias: " + site)
	}
}
//
client.on('message', async function(message) {
   if (!message.content.startsWith(prefix)) {return} else
   {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];
       
    args = args.splice(1);
    // check if site
    var ifSite = boorus[cmd]
    if (ifSite)
    {  
        if (message.channel.nsfw == true || message.author.id == Admin)
        {
            attsea(message.channel, cmd, args)

            return   
	    }
        else
        {
           message.channel.send("This channel doesn't have NSFW enabled!")
	    }
    }

    const limit = 1
    const random = true
    switch(cmd) 
    {
        // help
        case "help":
            message.channel.send("**Kuroro by CLORO**\n**Prefix**: `" + Prefix + "` **[UNCHANGEABLE]**\nI am a bot that gives you randomized NSFW from the Booru kingdom.\n\n`danb [tags]` - danbooru.donmai.us [can only support 1 tag!]\n`gelb [tags]` - gelbooru.com\n`e621 [tags]` - e621.net\n`e926 [tags] - e926.net`\n`hypno [tags]` - hypnohub.net\n`konac [tags]` - konachan.com\n`yandere [tags]` - yande.re\n`r34 [tags]` - rule34.xxx\n`xbooru [tags]` - xbooru.com\n`loli [tags]` - lolibooru.moe\n`r34pa [tags]` - rule34.paheal.net\n`derp [tags]` - derpibooru.org\n`fur [tags]` - furry.booru.org\n`real [tags]` - realbooru.com\n`xbo [tags]` - xbooru\n\nPlease donate to my PayPal to keep this bot up and running:\nhttps://paypal.me/CloroSphere")
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