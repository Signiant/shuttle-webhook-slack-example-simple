require('dotenv').config({path: './.env.dev'})
const express = require('express');
// const bodyParser = require('body-parser');
const prettyBytes = require('pretty-bytes')
const slackUtils = require('@slack/web-api');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}))
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

app.post('/event', (req, res) => {
    console.log(JSON.stringify(req.body, null, 4));
    let transferObj = JSON.parse(JSON.stringify(req.body, null, 4));

    let message = "";
    let filenames = "";
    let direction = "";
    let user = transferObj.payload.userEmail;
    let basePath = "";
    let size = 0;

    if (transferObj.eventType === "package.upload.complete" || transferObj.eventType === "package.download.complete") {
        basePath = transferObj.payload.portalDetails.storage[0].configuration.repositoryPath;
        let firstOne = true;
        transferObj.payload.packageDetails.files.forEach(filename => {
            if (firstOne) {
                if (basePath) {
                    filenames += basePath + "/" + filename.path + " (" + prettyBytes(filename.size) + ")";
                }
                else {
                    filenames += filename.path + " (" + prettyBytes(filename.size) + ")";
                }
                firstOne = false;
            }
            else {
                if (basePath) {
                    filenames += "\n" + basePath + "/" + filename.path + " (" + prettyBytes(filename.size) + ")";
                }
                else {
                    filenames += "\n" + filename.path + " (" + prettyBytes(filename.size) + ")";
                }
            }
//            console.log(filename.path);
        });

        let direction = "";

        if (transferObj.eventType === "package.upload.complete") {
            direction = "uploaded";
        }
        else if (transferObj.eventType === "package.download.complete") {
            direction = "downloaded";
        }
        let message = "The following files have been " + direction + " by " + user + ":\n" + filenames;
        slackUtils.sendMessage(message);
    }
    else {
        if (transferObj.eventType === "file.delete.complete") {
            let firstOne = true;
            transferObj.payload.sources.forEach(source => {
                if (firstOne) {
                    filenames += source.filePath;
                    firstOne = false;
                }
                else {
                    filenames += "\n" + source.filePath;
                }
//            console.log(filename.path);
            });
//            filenames = transferObj.payload.sources[0].filePath;
            let message = "The following files have been deleted by " + user + ":\n" + filenames;

            slackUtils.sendMessage(message);
        }
    }
    res.sendStatus(200);
});


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
    //slackUtils.sendMessage("Testing");
})



// const convertBytes = function(bytes) {
//     const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

//     if (bytes == 0) {
//         return "n/a"
//     }

//     const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

//     if (i == 0) {
//         return bytes + " " + sizes[i]
//     }

//     return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
// }