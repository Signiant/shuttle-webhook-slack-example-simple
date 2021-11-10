require('dotenv').config({path: './.env.dev'})
const serverless = require('serverless-http')
const express = require('express');
const prettyBytes = require('pretty-bytes');
const slackUtils = require('@slack/web-api');
const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const PORT = 8080

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

const sendMessage = async message => {
    // See: https://api.slack.com/methods/chat.postMessage
        const slackWebClient = new slackUtils.WebClient(SLACK_OAUTH_TOKEN)
        const response = await slackWebClient.chat.postMessage({ channel: SLACK_CHANNEL, text: message });
        console.log('Message sent: ', response);
        return response
    }

app.post('/event', async (req, res) => {
    let transferEvent = req.body
    let filenames = "";
    let direction = "";
    let userEmail = transferEvent.payload.userEmail;
    // optionaly add a base path value to enumerate a storage path in your message
    let basePath = "";

    if (transferEvent.eventType === "package.upload.complete" || 
        transferEvent.eventType === "package.download.complete") {
        basePath = transferEvent.payload.portalDetails.storage[0].configuration.repositoryPath;
        let firstFile = true;
        transferEvent.payload.packageDetails.files.forEach(filename => {
            if (firstFile) {
                if (basePath) {
                    filenames += basePath + "/" + filename.path + " (" + prettyBytes(filename.size) + ")";
                }
                else {
                    filenames += filename.path + " (" + prettyBytes(filename.size) + ")";
                }
                firstFile = false;
            }
            else {
                if (basePath) {
                    filenames += "\n" + basePath + "/" + filename.path + " (" + prettyBytes(filename.size) + ")";
                }
                else {
                    filenames += "\n" + filename.path + " (" + prettyBytes(filename.size) + ")";
                }
            }
        });

        if (transferEvent.eventType === "package.upload.complete") {
            direction = "uploaded";
        }
        else if (transferEvent.eventType === "package.download.complete") {
            direction = "downloaded";
        }

        let message = "The following files have been " + direction + " by " + userEmail + ":\n" + filenames;
        await sendMessage(message);
    }
    
    if (transferEvent.eventType === "file.delete.complete") {
            let firstFile = true;
            transferEvent.payload.sources.forEach(source => {
                if (firstFile) {
                    filenames += source.filePath;
                    firstFile = false;
                }
                else {
                    filenames += "\n" + source.filePath;
                }
            });
            let message = "The following files have been deleted by " + userEmail + ":\n" + filenames;
            await sendMessage(message);
    }
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Listening on:`, PORT));

// module.exports.handler = serverless(app);
const handler = serverless(app)
module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result
};
