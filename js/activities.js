function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const activityCounts = tweet_array.reduce((counts, tweet) => {
		const activity = tweet.activityType;
		if (activity && activity !== "unknown") {  // not a string of digits
			counts[activity] = (counts[activity] || 0) + 1;
		}
		return counts;
	}, {});

	const activityCountArray = Object.keys(activityCounts).map(activity => ({ // convert to an array
		activity: activity,
		count: activityCounts[activity]
	}));

	const activitiesWithDistance = {};

	tweet_array.forEach(tweet => {
		const activity = tweet.activityType;
		const distance = tweet.distance;

		if (activity && activity !== "unknown" && distance > 0) {
			if (!activitiesWithDistance[activity]) {
				activitiesWithDistance[activity] = {
					count: 0,
					totalDistance: 0
				};
			}
			activitiesWithDistance[activity].count++;
			activitiesWithDistance[activity].totalDistance += distance;
		}
	});

	const distanceActivityArray = Object.keys(activitiesWithDistance).map(activity => ({
		activity: activity,
		count: activitiesWithDistance[activity].count,
		avgDistance: activitiesWithDistance[activity].totalDistance / activitiesWithDistance[activity].count
	}));

	const topActivities = distanceActivityArray
		.sort((a, b) => b.count - a.count)
		.slice(0, 3)
		.map(item => item.activity);


	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const distanceArray = [];

	tweet_array.forEach(tweet => {
		const activity = tweet.activityType;
		const distance = tweet.distance;

		if (topActivities.includes(activity) && distance > 0 && activity !== "unknown") { //if activity is in top 3 + distance > 0 + activity is NOT unknown
			const dayOfWeek = tweet.time.getDay();  // sets day of the week to a value from 0-6
			const dayName = days[dayOfWeek];

			distanceArray.push({
				activity: activity,
				day: dayName,
				distance: distance,
				date: tweet.time.toISOString().split('T')[0],
				shortDay: dayName.substring(0, 3) //abbreviates to 3 letters, like mon or tue
			});
		}
	})


	const distancePoints = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance by Day of Week (Individual Points)",
		"data": {
			"values": distanceArray
		},
		"mark": {
			"type": "point",
			"size": 60,
			"opacity": 0.6 // point transparency
		},
		"encoding": {
			"x": {
				"field": "shortDay",
				"type": "ordinal",
				"title": "Day of Week",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				    "axis": {
        "grid": true  // ← Adds vertical grid lines
    }

			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"title": "Distance"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity Type"
			},
		}
	};

	const distancePointsAggr = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance by Day of Week (Individual Points)",
		"data": {
			"values": distanceArray
		},
		"mark": {
			"type": "point",
			"size": 60,
			"opacity": 0.6 // point transparency
		},
		"encoding": {
			"x": {
				"field": "shortDay",
				"type": "ordinal",
				"title": "Day of Week",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				    "axis": {
        "grid": true  // ← Adds vertical grid lines
    }

			},
			"y": {
				"aggregate": "mean",
				"field": "distance",
				"type": "quantitative",
				"title": "Mean of Distance"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity Type"
			},
		}
	};


	const activityCount = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Number of Tweets by Activity Type",
		"data": {
			"values": activityCountArray
		},
		"mark": "bar",  //bar type of mark
		"encoding": {
			"x": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity Type",
				"sort": "-y"  //descending order instead of +y for ascending
			},
			"y": {
				"field": "count",
				"type": "quantitative",
				"title": "Number of Tweets"
			}
		}
	};

	vegaEmbed('#activityVis', activityCount, { actions: false });
	vegaEmbed('#distanceVis', distancePoints, { actions: false });



	const aggregateButton = document.getElementById('aggregate');
	let showingAggregated = false;

	if (aggregateButton) {
		aggregateButton.addEventListener('click', function () {
			if (showingAggregated) {
				vegaEmbed('#distanceVis', distancePoints, { actions: false });
				aggregateButton.textContent = "Show means";

			} else {
				vegaEmbed('#distanceVis', distancePointsAggr, { actions: false });
				aggregateButton.textContent = "Show all activities";

			}
			showingAggregated = !showingAggregated;
		});
	}




};
//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
//Use those visualizations to answer the questions about which activities tended to be longest and when.




//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});