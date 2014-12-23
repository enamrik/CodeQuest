/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"blog"}[chunkId]||chunkId) + ".app.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__.e/* require */(1, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(8), __webpack_require__(3), __webpack_require__(1), __webpack_require__(2), __webpack_require__(7)]; (function(ko, _, RootView, Post, $){

	    var Blog = function () {
	        this.postsInRange = ko.observable();
	        this.searchText = ko.observable();
	        this.throttledSearchText = ko.computed(this.searchText).extend({ throttle: 400 });
	    };

	    Blog.prototype.configure = function (data) {
	        var self = this;
	        this.buildPosts(data.postsInRange);
	        this.currentPost = new Post(data.lastPost);
	        this.pageTitle = this.currentPost.title;

	        this.throttledSearchText.subscribe(function (val) {
	            var searchTerm = val.trim();

	            self.get('/find-posts', { search: searchTerm }, function (data) {
	                self.buildPosts(data);
	            });
	        });

	        if(this.currentPost.enableComments){
	            this._setupComments();
	        }
	    };

	    Blog.prototype._setupComments = function() {
	        window.setTimeout(function() {
	            var dsq = window.document.createElement('script');
	            dsq.type = 'text/javascript';
	            dsq.async = true;
	            dsq.src = '//code-quest.disqus.com/embed.js';
	            (window.document.getElementsByTagName('head')[0] || window.document.getElementsByTagName('body')[0]).appendChild(dsq);
	        });
	    }

	    Blog.prototype.isCurrentPost = function (post) {
	        return post.shortTitle == this.currentPost.shortTitle;
	    };

	    Blog.prototype.postsInRangeUrl = function (post) {
	        return this.isCurrentPost(post) ? '#' : '/posts/' + post.shortTitle;
	    };

	    Blog.prototype.buildPosts = function(postsArray) {
	        this.postsInRange(_.map(postsArray, function (post) { return new Post(post); }));
	    }

	    RootView.start(Blog);
	}.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});


/***/ }
/******/ ])