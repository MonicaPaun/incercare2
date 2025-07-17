const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");
// API Setup
const API_KEY="AIzaSyCSBWezlxd02L9VZHFpi5RxSpCDdTn-ips";
const API_URL= `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let controller, typingInterval;
const chatHistory = [];
const userData = { message: "", file: {} };
// Set initial theme from local storage
const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";
// Function to create message elements
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};
// Scroll to the bottom of the container
const scrollToBottom = () => container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
// Simulate typing effect for bot responses
const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = "";
  const words = text.split(" ");
  let wordIndex = 0;

  // Scroll o singură dată la început
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });

  typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
      // eliminăm scrollul forțat aici!
    } else {
      clearInterval(typingInterval);
      botMsgDiv.classList.remove("loading");
      document.body.classList.remove("bot-responding");
    }
  }, 40);
};

// Make the API call and generate the bot's response
const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();
  // Add user message and file data to the chat history
  chatHistory.push({
    role: "user",
    parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: (({ fileName, isImage, ...rest }) => rest)(userData.file) }] : [])],
  });
  try {
    // Send the chat history to the API to get a response
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    // Process the response text and display with typing effect
    const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
    typingEffect(responseText, textElement, botMsgDiv);
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    textElement.textContent = error.name === "AbortError" ? "Response generation stopped." : error.message;
    textElement.style.color = "#d62939";
    botMsgDiv.classList.remove("loading");
    document.body.classList.remove("bot-responding");
    scrollToBottom();
  } finally {
    userData.file = {};
  }
};
// Handle the form submission
const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains("bot-responding")) return;
  userData.message = userMessage;
  promptInput.value = "";
  document.body.classList.add("chats-active", "bot-responding");
  fileUploadWrapper.classList.remove("file-attached", "img-attached", "active");
  // Generate user message HTML with optional file attachment
  const userMsgHTML = `
    <p class="message-text"></p>
    ${userData.file.data ? (userData.file.isImage ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="img-attachment" />` : `<p class="file-attachment"><span class="material-symbols-rounded">description</span>${userData.file.fileName}</p>`) : ""}
  `;
  const userMsgDiv = createMessageElement(userMsgHTML, "user-message");
  userMsgDiv.querySelector(".message-text").textContent = userData.message;
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();
  setTimeout(() => {
    // Generate bot message HTML and add in the chat container
    const botMsgHTML = `
  <img class="avatar" src="bio-bot.png" />
  <p class="message-text">...</p>
  <button class="copy-btn" title="Copiază răspunsul" >📋 Copy</button>
`;
    const botMsgDiv = createMessageElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);

    botMsgDiv.querySelector(".copy-btn").addEventListener("click", () => {
      const text = botMsgDiv.querySelector(".message-text").textContent;
      navigator.clipboard.writeText(text).then(() => {
        const btn = botMsgDiv.querySelector(".copy-btn");
        btn.textContent = "✅ Copiat!";
        setTimeout(() => btn.textContent = "📋 Copy", 2000);
      });
    });
    
    scrollToBottom();
    generateResponse(botMsgDiv);
  }, 600); // 600 ms delay
};
// Handle file input change (file upload)
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const isImage = file.type.startsWith("image/");
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    fileInput.value = "";
    const base64String = e.target.result.split(",")[1];
    fileUploadWrapper.querySelector(".file-preview").src = e.target.result;
    fileUploadWrapper.classList.add("active", isImage ? "img-attached" : "file-attached");
    // Store file data in userData obj
    userData.file = { fileName: file.name, data: base64String, mime_type: file.type, isImage };
  };
});
// Cancel file upload
document.querySelector("#cancel-file-btn").addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-attached", "img-attached", "active");
});
// Stop Bot Response
document.querySelector("#stop-response-btn").addEventListener("click", () => {
  controller?.abort();
  userData.file = {};
  clearInterval(typingInterval);
  chatsContainer.querySelector(".bot-message.loading").classList.remove("loading");
  document.body.classList.remove("bot-responding");
});
// Toggle dark/light theme
themeToggleBtn.addEventListener("click", () => {
  const isLightTheme = document.body.classList.toggle("light-theme");
  localStorage.setItem("themeColor", isLightTheme ? "light_mode" : "dark_mode");
  themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";
});
// Delete all chats
document.querySelector("#delete-chats-btn").addEventListener("click", () => {
  chatHistory.length = 0;
  chatsContainer.innerHTML = "";
  document.body.classList.remove("chats-active", "bot-responding");
});
// Handle suggestions click
document.querySelectorAll(".suggestions-item").forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    promptInput.value = suggestion.querySelector(".text").textContent;
    promptForm.dispatchEvent(new Event("submit"));
  });
});
// Show/hide controls for mobile on prompt input focus
document.addEventListener("click", ({ target }) => {
  const wrapper = document.querySelector(".prompt-wrapper");
  const shouldHide = target.classList.contains("prompt-input") || (wrapper.classList.contains("hide-controls") && (target.id === "add-file-btn" || target.id === "stop-response-btn"));
  wrapper.classList.toggle("hide-controls", shouldHide);
});
// Add event listeners for form submission and file input click
promptForm.addEventListener("submit", handleFormSubmit);
promptForm.querySelector("#add-file-btn").addEventListener("click", () => fileInput.click());

const saveBtn = document.getElementById("save-chat-btn");
const savedList = document.getElementById("saved-conversations");

let savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]");

// Salvează conversația curentă
saveBtn.addEventListener("click", () => {
  const chatHTML = chatsContainer.innerHTML;
  const name = prompt("Cum vrei să numești această conversație?");
  if (!name) return;

  savedChats.unshift({ id: Date.now(), name, content: chatHTML });
  localStorage.setItem("savedChats", JSON.stringify(savedChats));
  renderSavedChats();
});

// Randează lista conversațiilor salvate
function renderSavedChats() {
  savedList.innerHTML = "";
  savedChats.forEach(chat => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${chat.name}</span>
      <button class="delete-saved-chat" title="Șterge">🗑️</button>
    `;

    // Încarcă conversația când dai click pe titlu
    li.querySelector("span").addEventListener("click", () => {
      chatsContainer.innerHTML = chat.content;
      document.body.classList.add("chats-active");
    });

    // Șterge conversația
    li.querySelector(".delete-saved-chat").addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Ștergi această conversație salvată?")) {
        savedChats = savedChats.filter(c => c.id !== chat.id);
        localStorage.setItem("savedChats", JSON.stringify(savedChats));
        renderSavedChats();
      }
    });

    savedList.appendChild(li);
  });
}


// Inițializare la pornire
renderSavedChats();

const scrollBtn = document.getElementById("scroll-down-btn");

// Afișează butonul când nu ești jos
container.addEventListener("scroll", () => {
  const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
  scrollBtn.style.display = isAtBottom ? "none" : "block";
});

// Click pe buton => scroll jos
scrollBtn.addEventListener("click", () => {
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
});




// Funcția pentru schimbarea temei între dark și light
function toggleTheme() {
  // Comută clasa dark pe body
  document.body.classList.toggle("dark");

  // Selectează iconița pentru temă
  const icon = document.querySelector("#theme-toggle i");

  // Dacă tema este dark, schimbă iconița și salvează tema în localStorage
  if (document.body.classList.contains("dark")) {
    icon.classList.add("bx-sun");  // Iconița pentru soare
    icon.classList.remove("bx-moon");  // Iconița pentru lună
    localStorage.setItem("theme", "dark");  // Salvează tema ca "dark"
  } else {
    // Dacă tema nu este dark, schimbă iconița și salvează tema în localStorage
    icon.classList.add("bx-moon");  // Iconița pentru lună
    icon.classList.remove("bx-sun");  // Iconița pentru soare
    localStorage.setItem("theme", "light");  // Salvează tema ca "light"
  }
}

// La încărcarea paginii, verificăm dacă există o temă salvată și o aplicăm
window.addEventListener('load', () => {
  //const loader = document.getElementById('loader-wrapper');
  const modal = document.getElementById("logoModal");

  // Verificăm dacă pagina curentă este sistemul-osos.html
  if (window.location.pathname.includes('bio-bot.html')) {
    // Afișăm loader-ul pentru pagina sistemul-osos.html
    // loader.style.display = 'flex';  // loader eliminat

    // setTimeout(() => {
    //   loader.classList.add('loader-close');
    //   setTimeout(() => {
    //     loader.style.display = 'none';
    //     sessionStorage.setItem("loaderShown", "true");
    //   }, 1000); 
    // }, 2500);
  }

  // Închide orice modal dacă a fost deschis
  if (modal) {
    modal.style.display = 'none';
    const modalImg = document.getElementById("modalImage");
    if (modalImg) {
      modalImg.style.transform = "scale(1)";
    }
  }

  // Tema salvată
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    const icon = document.querySelector("#theme-toggle i");
    icon.classList.add("bx-sun");
    icon.classList.remove("bx-moon");
  }
});

// Redirecționare spre index.html dacă e refresh pe altă pagină
const isRefresh = performance.navigation.type === 1 || performance.getEntriesByType("navigation")[0].type === "reload";
const isNotHome = !window.location.pathname.endsWith("index.html") && !window.location.pathname.endsWith("/");

if (isRefresh && isNotHome) {
  sessionStorage.removeItem("loaderShown");
  window.location.href = "index.html";
}



document.addEventListener("DOMContentLoaded", () => {
  const chatSidebar = document.getElementById("chat-sidebar");
  const chatToggleBtn = document.getElementById("chatSidebarToggle");

  // Toggle sidebar conversații
  chatToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
  
    // Închide sidebar-ul principal dacă e deschis
    const mainSidebar = document.querySelector(".sidebar");
    if (mainSidebar.classList.contains("visible")) {
      mainSidebar.classList.remove("visible");
    }
  
    // Deschide/închide chat-sidebar
    chatSidebar.classList.toggle("active");
  });
  

  // Click în afara sidebar-ului → îl închide
  document.addEventListener("click", (e) => {
    if (!chatSidebar.contains(e.target) && !chatToggleBtn.contains(e.target)) {
      chatSidebar.classList.remove("active");
    }
  });
});
