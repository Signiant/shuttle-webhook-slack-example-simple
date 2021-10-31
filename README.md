# Connecting Media Shuttle with Slack
Signiant has a rich set of REST API’s allowing integration with Signiant products. Media Shuttle REST API supports a Webhook concept – essentially a user-defined HTTP callback that allows for a web backend to call out to an HTTP service based on some event or system-related action. In this case, we focus on “File Transfer” events. It’s possible for errors to occur during a transfer and we will present a simple mechanism for handling an error condition; the emphasis here will be on sending Slack notifications upon a successful transfer. Slack also has a rich REST API to interact with. The code example(s) will be in the form of JavaScript, specifically in the context of Node.s.

## Setting Up A Slack Application

Start by obtaining a Slack API token. There are a few different types of Slack tokens. https://api.slack.com/authentication/token-types. In this example we use a [“bot user token” https://api.slack.com/authentication/token-types since we will effectively be operating as a bot to send notifications based on an upload complete webhook callback from Media Shuttle.

1. Obtain the bot user token by defining a new Slack https://api.slack.com/apps application and click on CREATE NEW APP.
2. Fill in the APP NAME field and choose a DEVELOPMENT SLACK WORKSPACE from the dropdown list. *Note that you may need to sign in to Slack to get to the proper Workspace.*
3. Click the CREATE APP.
4. In the BUILDING APPS FOR SLACK window, click the BOTS box.
5. The next window is to assign scopes to the bot token. Click REVIEW SCOPES TO ADD.
6. Select the following and click ADD AN OAUTH SCOPE after selecting each one.

`
chat:write:customize
chat:write
chat:write:public
`

7. Under OAUTH TOKENS & REDIRECT URLS at the top of the page, click INSTALL TO WORKSPACE.
8. You may be prompted for access permissions. Click the ALLOW button.
9. Copy the BOT USER OAUTH ACCESS TOKEN. This access token is used later to send a message from the node.js application.
10. If you haven’t done so, create a channel in the Slack workspace to send notification messages. For example: “notify-test”. Now let’s turn our attention to Setting up a Media Shuttle Webhook. 

## Setting up a Media Shuttle Webhook

In this section, we use the Signiant Media Shuttle API to obtain a list of available portals and their detailed information and install a webhook (subscription) to
monitor transfers related to that portal. *NOTE: This tutorial assumes an already configured Media Shuttle account https://developer.signiant.com/media-shuttle/getting-started.html*

Reference Get Started with Media Shuttle API https://developer.signiant.com/media-shuttle/getting-started.html instructions for additional information.

1. Authenticate with the Signiant Media Shuttle API, by retrieving your API key from the Media Shuttle administrative interface. 
2. Make a copy of your API key. Reference what is in the “Authentication” section in the Get Started Guide.
Note: In API calles set the Authorization in the Header to the value of the API Key
4. Now let’s issue our first Media Shuttle API call to obtain detailed portal
information with curl:
curl -X GET
“https://api.mediashuttle.com/v1/portals?url=<your_portal_name>.mediashuttle.com”
-H “accept: application/json” -H “Authorization: <YOUR_API_KEY>”


5. Sample response:

```
{
    “items”: [
        {
            “id”:”0824e-d1ea-abcd-a122-2210555061234”,
            “name”:”Test Portal”,
            “url”:”myportalname.mediashuttle.com”,
            “type”:”Submit”,
            “createdOn”:”2021-01-28T01:49:02.924Z”,
            “lastModifiedOn”:”2021-01-28T01:50:00.739Z”,
            “authentication”:{
                “mediaShuttle”:true,
                “saml”:false
            },
            “linkAuthentication”:{
            },
            “notifyMembers”:true
        }
    ]
}
```

Note the information returned regarding the portal of interest:
```
“id”:”0824e-d1ea-abcd-a122-2210555061234”,
“name”:”Test Portal”,
“url”:”myportalname.mediashuttle.com”,
```
The value of the ***id*** key is how we reference this portal in order to install a transfer subscription.


8. Before installing the webhook, it is important to note that the Media Shuttle
control plane hosted externally must have a public route to the node.js web
application that will be created below. Depending on the environment, this may
include the need for port mapping which is beyond the scope of this document.
In the example below, the application hosting the webhook will be my-test.
signiant.com on port 8081 (my-test.signiant.com:8081). Update the hostname
and port to match your own environment.
In the node.js code used, we define a service endpoint of /TransferUpdate
resulting in the following URL endpoint to use in the call to install the webhook:
http://my-test.signiant.com:8081/TransferUpdate
9. Issue the following curl command to install the webhook.
curl -X POST
“https://api.mediashuttle.com/v1/portals/<YOUR\_PORTAL\_ID>/subscription
s” -H “accept: application/json” -H “Authorization: <YOUR\_API\_KEY>” -H
“Content-Type: application/json” -d
“{\”type\”:\”webhook\”,\”details\”:{\”url\”:\”http://my-test.signiant.com:8081/
TransferUpdate\”}}”
Note: Substitute <YOUR\_PORTAL\_ID> with your portal id and <YOUR\_API\_KEY>
with your API key and my-test.signiant.com with the public IP address of the
machine which will be hosting the node.js application discussed above.
10. If successful, you should get a response similar to the following:
```
{
    “id”: “728d13e2-1ae9-4ced-a64d-064363985866”,
    “type”: “webhook”,
    “details”: {
        “url”: “http://my-test.signiant.com:8081/TransferUpdate”
    }
}
```

Now we’re ready to have a look at the node.js application to service our transfer
operation webhook.

11. Ensure a proper version of the Node.js runtime and NPM is already installed.
12. Download the source code and dependencies for the building block Webhook
Server from the following location:
<INSERT DOWNLOAD LOCATION HERE>
This node.js application uses the following external packages: Express, Body-
Parser, and @slack/web-api.
13. Make adjustments to the Javascript code to match your environment. If you
encounter runtime reference errors, you may need to run the following
commands to ensure the external packages listed above are installed properly:
npm install express
npm install body-parser
npm install @slack/web-api
Note: Although the Slack REST API could be used directly, for this example we will be using the Node Slack SDK @slack/web-api.
The code you’ll need to modify is in a single JavaScript source file:
Slackutils.js.
➜ꢀ All other supporting source files should not need to be modified unless
choosing to do so. For example, to change routing.
➜ꢀ Additionally, although nothing needs to be changed in the server.js file, a
few code snippets contained therein are referenced.
15. SlackUtils.js. There are only two lines of code to change here.
16. First, change the “token” constant to the Slack Bot token value obtained from the
Slack configuration at the beginning of this guide.
17. Second, change the “channel” constant to the Slack channel’s name the
notifications should be sent to. Don’t forget to add the # at the beginning of the
channel name. See the code snippets below:


//Below is the Slack token for the Building block Demo
const token = “<YOUR\_SLACK\_BOT\_TOKEN>”;
// ChannelId from Building Block Demo
const channel = ‘<YOUR\_SLACK\_CHANNEL>’;
The SlackUtils.js file really has only a single function in it which simply calls the
Slack API postMessage function to send the message passed in as a parameter:
sendMessage: function (message) {
    (async () => {
    // See: https://api.slack.com/methods/chat.postMessage
const res = await web.chat.postMessage({ channel: channel,
text: message });

// `res` contains information about the posted message
console.log(‘Message sent: ‘, res.ts);
})();}

18. Now let’s have a look at the server.js file. This is where the meat of the webhook
processing is done.
19. First, we use Express to provide the web server functionality and listens on port
8081:
12 | +1 781.221.4051
| WWW.SIGNIANT.COM https://www.signiant.com/?cc=ss-bb-ms-slack


var server = app.listen(8081, function () {
    var host = server.address().address
var port = server.address().port
console.log(“Example app listening at http://%s:%s”, host,
port
}
In this setup, when a file action such as a transfer occurs on the monitored portal,
an HTTP POST is issued to the url specified when the webhook was installed IE:
http://my-test.signiant.com:8081/TransferUpdate
The details behind how this HTTP POST is handled may be seen in the code
section that starts with:
app.post(‘/TransferUpdate’,…
20. You can inspect the details here. As you can see, we evaluate the payload to
formulate a message to send to Slack, mostly focusing on Upload Complete,
Download Complete, and Deleted event types.
Also note the code handles the case where there are multiple files involved.
The variable “message” contains the final result of the Slack message that will be
sent.
For example the following is a code snippet that shows a portion of how the final
message is created:

```
if (transferObj.eventType === “package.upload.complete” || transferObj.eventType === “package.download.complete”) {
    basePath =transferObj.payload.portalDetails.storage[0].configuration.repositoryPath;
    let firstOne = true;
    transferObj.payload.packageDetails.files.forEach(filename =>
        {
            if (firstOne) {
                if (basePath) {
                    filenames += basePath + “/” + filename.path + “(“ + convertBytes(filename.size) + “)”;
                }
            else {
                filenames += filename.path + “ (“ + convertBytes(filename.size) + “)”;
            }
            firstOne = false;
            }
            else {
                if (basePath) {
                    filenames += “\n” + basePath + “/” + filename.path + “ (“ + convertBytes(filename.size) + “)”;
                }
            else {
                filenames += “\n” + filename.path + “ (“ + convertBytes(filename.size) + “)”;
            }
        }
    });
let direction = “”;
if (transferObj.eventType === “package.upload.complete”) {
    direction = “uploaded”;
}
else if (transferObj.eventType === “package.download.complete”) {
    direction = “downloaded”;
}
let message = “The following files have been “ + direction + “ by “ + user + “:\n” + filenames;
slackUtils.sendMessage(message);
```
22. After making the changes mentioned above, we are ready to run the application.
This may be done with the following command:

`
Node server.js
`

Properly done, a Slack message is sent when a Media Shuttle file action is
performed.