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
        if (/completed/i.test(this.text) || /posted/i.test(this.text)) {
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
        if (/Check it out!/i.test(this.text)) {
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

    get activityType(): string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        const pattern = /(?:completed a|posted a)\s+\d+\.?\d*\s*(?:km|mi)\s+(\w+)/i;
        const match = this.text.match(pattern);
        if (match && match[1]) {
            return match[1].charAt(0).toUpperCase() + match[1].slice(1);
        }

        //TODO: parse the activity type from the text of the tweet
        return "unknown";
    }

    get distance(): number {
        if (this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance from the text of the tweet

        const match = this.text.match(/(\d+\.?\d*)\s*(km|mi)/i)

        if (match) {
            const num = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            if (unit === 'km') {
                return num * 0.621371;
            }
            return num
        }

        return 0;
    }

    getHTMLTableRow(rowNumber: number): string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity

        const urlMatch = this.text.match(/https?:\/\/[^\s]+/i);
        let url = '#';

        if (urlMatch) {
            url = urlMatch[0];
        }

        // determines what to display form tweet, and shortens it with ... if it's too long
        let beforeUrl = this.text;
        let afterUrl = '';

        if (urlMatch) {
            url = urlMatch[0];
            const urlIndex = this.text.indexOf(url);
            beforeUrl = this.text.substring(0, urlIndex).trim();
            afterUrl = this.text.substring(urlIndex + url.length).trim();

            const maxLength = 100;
            if (beforeUrl.length > maxLength) {
                beforeUrl = beforeUrl.substring(0, maxLength) + '...';
            }
        }

        // creates a clickable link

        let linkText;
        if (url !== '#') {
            linkText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        }

        const fullDisplay = `${beforeUrl} ${linkText} ${afterUrl}`;
        // uses rowNumber to create unique ID's and add row number column
        const rowHTML = `
        <tr id="tweet-row-${rowNumber}">
            <td>${rowNumber + 1}</td>
            <td>${this.activityType}</td>
            <td>${fullDisplay}</td>
        </tr>
    `;

        return rowHTML;
    }
}