const { WebClient } = require('@slack/web-api');

//Below is the Slack token for the Building block Demo
const token = "<YOUR_SLACK_BOT_TOKEN>";

// ChannelId from Building Block Demo
const channel = '<YOUR_SLACK_CHANNEL>';

const web = new WebClient(token);

module.exports = {
    sendMessage: function (message) {
        (async () => {
            // See: https://api.slack.com/methods/chat.postMessage
            const res = await web.chat.postMessage({ channel: channel, text: message });
            //const res = await web.channels.list

            // `res` contains information about the posted message
            console.log('Message sent: ', res.ts);
        })();    }
};

