$( document ).ready(function() {

  'use strict';

  //set variable to represent the article form
  var articleForm = document.getElementById('article-form');

  //set variable to represent the status message area in the DOM
  var syncDom = document.getElementById('sync-wrapper');

  //hide the reset button
  $("#reset-button").hide();


  /*****************************************************
  ENABLING SYNCING WITH POUCHDB AND COUCHDB (CLOUDANT)
  ******************************************************/

  //set the local PouchDB database
  var db = new PouchDB('blogtrackerbeta');

  

  // Initialise a sync with the remote server
  function sync() {
    //update attribute of the sync-wrapper div to show current state of sync
    syncDom.setAttribute('data-sync-state', 'syncing');
    //update sync status span to show sync working
    $('#sync-span').html('Currently syncing to remote database.');
    $('#sync-wrapper').css("background-color", "green");
    // setting live: true means the database will sync continuously
    var opts = {live: true};
    //sync local PouchDB instance (db) with the remote CouchDB
    //use the retun value from db.sync to listen to the changes
    //on every change in the db, re-run updateArticles to display current list
    db.sync(remoteCouch, opts, syncError).on('change', updateArticles);
  }


  // if there was some form or error syncing, this function runs
  function syncError() {
    //update sync-wrapper attribute to show error status
    $('#sync-wrapper').attr('data-sync-state', 'error');
    //update sync status span to show sync error on red background
    $('#sync-span').html('Error syncing to remote database. Data will continue saving locally until connection is re-established.');
    $('#sync-wrapper').css("background-color", "red");
  }



  /*****************************************************
  HELPER FUNCTIONS
  ******************************************************/

  //on page load, unless we're on the writer page, change hash to "reset",
  //which will make modeReset run
  if (!(location.href.includes("writer"))) {
    location.hash = "reset";

  //if on writer page, run modeWriter to load relevant content
  } else {
    modeWriter();
  }

  //when this function is called with a message and a color, it will briefly display
  //an unobtrusive toast alert at the bottom of the visible page
  function toast(message, color) {
    $("#alert.toast").css("background-color", color).html(message).fadeIn(400).delay(800).fadeOut(800);
  }


 /*****************************************************
  DISPLAY LISTS OF EXISTING ARTICLES
  ******************************************************/

  /* NOTE ON ACCESSING POUCHDB:
  `db.allDocs` gets all the local PouchDB documents.
  It calls `function(err, doc)` when it's done.
  The returned `doc` is a JavaScript object.
  The `rows` attribute is an array of results.
  Each one of those contains `doc` that is the document body.
  Learn more at: https://pouchdb.com/
  */

  //on page load, update article list based on current state of PouchDB
  updateArticles();


  //when called, this function accesses PouchDB and passes its contents to
  //funtions that need to update article listings
  function updateArticles() {
    //Get all the local PouchDB documents
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      //then redraw the list of articles
      redrawArticleList(doc.rows);
    });
  }

  //to be called when you click on an article link
  function showArticle() {
    modeArticle();
  }

  //Update the DOM to display a list of all articles currently saved in PouchDB
  function redrawArticleList(articles) {

    //clear out the UL
    $('#article-list').html("");

    //rewrite the UL by looping through each currentArticle
    articles.forEach(function(currentArticle) {

      //assign a status class and matching emojis
      var wingding = "";
      var completedClass = "";

      if (currentArticle.doc.completed == true) {
        wingding = "&#127942;"; //trophy
        completedClass = "done";
      } else if (currentArticle.doc.author !==""){
        wingding = "&#9997;"; //writing hand
        completedClass = "inProgress";
      } else {
        wingding = "&#128587;" //raising hand
        completedClass = "authorNeeded";
      }

      //check state of each editor checkbox and add true to a string to be
      //inserted into class list
      var editors ="";

      if (currentArticle.doc.Bradley == true) {
        editors += "Bradley ";
      }

      if (currentArticle.doc.Gregor == true) {
        editors += "Gregor ";
      }

      if (currentArticle.doc.Teri == true) {
        editors += "Teri ";
      }

      if (currentArticle.doc.Steven == true) {
        editors += "Steven ";
      }

      editors = " " + editors;

      //if article has an author, include author in listing. always included the completed class and editors
      if (currentArticle.doc.author.length > 0) {
        $('#article-list').append("<li class='article " + completedClass+ editors + "'><strong>" + wingding + " &nbsp; &nbsp; &nbsp;  <a href='#"+currentArticle.doc._id +"'>"+currentArticle.doc.title+"</a></strong> (" +currentArticle.doc.author + ")</li>");
      //if not, leave out
      } else {
        $('#article-list').append("<li class='article " + completedClass+ editors +"'><strong>" + wingding + "  &nbsp; &nbsp; &nbsp; <a href='#"+currentArticle.doc._id +"'>"+currentArticle.doc.title+"</a></strong> </li>");
      }

    });

  } //end redrawArticles()


  //listen for click on the legend
  $("ul.legend").click(function(evt) {
    var selectedClass = $(evt.target).attr("class");
    console.log(selectedClass);
    //class will be legend if user clicks on something in this box apart
    //from the intended options

    //if class is "nope" (for certain headers that shouldn't have functionality),
    //do nothing

    //if user clicked all or legend (random place in ul), show all items
    if (selectedClass == "all" || selectedClass == "legend") {
      $(".article").show();
      $("#selectedClass").html("All Articles");

    //else if user clicked a genuine filtering option (not all or nope or legend)
    } else if (selectedClass !=="nope" && selectedClass !== "legend") {

      //if there's nothing in the selected category, let them know
      //and instead show all articles.
      if ($(".article." + selectedClass).length == 0) {
        toast("There's nothing in that category right now. Showing all articles instead.");
        $(".article").show();
        $("#selectedClass").html("All Articles");

      //if they clicked a valid class with articles, hide all items and
      //then show just things of selected class
      } else {
        $(".article").hide();
        $(".article." + selectedClass).show();
        $("#selectedClass").html($(evt.target).html());
      }
    }
  }); //end legend click handler

 /*****************************************************
  UPDATE UI FOR CHOOSING VS EDITING
  ******************************************************/

  //Update UI to show an article to edit (whether new or existing)
  function modeArticle(oldURLhash, newURLhash) {

    //TODO: FIGURE OUT HOW TO SCROLL TO TOP OF SECTION INSTEAD OF TOP OF PAGE
    //scroll to top of page
    //thx to SO: https://stackoverflow.com/questions/4210798/how-to-scroll-to-top-of-page-with-javascript-jquery
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    //disable the add article button until you save the record you're now working on
    $("#add-button").attr("disabled", true);
    $("#reset-button").attr("disabled", false);

    $("#article-list-wrapper").hide();

    $("#reset-button").show();
    $("#add-button").hide();


    //call function displayForm, which will determine whether to open an existing
    //record or create a blank one
    displayForm();

  } //end modeArticle()


  //reset page to start, where editor chooses between editing or creating a record
  function modeReset() {

    //scroll to top of page
    //thx to SO: https://stackoverflow.com/questions/4210798/how-to-scroll-to-top-of-page-with-javascript-jquery
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    //reset the form and hash
    articleForm.reset();

    //set hash to reset
    location.hash = "reset";

    //hide the blank form and show the options for what to do next
    $("#article-form").hide();
    $("#reset-button").hide();
    $("#add-button").show();

    $("#add-button").attr("disabled", false);
    $("#reset-button").attr("disabled", true);

    updateArticles();
    $("#article-list-wrapper").show();

  } //end modeReset

  //Listen for click on "go back" button and allow user to leave the form without saving or validation
  $( "#reset-button" ).click(function() {
    //suggest saving
    suggestSave();
  }); //end reset-button click handler


  //when add article button is clicked
  $( "#add-button" ).click(function() {
      //setting the hash to new will trigger the modeArticle() function
      window.location.hash = "new";
  }); //end add-button click handler

  //listen for hash change and set view accordingly
  window.addEventListener("hashchange", function (evt) {

    //set the new hash as newURLhash
    var newHash = window.location.hash;
    var newURL = evt.newURL;

    //if user requested the writer hash, don't change the hash or initiate any functions
    if (newURL.includes("writer")) {
      toast("welcome to the writer page", "purple");
      modeWriter(newHash);

    //if new hash is not on the writer page, determine what to do next...
    } else {

      //if new hash = reset or blank, reset the page
      if (newHash == "#reset" || newHash ==""){
        modeReset();

      //if new hash = new, call modeArticle function will check if it's new or existing)
      } else if (newHash == "#new"){
        modeArticle();

      //if hash is a real string representing an article, call modeArticle function which
      //will check if it's new or existing
      //TODO: COMBINE THIS WITH THE NEW ONE ABOVE UNLESS SOMETHING GOES AWRY IN TESTING
      } else {
        modeArticle();
      }
    }
  });

  //displayForm is called from modeArticle after UI is reset - it uses the current hash
  //to determine whether to show a blank form or a pre-populated form
  function displayForm() {
    //make a variable from the hash with the leading # removed
    var hash = window.location.hash.slice(1);

    //if you chose to create a new article
    if (hash == "new") {
      //clear the hidden form of any pre-filled values
      articleForm.reset();
      //hide the un-needed delete button
      $("#delete-button-wrapper").hide();
      //change the H3 of still-hidden form section to "Create Article"
      $("#create-edit-header").html("Create");

    } else if (hash == "reset") {
      console.log("hash was reset when displayForm was called, which is weird", "red");

    } else if (hash == "null" || hash == "") {
      console.log("hash was null or blank when displayForm was called, which is weird", "red");

    //else if hash is an actual article ID
    } else {
      //run populateForm on the still-hidden form to put into it existing values from db
      populateForm();

     //display the delete button
       $("#delete-button-wrapper").show();

    }

    //display the article form (which has either been pre-filled or is blank
    //based on your choice above)
    $("#article-form").show();
      //hide the add button  and show the go back button
    $("#add-button").hide();
    $("#reset-button").show();
  } //end displayForm()

  //this function is called when you choose to edit an article rather than create a new one
  function populateForm() {
    //using the hash to recall unique ID
    var ID = window.location.hash.slice(1);
    db.get(ID, function(err, doc) {
      if (err) {
        toast("error getting requested article record from PouchDB", "red");
      } else {

     //I am carefully matching ids of the elements to the field names in pouchDB
     //so I can loop like this without writing extra javascript for each association
        for (var d in doc){
          //if that field is a checkbox, use .prop() to set the value
          if ($("#" + d).attr('type') == 'checkbox'){
            $("#" + d).prop("checked", doc[d]);
          //if it's not a checkbox, use .val() to set hte value
          } else {
            $("#" + d).val(doc[d]);
          }
        }

        //create an uneditable link to the author's page
        $("#insert_writerURL").attr("href", "writer.html#"+ID)
        .html("writer.html#"+ID);
        //fill in the ID and REV for the editor to see but not edit
        $("#insert_id").html(ID);
        $("#insert_rev").html($("#_rev").val());

        //use existing field values to reveal fields accordingly (we need this since the
        //on change handles won't get called while we load)
        updateReveals();
      }

    })
  } //end populateForm()


 /*****************************************************
  HIDING AND REVEALING FIELDS WHILE EDITING FORM
  ******************************************************/


  function sessionReveal() {

    //if article type is Session Recap, show items relevant to session recaps or all sessions
    if ($( "#articleType" ).val() =="session_recap") {
      $(".session").show();
      $(".sessionRecap").show();
      $(".passionTalk").hide();
      $(".notSession").hide();
    //if article type is Passion Talk, show items relevant to passion talks or all sessions
    } else if ($( "#articleType" ).val() =="passion_talk"){
      $(".session").show();
      $(".passionTalk").show();
      $(".sessionRecap").hide();
      $(".notSession").hide();
    //if article type is neither, hide items only relevant to sessions
    } else {
      $(".notSession").show();
      $(".session").hide();
      $(".sessionRecap").hide();
      $(".passionTalk").hide();

    }

  } //end sessionReveal

  //when value of #articleType selector changes, show/hide specific form fields and update hash
  $( "#articleType" ).change(function() {
      sessionReveal();
    }); //end articleType click handler


  //reveal certain siblings of .controlReveal elements
  function siblingReveal() {
    console.log("running siblingReveal");

    $( ".controlReveal" ).each(function( index ) {

    //if it's a checkbox, see if it's checked (if so, show related; if not, hide)
      if (this.type =="checkbox") {
        if (this.checked) {
          $(this).siblings(".reveal").show();
        } else {
          $(this).siblings(".reveal").hide();
        }

      //If it's a text field, check if it's empty (if so, hide related; if not, show)
      } else if (this.type =="text" || this.type =="textarea") {
        if (this.value == "") {
          $(this).siblings(".reveal").hide();
        } else {
          $(this).siblings(".reveal").show();
        }
      } else {
          toast("you can't use this funtion with that input type", "red");
      }
    });
  }//end siblingReveal()

  //If you edit a form input with class "controlReveal",
  //show or hide its siblings of class "reveal" accordingly
  $( ".controlReveal" ).change(function() {
      siblingReveal();
    }); //end control reveal click handler

  //For cases where that sibling structure won't work (usually due to lots of nesting)
  //utility function: when you click given ID, it reveals items of given class
  function revealClass(checkedID, revealedClass) {
    //console.log("running revealClass ");
    if (checkedID.prop("checked")) {
      revealedClass.show();
    //if it's now not checked
    } else {
      revealedClass.hide();
    }
  }

  //Show/hide specific items when #draftReceived checkbox is checked/unchecked
  $( "#draftReceived" ).change(function(evt) {
    //console.log("draftreceived click handler, will run revealClass");
    revealClass( $("#draftReceived"), $(".drafted") );
  });

  //Show/hide specific items when #editComplete checkbox is checked/unchecked
  $( "#editComplete" ).change(function(evt) {
    //console.log("editcomplete click handler, will run revealClass");
    revealClass( $("#editComplete"), $(".edited") );
  });

  //Show/hide specific items when #testedTwitterCard checkbox is checked/unchecked
  $( "#testedTwitterCard" ).change(function(evt) {
    //console.log("testedTwitterCard click handler, will run revealClass");
    revealClass( $("#testedTwitterCard"), $(".cardTested") );
  }); //end twitter card click handler

  //this fucnction is called when user (un)checks the  published checkbox, updated displayed fields
  function revealFinal() {

    //if requirements complete &  mark complete IS checked
    if ( ($( ".finalize:checked").length == 5) && ($( "#publishedURL").val() !=="") && ($( "#publishedDate").val() !=="") && ($("#completed:checked").length==1) ) {
      $(".finalized").show().removeClass("red");
      $("#finalWarning").hide();
      $("#finalStuffToDo").removeClass("redBorder");
      $(".finalized .trophy").show();

    //if requirements complete &  mark complete is NOT YET checked
    } else if ( ($( ".finalize:checked").length == 5) && ($( "#publishedURL").val() !=="") && ($( "#publishedDate").val() !=="") ) {
      $(".finalized").show().addClass("red");
      $("#finalWarning").hide();
      $("#finalStuffToDo").removeClass("redBorder");
      $(".finalized .trophy").hide();

    //if requirements are not complete (whether or not mark complete is checked)
    } else {
      $("#completed").prop("checked", false); //WHY ISN'T THIS WORKING??? uncheck the mark complete box
      $(".finalized").hide();
      $("#finalWarning").show();
      $("#finalStuffToDo").addClass("redBorder");
      //if previously marked complete, programatically uncheck if user removes required things above

    }

  } //end revealFinal()

  //when the value of any of the publishing or post-publishing fields are changed,
  //determine whether article is complete and update UI accordingly
  $( ".finalize, #publishedURL, #publishedDate, #completed" ).change(function() {
   revealFinal()
  });

  //when loading up an article to edit, we can run all of the reveal funcions at
  //once without their specific event handlers needing to be activated
  function updateReveals() {
    sessionReveal();
    siblingReveal();
    revealClass( $("#draftReceived"), $(".drafted") );
    revealClass( $("#editComplete"), $(".edited") );
    revealClass( $("#testedTwitterCard"), $(".cardTested") );
    revealFinal();
  }


/*****************************************************
  CREATING, UPDATING, AND DELETING RECORDS FOR REAL
  ******************************************************/


  //validate that title is completed
  function validateTitle() {
    //if required title is blank
    console.log("checking title");
    console.log($("#title").val());


    if ( $("#title").val() == "") {

     console.log("title is blank");
      //show the warning message
      $("#title + span").addClass("invalid");

    } else {
      console.log("title is not blank");
      $("#title + span").removeClass("invalid");
    }
  } //end validateTitle()


  //validate all URL entries
  function validateURL (){
  //loop through all URLs on page
    $("input[type='url']").each(function( index ) {
      console.log( index + "(" + this.id + "): " + $( this ).val() );


      /* set valid pattern for URL using regex. it must take one of these
      formats (sth must be at least two characters and something can be any number of
      characters, but neither can include a newline character).
      http://something.sth
      https://something.sth
      http://www.something.sth
      https://www.something.sth
      www.something.sth */

      var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.){1}(.+)\.(.{2,})/;
      var URLentered = this.value;
      var match = URLentered.match(regex); //true or false

      //if field is not blank and the entry is not valid, add invalid class to
      //relevant form warning
      if ( (this.value !== "") && (!match) ) {
        //console.log("not blank and not valid");
        $("#" + this.id + "+ span").addClass("invalid");
      } else {
        //console.log("either valid or blank");
        $("#" + this.id + "+ span").removeClass("invalid");
      }

    });

  } //end url validation


  //run all validation functions when called from savearticle
  function validateForm() {

    validateTitle();

    validateURL();


    //if no fields have invalid class, return true to enable saving
    if ($(".invalid").length == 0) {
      return true;

    //if any fields have invalid class, marked completed false and return false to block saving
    } else {
      $("#completed").prop("checked", false);
      return false;
    }

  } //end validateForm()


  //when value of any URL field changes, run validateURL()
  $("input[type='url']").on("keyup click", function(){
    console.log("keyup or click in url input");
    validateURL();
  });

  //on keyup or click in title field, run validateTitle()
  $("#title").on("keyup click", function(){
    console.log("keyup or click in title");
    validateTitle();
  });


  //when user clicks "save & close" while editing a record
  $( "#submit_button" ).click(function() {
    //run saveArticle function, which will run validation, save if validated
    saveArticle();

  }); //end submit-button click handler

  //when delete button is clicked in article record
  $( "#delete-button" ).click(function(evt) {
    //make the user confirm they want to delete the record
    var r = confirm("***ARE YOU SURE YOU WANT TO DELETE THIS RECORD?*** Click OK to continue with deletion or Cancel to keep this record.");
    //if they clicked ok...
    if (r == true) {
      //PouchDB allows us to delete items by referencing just their id and rev
      //we know what those are because they're currently saved as the values
      //of our form fields
      db.get($("#_id").val()).then(function(doc) {
        return db.remove($("#_id").val(), $("#_rev").val());
      }).then(function (result) {
        toast("Record has been deleted.", "green");
        //clear out the form & update UI
        modeReset();

      }).catch(function (err) {
        toast("Couldn't delete the record from PouchDB.", "red");
        console.log(err);
      });

    //if they clicked cancel...
    } else {
      toast("Phew, close call! Carry on, then.", "blue");
    }
  }); //end delete-button click handler

  function suggestSave() {
    //ask user to confirm desire to save record before continuing

    var r = confirm ("Would you like to save the current article first? Click OK to save to Cancel to proceed without saving.");

    if (r == true) {
      //if they say yes, save current state of form and put into pouchDB
      //saveArticle includes form validation, saving, and resetting mode once saved
      saveArticle();
    } else {
      toast("Wow, you're a risk-taker! Okay, discarding edits without saving.", "blue");
      //changing the hash will trigger the onhashchange listener
      location.hash = "reset";
    }

  }


  //create a new article object and write it to the database, then reset page
  function saveArticle() {

    //if form data passes validation test, proceed to create a var article object and save it to pouchdb
    if (validateForm()) {

      //if user is editing an old article, use the existing id and rev when creating the new article object
      if (location.hash !=="#new") {
        //set variables ID and REV to equal what you pulled in from pouch so they don't change on submission
        //console.log("taking old ID & REV values from existing article");
        var ID = $("#_id").val();
        var REV = $("#_rev").val();

      //else if this is a new record
      } else if (location.hash == "#new") {
        console.log("inventing new ID & REV values for new article");
        //create a new id based on current date and time to be a unique identifier
        var ID = new Date().toISOString();
        var REV = null;
      } else {
        console.log("something fishy is happening");
      }

      var article = {

        //these fields are created and updated without user input:
        _id: ID, // this will pull in the old ID (if existing) or a date-based one for a new record
        _rev: REV, // pulls in the old rev or null for a new record
        writerURL: ("/writer.html#"+ID),
        objectType: "article", //  will allow me to later have other types of objects (people, etc. in same DB)

        //these fields are updated by the user in the form:
        title: $("#title").val(), 
        articleType: $("#articleType").val(), 
        presenters: $("#presenters").val(), 
        event: $("#event").val(), 
        author: $("#author").val(), 
        mediumUsername: $("#mediumUsername").val(), 
        mediumWriterAdded: $("#mediumWriterAdded").prop("checked"), 
        roughVideoCheckbox: $("#roughVideoCheckbox").prop("checked"), 
        roughVideoURL: $("#roughVideoURL").val(), 
        notesCheckbox: $("#notesCheckbox").prop("checked"), 
        notesURL: $("#notesURL").val(), 
        picCheckbox: $("#picCheckbox").prop("checked"), 
        picURL: $("#picURL").val(), 
        targetDate: $("#targetDate").val(),
        draftReceived: $("#draftReceived").prop("checked"),
        draftURL: $("#draftURL").val(),
        Bradley: $("#Bradley").prop("checked"),
        Gregor: $("#Gregor").prop("checked"),
        Steven: $("#Steven").prop("checked"),
        Teri: $("#Teri").prop("checked"),
        editComplete: $("#editComplete").prop("checked"),
        testedTwitterCard: $("#testedTwitterCard").prop("checked"),
        scheduled: $("#scheduled").prop("checked"),
        scheduledDate: $("#scheduledDate").val(),
        published: $("#published").prop("checked"),
        publishedURL: $("#publishedURL").val(),
        publishedDate: $("#publishedDate").val(),
        updatedHomepage: $("#updatedHomepage").prop("checked"), 
        sharedTwitter: $("#sharedTwitter").prop("checked"), 
        sharedSlack: $("#sharedSlack").prop("checked"), 
        authorThanked: $("#authorThanked").prop("checked"),

        completed: $("#completed").prop("checked"),
      };


      //if this is a new record and therefore didn't have an old rev pulled in, delete the null rev
      //to avoid issues when saving to the DB
      if (location.hash == "new" || location.hash == "reset" || location.hash.length < 1) {
        console.log("deleting rev because this is a new article");
        delete article["_rev"];
      };

      console.log("State of article object BEFORE doing db.put: " +JSON.stringify(article));
      //write the new article record to the pouchDB database
      db.put(article
        //if writing to PouchDB is successful...
      ).then(function (response) {
        toast("Your record has been saved.", "green");
        console.log("State of article object WHILE doing db.put: " +JSON.stringify(article));
        //once article is successfully save, reset the page using our function
        modeReset();
        //if not successfully saved, show error
      }).catch(function (err) {
        toast("Saving to PouchDB didn't work. Please try again.", "red");
        console.log(err);
      });



    //else if form did not pass validation tests, make user fix it before saving
    } else {
      toast("Please address the error messages in red above before saving this form.", "red");
    }
  }// end saveArticle()

  //If there is a remote database, sync to/from it (make PouchDB talk to CouchDB)
  if (remoteCouch) {
    sync();
  }

  /*****************************************************
  UPDATE THE WRITER PAGE DISPLAY
  ******************************************************/

  //function called when user navigates to a writer page
  function modeWriter() {
    console.log("running modeWriter");
    //using the hash to recall unique ID
    var ID = window.location.hash.slice(1);

    //retrieve the relevant record from PouchDB
    //making it accessible as object "doc"
    db.get(ID, function(err, doc) {
      if (err) {
        toast("error getting requested article record from PouchDB", "red");
      } else {
        console.log(doc);

      //insert title into HTML field
      $("#title").html(doc.title);

      //insert author into HTML field
      $("#author").html(doc.author);

      //insert articleType into a hidden form element
      $("#articleType").val(doc.articleType);
      //this allows us to use the same function as earlier
      //to hide and reveal session-related content from the page
      sessionReveal();


      //If a video URL has been entered, add the link to the relevant li.
      //Otherwise, remove the li.
      if (doc.roughVideoURL !== "") {
        $("#roughVideoURL").attr("href", doc.roughVideoURL).html(doc.roughVideoURL);
      } else {
        $("#roughVideoURL").parent().remove();
      }

      //If a notes URL has been entered, add the link to the relevant li.
      //Otherwise, remove the li.
      if (doc.notesURL !== "") {
        $("#notesURL").attr("href", doc.notesURL).html(doc.notesURL);
      } else {
        $("#notesURL").parent().remove();
      }

      //If a pic URL has been entered, add the link to the relevant li.
      //Otherwise, remove the li.
      if (doc.picURL !== "") {
        $("#picURL").attr("href", doc.picURL).html(doc.picURL);
      } else {
        $("#picURL").parent().remove();
      }

      //if the number of list items is 0 (meaning there are no resources),
      //hide the section header and the instruction regarding resources available
      if ($("#writerResources li").length == 0) {
        $(".session.resourcesAvailable").hide();
      }

      //Update text based on whether the writer has been added to Medium already
      if (doc.mediumWriterAdded) {
        console.log("medium writer has beed added");
        $("#mediumWriterAdded").html("Since you've already been added as a writer, ");
      } else {
        console.log("i don't see a medium writer");
        $("#mediumWriterAdded").html("Once we've added you as writer, ");
      }

      } //end stuff to do if pulling from pouchdb is successful
    })
  } //end modeWriter


}); //end of onload

