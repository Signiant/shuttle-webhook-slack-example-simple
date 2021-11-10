# Send Media Shuttle Events to Slack

Signiant has a rich set of REST API’s allowing integration with Signiant products. Media Shuttle REST API supports a Webhook concept – essentially a user-defined HTTP callback that allows for a web backend to call out to an HTTP service based on some event or system-related action. In this case, we focus on “File Transfer” events. It’s possible for errors to occur during a transfer and we will present a simple mechanism for handling an error condition; the emphasis here will be on sending Slack notifications upon a successful transfer. Slack also has a rich REST API to interact with. The code example(s) will be in the form of JavaScript, specifically in the context of Node.s.

## Setting Up A Slack Application

Start by obtaining a Slack API token. There are a few different types of Slack tokens. https://api.slack.com/authentication/token-types. In this example we use a [“bot user token” https://api.slack.com/authentication/token-types since we will effectively be operating as a bot to send notifications based on an upload complete webhook callback from Media Shuttle.

   Obtain the bot user token by defining a new Slack https://api.slack.com/apps application and click on CREATE NEW APP.
   
   Fill in the APP NAME field and choose a DEVELOPMENT SLACK WORKSPACE from the dropdown list. *Note that you may need to sign in to Slack to get to the proper Workspace.*
   
   Click the CREATE APP.
   
   In the BUILDING APPS FOR SLACK window, click the BOTS box.
   
   The next window is to assign scopes to the bot token. Click REVIEW SCOPES TO ADD.
   
   Select the following and click ADD AN OAUTH SCOPE after selecting each one.

```
chat:write:customize
chat:write
chat:write:public
```

   
Under OAUTH TOKENS & REDIRECT URLS at the top of the page, click INSTALL TO WORKSPACE.
   
You may be prompted for access permissions. Click the ALLOW button.
   
Copy the BOT USER OAUTH ACCESS TOKEN. This will be used in your .env.dev as 

```
SLACK_OATH_TOKEN=<token>
```
If you haven’t done so, create a channel in the Slack workspace to send notification messages. For example: **#ms-notify-slack**. This will be used in your .env.dev as
```
SLACK_CHANNEL=ms-notify-slack
```
## Clone the project

You will need to know the public endpoint to register in a future step. You must deploy your project to AWS in order to get the endpoint URL. Clone the this source project to your IDE. Change directories into the project. Type:
```
>npm install
```

As the serverless.yml file has the **stage:dev** set, create a .env.dev file in the root project folder. If the stage is prod then you will create a .env file. This will load the env into the lambda configuration environment. Enter this into the file:
```
SLACK_OATH_TOKEN=<your_slack_oath_token_you_created_above>
SLACK_CHANNEL=<your_slack_channel_you_created_above>
```

Deploy your project

```
serverless deploy
```

Use the endpoints POST url value in the next step. ie.,

```https://xyz123abc4.execute-api.us-west-2.amazonaws.com/event```

## Setting up a Media Shuttle Webhook

In this section, we use the Signiant Media Shuttle API to obtain a list of available portals and their detailed information and install a webhook event (POST /subscription) to monitor transfer events related to that portal. Reference Get Started with Media Shuttle API https://developer.signiant.com/media-shuttle/getting-started.html instructions for additional information.

**You will need your Media Shuttle API Key to perform this task.**

We will do this using Swagger Interface https://developer.signiant.com/media-shuttle/api-documentation.html

Click Authorize and enter your Media Shuttle API Key

Select GET /portals and **Try it out**. Enter the portal URL you want to use to monitor events. ie. portal_name.mediashuttle.com  

Click **Execute**

*You must get a Code 200 and Response Body that will include a portal*

The value of the ***id*** key is how we reference this portal in order to create a transfer event subscription. Be sure to copy the Response body **id** and not the Example Value **id**.

Scroll down to System-to-Person and click POST /portals/{portalId}/subscriptions and **Try it out**. Enter the **id** from above into the **portalId** field. Then scroll down to Request body and replace the **url** with your hosted app endpoint. ie., 
```
{
  "type": "webhook",
  "details": {
    "url": "https://xyz123abc4.execute-api.us-west-2.amazonaws.com/event"
  }
}
```

Click **Execute**

*You must get a Code 200 and Response Body confirming a new event webhook has been created. This will include a subscription id that you do not need to use.*

Properly done, a Slack message is sent to the channel defined when a Media Shuttle file transfer in the configured portal is performed.