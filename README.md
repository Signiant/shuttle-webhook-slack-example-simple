

[Building](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[Bl](https://www.signiant.com/?cc=ss-bb-ms-slack)ocks

A Modern Approach to Building Media Workﬂows

How Media Shuttle, Slack and a little javascript shaved critical

time for a distributed production team

This article is part of an upcoming series on Implementing Modern Media

Workﬂows with SaaS Building Blocks. Over the course of this series, Signiant will

oﬀer real-world technical examples demonstrating the power of connecting oﬀ-the-shelf

functional modules via APIs.

In this installment, Signiant demonstrates connecting Media Shuttle and Slack in a

simple integration used recently in a live sports production.

Build vs. buy has always been a continuum rather than a single binary decision.

Every media enterprise buys technology at some level and builds systems by

hooking the various pieces together. In the old days, the build process involved

connecting hardware products with coax and BNC connectors. In the cloud era, the

analogous process is connecting various web services with APIs and lightweight

business logic. Because there are endless possibilities within the giant sandbox of

web services, careful management of the build vs. buy dimension is essential for

media companies.

With that, it’s not a question of build vs. buy but rather which size blocks to build

with. Signiant believes that the sweet spot is somewhere near the middle of the

continuum from microservices through end-to-end systems. Our technology is

packed into full-stack products, providing media companies with modules that can

be readily deployed as components of larger workﬂows. With web services and

good APIs, these products can easily be connected together to address speciﬁc

business requirements and can be readily swapped out as technology evolves.

With this approach, the customer is rewarded with much faster time-to-value while

maintaining agility and favorable economics.

1

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





Real-World Application

Let’s take a look at a real production example where this approach was put into

practice with great success and in a very short amount of time. A large sports

broadcaster was simultaneously covering three live sporting events in three

diﬀerent cities across the U.S. In addition to the live action, camera crews at each

location were shooting interviews and capturing B-roll to intercut into highlight

reels. The broadcaster needed to move camera card ﬁles from the remote

production location to the main production facility quickly, and a distributed

production team needed to be informed in the most eﬃcient way as new clips

became available.

As always, things are moving very fast. The sports director wants it now, now,

now, and the editors also have other packages to concentrate on. Rather than

waiting and watching for the delivery in multiple messaging services, like email, the

broadcaster wanted those notiﬁcations to come to their existing Slack service used

for internal production communication — a single communication source.

Coupling Signiant Media Shuttle and Slack using some simple scripting lets them do

exactly that and stay in the platform they already use. The workﬂow went from idea

to production in a couple of days, using familiar tools, and helped get quick edits

on the air, easily. Since both Media Shuttle and Slack are SaaS oﬀerings, minimal

eﬀort was required to deploy the two major building blocks themselves.

This is a very simple example of an actual Signiant use case that illustrates the

power of the building block approach; it happened to be in the sports industry but

the same concept could be applied to many situations. Here is the actual code to

make it happen.

2

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





Connecting Media Shuttle and Slack

Signiant has a rich set of API’s allowing integration with Signiant products. There

are a variety of REST API’s to Transfer, Manage, and Audit in and around the Media

Shuttle product. In this build example, we focus on a small and speciﬁc subset of

the Media Shuttle REST API — just enough to get the job done.

➜ꢀ Media Shuttle REST API supports a Webhook concept – essentially a user-

deﬁned HTTP callback that allows for a web backend to call out to an HTTP

service based on some event or system-related action. In this case, we focus

on “File Transfer” events. It’s possible for errors to occur during a transfer and

we will present a simple mechanism for handling an error condition, but the

emphasis here will be on sending Slack notiﬁcations upon a successful transfer.

➜ꢀ Slack also has a very rich Web (REST) API to interact with. Again, here we’ll focus

on just a small subset of the Slack Web API.

➜ꢀ The code example(s) will be in the form of JavaScript, speciﬁcally in the context

of a node.js application.

Setting Up A Slack Application

[Start](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[by](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[obtaining](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[a](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[Slack](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[API](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[token.](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[There](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[are](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[a](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[few](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[diﬀerent](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[types](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[of](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[Slack](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[tokens.](https://api.slack.com/authentication/token-types#bot)

In this example we use a [“bot](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[user](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[token”](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)since we will eﬀectively be operating as

[a](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[bot](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[to](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[send](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[notiﬁcations](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[based](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[on](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[an](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[upload](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[complete](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[webhook](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[callback](https://api.slack.com/authentication/token-types#bot)[ ](https://api.slack.com/authentication/token-types#bot)[from](https://api.slack.com/authentication/token-types#bot)

Signiant Media Shuttle.

1.To obtain the bot user token, create (deﬁne) a new [Slack](https://api.slack.com/apps)[ ](https://api.slack.com/apps)[application](https://api.slack.com/apps)[ ](https://api.slack.com/apps)and click

on CREATE NEW APP.

3

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





\2. Next, ﬁll in the APP NAME ﬁeld and choose a DEVELOPMENT SLACK

WORKSPACE from the dropdown list. Note that you may need to sign in to

Slack to get to the proper Workspace.

Click the CREATE APP.

\3. In the BUILDING APPS FOR SLACK window, click the BOTS box.

4

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





\4. The next window is to assign scopes to the bot token. Click REVIEW SCOPES TO

ADD.

\5. Select the following and click ADD AN OAUTH SCOPE after selecting each one.

➜ꢀ chat:write:customize

➜ꢀ chat:write

➜ꢀ chat:write:public

5

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





\6. Under OAUTH TOKENS & REDIRECT URLS at the top of the page, click INSTALL

TO WORKSPACE.

\7. You may be prompted for access permissions. Click the ALLOW button.

\8. Copy the BOT USER OAUTH ACCESS TOKEN. This access token is used later to

send a message from the node.js application.

6

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





\9. If you haven’t done so, create a channel in the Slack workspace to send

notiﬁcation messages. For example: “notify-test”.

Now let’s turn our attention to Setting up a Media Shuttle Webhook.

Setting up a Media Shuttle Webhook

In this section, we use the Signiant Media Shuttle API to obtain a list of available

portals and their detailed information and install a webhook (subscription) to

monitor transfers related to that portal.

[NOTE:](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[This](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[tutorial](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[assumes](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[an](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[already](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[conﬁgured](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Media](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Shuttle](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[account](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[and](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[at](https://developer.signiant.com/media-shuttle/getting-started.html)

least one portal for use here. Reference the [Get](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Started](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[with](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Media](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Shuttle](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[API](https://developer.signiant.com/media-shuttle/getting-started.html)

instructions for additional information.

\1. [To](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[authenticate](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[with](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[the](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Signiant](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Media](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Shuttle](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[API,](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[an](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[API](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[key](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[is](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[needed](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[from](https://developer.signiant.com/media-shuttle/getting-started.html)

[the](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Media](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Shuttle](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[administrative](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[interface.](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Refer](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[to](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[the](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Get](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Started](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[with](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Media](https://developer.signiant.com/media-shuttle/getting-started.html)

[Shuttle](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[API](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)instructions on how to obtain an API key.

\2. [Make](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[a](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[copy](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[of](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[your](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[API](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[key.](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[The](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[key](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[is](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[needed](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[in](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[subsequent](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[steps.](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[You](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[will](https://developer.signiant.com/media-shuttle/getting-started.html)

[only](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[need](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[to](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[reference](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[what](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[is](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[in](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[the](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[“Authentication”](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[section](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[in](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[the](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Get](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Started](https://developer.signiant.com/media-shuttle/getting-started.html)

[with](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Media](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[Shuttle](https://developer.signiant.com/media-shuttle/getting-started.html)[ ](https://developer.signiant.com/media-shuttle/getting-started.html)[API](https://developer.signiant.com/media-shuttle/getting-started.html).

The Media Shuttle API key authenticates when making API calls against the

Media Shuttle account.

It is important to note the API key is used as the value for the HTTP

Authorization Header in REST API calls made.

For example with curl:

curl … -H “Authorization: <YOUR\_API\_KEY>”

\3. Here is a complete curl example demonstrating exactly how to use the API key.

The screenshot below is from a test account showing details for a portal by the

name of “mf-test” in the Media Shuttle UI.

7

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





Note the URL for the portal, mf-test.mediashuttle.com in this case.

The Media Shuttle API uses internal portal identiﬁers (id’s) to reference a

particular portal. Instructions below show how to obtain a particular portal’s id

and use it in subsequent API calls.

\4. Now let’s issue our ﬁrst Media Shuttle API call to obtain detailed portal

information with curl:

curl -X GET

“https://api.mediashuttle.com/v1/portals?url=mf-subtest.mediashuttle.com”

-H “accept: application/json” -H “Authorization: <YOUR\_API\_KEY>”

\5. Replace <YOUR\_API\_KEY> with the API key made above.

\6. Replace mf-subtest.mediashuttle.com with the URL for your Media Shuttle

Portal as indicated above.

8

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





7.The curl command should return something similar to the following:

{

“items”:[

{

“id”:”0824e-d1ea-4fb4-a122-221055506621e”,

“name”:”Flathers - Metadata Test Submit Portal”,

“url”:”mf-subtest.mediashuttle.com”,

“type”:”Submit”,

“createdOn”:”2021-01-28T01:49:02.924Z”,

“lastModiﬁedOn”:”2021-01-28T01:50:00.739Z”,

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

Note the information returned regarding the portal of interest:

“id”:”0824e-d1ea-4fb4-a122-221055506621e”,

“name”:”Flathers - Metadata Test Submit Portal”,

“url”:”mf-subtest.mediashuttle.com”,

The value of the id ﬁeld (0824e-d1ea-4fb4-a122-221055506621e) is how we

will reference this portal in order to install a transfer monitoring webhook

(subscription).

9

| +1 781.221.4051 [|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





\8. Before installing the webhook, it is important to note that the Media Shuttle

control plane hosted externally must have a public route to the node.js web

application that will be created below. Depending on the environment, this may

include the need for port mapping which is beyond the scope of this document.

In the example below, the application hosting the webhook will be my-test.

signiant.com on port 8081 (my-test.signiant.com:8081). Update the hostname

and port to match your own environment.

In the node.js code used, we deﬁne a service endpoint of /TransferUpdate

resulting in the following URL endpoint to use in the call to install the webhook:

http://my-test.signiant.com:8081/TransferUpdate

\9. Issue the following curl command to install the webhook.

curl -X POST

“https://api.mediashuttle.com/v1/portals/<YOUR\_PORTAL\_ID>/subscription

s” -H “accept: application/json” -H “Authorization: <YOUR\_API\_KEY>” -H

“Content-Type: application/json” -d

“{\”type\”:\”webhook\”,\”details\”:{\”url\”:\”http://my-test.signiant.com:8081/

TransferUpdate\”}}”

Note: Substitute <YOUR\_PORTAL\_ID> with your portal id and <YOUR\_API\_KEY>

with your API key and my-test.signiant.com with the public IP address of the

machine which will be hosting the node.js application discussed above.

\10. If successful, you should get a response similar to the following:

{

“id”: “728d13e2-1ae9-4ced-a64d-064363985866”,

“type”: “webhook”,

“details”: {

“url”: “http://my-test.signiant.com:8081/TransferUpdate”

}

}

10 | +1 781.221.4051

[|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





Now we’re ready to have a look at the node.js application to service our transfer

operation webhook.

\11. Ensure a proper version of the Node.js runtime and NPM is already installed.

\12. Download the source code and dependencies for the building block Webhook

Server from the following location:

<INSERT DOWNLOAD LOCATION HERE>

This node.js application uses the following external packages: Express, Body-

Parser, and @slack/web-api.

\13. Make adjustments to the Javascript code to match your environment. If you

encounter runtime reference errors, you may need to run the following

commands to ensure the external packages listed above are installed properly:

npm install express

npm install body-parser

npm install @slack/web-api

\14. [Note:](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[Although](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[the](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[Slack](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[REST](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[API](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[could](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[be](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[used](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[directly,](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[for](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[this](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[example](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[we](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[will](https://slack.dev/node-slack-sdk/web-api)

[be](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[using](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[the](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[Node](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[Slack](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)[SDK](https://slack.dev/node-slack-sdk/web-api)[ ](https://slack.dev/node-slack-sdk/web-api)(@slack/web-api ).

➜ꢀ The code you’ll need to modify is in a single JavaScript source ﬁle:

Slackutils.js.

➜ꢀ All other supporting source ﬁles should not need to be modiﬁed unless

choosing to do so. For example, to change routing.

➜ꢀ Additionally, although nothing needs to be changed in the server.js ﬁle, a

few code snippets contained therein are referenced.

\15. SlackUtils.js. There are only two lines of code to change here.

\16. First, change the “token” constant to the Slack Bot token value obtained from the

Slack conﬁguration at the beginning of this guide.

\17. Second, change the “channel” constant to the Slack channel’s name the

notiﬁcations should be sent to. Don’t forget to add the # at the beginning of the

channel name. See the code snippets below:

11 | +1 781.221.4051

[|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





//Below is the Slack token for the Building block Demo

const token = “<YOUR\_SLACK\_BOT\_TOKEN>”;

// ChannelId from Building Block Demo

const channel = ‘<YOUR\_SLACK\_CHANNEL>’;

The SlackUtils.js ﬁle really has only a single function in it which simply calls the

Slack API postMessage function to send the message passed in as a parameter:

sendMessage: function (message) {

(async () => {

// See: https://api.slack.com/methods/chat.postMessage

const res = await web.chat.postMessage({ channel: channel,

text: message });

// `res` contains information about the posted message

console.log(‘Message sent: ‘, res.ts);

})();}

\18. Now let’s have a look at the server.js ﬁle. This is where the meat of the webhook

processing is done.

\19. First, we use Express to provide the web server functionality and listens on port

8081:

12 | +1 781.221.4051

[|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





var server = app.listen(8081, function () {

var host = server.address().address

var port = server.address().port

console.log(“Example app listening at http://%s:%s”, host,

port)

})

In this setup, when a ﬁle action such as a transfer occurs on the monitored portal,

an HTTP POST is issued to the url speciﬁed when the webhook was installed IE:

http://my-test.signiant.com:8081/TransferUpdate

The details behind how this HTTP POST is handled may be seen in the code

section that starts with:

app.post(‘/TransferUpdate’,…

\20. You can inspect the details here. As you can see, we evaluate the payload to

formulate a message to send to Slack, mostly focusing on Upload Complete,

Download Complete, and Deleted event types.

Also note the code handles the case where there are multiple ﬁles involved.

The variable “message” contains the ﬁnal result of the Slack message that will be

sent.

For example the following is a code snippet that shows a portion of how the ﬁnal

message is created:

if (transferObj.eventType === “package.upload.complete” ||

transferObj.eventType === “package.download.complete”) {

13 | +1 781.221.4051

[|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





basePath =

transferObj.payload.portalDetails.storage[0].conﬁguration reposi

toryPath;

let ﬁrstOne = true;

transferObj.payload.packageDetails.ﬁles.forEach(ﬁlename =>

{

if (ﬁrstOne) {

if (basePath) {

ﬁlenames += basePath + “/” + ﬁlename.path + “

(“ + convertBytes(ﬁlename.size) + “)”;

}

else {

ﬁlenames += ﬁlename.path + “ (“ +

convertBytes(ﬁlename.size) + “)”;

}

ﬁrstOne = false;

}

else {

if (basePath) {

ﬁlenames += “\n” + basePath + “/” +

ﬁlename.path + “ (“ + convertBytes(ﬁlename.size) + “)”;

}

else {

ﬁlenames += “\n” + ﬁlename.path + “ (“ +

convertBytes(ﬁlename.size) + “)”;

}

}

});

let direction = “”;

if (transferObj.eventType === “package.upload.complete”) {

direction = “uploaded”;

}

14 | +1 781.221.4051

[|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





else if (transferObj.eventType ===

“package.download.complete”) {

direction = “downloaded”;

}

let message = “The following ﬁles have been “ + direction

\+ “ by “ + user + “:\n” + ﬁlenames;

\21. Finally the SlackUtils.sendMessage() is called to send the Slack message:

slackUtils.sendMessage(message);

\22. After making the changes mentioned above, we are ready to run the application.

This may be done with the following command:

Node server.js

Properly done, a Slack message is sent when a Media Shuttle ﬁle action is

performed.

15 | +1 781.221.4051

[|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)





Building with the Right Size Blocks

This example illustrates the power of connecting functional modules via APIs

to quickly solve pressing operational problems. It’s also a good reminder that

connecting a general-purpose tool (Slack) with a media-centric one (Media Shuttle)

is often the best way to meet media industry needs. Both Slack and Media Shuttle

are out-of-the-box functional building blocks that are suﬃciently general-purpose

to warrant the supplier’s investment in a multi-tenant, SaaS product oﬀering. And

because most modern SaaS products oﬀer robust APIs, it is straightforward to

connect these products into larger workﬂows.

Each building block does a speciﬁc job. By using oﬀ-the-shelf, best-of-breed

products, combined with modern APIs and scripting, media companies can create

solutions that can be easily adapted as situations change. Scripts can be updated

and any block can easily be swapped out for another if necessary. This approach

enables media companies to build new workﬂows faster, using familiar tools, and

dramatically shrink the time-to-value.

Signiant was an early leader in cloud-native SaaS, and developed one of the ﬁrst SaaS solutions

for use directly in the media supply chain. Media Shuttle was released in 2012, providing media

companies of all sizes with access to advanced transport technology that enables fast, securable,

reliable transfer of large ﬁles. Since then, Signiant has continued to innovate, introducing two

additional SaaS products, [Flight](https://www.signiant.com/products/flight/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/products/flight/?cc=ss-bb-ms-slack)and [Jet](https://www.signiant.com/products/jet/?cc=bb-ms-slack), built on the same SaaS platform and with the same

cloud-native approach. While these full-stack products are widely used for stand-alone use cases,

the products themselves and components within them are often components of much larger

and more complex workﬂows thanks to an investment in robust, modern APIs. This approach is

commonplace in the broader technology industry and is now emerging in the media technology

world as the industry moves from an on-premise world towards a more cloud-centric world.

About Signiant

Signiant’s enterprise software provides the world’s top content creators and distributors

with fast, reliable, secure access to large media ﬁles, regardless of physical storage type or

location. By enabling authorized people and processes to seamlessly exchange valuable

content — within and between enterprises — Signiant connects the global media supply

chain. [Find](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[out](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[more](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[at](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[www.signiant.com](https://www.signiant.com/?cc=ss-bb-ms-slack).

16 | +1 781.221.4051

[|](https://www.signiant.com/?cc=ss-bb-ms-slack)[ ](https://www.signiant.com/?cc=ss-bb-ms-slack)[WWW.SIGNIANT.COM](https://www.signiant.com/?cc=ss-bb-ms-slack)

