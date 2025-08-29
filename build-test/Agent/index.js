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
exports.runAgent = runAgent;
exports.chooseCharacter = chooseCharacter;
exports.initAgent = initAgent;
var generative_ai_1 = require("@google/generative-ai");
var logger_1 = require("../config/logger");
var secret_1 = require("../secret");
var utils_1 = require("../utils");
var fs_1 = require("fs");
var path_1 = require("path");
var readlineSync = require("readline-sync");
function runAgent(schema, prompt) {
    return __awaiter(this, void 0, void 0, function () {
        var currentApiKeyIndex, geminiApiKey, generationConfig, googleAI, model, result, responseText, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentApiKeyIndex = 0;
                    geminiApiKey = secret_1.geminiApiKeys[currentApiKeyIndex];
                    if (!geminiApiKey) {
                        logger_1.default.error("No Gemini API key available.");
                        return [2 /*return*/, "No API key available."];
                    }
                    generationConfig = {
                        responseMimeType: "application/json",
                        responseSchema: schema,
                    };
                    googleAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
                    model = googleAI.getGenerativeModel({
                        model: "gemini-2.0-flash",
                        generationConfig: generationConfig,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, model.generateContent(prompt)];
                case 2:
                    result = _a.sent();
                    if (!result || !result.response) {
                        logger_1.default.info("No response received from the AI model. || Service Unavailable");
                        return [2 /*return*/, "Service unavailable!"];
                    }
                    responseText = result.response.text();
                    data = JSON.parse(responseText);
                    return [2 /*return*/, data];
                case 3:
                    error_1 = _a.sent();
                    return [4 /*yield*/, (0, utils_1.handleError)(error_1, currentApiKeyIndex, schema, prompt, runAgent)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function chooseCharacter() {
    logger_1.default.info("Starting character selection...");
    var charactersDir = (function () {
        var buildPath = path_1.default.join(__dirname, "characters");
        logger_1.default.info("Checking build path: ".concat(buildPath));
        if (fs_1.default.existsSync(buildPath)) {
            logger_1.default.info("Using build path for characters");
            return buildPath;
        }
        else {
            // Fallback to source directory
            var sourcePath = path_1.default.join(process.cwd(), "src", "Agent", "characters");
            logger_1.default.info("Using source path for characters: ".concat(sourcePath));
            return sourcePath;
        }
    })();
    var files = fs_1.default.readdirSync(charactersDir);
    logger_1.default.info("Found files in characters directory: ".concat(files.join(", ")));
    var jsonFiles = files.filter(function (file) { return file.endsWith(".json"); });
    logger_1.default.info("Found JSON files: ".concat(jsonFiles.join(", ")));
    if (jsonFiles.length === 0) {
        throw new Error("No character JSON files found");
    }
    var selectedFile;
    // Check if CHARACTER environment variable is set
    var envCharacter = process.env.CHARACTER;
    if (envCharacter) {
        var matchingFile = jsonFiles.find(function (file) {
            return file.toLowerCase().includes(envCharacter.toLowerCase()) ||
                file === envCharacter;
        });
        if (matchingFile) {
            selectedFile = matchingFile;
            logger_1.default.info("Using character from environment: ".concat(selectedFile));
        }
        else {
            logger_1.default.warn("Character \"".concat(envCharacter, "\" not found, using default"));
            selectedFile = jsonFiles[0];
        }
    }
    else if (process.stdin.isTTY) {
        // Interactive mode - only if TTY is available
        console.log("Select a character:");
        jsonFiles.forEach(function (file, index) {
            console.log("".concat(index + 1, ": ").concat(file));
        });
        var answer = readlineSync.question("Enter the number of your choice: ");
        var selection = parseInt(answer);
        if (isNaN(selection) || selection < 1 || selection > jsonFiles.length) {
            throw new Error("Invalid selection");
        }
        selectedFile = jsonFiles[selection - 1];
    }
    else {
        // Non-interactive mode - use first character as default
        selectedFile = jsonFiles[0];
        logger_1.default.info("Running in non-interactive mode, using default character: ".concat(selectedFile));
    }
    var chosenFile = path_1.default.join(charactersDir, selectedFile);
    var data = fs_1.default.readFileSync(chosenFile, "utf8");
    var characterConfig = JSON.parse(data);
    return characterConfig;
}
function initAgent() {
    try {
        var character = chooseCharacter();
        console.log("Character selected:", character);
        return character;
    }
    catch (error) {
        console.error("Error selecting character:", error);
        if (process.env.NODE_ENV === "development") {
            logger_1.default.warn("Skipping agent initialization in development mode due to error");
            return null;
        }
        else {
            process.exit(1);
        }
    }
}
if (require.main === module) {
    (function () {
        initAgent();
    })();
}
