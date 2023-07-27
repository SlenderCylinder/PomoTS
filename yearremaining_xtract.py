import tweepy

auth = tweepy.OAuth2BearerHandler("AAAAAAAAAAAAAAAAAAAAAG9gmgEAAAAAD9ZI2liksJDvHMFC8mzv%2FoPFPPw%3Db1m3APslf9WTCkfQh2fVRUQlE7ZzSZpMWh9jyDpwjCObujHmwq")
api = tweepy.API(auth, wait_on_rate_limit=True) 
items = tweepy.Cursor(api.user_timeline, screen_name='year_remaining', count=2).items(1)

for item in items:
    print(item.text)