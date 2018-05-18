
# Offline First Project Manager
**An offline-capable project management tool, built as a Progressive Web App by [Teri Chadbourne](https://github.com/terichadbourne).**

This offline-capable Progressive Web App was built with PouchDB, CouchDB, service workers, and a web app manifest. It uses only client-side code. You can read more below about its Offline First design pattern, explore the code here on GitHub, or run the app yourself by following the instructions below.

___
This project is featured in my talk, **Offline First: Making Your App Awesome When the Network Isn't**. 

You can read the companion beginner-friendly blog series on Medium: 
- [Part 1: Enabling offline data storage, sync, and sharing with PouchDB and Apache CouchDB™](https://medium.com/ibm-watson-data-lab/making-your-app-awesome-when-the-network-isnt-part-1-3ed530c2523)
- [Part 2: Ensuring quick page loads — offline or not — with service workers](https://medium.com/ibm-watson-data-lab/making-your-app-awesome-when-the-network-isnt-part-2-669ee36e2f81)

[Resources shared in my talk](#resources-and-additional-reading) can be found below.

The slides from my talk can be seen [here](https://github.com/ibm-watson-data-lab/offline-first-project-manager/blob/master/doc/source/pdf/Offline_First_Making_Your_App_Awesome_When_the_Network_Isnt.pdf). 

___

**Jump to...**
- [The purpose of the app](#the-purpose-of-the-app)
- [The Offline First functionality](#the-offline-first-functionality)
- [Running the app: Quickstart for experienced coders](#running-the-app-quickstart-for-experienced-coders)
- [Running the app: Step-by-step instructions](#running-the-app-step-by-step-instructions)
- [Testing the Offline First functionality](#testing-the-offline-first-functionality)
- [The project's file structure](#the-projects-file-structure)
- [Resources and additional reading](#resources-and-additional-reading)
- [License](#license)     


## The purpose of the app

### For me, as a project management tool:
This app is an offline-capable project management tool that I built to track the status of blog posts in the works for the [Offline Camp Medium publication](http://medium.com/offline-camp). Using a simple web form, which uses logic to hide and reveal certain questions depending on the data entered, it stores a record for each article in progress and lets me come back and edit that record later. It also creates a second webpage I can share with an author to provide resources they need and request resources I need in return. 

Because I need to start this process while I'm on site at [Offline Camp](http://offlinefirst.org/camp) with very limited internet access, the app needs to load while offline and allow me to edit and save data without an internet connection. Since I collaborate with other editors and own many gadgets, the data ultimately needs to sync across multiple devices, browsers, and users. It requires an [Offline First](http://offlinefirst.org) design.  

### For you, as a sample implementation of an offline-capable Progressive Web App:
You can explore my code to see how PouchDB, Apache CouchDB™, service workers, and a web app manifest are used to create an Offline First experience in the form of a Progressive Web App. The nuances of what I'm using my own web form for don't matter. In fact, you'd most likely want to clone the repo and adapt the form logic to create another offline-capable, form-based web app that meets the custom needs of your own project.

This is a simple, beginner-friendly web application built using only client-side code. In addition to its custom JavaScript, HTML, and CSS files, it relies on the great sync powers of PouchDB library. jQuery.js and normalize.css are used out of convience to simplify the front-end development, while Node.js and Express are used only to serve the project up locally for review. You don't need to understand server-side development to see what makes this application tick.


## The Offline First functionality

The [Offline First](http://offlinefirst.org) approach to web development plans for the most constrained network environment first, enabling a great user experience even while the device is offline or has only an intermittent connection, and providing progressive enhancement as network conditions improve. This design also makes apps incredibly performant (fast!) on the best of networks. 

PouchDB, CouchDB, service workers, and a wep app manifest are the primary tools that turn this simple project management tool into a high-performance, offline-capable Progressive Web App.

**Data stays safe on your device, even while it's offline.**  
Persistance of data entered by the user is achieved using the in-browser database PouchDB. This will allow your data to survive between sessions and when disconnected from the network. (Whether you're offline at an event or back in the office on your trusty Wi-Fi, you can still add new projects and modify existing ones.)

**Data syncs between devices when a connection is available.**  
When a connection is available, the data is synced from the local device to a CouchDB database in the cloud, and can thus be shared across multiple devices or users. (Managing a project with a partner or need to access the data on both your phone and your laptop? No problem!)

**The app loads quickly, even while offline.**  
To keep the app itself functional while offline, a service worker is used to cache page resources (the most important HTML, CSS, and JavaScript files) when the web application is first visited. Each device must have a connection for this first visit, after which the app will be fully functional even while offline or in shoddy network conditions. (No more error messages or frustratingly slow page loads.)

**The app can be installed on a mobile device.**  
In combination with the service worker used for caching, a web app manifest containing metadata allows the app to become a Progressive Web App, an enhanced website that can be installed on a mobile device and can then be used with or without an internet connection. (It's secretly still a website, but you can access it through one of those handy dandy little app icons on your homescreen!)

Explore the code in this GitHub repository to see how the Offline First design is applied.


## Running the app: Quickstart for experienced coders
_(The **TL;DR** you're looking for if you're already familiar with the command line, Node.js, NPM, Git, GitHub, and CouchDB.)_

After reviewing the [security concerns](#important-security-note), follow these instruction to run the app locally and see the Offline First functionality in action: 

1. Clone the repo and run `npm install`.
2. Set up a new remote CouchDB database with CORS enabled.
3. Add a new file titled `credentials.js` to the `js` directory. The one line of code in this file should be: 

    ```
    var remoteCouch = "YOUR_REMOTE_COUCHDB_URL_HERE";
    ```
4. Run `npm start` from the project directory and go to http://localhost:8000/.
5. Due to [security concerns](#important-security-note), don't let anyone else use the app while you're running it.

## Running the app: Step-by-step instructions

To see the Offline First functionality in action, you'll need to follow the steps below. 

**A note on security:** To keep the focus on the front-end code that provides the app's offline functionality, this sample implementation has simplified the server-side elements and **does not currently protect your login credentials** for CouchDB. It is **not suitable for production**. (See the **[security note](#important-security-note)** below for more detail.)

### 1. Get set up with Node, NPM, Git, and GitHub:

Install Node and NPM. (Check out these installation tutorials for [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac) or [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows) if needed.)

[Set up Git and GitHub](https://help.github.com/articles/set-up-git/).

### 2. Clone the repo and install dependencies:

From the command line, navigate to the directory (folder) inside of which you'd like to store this project. (Here's a [command line tutorial](https://tutorial.djangogirls.org/en/intro_to_command_line/) if you need it.)

Clone this repo by typing: 

```
git clone https://github.com/ibm-watson-data-lab/offline-first-project-manager.git
```

Navigate into the project directory (the folder containing the cloned repo) by typing: 

```
cd offline-first-project-manager
```

Type `npm install` to install this project's dependencies. This will set you up with the files you need for Express, a Node.js web application framework that will deal with some server stuff while we focus on the client-side code.

### 3. Create a Cloudant or CouchDB service
PouchDB can synchronize with CouchDB and compatible servers. To run and test locally, you can install CouchDB. Alternatively, you can use a hosted IBM Cloudant NoSQL DB service for your remote DB. In either case, you'll need a new database accessible via a URL with a top-secret API key built in. You'll also need CORS enabled. 

#### Option A: Install Apache CouchDB

[Install CouchDB 2.1](http://docs.couchdb.org/en/2.1.0/install/index.html). Instructions are available for installing CouchDB 2.1 on Unix-like systems, on Windows, on Mac OS X, on FreeBSD, and via other methods.

Configure CouchDB for a [single-node setup](http://docs.couchdb.org/en/2.1.0/install/setup.html#single-node-setup), as opposed to a cluster setup. Once you have finished setting up CouchDB, you should be able to access CouchDB at `http://127.0.0.1:5984/`. Ensure that CouchDB is running and take note of your admin username and password.

#### Option B: Create a Cloudant NoSQL DB service

To provision a managed Cloudant NoSQL DB, log in to [IBM Cloud](https://console.ng.bluemix.net/). (Sign up for an account, if you do not already have one.)

[Provision a Cloudant NoSQL DB _Lite_ plan instance](https://console.bluemix.net/catalog/services/cloudant-nosql-db), which is free. 

Open the **Service credentials** tab.

Add new credentials for this service instance if no credentials have been defined yet.

View the credentials and note the value of the **url** property, which has the following format: `https://username:password@username-bluemix.cloudant.com`.

Tip: Select the **Manage** tab and click **Launch** to open the Cloudant dashboard and manage the service instance.
 
### 4. Set up your remote Cloudant or CouchDB database and enable CORS 

From your Cloudant or CouchDB dashboard, select the Databases tab on the left and then use the `Create Database` button to create the "blog-tracker-beta" database.

![](doc/source/images/create_db.png)

To enable Cross-Origin Resource Sharing (CORS), select the Account Settings (or config) tab and open the **CORS** tab. Enable CORS and restrict the domain as needed for security.

![](doc/source/images/enable_cors.png)

### 5. Create a credentials file (see [security note](#important-security-note)):
Navigate into the `js` directory by typing `cd js`. 

Create a new JavaScript file in this directory titled `credentials.js`. It's very important that you spell this correctly, since the filename is already referenced in your `.gitignore` file to prevent accidental upload of your CouchDB credentials to GitHub at a later date. 

Add the following line of code to your `credentials.js` file, inserting the URL you establish in Step 1 and keeping the quotation marks you see here: 

```
var remoteCouch = "YOUR_REMOTE_COUCHDB_URL_HERE";
```

Save the file and exit your editor.

### 6. Launch the app (see [security note](#important-security-note)):

Navigate back to the main project file using `cd ..`.

Type `npm start` and wait until you see the message `server is listening on 8000`

To load the app, open a modern Chrome or Firefox browser (to ensure you receive all the benefits of service workers) and navigate to: http://localhost:8000/

To stop the server when you're done (or for testing purposes as described below, use Control-C.

### IMPORTANT SECURITY NOTE: 
Although your `credentials.js` file won't be tracked by Git or uploaded to GitHub, it is among the files that will be served up when you launch the app. This means that a user could therefore inspect your code and view the contents of the file, gaining access to your remote database. **This setup is not suitable for production.**

For an example of a PWA built using the same technologies with more robust security measures, check out this [sample implementation of a shopping list app](https://github.com/ibm-watson-data-lab/shopping-list-vanillajs-pouchdb). It requires each user, device, or browser to enter their own CouchDB credentials, which are stored locally in PouchDB in a spot that does not get synced to the remote database.



## Testing the Offline First functionality

### Test offline data entry and syncing between devices (PouchDB & CouchDB): 
A new PouchDB database will be created in each browser you use to test the app. A great way to explore the offline syncing powers of PouchDB and CouchDB
is to load the site in both Chrome and Firefox (modern implementations of which support service workers), thinking of them each as a different user or device. 

You can now explore what happens if one user is online and another isn't. To do this, set just one browser to offline mode. (In Chrome, open the developer tools and select Network or Applications and then check the Offline box. In Firefox, go to Web Developer, then check Work Offline. In either case, you must refresh the page for the effect to take the place.) 

Because the app files are hosted locally, this process will only simulate disconnecting from the remote CouchDB database, not from the resources that make up the page itself (the HTML, CSS, and JS files that create the user experience).

### Testing caching of resources (service workers): 
In order to simulate loading the page from scratch while you're offline (after at least once accessing it while online), you'll need to kill the local server you started (by typing `Ctrl-C` in Terminal) and refresh the page. The
service worker should have cached relevant resources so you should see no change in functionality with this test. (On a website without a service worker, you'd be seeing a 404(?) error or Chrome's famous downasaur.)

### Testing installing to homescreen (web app manifest): 
Instructions coming soon.

## The project's file structure
Here's a quick look at the project's file structure, to guide your exploration of the code in this repo:

![](doc/source/images/file_structure.png)

## Resources and additional reading 

For a closer look at the steps I took to build this offline-capable Progressive Web App using only client-side code, check out my beginner-friendly tutorial series:

- [Part 1: Enabling offline data storage, sync, and sharing with PouchDB and Apache CouchDB™](https://medium.com/ibm-watson-data-lab/making-your-app-awesome-when-the-network-isnt-part-1-3ed530c2523)
- [Part 2: Ensuring quick page loads — offline or not — with service workers](https://medium.com/ibm-watson-data-lab/making-your-app-awesome-when-the-network-isnt-part-2-669ee36e2f81)

To explore the technologies used and learn more about Offline First, take a look at these additional resources:

Offline First
- [Offline First resources](https://medium.com/offline-camp/offline-first-resources-2acc5836e9d4)
- [Offline First](http://offlinefirst.org/)
- [Offline Camp Medium publication](https://medium.com/offline-camp)
- [Offline First YouTube channel](https://www.youtube.com/OfflineFirst)
- [Offline Camp](http://offlinefirst.org/camp/)

PouchDB & CouchDB
- [PouchDB](https://pouchdb.com/) 
- [Apache CouchDB™](http://couchdb.apache.org/)
- [IBM Cloudant](https://www.ibm.com/cloud/cloudant)
- [Sample implementations on offline-capable shopping list apps built with PouchDB & CouchDB in a variety of stacks](https://ibm-watson-data-lab.github.io/shopping-list/)
- [Curated articles on PouchDB, PouchDB & Hoodie](https://medium.com/offline-camp/couchdb-pouchdb-hoodie/home) from the Offline Camp Medium publication 
- [Offline First Apps with PouchDB (video)](https://www.youtube.com/watch?v=7L7esHWAjSU&t=45s) by Bradley Holt

Service Workers
- [Service Workers: An Introduction](https://developers.google.com/web/fundamentals/primers/service-workers/) by Matt Gaunt
- [Service Workers Explained](https://github.com/w3c/ServiceWorker/blob/master/explainer.md) by the WC3 
- [The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle) by Jake Archibald
- [Debugging Service Workers (Code Lab)](https://developers.google.com/web/fundamentals/codelabs/debugging-service-workers/) by Rob Dodson
- [Curated articles on Service Workers & PWAs](https://medium.com/offline-camp/progressive-web-apps-service-workers/home) from the Offline Camp Medium publication
- [Browser support for Service Workers](https://caniuse.com/#feat=serviceworkers)
- [Offline Web Applications using IndexedDB & Service Worker](https://www.udacity.com/course/offline-web-applications--ud899) (free Udacity course taught by Google instructors)

Progressive Web Apps
- [Progressive Web Apps resources from the team at Google](https://developers.google.com/web/progressive-web-apps/)
- [Your First Progressive Web App (Code Lab)](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/) by Pete LePage
- [Lighthouse](developers.google.com/web/tools/lighthouse) (performance audits for your PWA)
- [Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) (essential for make a PWA installable to the home screen)

Developer Tools 
- [Debugging in Chrome](https://developers.google.com/web/tools/chrome-devtools/progressive-web-apps)
- [Debugging in Firefox](https://developer.mozilla.org/en-US/docs/Tools/about:debugging)


## License
[Apache 2.0](LICENSE)
