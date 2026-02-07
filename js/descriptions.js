
let tweet_array = [];
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: Filter to just the written tweets
	writtenTweets = tweet_array.filter(tweet => tweet.written);

}


function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchInput = document.getElementById('textFilter');
	const tableBody = document.getElementById('tweetTable');
	const searchCountVar = document.getElementById('searchCount');
	const searchTextVar = document.getElementById('searchText');



	searchInput.addEventListener('input', function (event) {
		const searchText = event.target.value;

		const filteredTweets = writtenTweets.filter(tweet => {
			return tweet.text.toLowerCase().includes(searchText.toLowerCase());
		});


		searchCountVar.textContent = filteredTweets.length;
		searchTextVar.textContent = searchText;

		tableBody.innerHTML = ''; // to clear the table


		let tableHTML = '';
		filteredTweets.forEach((tweet, index) => {
			tableHTML += tweet.getHTMLTableRow(index);
		});

		tableBody.innerHTML = tableHTML
	});

	searchInput.dispatchEvent(new Event('input'));



}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});