/*
---

script: MooTemplatr.js

name: MooTemplatr

description: Creates a JSONP request and parses the result through a custom made HTML template

license: MIT-style license

authors:
  - Thomas Kunambi
  - kunambi
  - leeryloons

requires:
  - Core/Class
  - Core/Object
  - Core/Element
  - More/Request.JSONP
  - More/Date

provides: [MooTemplatr]

...
*/

var MooTemplatr = new Class({
    /**
     @this {MooTemplatr}
     @param {Array} Options for behaviours of the displaying of json data
     @description Creates a JSONP request and parses the result through a custom made HTML template
     @author Thomas Kunambi
     @version 1.0
     @jslint nomen: true, undef: true, sloppy: true, white: true, browser: true, devel: true
     */
    Implements: Options,
    options: {
        element: null,
        apiURL: "",
        actions: {},
        dateformat: "%Y-%m-%d %H:%M:%S",
        params: {},
        template: ""
    },
    /**
     @constructor
     @throws {String} If this.element can't be found, throw error
     @throws {Error} Console.logs any error messages
     */
    initialize: function(options) {
        this.setOptions(options);
        try {
            this.element = document.id(this.options.element) || this.options.element;
            if (this.element === null) {
                throw("DOM object not found");
            }
            if (!this.options.template.trim()) {
                throw("You need to specify a template for output");
            }
        } catch(e) {
            if (console !== "undefined") {
                console.log(e);
            }
            return;
        }

        var oQuery = Object.filter(this.options.params, function(value) {
            return value;
        });

        this.oSettings = {
            "API": this.options.apiURL,
            "query": oQuery,
            "jsonKey": "JSONP.",
            "htmlKey": "HTML."
        };

        this._setup();
    },
    /**
     @protected
     @return {void}
     @description collects and sets additional important variables
     @since 1.0
     */
    _setup: function() {
        this._fetch_data();
    },
    /**
     @protected
     @return {void}
     @description fetches data from API, caches it if needed, and parses response
     @since 1.0
     */
    _fetch_data: function() {
        var sEntireURL = this.oSettings.API + "?" + Object.toQueryString(this.oSettings.query),
            sJSONKey = this.oSettings.jsonKey + sEntireURL,
            sHTMLKey = this.oSettings.htmlKey + this.options.template,
            fnInterval = null,
            reqJson = new Request.JSONP({
                url: this.oSettings.API,
                data: this.oSettings.query,
                link: "chain",
                callbackKey: "callback",
                onComplete: function(oJSONP) {
                    this._set_cache(sJSONKey, JSON.encode(oJSONP));
                }.bind(this)
            }),
            reqTmpl = new Request({
                url: this.options.template,
                onSuccess: function(sHTML) {
                    this._set_cache(sHTMLKey, sHTML);
                }.bind(this)
            }),
            fnIsCached = function() {
                var sHTML = sessionStorage.getItem(sHTMLKey),
                    sJSON = JSON.decode(sessionStorage.getItem(sJSONKey));
                if (sHTML && sJSON) {
                    clearInterval(fnInterval);
                    this._manipulateData(sHTML, sJSON);
                }
            };

        if (!this.in_cache(sHTMLKey)) {
            reqTmpl.send();
        }

        if (!this.in_cache(sJSONKey)) {
            reqJson.send();
        }

        fnInterval = fnIsCached.periodical(10, this);
    },
    /**
     @protected
     @return {void}
     @description this method is supposed to be overridden if necessary to manipulate data after receival
     @param {String} sHTML   HTML template
     @param {Object} sJSON   serialised JSON-data
     @since 1.0
     */
    _manipulateData: function(sHTML, sJSON) {
        this._parse(sHTML, sJSON);
    },
    /**
     @protected
     @return {void}
     @description traverses the json-data and replaces the occurances it finds in the HTML template
     @param {String} template   HTML template
     @param {Object} jsonp      JSONP-data from API
     @since 1.0
     */
    _parse: function(template, jsonp) {
        var regTag = /[{]{2}\s*([a-zA-Z0-9._\-]+)\s*[}]{2}/mig,
            oUL = new Element("ul");

        Object.each(jsonp, function(oEntry) {
            var oNestedObjects = Object.filter(oEntry, function(value) {
                    return typeOf(value) === "object";
                }),
                sParsedHTML = "";

            if (Object.getLength(oNestedObjects)) {
                Object.each(oNestedObjects, function(oNestedValues, oName) {
                    Object.each(oNestedValues, function(value, key) {
                        oEntry[oName + "." + key] = value;
                    });
                });
            }
            oEntry = this._doAction(oEntry);
            sParsedHTML = template.substitute(oEntry, regTag);
            oUL.set("html", oUL.get("html") + sParsedHTML);
        }, this);

        document.id(this.element).adopt(oUL);
    },
    /**
     @protected
     @return {Object}
     @description returns the passed object - but parsed through another method, or untouched if no method exists
     @param {Object} oObj   an object to be parsed through any other method
     @since 0.8
     */
    _doAction: function(oObj) {
        Object.each(this.options.actions, function(action, key) {
            if (typeOf(this[action]) === "function") {
                oObj[key] = this[action](oObj[key]);
            }
        }, this);
        return oObj;
    },
    /**
     @protected
     @return {void}
     @description add new item with unique key to sessionStorage
     @param {String} sURL   an URL
     @param {String} sJSON  a serialised JSON object
     @since 1.0
     */
    _set_cache: function(sURL, sJSON) {
        sessionStorage.setItem(sURL, sJSON);
    },
    /**
     @public
     @return {Boolean}
     @description check wether the key exists in the sessionStorage
     @param {String} sURL   an URL, used as a key
     @since 1.0
     */
    in_cache: function(sURL) {
        return sessionStorage.getItem(sURL) !== null;
	},
    /**
     @public
     @return {void}
     @description clears the sessionStorage
     @since 1.0
     */
    clear_cache: function() {
        sessionStorage.clear();
    },
    /**
     @public
     @return {String}
     @description takes string and returns http://, ftp://, file:// clickable.
     @since 1.0
     */
    linkify: function(sText) {
        if (sText) {
            sText = sText.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/mig, '<a href="$1" rel="external">$1</a>');
        }
        return sText;
    },
    /**
     @public
     @return {String}
     @description formats date according to specification
     @see http://mootools.net/docs/more/Types/Date#Date:format
     @since 1.0
     */
    formatdate: function(sDate, sFormat) {
        var sNewFormat = sFormat||this.options.dateformat,
            dDate = Date.parse(sDate);
        return dDate.format(sNewFormat);
    }
});

MooTemplatr.Facebook = new Class({
    /**
     @this {MooTemplatr.Facebook}
     @param {Array} Options for behaviours of the displaying of json data
     @description Search through Facebooks open API for specific keywords
     @author Lotta Andersson & Thomas Kunambi
     @version 1.0
     */
    Extends: MooTemplatr,
    options: {
        apiURL: "https://graph.facebook.com/search",
        search: "23 critters", // Search for posts with these keywords.
        params: {
            type: "post", // The type of posts to return. Allowed values: post, events, application, groups, places, location and checkin
            center: "59.323009, 18.069798", // latitude and longitude, used with type=places or type=location
            distance: "1000", // distance from center, used with type=places or type=location
            limit: 5 // The number of posts to return. Is not supported with type=post
        }
    },
    _setup: function() {
        Object.append(this.oSettings.query, {"q": this.options.search});
        this._fetch_data();
    },
    _manipulateData: function(sHTML, oJSON) {
        this._parse(sHTML, oJSON.data);
    }
});

MooTemplatr.Twitter = new Class({
    /**
     @this {MooTemplatr.Twitter}
     @param {Array} Options for behaviours of the displaying of json data
     @description List Tweets for a specified Twitter username
     @author Thomas Kunambi
     @version 1.0
     */
    Extends: MooTemplatr,
    options: {
        apiURL: "http://api.twitter.com/1/statuses/user_timeline/",
        username: "23critters",
        actions: {
            "text": "linkify",
            "created_at": "formatdate"
        },
        params: {
            count: 5 // The number of tweets to return.
        }
    },
    _setup: function() {
        this.oSettings.API = this.options.apiURL + this.options.username + ".json";
        this._fetch_data();
    },
    /**
     @public
     @return {String}
     @description takes string and returns http://, ftp://, file:// clickable. Also @usernames and #tags
     @since 1.0
     */
    linkify: function(sText) {
        if (sText) {
            sText = sText.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/mig, '<a href="$1" rel="external">$1</a>');
            sText = sText.replace(/(^|\s)@(\w+)/g, '$1@<a href="http://www.twitter.com/$2">$2</a>');
            sText = sText.replace(/(^|\s)#(\w+)/g, '$1#<a href="http://www.twitter.com/search/$2">$2</a>');
        }
        return sText;
    }
});

MooTemplatr.Tumblr = new Class({
    /**
     @this {MooTemplatr.Tumblr}
     @param {Array} Options for behaviours of the displaying of json data
     @description List posts for a specified Tumblr username
     @author Thomas Kunambi
     @version 1.0
     */
    Extends: MooTemplatr,
    options: {
        apiURL: ".tumblr.com/api/read/json",
        username: "23critters",
        params: {
            num: 5, // The number of posts to return. The default is 20, the maximum is 50
            start: 0, // The post offset to start from.
            type: "all", // The type of posts to return. Allowed values: all, text, quote, photo, link, chat, video, or audio.
            id: null, // A specific post ID to return. Use instead of start, num, or type (set these to falsies).
            filter: "text", // Allowed values: text - Plain text, none - No post-processing. Output exactly what the author entered.
            search: "" // Search for posts with this query.
        },
        actions: {
            "url-with-slug": "linkify"
        }
    },
    _setup: function() {
        this.oSettings.API = "http://" + this.options.username + this.options.apiURL;
        this._fetch_data();
    },
    _manipulateData: function(sHTML, oJSON) {
        this._parse(sHTML, oJSON.posts);
    }
});

MooTemplatr.Youtube = new Class({
    /**
     @this {MooTemplatr.Youtube}
     @param {Array} Options for behaviours of the displaying of json data
     @description List videos for a specified Youtube user
     @author Thomas Kunambi
     @version 1.0
     */
    Extends: MooTemplatr,
    options: {
        apiURL: "https://gdata.youtube.com/feeds/api/videos",
        username: "23critters",
        params: {
            "max-results": 5 // default 1
        },
        actions: {
            "updated": "formatdate"
        }
    },
    _setup: function() {
        Object.append(this.oSettings.query, {"q": this.options.username, "v": 2, "alt": "jsonc"});
        this.oSettings.API = this.options.apiURL;
        this._fetch_data();
    },
    _manipulateData: function(sHTML, oJSON) {
        this._parse(sHTML, oJSON.data.items);
    }
});

MooTemplatr.Vimeo = new Class({
    /**
     @this {MooTemplatr.Vimeo}
     @param {Array} Options for behaviours of the displaying of json data
     @description List information about a specified Vimeo user
     @author Thomas Kunambi
     @version 1.0
     */
    Extends: MooTemplatr,
    options: {
        apiURL: "http://vimeo.com/api/v2/",
        type: "videos", // Allowed values: info, videos, likes, appears_in, all_videos, subscriptions, albums, channels, groups
        username: "23critters",
        params: {},
        actions: {
            "upload_date": "formatdate"
        }
    },
    _setup: function() {
        this.oSettings.API = this.options.apiURL + this.options.username + "/" + this.options.type + ".json";
        this._fetch_data();
    }
});

MooTemplatr.Reddit = new Class({
    /**
     @this {MooTemplatr.Reddit}
     @param {Array} Options for behaviours of the displaying of json data
     @description List information about a specified Reddit user
     @author Thomas Kunambi
     @version 1.0
     */
    Extends: MooTemplatr,
    options: {
        apiURL: "http://www.reddit.com/user/",
        type: "overview", // Allowed values: overview, submitted, commented, liked, disliked, hidden and saved
        username: "23critters",
        params: {
            limit: 5, // default 25
            sort: "new", // Allowed values: hot, new, top and controversial
            t: "all" // Allowed values: hour, day, week, month, year and all
        }
    },
    _setup: function() {
        Object.append(this.oSettings.query, {"jsonp": "Request.JSONP.request_map.request_0"});
        this.oSettings.API = this.options.apiURL + this.options.username + "/" + this.options.type + "/.json";
        this._fetch_data();
    },
    _manipulateData: function(sHTML, oJSON) {
        this._parse(sHTML, oJSON.data.children);
    }
});
