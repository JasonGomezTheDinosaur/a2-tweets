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

	const lastTweetTime = allTweetTimes.at(0);
	const firstTweetTime = allTweetTimes.at(allTweetTimes.length - 1);

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


	let completedCount = 0
	let liveCount = 0;
	let achievementCount = 0;
	let miscCount = 0;

	tweet_array.forEach(tweet => {
		switch (tweet.source) {
			case 'completed_event': completedCount++; break;
			case 'live_event': liveCount++; break;
			case 'achievement': achievementCount++; break;
			default: miscCount++; break;
		}
	});

	let writtenCompletedCount = 0;

	tweet_array.forEach(tweet => {
		if (tweet.source === 'completed_event' && tweet.written) {
			writtenCompletedCount++;
		}
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	const completedPercentage = math.format((completedCount / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	const livePercentage = math.format((liveCount / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	const achievementPercentage = math.format((achievementCount / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	const miscPercentage = math.format((miscCount / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	const completedWrittenPercentage = math.format((writtenCompletedCount / completedCount) * 100, { notation: 'fixed', precision: 2 });





	document.getElementsByClassName('completedEvents')[0].innerText = completedCount;
	document.getElementsByClassName('liveEvents')[0].innerText = liveCount;
	document.getElementsByClassName('achievements')[0].innerText = achievementCount;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscCount;

	document.querySelector('.completedEventsPct').innerText = completedPercentage;
	document.querySelector('.liveEventsPct').innerText = livePercentage;
	document.querySelector('.achievementsPct').innerText = achievementPercentage;
	document.querySelector('.miscellaneousPct').innerText = miscPercentage;

	document.querySelector('.completedEventsPct').textContent = completedPercentage + '%';
	document.querySelector('.liveEventsPct').textContent = livePercentage + '%';
	document.querySelector('.achievementsPct').textContent = achievementPercentage + '%';
	document.querySelector('.miscellaneousPct').textContent = miscPercentage + '%';


	document.getElementsByClassName('completedEvents')[1].textContent = completedCount;
	document.querySelector('.written').textContent = writtenCompletedCount;
	document.querySelector('.writtenPct').textContent = completedWrittenPercentage + '%';


	console.log("=== DEBUG ===");
	console.log("completedCount:", completedCount);
	console.log("completedPct:", completedPercentage);
	console.log("Element found:", document.querySelector('.completedEventsPct'));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});