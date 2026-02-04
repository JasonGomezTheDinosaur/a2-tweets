function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}






	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const allTweetTimes = tweet_array.map(tweet => tweet.time);

	const firstTweetTime = allTweetTimes.at(0);
	const lastTweetTime = allTweetTimes.at(allTweetTimes.length - 1);

	const earliestDate = firstTweetTime.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

const latestDate = lastTweetTime.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const firstTweetDateSpan = document.getElementById('firstDate');
	const lastTweetDateSpan = document.getElementById('lastDate');


	
	firstTweetDateSpan.textContent = earliestDate;
	lastTweetDateSpan.textContent = latestDate;
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});