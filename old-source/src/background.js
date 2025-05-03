// background.js

// Constants for translation API configuration
const DEFAULT_TARGET_LANGUAGE = "en";
const API_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize cache for translations
let translationCache = {};

// Message listener for communication between components
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "translate") {
    // Check cache first
    const cacheKey = `${request.text}-${
      request.targetLang || DEFAULT_TARGET_LANGUAGE
    }`;
    if (
      translationCache[cacheKey] &&
      Date.now() - translationCache[cacheKey].timestamp < API_CACHE_DURATION
    ) {
      sendResponse({ translation: translationCache[cacheKey].translation });
      return true;
    }

    // Implement translation API client here
    const text = encodeURIComponent(request.text);
    const targetLang = request.targetLang || DEFAULT_TARGET_LANGUAGE;
    const apiKey = "google_key-temple"; // Replace with your actual API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${text}&target=${targetLang}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (
          data.data &&
          data.data.translations &&
          data.data.translations.length > 0
        ) {
          const translation = data.data.translations[0].translatedText;

          // Add to cache
          translationCache[cacheKey] = {
            translation: translation,
            timestamp: Date.now(),
          };

          sendResponse({ translation: translation });
        } else {
          throw new Error("Invalid API response format");
        }
      })
      .catch((error) => {
        console.error("Error translating:", error);
        sendResponse({
          translation: "Translation failed.",
          error: error.message,
        });
      });

    // Return true to indicate async response
    return true;
  } else if (request.message === "saveWord") {
    saveWord(request.word);
    return true;
  } else if (request.message === "getWords") {
    getWords(function (words) {
      sendResponse({ words: words });
    });
    return true;
  } else if (request.message === "deleteWord") {
    deleteWord(request.wordId);
    return true;
  } else if (request.message === "updateWord") {
    updateWord(request.word);
    return true;
  } else if (request.message === "exportDictionary") {
    exportDictionary(function (data) {
      sendResponse({ data: data });
    });
    return true;
  } else if (request.message === "importDictionary") {
    importDictionary(request.data, request.mergeOption);
    return true;
  }
});

// Create context menu for translation
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "translateSelection",
    title: "Translate Selection",
    contexts: ["selection"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "translateSelection") {
    chrome.tabs.sendMessage(tab.id, {
      message: "contextMenuTranslate",
      text: info.selectionText,
    });
  }
});

// Storage functions
function saveWord(word) {
  chrome.storage.local.get({ words: [] }, function (data) {
    const words = data.words;

    // Check if word already exists to avoid duplicates
    const existingIndex = words.findIndex(
      (w) =>
        w.original === word.original && w.targetLanguage === word.targetLanguage
    );

    if (existingIndex >= 0) {
      // Update existing word
      words[existingIndex] = {
        ...words[existingIndex],
        ...word,
        timestamp: Date.now(), // Update timestamp
      };
    } else {
      // Add new word
      word.id = Date.now().toString(); // Generate unique ID
      words.push(word);
    }

    chrome.storage.local.set({ words: words });
  });
}

function getWords(callback) {
  chrome.storage.local.get({ words: [] }, function (data) {
    callback(data.words);
  });
}

function deleteWord(wordId) {
  chrome.storage.local.get({ words: [] }, function (data) {
    let words = data.words;
    words = words.filter((word) => word.id !== wordId);
    chrome.storage.local.set({ words: words });
  });
}

function updateWord(updatedWord) {
  chrome.storage.local.get({ words: [] }, function (data) {
    let words = data.words;
    const index = words.findIndex((word) => word.id === updatedWord.id);

    if (index >= 0) {
      words[index] = updatedWord;
      chrome.storage.local.set({ words: words });
    }
  });
}

function exportDictionary(callback) {
  chrome.storage.local.get({ words: [] }, function (data) {
    const exportData = {
      words: data.words,
      exportDate: Date.now(),
      version: "1.0",
    };

    callback(JSON.stringify(exportData));
  });
}

function importDictionary(jsonData, mergeOption = "append") {
  try {
    const importedData = JSON.parse(jsonData);

    if (!importedData.words || !Array.isArray(importedData.words)) {
      throw new Error("Invalid import format");
    }

    chrome.storage.local.get({ words: [] }, function (data) {
      let currentWords = data.words;
      const importedWords = importedData.words;

      switch (mergeOption) {
        case "replace":
          // Replace all existing words
          currentWords = importedWords;
          break;
        case "merge":
          // Merge, replacing duplicates with imported versions
          const wordMap = new Map();

          // First add all current words to the map
          currentWords.forEach((word) => {
            wordMap.set(word.id, word);
          });

          // Then override with imported words
          importedWords.forEach((word) => {
            wordMap.set(word.id, word);
          });

          // Convert map back to array
          currentWords = Array.from(wordMap.values());
          break;
        case "append":
        default:
          // Simply append new words
          currentWords = currentWords.concat(importedWords);
          break;
      }

      chrome.storage.local.set({ words: currentWords });
    });
  } catch (error) {
    console.error("Error importing dictionary:", error);
  }
}

// Clean up old cache entries periodically
function cleanupCache() {
  const now = Date.now();
  for (const key in translationCache) {
    if (now - translationCache[key].timestamp > API_CACHE_DURATION) {
      delete translationCache[key];
    }
  }
}

// Run cache cleanup every hour
setInterval(cleanupCache, 60 * 60 * 1000);
