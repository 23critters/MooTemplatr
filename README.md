MooTemplatr
===========

MooTemplatr is a nifty widget, written in MooTools framework, that allows you to pull information via various public APIs about a certain user or search query.
Presents the information in an UL-list. You may template the output however you want. However, please remember that the template's HTML is looped.
All data is transfered in JSON/P. All requests are cached within HTML5s sessionStorage
Download custom built mootools-more from http://mootools.net/more/8b71d9032491a52b5b31d4323243a5c3

How to use
-----------------

Javascript snippet to initialize the class:

	var t1 = new MooTemplatr.Twitter({
		params: {
            count: 3
        },
		element: "listposts",
		username: "23critters",
        dateformat: "%H:%M",
		template: "TwitterTemplate.html",
        actions: {
            "created_at": "formatdate"
        }
    });


HTML snippet:

	<div id="listposts">
	</div>


Options
-----------------
    element: (string||object) Reference to DOM element container. if passing a string, supply the elements' id
    count: (integer) How many posts to pull | default: 5
    template: (string) Path to the template containing the HTML | default: ""
    username: (string) Username of user from who to fetch information from | default: "23 critters"
	actions: (object) A set of "instructions" if you want to pass information from the provider via different
	    parsers | default: {}
	dateformat: (string) A model over how to format the printed date, more information at
	    http://mootools.net/docs/more/Types/Date#Date:format | default: "%Y-%m-%d %H:%M:%S"
    cachetime: (integer) The amount of seconds between every time we clear the cache | default: 60 * 60 * 24 * 7 (once every week)

    Please check source code for the various sub-classes' options/actions.

Methods
-----------------

The following methods are availible publicly:

    linkify: takes string and returns http://, ftp://, file:// clickable.
	formatdate: formats date according to specification at http://mootools.net/docs/more/Types/Date#Date:format
	in_cache: returns boolean wether sessionStorage holds the key
	clear_cache: clears the cache


Notes
===========

Version 1.1

    * Added an search option for Twitter sub-class. If propagated it will override the default behaviour of pulling tweets from a single user. Read more about their search operators here: https://dev.twitter.com/docs/using-search
    * Added timeout for how often the cache should be cleared out. Default is once every year
    * Fixed bug: Dates from Reddit wasn't automaticly parsed.

Version 1.0

    * Squashed numerous bugs
    * Fixed caching properly
    * Fixed Facebook search

Version 0.1

    * First version


Known bugs
-----------------

Known bugs that hopefully will be squashed in future releases

    * For unknown reasons, the date passed to formatDate is sometimes an empty string
	* If you find any, please create an issue on GitHub


Wish list
-----------------

Future features I'd like to implement

    * Support for oAuth since Twitter will require it, even for their public APIs
    * Add sub-class for Instagram and Pinterest
