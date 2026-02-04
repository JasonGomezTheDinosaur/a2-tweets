class Tweet {
    private text: string;
    time: Date;

    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
    }

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'

    // Look for "completed" for complete event
    // look for word "watch" for live event
    // look for word "achieved" for achievement
    // anything not fitting into above is misc

    get source(): string {
        if (/completed/i.test(this.text)) {
            return "completed_event"
        }

        if (/watch/i.test(this.text)) {
            return "live_event"
        }

        if (/achieved/i.test(this.text)) {
            return "achievement"
        }

        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    // check if the tweet contains "@Runkeeper"
    // if yes, return false
    // else true

    get written(): boolean {
        if (/@Runkeeper/i.test(this.text)) {
            return false;
        }

        //TODO: identify whether the tweet is written
        return true;
    }

    get writtenText(): string {
        if (!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.text;
    }

    // use writtentext to look for the word after the words "mi" or "km"
    get activityType(): string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

                const match = this.text.match(/(\d+\.?\d*)\s*(km|mi)/i)

        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    // use writtentext to look for the num after the word "a"
    get distance(): number {
        if (this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance from the text of the tweet

        const match = this.text.match(/(\d+\.?\d*)\s*(km|mi)/i)

        if (match) {
            return Number(parseFloat(match[1]));
        }
       
        return 0;
    }

    getHTMLTableRow(rowNumber: number): string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}