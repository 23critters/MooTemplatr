Tweet Display
===========

Tweet Display is a nifty widget, written in MooTools framework, that allows you to pull information via Twitters API
about a certain user. Presents the tweets in a UL-list. You may template the output however you want. However, please
remember that the template's HTML is looped. All data is transfered in JSON/P.
Bundled with custom built mootools-more

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

	<div id="tweetdisplay">
	</div>

CSS selector to style the active navigation anchor, eg:

	DIV#tweetdisplay {background-color: #ccc;}

Options
-----------------
    element: (string||object) Reference to DOM element container. if passing a string, supply the elements' id
    count: (integer) How many tweets to pull | default: 5
    template: (string) Path to the template containing the HTML | default: "MooTemplatr.html"
    username: (string) Username of user from who to fetch information from | default: "23critters"
	actions: (object) A set of "instructions" if you want to pass information from Twitter via different
	    parsers | default: {"text":"linkify", "created_at":"formatdate"}
	dateformat: (string) A model over how to format the printed date, more information at
	    http://mootools.net/docs/more/Types/Date#Date:format | default: "%Y-%m-%d %H:%M:%S"
	locale: (string) When you parse the date, define which locale you'd like to use (requires More/Locale/Locale,
	    but is already dependency of Date.js). More information at http://mootools.net/docs/more/Locale/Date


Methods
-----------------

The following methods are availible publicly:

    linkify: takes string and returns http://, ftp://, file:// clickable. Also @usernames and #tags
	formatdate: formats date according to specification at http://mootools.net/docs/more/Types/Date#Date:format
	clear_cache: clears the cache


Known bugs
-----------------

Known bugs that hopefully will be squashed in future releases

	* None atm


Notes
===========
Version 1.1

	* Incremented version number just to force Mootools Forge to display latest commit

Version 1.0

    * Added cache! Will use sessionStorage in order to cache various requests when applicable.
    * Enabled parsing of nested objects. Eg, use can use {{ user.id }} in order to print the user-id
        * Please note: the option "actions" has had its keys places switched to [field_to_parse]:[method_to_call]

Version 0.9

	* Added ability to format date according to chosen Locale
	* Note: I will increment version number to 1.0 when I've resolved bug #1

Version 0.8

	* Added the ability to send information from the JSON/P response to various methods, at this time there's only "linkify" and "formatdate"
	* Added option to allow formation of dates
	* Tweet texts should be linkable. URL, #tags and @usernames

Version 0.1

    * First version


Wish list
-----------------

Future features I'd like to implement

	* Make this class stand-alone from Twitter


