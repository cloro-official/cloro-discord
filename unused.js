// JavaScript source code
 /*/ 
            danbooru
            case 'danb':
                const post = booru.posts({ tags: 'rating:explicit ' + args.join(' ')}).then(posts => {
                  const index = Math.floor(Math.random() * posts.length)
                  var post = posts[index]

                  if (post != null)
                  {
                    bot.sendMessage({
                        to: channelID,
                        message: "https://danbooru.donmai.us/posts/" + post,
                    })
                  }
                  else
                  {
                    bot.sendMessage({
                        to: channelID,
                        message: "Sorry, no post found with tags: " + args.join(' ')
                    })
                    
				  }
                })
            break
            *///
            /*/ nuke
            case "nuke":
                logger.info(userID)
                if (userID == 295544075237588992)
                {
                    isNuking = !isNuking
                    
                    switch (isNuking)
                    {
                        case true:
                            for (i = 0; i >= 30; i++)
                            {
                                const index = _u.sample(boorus)    
                                var site = boorus[index]

                                await attsea(site, ['sex'], channelID)
							}

                            isNuking = false
                        break
                        case false:
                            
                        break
					}
                }
            break
            // random
            case "random":
                 var site = _u.sample(boorus)    

                 const post = await site.search(['rating:explicit'], {limit, random})
                 bot.sendMessage({
                    to: channelID,
                    message: post.fileUrl
                 })
            break*/