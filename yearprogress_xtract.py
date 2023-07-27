import tweepy

auth = tweepy.OAuth2BearerHandler("AAAAAAAAAAAAAAAAAAAAAG9gmgEAAAAAD9ZI2liksJDvHMFC8mzv%2FoPFPPw%3Db1m3APslf9WTCkfQh2fVRUQlE7ZzSZpMWh9jyDpwjCObujHmwq")
api = tweepy.API(auth, wait_on_rate_limit=True) 
items = tweepy.Cursor(api.user_timeline, screen_name='progressbar202_', count=2).items(1)

for item in items:
    media = item.entities.get('media', [])
    if len(media) > 0:
        image_url = media[0]['media_url']
        tweet_text = item.text
        tweet_text = tweet_text.split('https://t.co/')[0] # Extract only the text before the URL
        print(f"{tweet_text}\n{image_url}")
        