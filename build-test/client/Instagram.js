"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInstagram = runInstagram;
var puppeteer_1 = require("puppeteer");
var puppeteer_extra_1 = require("puppeteer-extra");
var puppeteer_extra_plugin_stealth_1 = require("puppeteer-extra-plugin-stealth");
var puppeteer_extra_plugin_adblocker_1 = require("puppeteer-extra-plugin-adblocker");
var proxy_chain_1 = require("proxy-chain");
var secret_1 = require("../secret");
var logger_1 = require("../config/logger");
var utils_1 = require("../utils");
var Agent_1 = require("../Agent");
var schema_1 = require("../Agent/schema");
// Add stealth plugin to puppeteer
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_adblocker_1.default)({
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: puppeteer_1.DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
}));
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
function runInstagram() {
    return __awaiter(this, void 0, void 0, function () {
        var server, proxyUrl, browser, page, cookiesPath, checkCookies, cookies, isLoggedIn, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check if Instagram credentials are properly configured
                    if (!secret_1.IGusername ||
                        secret_1.IGusername === "default_IGusername" ||
                        !secret_1.IGpassword ||
                        secret_1.IGpassword === "default_IGpassword") {
                        logger_1.default.info("Instagram credentials not configured. Skipping Instagram automation in development mode.");
                        return [2 /*return*/];
                    }
                    server = new proxy_chain_1.Server({ port: 8000 });
                    return [4 /*yield*/, server.listen()];
                case 1:
                    _a.sent();
                    proxyUrl = "http://localhost:8000";
                    return [4 /*yield*/, puppeteer_extra_1.default.launch({
                            headless: process.env.NODE_ENV === "development" ? true : false,
                            args: [
                                "--proxy-server=".concat(proxyUrl),
                                "--no-sandbox",
                                "--disable-setuid-sandbox",
                                "--disable-dev-shm-usage",
                                "--disable-accelerated-2d-canvas",
                                "--no-first-run",
                                "--no-zygote",
                                "--disable-gpu",
                            ],
                        })];
                case 2:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _a.sent();
                    cookiesPath = "./cookies/Instagramcookies.json";
                    return [4 /*yield*/, (0, utils_1.Instagram_cookiesExist)()];
                case 4:
                    checkCookies = _a.sent();
                    logger_1.default.info("Checking cookies existence: ".concat(checkCookies));
                    if (!checkCookies) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, utils_1.loadCookies)(cookiesPath)];
                case 5:
                    cookies = _a.sent();
                    return [4 /*yield*/, page.setCookie.apply(page, cookies)];
                case 6:
                    _a.sent();
                    logger_1.default.info("Cookies loaded and set on the page.");
                    // Navigate to Instagram to verify if cookies are valid
                    return [4 /*yield*/, page.goto("https://www.instagram.com/", {
                            waitUntil: "networkidle2",
                        })];
                case 7:
                    // Navigate to Instagram to verify if cookies are valid
                    _a.sent();
                    return [4 /*yield*/, page.$("a[href='/direct/inbox/']")];
                case 8:
                    isLoggedIn = _a.sent();
                    if (!isLoggedIn) return [3 /*break*/, 9];
                    logger_1.default.info("Login verified with cookies.");
                    return [3 /*break*/, 11];
                case 9:
                    logger_1.default.warn("Cookies invalid or expired. Logging in again...");
                    return [4 /*yield*/, loginWithCredentials(page, browser)];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11: return [3 /*break*/, 14];
                case 12: 
                // If no cookies are available, perform login with credentials
                return [4 /*yield*/, loginWithCredentials(page, browser)];
                case 13:
                    // If no cookies are available, perform login with credentials
                    _a.sent();
                    _a.label = 14;
                case 14: 
                // Optionally take a screenshot after loading the page
                return [4 /*yield*/, page.screenshot({ path: "logged_in.png" })];
                case 15:
                    // Optionally take a screenshot after loading the page
                    _a.sent();
                    // Navigate to the Instagram homepage
                    return [4 /*yield*/, page.goto("https://www.instagram.com/")];
                case 16:
                    // Navigate to the Instagram homepage
                    _a.sent();
                    _a.label = 17;
                case 17:
                    if (!true) return [3 /*break*/, 24];
                    return [4 /*yield*/, interactWithPosts(page)];
                case 18:
                    _a.sent();
                    logger_1.default.info("Iteration complete, waiting 30 seconds before refreshing...");
                    return [4 /*yield*/, delay(30000)];
                case 19:
                    _a.sent();
                    _a.label = 20;
                case 20:
                    _a.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, page.reload({ waitUntil: "networkidle2" })];
                case 21:
                    _a.sent();
                    return [3 /*break*/, 23];
                case 22:
                    e_1 = _a.sent();
                    logger_1.default.warn("Error reloading page, continuing iteration: " + e_1);
                    return [3 /*break*/, 23];
                case 23: return [3 /*break*/, 17];
                case 24: return [2 /*return*/];
            }
        });
    });
}
var loginWithCredentials = function (page, browser) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                return [4 /*yield*/, page.goto("https://www.instagram.com/accounts/login/")];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.waitForSelector('input[name="username"]')];
            case 2:
                _a.sent();
                // Fill out the login form
                return [4 /*yield*/, page.type('input[name="username"]', secret_1.IGusername)];
            case 3:
                // Fill out the login form
                _a.sent(); // Replace with your username
                return [4 /*yield*/, page.type('input[name="password"]', secret_1.IGpassword)];
            case 4:
                _a.sent(); // Replace with your password
                return [4 /*yield*/, page.click('button[type="submit"]')];
            case 5:
                _a.sent();
                // Wait for navigation after login
                return [4 /*yield*/, page.waitForNavigation()];
            case 6:
                // Wait for navigation after login
                _a.sent();
                return [4 /*yield*/, browser.cookies()];
            case 7:
                cookies = _a.sent();
                // logger.info("Saving cookies after login...",cookies);
                return [4 /*yield*/, (0, utils_1.saveCookies)("./cookies/Instagramcookies.json", cookies)];
            case 8:
                // logger.info("Saving cookies after login...",cookies);
                _a.sent();
                return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                // logger.error("Error logging in with credentials:", error);
                logger_1.default.error("Error logging in with credentials:");
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
function interactWithPosts(page) {
    return __awaiter(this, void 0, void 0, function () {
        var postIndex, maxPosts, postSelector, likeButtonSelector, likeButton, ariaLabel, captionSelector, captionElement, caption, moreLinkSelector, moreLink, expandedCaption, commentBoxSelector, commentBox, prompt_1, schema, result, comment, postButton, waitTime, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    postIndex = 1;
                    maxPosts = 50;
                    _b.label = 1;
                case 1:
                    if (!(postIndex <= maxPosts)) return [3 /*break*/, 31];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 29, , 30]);
                    postSelector = "article:nth-of-type(".concat(postIndex, ")");
                    return [4 /*yield*/, page.$(postSelector)];
                case 3:
                    // Check if the post exists
                    if (!(_b.sent())) {
                        console.log("No more posts found. Ending iteration...");
                        return [2 /*return*/];
                    }
                    likeButtonSelector = "".concat(postSelector, " svg[aria-label=\"Like\"]");
                    return [4 /*yield*/, page.$(likeButtonSelector)];
                case 4:
                    likeButton = _b.sent();
                    return [4 /*yield*/, (likeButton === null || likeButton === void 0 ? void 0 : likeButton.evaluate(function (el) {
                            return el.getAttribute("aria-label");
                        }))];
                case 5:
                    ariaLabel = _b.sent();
                    if (!(ariaLabel === "Like")) return [3 /*break*/, 8];
                    console.log("Liking post ".concat(postIndex, "..."));
                    return [4 /*yield*/, likeButton.click()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, page.keyboard.press("Enter")];
                case 7:
                    _b.sent();
                    console.log("Post ".concat(postIndex, " liked."));
                    return [3 /*break*/, 9];
                case 8:
                    if (ariaLabel === "Unlike") {
                        console.log("Post ".concat(postIndex, " is already liked."));
                    }
                    else {
                        console.log("Like button not found for post ".concat(postIndex, "."));
                    }
                    _b.label = 9;
                case 9:
                    captionSelector = "".concat(postSelector, " div.x9f619 span._ap3a div span._ap3a");
                    return [4 /*yield*/, page.$(captionSelector)];
                case 10:
                    captionElement = _b.sent();
                    caption = "";
                    if (!captionElement) return [3 /*break*/, 12];
                    return [4 /*yield*/, captionElement.evaluate(function (el) { return el.innerText; })];
                case 11:
                    caption = _b.sent();
                    console.log("Caption for post ".concat(postIndex, ": ").concat(caption));
                    return [3 /*break*/, 13];
                case 12:
                    console.log("No caption found for post ".concat(postIndex, "."));
                    _b.label = 13;
                case 13:
                    moreLinkSelector = "".concat(postSelector, " div.x9f619 span._ap3a span div span.x1lliihq");
                    return [4 /*yield*/, page.$(moreLinkSelector)];
                case 14:
                    moreLink = _b.sent();
                    if (!moreLink) return [3 /*break*/, 17];
                    console.log("Expanding caption for post ".concat(postIndex, "..."));
                    return [4 /*yield*/, moreLink.click()];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, captionElement.evaluate(function (el) { return el.innerText; })];
                case 16:
                    expandedCaption = _b.sent();
                    console.log("Expanded Caption for post ".concat(postIndex, ": ").concat(expandedCaption));
                    caption = expandedCaption;
                    _b.label = 17;
                case 17:
                    commentBoxSelector = "".concat(postSelector, " textarea");
                    return [4 /*yield*/, page.$(commentBoxSelector)];
                case 18:
                    commentBox = _b.sent();
                    if (!commentBox) return [3 /*break*/, 25];
                    console.log("Commenting on post ".concat(postIndex, "..."));
                    prompt_1 = "Craft a thoughtful, engaging, and mature reply to the following post: \"".concat(caption, "\". Ensure the reply is relevant, insightful, and adds value to the conversation. It should reflect empathy and professionalism, and avoid sounding too casual or superficial. also it should be 300 characters or less. and it should not go against instagram Community Standards on spam. so you will have to try your best to humanize the reply");
                    schema = (0, schema_1.getInstagramCommentSchema)();
                    return [4 /*yield*/, (0, Agent_1.runAgent)(schema, prompt_1)];
                case 19:
                    result = _b.sent();
                    comment = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.comment;
                    return [4 /*yield*/, commentBox.type(comment)];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, page.evaluateHandle(function () {
                            var buttons = Array.from(document.querySelectorAll('div[role="button"]'));
                            return buttons.find(function (button) {
                                return button.textContent === "Post" && !button.hasAttribute("disabled");
                            });
                        })];
                case 21:
                    postButton = _b.sent();
                    if (!postButton) return [3 /*break*/, 23];
                    console.log("Posting comment on post ".concat(postIndex, "..."));
                    return [4 /*yield*/, postButton.click()];
                case 22:
                    _b.sent();
                    console.log("Comment posted on post ".concat(postIndex, "."));
                    return [3 /*break*/, 24];
                case 23:
                    console.log("Post button not found.");
                    _b.label = 24;
                case 24: return [3 /*break*/, 26];
                case 25:
                    console.log("Comment box not found.");
                    _b.label = 26;
                case 26:
                    waitTime = Math.floor(Math.random() * 5000) + 5000;
                    console.log("Waiting ".concat(waitTime / 1000, " seconds before moving to the next post..."));
                    return [4 /*yield*/, delay(waitTime)];
                case 27:
                    _b.sent();
                    // Scroll to the next post
                    return [4 /*yield*/, page.evaluate(function () {
                            window.scrollBy(0, window.innerHeight);
                        })];
                case 28:
                    // Scroll to the next post
                    _b.sent();
                    postIndex++;
                    return [3 /*break*/, 30];
                case 29:
                    error_2 = _b.sent();
                    console.error("Error interacting with post ".concat(postIndex, ":"), error_2);
                    return [3 /*break*/, 31];
                case 30: return [3 /*break*/, 1];
                case 31: return [2 /*return*/];
            }
        });
    });
}
