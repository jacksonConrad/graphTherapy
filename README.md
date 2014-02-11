graphTherapy
============

Group Therapy is a radio show hosted by the Trance artists Above & Beyond.  It is hosted every friday at 2pm EST,
and has some of the most dedicated fans out there.  This app tracks and graphs twitter trends of this radio show.

---
##LISTEN 

www.aboveandbeyond.nu/radio
---

##Stack

Built on the MEAN stack. (MongoDB, Node.js/Express, Angularjs)

The bargraph was build using d3 

##Technical Overview

This app uses the Twitter Streaming API to track the following keywords:

    - aboveandbeyond
    - abgrouptherapy
    - grouptherapy
    - abgt (the hashtag associated with the show)

Everytime someone tweets something containing a keyword, this app recieves it and stores it in a database.
The server uses Socket.io to broadcast this tweet to all connected clients so they can see tweets
update the table in real-time.

###Backend data aggregation

* api/twitterAPI.js
  * recieves data through twitter streaming API
  * stores new data in the db
  * sends new tweets to the clients via websockets
* api/statAPI.js
  * aggregates graph data on server startup
  * emits new data to clients every minute/hour/day
  * stores graph data in FIFO queues
    * since data is ordered, we don't need random access to the arrays,
    just to push/pop/shift/unshift appropriately

###Bar Graph

There are three possible views for the bar-graph: 

* minutes
* hours 
* days

To view the time correseponding to a given bar, you have to hover your mouse over it.
I thought this would be a cleaner alternative to listing all 60/24/28 times on the x-axis.

The app also uses sockets to update the bar-graph for the client in real-time.

##Real-life appliations

While this webapp is a bit contrived to meet the criteria of an assignment, it could easily be expanded upon
to serve as a twitter analytics tool.  By analyzing these data trends, artists and companies could determine:

* Who are their most influential followers 
* What songs/ideas get their fans/customers excited
* Magnitude of growth/outreach

Combining these data trends with sentiment analysis technology could also produce meaningful data.

Most of the tweet data in the database isn't being utilized (the data represented in the graph
is simply a *count* of documents), but I kept it there so it could possibly be utilized later.  For example, the user.followers_count field
could be used to determine the influence of a given follower. 
        

