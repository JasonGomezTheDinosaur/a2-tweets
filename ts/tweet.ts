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

        return true;
    }

    get writtenText(): string {
        if (!this.written) {
            return "";
        }
        return this.text;
    }

    get activityType(): string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        

        const distancePattern = /(?:completed a|posted a)\s+\d+\.?\d*\s*(?:km|mi)\s+(\w+)/i;
        const distanceMatch = this.text.match(distancePattern);
        if (distanceMatch && distanceMatch[1]) {
            return distanceMatch[1].charAt(0).toUpperCase() + distanceMatch[1].slice(1);
        }

        const generalPattern = /(?:completed a|posted a)\s+([a-zA-Z\s]+?)(?:\s+with|\s+in\s+\d|$)/i;
        const generalMatch = this.text.match(generalPattern);

        if (generalMatch && generalMatch[1]) {
            let activity = generalMatch[1].charAt(0).toUpperCase() + generalMatch[1].slice(1);

            activity = activity.replace(/\s+\d+.*$/, '');
            activity = activity.replace(/\s+workout$|\s+session$|\s+activity$/, '');

            if (activity) {
                return activity;
            }
        }
        return "unknown";
    }

    get distance(): number {
        if (this.source != 'completed_event') {
            return 0;
        }

        const match = this.text.match(/(\d+\.?\d*)\s*(km|mi)/i)

        if (match) {
            const num = parseFloat(match[1]);
            const unit = match[2].charAt(0).toUpperCase() + match[2].slice(1);
            if (unit === 'km') {
                return num * 0.621371;
            }
            return num
        }

        return 0;
    }

    getHTMLTableRow(rowNumber: number): string {

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