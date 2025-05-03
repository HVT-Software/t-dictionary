// content.js

let icon = null;
let popup = null;

// Add CSS styles for the popup and animations
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .translation-popup {
      position: absolute;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      padding: 10px;
      font-size: 14px;
      max-width: 300px;
      z-index: 10000;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.3s, transform 0.3s;
    }
    
    .translation-popup.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .translation-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .translation-text {
      margin-bottom: 8px;
    }
    
    .translation-context {
      font-style: italic;
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .translation-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    .translation-btn {
      background-color: #f0f0f0;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      margin-left: 5px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .translation-btn:hover {
      background-color: #e0e0e0;
    }
    
    .translation-btn.save {
      background-color: #4285f4;
      color: white;
    }
    
    .translation-btn.save:hover {
      background-color: #3367d6;
    }
  `;
  document.head.appendChild(style);
}

function getSelectionContext() {
  let context = "";
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parentNode =
      range.commonAncestorContainer.nodeType === 3
        ? range.commonAncestorContainer.parentNode
        : range.commonAncestorContainer;

    // Get full text from parent element
    const fullText = parentNode.textContent || "";

    // Extract sentence containing the selection
    const beforeSelection = fullText.substring(0, range.startOffset);
    const afterSelection = fullText.substring(range.endOffset);

    // Find sentence boundaries
    const sentenceStart = Math.max(
      0,
      beforeSelection.lastIndexOf(".") + 1,
      beforeSelection.lastIndexOf("!") + 1,
      beforeSelection.lastIndexOf("?") + 1
    );

    const sentenceEnd = Math.min(
      afterSelection.indexOf(".") > -1
        ? range.endOffset + afterSelection.indexOf(".") + 1
        : fullText.length,
      afterSelection.indexOf("!") > -1
        ? range.endOffset + afterSelection.indexOf("!") + 1
        : fullText.length,
      afterSelection.indexOf("?") > -1
        ? range.endOffset + afterSelection.indexOf("?") + 1
        : fullText.length
    );

    context = fullText.substring(sentenceStart, sentenceEnd).trim();
  }

  return context;
}

function createIcon(event, selectedText) {
  // Get context (sentence)
  const context = getSelectionContext();

  // Remove existing icon if any
  removeExistingIcon();

  // Create icon
  icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("images/icon16.png"); // Use extension's icon
  icon.style.position = "absolute";
  icon.style.top = event.pageY - 20 + "px";
  icon.style.left = event.pageX + 10 + "px";
  icon.style.cursor = "pointer";
  icon.style.zIndex = "10000"; // Ensure it's on top
  icon.style.width = "24px";
  icon.style.height = "24px";
  icon.style.borderRadius = "50%";
  icon.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  icon.title = "Click to translate";

  // Add click listener to icon
  icon.addEventListener("click", function () {
    showTranslationPopup(event, selectedText, context);
  });

  document.body.appendChild(icon);
}

function removeExistingIcon() {
  if (icon && icon.parentNode) {
    icon.parentNode.removeChild(icon);
    icon = null;
  }
}

function removeExistingPopup() {
  if (popup && popup.parentNode) {
    popup.parentNode.removeChild(popup);
    popup = null;
  }
}

function showTranslationPopup(event, selectedText, context) {
  // Send message to background script to translate
  if (chrome.runtime) {
    try {
      chrome.runtime.sendMessage(
        { message: "translate", text: selectedText, context: context },
        function (response) {
          removeExistingPopup();

          // Create popup
          popup = document.createElement("div");
          popup.classList.add("translation-popup");
          popup.style.position = "absolute";
          popup.style.top = event.pageY + "px";
          popup.style.left = event.pageX + "px";

          // Build popup content
          const header = document.createElement("div");
          header.classList.add("translation-header");

          const originalText = document.createElement("div");
          originalText.textContent = selectedText;
          originalText.style.fontWeight = "bold";
          header.appendChild(originalText);

          const closeBtn = document.createElement("span");
          closeBtn.textContent = "×";
          closeBtn.style.cursor = "pointer";
          closeBtn.addEventListener("click", function () {
            removeExistingPopup();
          });
          header.appendChild(closeBtn);

          const translationText = document.createElement("div");
          translationText.classList.add("translation-text");
          translationText.textContent =
            response?.translation || "Translation failed.";

          const contextElement = document.createElement("div");
          contextElement.classList.add("translation-context");
          contextElement.textContent = context;

          const actions = document.createElement("div");
          actions.classList.add("translation-actions");

          const saveBtn = document.createElement("button");
          saveBtn.classList.add("translation-btn", "save");
          saveBtn.textContent = "Save Word";
          saveBtn.addEventListener("click", function () {
            // Save word to dictionary
            chrome.runtime.sendMessage({
              message: "saveWord",
              word: {
                original: selectedText,
                translation: response?.translation,
                context: context,
                sourceLanguage: "auto", // Auto-detect source language
                targetLanguage: "en", // Default target language
                timestamp: Date.now(),
                notes: "",
                tags: [],
              },
            });

            // Show saved confirmation
            saveBtn.textContent = "Saved!";
            saveBtn.disabled = true;

            // Reset after 1 second
            setTimeout(function () {
              saveBtn.textContent = "Save Word";
              saveBtn.disabled = false;
            }, 1000);
          });

          actions.appendChild(saveBtn);

          // Assemble popup
          popup.appendChild(header);
          popup.appendChild(translationText);
          popup.appendChild(contextElement);
          popup.appendChild(actions);

          document.body.appendChild(popup);

          // Add show class to trigger animation
          setTimeout(function () {
            popup.classList.add("show");
          }, 10);

          // Handle clicking outside to close
          document.addEventListener("click", handleOutsideClick);
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  } else {
    console.error("Extension context invalidated.");
  }
}

function handleOutsideClick(e) {
  if (popup && !popup.contains(e.target) && e.target !== icon) {
    removeExistingPopup();
    document.removeEventListener("click", handleOutsideClick);
  }
}

// Text selection detection
document.addEventListener("mouseup", function (event) {
  setTimeout(function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      createIcon(event, selectedText);
    } else {
      removeExistingIcon();
    }
  }, 10); // Short delay to ensure selection is complete
});

// Remove icon when clicking elsewhere or starting a new selection
document.addEventListener("mousedown", function (event) {
  if (icon && event.target !== icon) {
    removeExistingIcon();
  }

  if (popup && !popup.contains(event.target) && event.target !== icon) {
    removeExistingPopup();
  }
});

// Handle page scroll
window.addEventListener("scroll", function () {
  removeExistingIcon();
  removeExistingPopup();
});

// Initialize
(function () {
  injectStyles();
})();
