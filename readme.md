
# Offline First Project Manager
An offline-capable project management tool, built as a Progressive Web App by [Teri Chadbourne](https://github.com/terichadbourne).

For more on how this Progressive Web App was built using PouchDB, CouchDB, Service Worker, and a Wep App Manifest, stay tuned for an upcoming blog series. 

## The purpose of the app

### For me, as a project management tool:
This app is an offline-capable project management tool that I built to track the status of blog posts on the Offline Camp Medium publication. Using a simple web form, which adapts itself based on what I enter, it stores a record for each article in progress and lets me come back and edit that record later. It also creates a second webpage I can share with an author to provide resources they need and request resources I need in return. 

Because I need to start this process while I'm on site at Offline Camp with very limited internet access, the app needs to load while offline and allow me to edit and save data without an internet connection. Since I collaborate with other editors and own many gadgets, the data ultimately needs to sync across multiple devices, browsers, and users. It requires an [Offline First](http://offlinefirst.org) design.  

### For you, as a sample implementation of an offline-capable Progressive Web App:
You can explore my code to see how PouchDB, Apache CouchDB™, Service Worker, and a Web App Manifest are used to create an Offline First experience in the form of a Progressive Web App. The nuances of what I'm using my own web form for don't matter. In fact, you'd most likely want to clone the repo and adapt the form logic to create another offline-capable, form-based web app, such as a to do list or shopping list app. 


## Offline First App Design

[Offline First](http://offlinefirst.org) is an approach to web development which plans for the most network-constrained environments first, adding
more functionality if and when connections improve. Because the most important resources are cached locally, this design pattern leads to extremly performant (speedy) apps.

This project management app works Offline First! The first time you load the page, a service worker caches the resources necessary for you to work offline on future visits. The app saves data locally first using PouchDB in your browser, then syncs to a remote CouchDB database (in this case, IBM Cloudant) whenever you have a connection. 

Using multiple devices or browsers? It will all sync up automagically!

You can learn more about Offline First methodology and use cases at [offlinefirst.org](http://offlinefirst.org) on in our Medium publication
at [medium.com/offline-camp](http://medium.com/offline-camp).


## Running the App

To run the code as is and see the Offline First functionality in action, you'll need to follow these steps: 

### 1. Prepare your CouchDB database and API key:
- Create an empty CouchDB database and get yourself set up with an API key. 
- If you haven't used CouchDB before, one easy option is to create a new database on Cloudant, which takes care of the hosting for you. After creating a new database, click on Permissions and then Generate API Key. Write down the Key and Password generated in a safe place, because Cloudant will never show them to you again. 
- In order to keep your (and my) credentials safe, you'll be setting an environment variable locally instead of hardcoding your creds into your code.
- You'll need a URL that references your database, with your top-secret API key built in. If you choose to use Cloudant, it will look like this: https://<KEY>:<PASSWORD>@<USERNAME>.cloudant.com/<DATABASE>
- Ensure Cross-Origin Resource Sharing (CORS) is enabled on your database. (If using Cloudant, visit the CORS tab in your user settings.)

### 2. Get your computer set up (if you haven't used Git or Node or NPM before): 
- Open your command line application (Terminal on a Mac).
- Ensure you have Node and NPM installed. (WHAT SHOULD THEY DO TO CHECK?)
- Ensure you have whatever you need to set up so you can use GitHub. (WHAT WOULD THAT BE? )

### 3. Clone the repo and install dependencies:
- In the command line, navigate to the folder inside of which you'd like to store this project. 
- Clone this repo by typing `git clone <TBD HERE>`
- Navigate into the project directory (the folder containing this repo) by typing `cd TBD HERE` 
- Type `npm install` to install this project's dependencies. This will set you up with Express, which is how you'll serve the files locally.

### 4. Create a `credentials.js` file:
- Navigate into the `JS` directory by typing `cd js`. 
- Create a new JavaScript file in this directory titled `credentials.js`. It's important that you spell this correctly, since the filename is already referenced in your `.gitignore` to prevent accidental upload of your credentials to GitHub at a later date. 
- Add the following line of code to your `credentials.js` file, inserting the URL you establish in Step 1: `var remoteCouch = "YOUR_URL_HERE";`
- Save the file and exit your editor.
- **IMPORTANT SECURITY NOTE**: Although your `credentials.js` file won't be tracked by Git or uploaded to GitHub, it is among the files that will be served up when you launch the app in the next step, and a user could therefore inspect your code and view the contents of the file, gaining access to your remote database. **This setup is not suitable for production.**

### 5. Launch the app:
- Navigate back to the main project file using `cd ..`.
- Type `npm start` and wait until you see the message `server is listening on 8000`
- To load the app, open a modern Chrome or Firefox browser (to ensure you receive all the benefits of Service Worker) and navigate to: http://localhost:8000/



## Testing the Offline First Functionality

### Test offline data entry and syncing between devices (PouchDB & CouchDB): 
A new PouchDB database will be created in each browser you use to test the app. A great way to explore the offline syncing powers of PouchDB and CouchDB
is to load the site in both Chrome and Firefox (modern implementations of which support service workers), thinking of them each as a different user or device. 

You can now explore what happens if one user is online and another isn't. To do this, set just one browser to offline mode. (In Chrome, open the developer tools and select Network or Applications and then check the Offline box. In Firefox, go to Web Developer, then check Work Offline. In either case, you must refresh the page for the effect to take the place.) Because the app files are hosted locally, this will only simulate disconnecting from the remote CouchDB database, not from the resources that make up the page itself (the HTML, CSS, and JS files that create the user experience).

### Testing caching of resources (Service Worker): 
In order to simulate loading the page from scratch while you're offline (after at least once accessing it while online), you'll need to kill the local server you started (by typing `Ctrl-C` in Terminal) and refresh the page. The
service worker should have cached relevant resources so you should see no change in functionality with this test. (On a website without a Service Worker, you'd be seeing a 404(?) error or Chrome's famous downasaur.)

### Testing installing to homescreen (Web App Manifest): 
Something with Ngrok TBD


## Resources and Additional Reading 
- Blog series coming soon!
- [PouchDB](https://pouchdb.com/) 
- [Apache CouchDB™](http://couchdb.apache.org/)
- [IBM Cloudant](https://www.ibm.com/cloud/cloudant)
- [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers/)
- [Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/)
- [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)
- [Offline First](http://offlinefirst.org/)
- [Offline Camp](http://offlinefirst.org/camp/)
- [Offline Camp Medium publication](https://medium.com/offline-camp)
- [Additional Offline First resources](https://medium.com/offline-camp/offline-first-resources-2acc5836e9d4)
- [Offline First sample implementations in a variety of stacks](https://ibm-watson-data-lab.github.io/shopping-list/)

## License
[Apache 2.0](LICENSE)
