/**
 * Created by xeonwell on 2016/3/22.
 */
var asdf = function () {
    "use strict";

    //polyfill
    // getComputedStyle shouldn't freak out when called
    // without a valid element as argument
    try {
        getComputedStyle(undefined)
    } catch (e) {
        var nativeGetComputedStyle = getComputedStyle;
        window.getComputedStyle = function (element) {
            try {
                return nativeGetComputedStyle(element)
            } catch (e) {
                return null
            }
        }
    }

    //
    var asdf = {};
    var PAGE_NAME = "data-page",
        PAGE_CLASS = "app-page";

    var document = window.document, emptyArray = [], emptyClass = {},
        isArray = Array.isArray ||
            function (object) {
                return object instanceof Array
            };

    var readyRE = /complete|loaded|interactive/;



    /**
     * 框架配置
     * @type {{}}
     */
    asdf.config = {
        isDebug: true,
    };

    var util = asdf.util = {
        /**
         * zepto
         * @param callback
         * @returns {asdf.util}
         */
        ready: function (callback) {
            if (typeof callback !== 'function') {
                return;
            }
            // need to check if document.body exists for IE as that browser reports
            // document ready when it hasn't yet created the body element
            if (readyRE.test(document.readyState) && document.body) callback(asdf);
            else document.addEventListener('DOMContentLoaded', function () {
                callback(asdf)
            }, false);
            return this;
        },
        isArray: isArray,
    };

    function emptyFunction() {
    }

    /**
     *
     * @param elem
     * @returns {boolean}
     */
    function isNode(elem) {
        return elem != null
            && typeof elem === 'object'
            && (elem instanceof Node) || (elem instanceof HTMLElement)
            && typeof elem.nodeType === 'number'
            && typeof elem.nodeName === 'string';
    }


    var pageStack = [],
        currentNode, parentNode,
        pages = {},
        controllers = {};

    util.ready(function () {
        var pageNodes = document.getElementsByClassName(PAGE_CLASS);
        while (pageNodes.length) {
            addPage(pageNodes[0]);
        }
    });

    /**
     *
     * @param {String} pageName
     * @param {HTMLElement} page
     */
    function addPage(pageName, page) {
        if (typeof pageName !== 'string') {
            page = pageName;
            pageName = undefined;
        }
        if (!isNode(page)) {
            throw TypeError('page template node must be a DOM node, got ' + page);
        }
        pageName = page.getAttribute(PAGE_NAME);
        if (!pageName) {
            throw TypeError('page name was not specified');
        }
        //console.log(pageName);
        page.setAttribute(PAGE_NAME, pageName);
        if (page.parentNode) {
            if (!parentNode)
                parentNode = page.parentNode;
            page.parentNode.removeChild(page);
        }
        pages[pageName] = page.cloneNode(true);
    }

    /**
     *
     * @param pageName
     * @returns {boolean}
     */
    function hasPage(pageName) {
        return (pageName in pages);
    }

    /**
     *
     * @param pageName
     * @returns {Node|Element|DocumentFragment|*}
     */
    function clonePage(pageName) {
        if (!hasPage(pageName)) {
            throw TypeError(pageName + ' is not a known page');
        }
        return pages[pageName].cloneNode(true);
    }

    /**
     *
     * @param pageName
     * @param controller
     */
    function addController(pageName, controller) {
        controllers[pageName] = controller;
    }

    /**
     * load page
     * @param pageName
     * @param args
     * @param options
     * @param callback
     * @returns {boolean}
     */
    function loadPage(pageName, args, options, callback) {
        if (!hasPage(pageName)) return false;
        var oldNode = currentNode;
        currentNode = pages[pageName].cloneNode(true);
        processPage(currentNode);
        var context = {options: options, callback: callback};
        var controller = controllers[pageName];
        var vueObj, resultObj;

        if (controller){
            resultObj = controller.call(context, currentNode, args);
        }
        if (resultObj && typeof resultObj === 'object') {
            if (!resultObj.el)
                resultObj.el = currentNode;
            vueObj = new Vue(resultObj);
        }
        pageStack.push([
            pageName,
            currentNode,
            controller,
            args,
            context,
            vueObj
        ]);
        if (parentNode) {
            if (!oldNode)
                parentNode.appendChild(currentNode);
            else
                parentNode.replaceChild(currentNode, oldNode);
        }
    }

    /**
     *
     * @param page
     */
    function processPage(page) {

    }

    /**
     *
     * @param pageName
     * @param controller
     */
    asdf.controller = function (pageName, controller) {
        if (typeof pageName !== 'string') {
            throw TypeError('page name must be a string, got ' + pageName);
        }

        if (typeof controller !== 'function') {
            throw TypeError('page controller must be a function, got ' + controller);
        }

        if (controller) {
            addController(pageName, controller);
        }
    };
    asdf.load = function (pageName, args, options, callback) {
        if (typeof pageName !== 'string') {
            throw TypeError('page name must be a string, got ' + pageName);
        }
        switch (typeof args) {
            case 'function':
                options = args;
                args = {};
            case 'string':
                callback = options;
                options = args;
            case 'undefined':
                args = {};
            case 'object':
                break;
            default:
                throw TypeError('page arguments must be an object if defined, got ' + args);
        }
        switch (typeof options) {
            case 'function':
                callback = options;
            case 'undefined':
                options = {};
            case 'object':
                break;
            case 'string':
                options = {transition: options};
                break;
            default:
                throw TypeError('options must be an object if defined, got ' + options);
        }
        switch (typeof callback) {
            case 'undefined':
                callback = function () {
                };
            case 'function':
                break;
            default:
                throw TypeError('callback must be a function if defined, got ' + callback);
        }

        return loadPage(pageName, args, options, callback);
    };

    Object.freeze(asdf);
    return asdf;
}();
