
let writtenTweets = [];
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	writtenTweets = runkeeper_tweets.filter(tweet => tweet.written);

}


function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	const filteredTweets = writtenTweets.filter(tweet => {
		return tweet.text.toLowerCase().includes(searchText.toLowerCase());
	});

	searchInput.addEventListener('input', function (event) {
		const searchText = event.target.value;

		const filteredTweets = writtenTweets.filter(tweet => {
			return tweet.text.toLowerCase().includes(searchText.toLowerCase());
		});

		tableBody.innerHTML = ''; // to clear the table

		filteredTweets.forEach((tweet, index) => {
			tableBody.innerHTML += tweet.getHTMLTableRow(index);
		});
	});



}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});