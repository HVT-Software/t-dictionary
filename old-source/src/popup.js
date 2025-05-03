// popup.js

document.addEventListener("DOMContentLoaded", function () {
  // Initialize UI
  initializePopup();

  // Load saved words
  loadSavedWords();

  // Event listeners for tab switching
  document.getElementById("dict-tab").addEventListener("click", function () {
    switchTab("dictionary");
  });

  document
    .getElementById("settings-tab")
    .addEventListener("click", function () {
      switchTab("settings");
    });

  // Set up export/import buttons
  document
    .getElementById("export-btn")
    .addEventListener("click", exportDictionary);
  document.getElementById("import-btn").addEventListener("click", function () {
    document.getElementById("import-file").click();
  });

  document
    .getElementById("import-file")
    .addEventListener("change", importDictionary);

  // Set up search box
  document.getElementById("search-box").addEventListener("input", filterWords);

  // Set up sort selection
  document
    .getElementById("sort-select")
    .addEventListener("change", function () {
      loadSavedWords(); // Reload with new sort
    });
});

function initializePopup() {
  // Default to dictionary tab
  switchTab("dictionary");
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach(function (tab) {
    tab.style.display = "none";
  });

  // Deactivate all tab buttons
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabName + "-content").style.display = "block";

  // Activate selected tab button
  document.getElementById(tabName + "-tab").classList.add("active");
}

function loadSavedWords() {
  chrome.runtime.sendMessage({ message: "getWords" }, function (response) {
    const words = response.words || [];
    const sortOption = document.getElementById("sort-select").value;
    const wordList = document.getElementById("word-list");

    // Clear current list
    wordList.innerHTML = "";

    // Sort the words
    sortWords(words, sortOption);

    if (words.length === 0) {
      wordList.innerHTML =
        '<div class="empty-message">Your dictionary is empty. Translate and save words to see them here.</div>';
      return;
    }

    // Create word items
    words.forEach(function (word) {
      const wordItem = createWordItem(word);
      wordList.appendChild(wordItem);
    });
  });
}

function sortWords(words, sortOption) {
  switch (sortOption) {
    case "date-new":
      words.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case "date-old":
      words.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case "alpha-asc":
      words.sort((a, b) => a.original.localeCompare(b.original));
      break;
    case "alpha-desc":
      words.sort((a, b) => b.original.localeCompare(a.original));
      break;
    default:
      words.sort((a, b) => b.timestamp - a.timestamp);
  }
}

function createWordItem(word) {
  const item = document.createElement("div");
  item.className = "word-item";
  item.setAttribute("data-id", word.id);

  // Format date
  const date = new Date(word.timestamp);
  const formattedDate =
    date.toLocaleDateString() + " " + date.toLocaleTimeString();

  // Create word content
  item.innerHTML = `
    <div class="word-header">
      <div class="word-original">${word.original}</div>
      <div class="word-actions">
        <button class="edit-btn" title="Edit"><i class="icon edit"></i></button>
        <button class="delete-btn" title="Delete"><i class="icon delete"></i></button>
      </div>
    </div>
    <div class="word-translation">${word.translation}</div>
    ${word.context ? `<div class="word-context">"${word.context}"</div>` : ""}
    <div class="word-meta">
      <span class="word-date">${formattedDate}</span>
      ${
        word.tags && word.tags.length > 0
          ? `<span class="word-tags">${word.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}</span>`
          : ""
      }
    </div>
  `;

  // Add event listeners
  item.querySelector(".edit-btn").addEventListener("click", function () {
    editWord(word);
  });

  item.querySelector(".delete-btn").addEventListener("click", function () {
    deleteWord(word.id);
  });

  return item;
}

function editWord(word) {
  // Create edit form
  const editForm = document.createElement("div");
  editForm.className = "edit-form";
  editForm.innerHTML = `
    <h3>Edit Word</h3>
    <div class="form-field">
      <label for="edit-original">Original:</label>
      <input type="text" id="edit-original" value="${word.original}">
    </div>
    <div class="form-field">
      <label for="edit-translation">Translation:</label>
      <input type="text" id="edit-translation" value="${word.translation}">
    </div>
    <div class="form-field">
      <label for="edit-context">Context:</label>
      <textarea id="edit-context">${word.context || ""}</textarea>
    </div>
    <div class="form-field">
      <label for="edit-tags">Tags (comma separated):</label>
      <input type="text" id="edit-tags" value="${
        word.tags ? word.tags.join(", ") : ""
      }">
    </div>
    <div class="form-field">
      <label for="edit-notes">Notes:</label>
      <textarea id="edit-notes">${word.notes || ""}</textarea>
    </div>
    <div class="form-actions">
      <button id="save-edit-btn">Save</button>
      <button id="cancel-edit-btn">Cancel</button>
    </div>
  `;

  // Add to body
  document.body.appendChild(editForm);

  // Set up event listeners
  document
    .getElementById("save-edit-btn")
    .addEventListener("click", function () {
      const updatedWord = {
        ...word,
        original: document.getElementById("edit-original").value,
        translation: document.getElementById("edit-translation").value,
        context: document.getElementById("edit-context").value,
        notes: document.getElementById("edit-notes").value,
        tags: document
          .getElementById("edit-tags")
          .value.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        timestamp: Date.now(), // Update timestamp to now
      };

      chrome.runtime.sendMessage(
        {
          message: "updateWord",
          word: updatedWord,
        },
        function () {
          document.body.removeChild(editForm);
          loadSavedWords(); // Reload the list
        }
      );
    });

  document
    .getElementById("cancel-edit-btn")
    .addEventListener("click", function () {
      document.body.removeChild(editForm);
    });
}

function deleteWord(wordId) {
  if (confirm("Are you sure you want to delete this word?")) {
    chrome.runtime.sendMessage(
      {
        message: "deleteWord",
        wordId: wordId,
      },
      function () {
        loadSavedWords(); // Reload the list
      }
    );
  }
}

function filterWords() {
  const searchTerm = document.getElementById("search-box").value.toLowerCase();
  const wordItems = document.querySelectorAll(".word-item");

  wordItems.forEach(function (item) {
    const original = item
      .querySelector(".word-original")
      .textContent.toLowerCase();
    const translation = item
      .querySelector(".word-translation")
      .textContent.toLowerCase();
    const context = item.querySelector(".word-context")
      ? item.querySelector(".word-context").textContent.toLowerCase()
      : "";

    if (
      original.includes(searchTerm) ||
      translation.includes(searchTerm) ||
      context.includes(searchTerm)
    ) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function exportDictionary() {
  chrome.runtime.sendMessage(
    { message: "exportDictionary" },
    function (response) {
      if (response && response.data) {
        // Create download link
        const blob = new Blob([response.data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          "tdictionary-export-" +
          new Date().toISOString().split("T")[0] +
          ".json";
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
      }
    }
  );
}

function importDictionary(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Reset the file input
  event.target.value = "";

  const reader = new FileReader();
  reader.onload = function (e) {
    const contents = e.target.result;

    // Ask for merge option
    const mergeOption = prompt(
      "Choose how to import:\n" +
        "1. Append (add all words to your current dictionary)\n" +
        "2. Replace (remove all current words and replace with imported ones)\n" +
        "3. Merge (keep all words, but update existing ones)\n" +
        "Enter 1, 2, or 3:",
      "1"
    );

    let option = "append";
    switch (mergeOption) {
      case "2":
        option = "replace";
        break;
      case "3":
        option = "merge";
        break;
      default:
        option = "append";
    }

    chrome.runtime.sendMessage(
      {
        message: "importDictionary",
        data: contents,
        mergeOption: option,
      },
      function () {
        alert("Dictionary imported successfully!");
        loadSavedWords(); // Reload the list
      }
    );
  };

  reader.readAsText(file);
}

// Listen for messages from content script or background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "wordSaved") {
    // Reload the word list
    loadSavedWords();
  }
});

// Call to load words immediately when the popup opens
loadSavedWords();
