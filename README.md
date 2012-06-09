MooTemplatr
===========

MooTemplatr is a nifty widget, written in MooTools framework, that allows you to pull information via various APIs
about a certain user. Presents the information in an UL-list. You may template the output however you want. However,
please remember that the template's HTML is looped. All data is transfered in JSON/P.
All requests are cached within HTML5s sessionStorage
Download custom built mootools-more from http://mootools.net/more/8b71d9032491a52b5b31d4323243a5c3

How to use
-----------------

Javascript snippet to initialize the class:

	window.addEvent("domready", function() {
		var TD = new MooTemplatr({
			element: document.id("div#tweetdisplay"),
			username: "23critters"
		});
	});


HTML snippet:

	<div id="display">
	</div>

CSS selector to style the active navigation anchor, eg:

	DIV#display {background-color: #ccc;}

Options
-----------------
    element: (string||object) Reference to DOM element container. if passing a string, supply the elements' id
    count: (integer) How many posts to pull | default: 5
    template: (string) Path to the template containing the HTML | default: ""
    username: (string) Username of user from who to fetch information from | default: "23critters"
	actions: (object) A set of "instructions" if you want to pass information from the provider via different
	    parsers | default: {}
	dateformat: (string) A model over how to format the printed date, more information at
	    http://mootools.net/docs/more/Types/Date#Date:format | default: "%Y-%m-%d %H:%M:%S"


Methods
-----------------

The following methods are availible publicly:

    linkify: takes string and returns http://, ftp://, file:// clickable. Also @usernames and #tags
	formatdate: formats date according to specification at http://mootools.net/docs/more/Types/Date#Date:format
	clear_cache: clears the cache


Known bugs
-----------------

Known bugs that hopefully will be squashed in future releases

	* Only MooTemplatr.Twitter is working atm, working on the others


Notes
===========

Version 0.1

    * First version


Wish list
-----------------

Future features I'd like to implement

	* Set interval to empty cache
