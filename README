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

	var t1 = new MooTemplatr.Twitter({
		params: {
            count: 3
        },
		element: "listtweet",
		username: "23critters",
        dateformat: "%H:%M",
		template: "TwitterTemplate.html",
        actions: {
            "created_at": "formatdate"
        }
    });


HTML snippet:

	<div id="listtweet">
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

    Please check source code for the various sub-classes' options.

Methods
-----------------

The following methods are availible publicly:

    linkify: takes string and returns http://, ftp://, file:// clickable.
	formatdate: formats date according to specification at http://mootools.net/docs/more/Types/Date#Date:format
	in_cache: returns boolean wether sessionStorage holds the key
	clear_cache: clears the cache


Known bugs
-----------------

Known bugs that hopefully will be squashed in future releases

	* None, please create an issue on GitHub


Notes
===========

Version 1.0

    * Squashed numerous bugs
    * Fixed caching properly
    * Fixed Facebook search

Version 0.1

    * First version


Wish list
-----------------

Future features I'd like to implement

    * Add sub-class for Instagram and Pinterest
	* Set interval to empty cache
