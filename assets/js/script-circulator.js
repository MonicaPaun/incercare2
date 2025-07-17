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
    const loader = document.getElementById('loader-wrapper');
    const modal = document.getElementById("logoModal");
  
    // Verificăm dacă pagina curentă este sistemul-osos.html
    if (window.location.pathname.includes('sistemul-circulator.html')) {
      // Afișăm loader-ul pentru pagina sistemul-osos.html
      //loader.style.display = 'flex';  // Asigură-te că loader-ul este vizibil
  
      //setTimeout(() => {
      //  loader.classList.add('loader-close');
      //  setTimeout(() => {
       //   loader.style.display = 'none';
       //   sessionStorage.setItem("loaderShown", "true");
       // }, 1000); 
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
  
  document.querySelector('.close-btn')?.addEventListener('click', () => {
    const searchInput = document.querySelector('.search-container input');
    searchInput.value = '';
    searchInput.blur();
  });
   // Buton pentru întoarcerea la sisteme.html
   document.getElementById('goBackBtn').addEventListener('click', function() {
    window.location.href = "sisteme.html";  // Mergi la sisteme.html
  });
  
  // Script pentru a face un refresh și a te duce automat la index.html
  if (performance.navigation.type == 1) {
    window.location.href = "index.html";  // Resetează și duce automat la index.html
  }
  // Script pentru a deschide/închide meniul
document.getElementById('menu-toggle').addEventListener('click', function() {
  document.getElementById('side-menu').classList.toggle('open'); // Deschide sau închide meniul
  document.body.classList.toggle('menu-open'); // Adaugă fundal semitransparent
});

// Deschidere modal clasic (dacă ai un modal separat)
function openModal() {
  document.getElementById('notiteModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('notiteModal').style.display = 'none';
}

// Toggle afișare panou notițe (colț dreapta jos, mutabil)
function toggleNotite() {
  const panel = document.getElementById('notitePanel');
  if (panel.style.display === 'flex') {
    panel.style.display = 'none';
  } else {
    panel.style.display = 'flex';
    loadPanelState();
  }
}

// Drag din orice punct, nu doar header
dragElement(document.getElementById("notitePanel"));

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (e.target.classList.contains("close-small")) return; // Excludem închiderea
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.bottom = "auto";
    elmnt.style.right = "auto";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    savePanelState();
  }
}

// Salvează poziția/dimensiunea în localStorage
function savePanelState() {
  const panel = document.getElementById('notitePanel');
  const state = {
    top: panel.style.top,
    left: panel.style.left,
    width: panel.style.width,
    height: panel.style.height
  };
  localStorage.setItem('notitePanelState', JSON.stringify(state));
}

function loadPanelState() {
  const state = JSON.parse(localStorage.getItem('notitePanelState'));
  const panel = document.getElementById('notitePanel');
  if (state) {
    panel.style.top = state.top;
    panel.style.left = state.left;
    panel.style.width = state.width;
    panel.style.height = state.height;
    panel.style.bottom = "auto";
    panel.style.right = "auto";
  }
}


// Script pentru deschiderea submeniurilor la click
document.querySelectorAll('.has-submenu > a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); // Previne scroll-ul automat
    const submenu = this.nextElementSibling;

    // Închide celelalte submeniuri deschise
    document.querySelectorAll('.submenu').forEach(menu => {
      if (menu !== submenu) menu.style.display = 'none';
    });

    // Comută afișarea acestui submenu
    submenu.style.display = submenu.style.display === 'flex' ? 'none' : 'flex';

    // Comută rotația săgeții
    this.querySelector('.arrow')?.classList.toggle('rotated');
  });
});


// Click în afara meniului → îl închide
document.addEventListener("click", (e) => {
  const sideMenu = document.getElementById("side-menu");
  const menuToggle = document.getElementById("menu-toggle");

  if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open"); // Scoate fundalul semitransparent
  }
});



document.addEventListener('DOMContentLoaded', () => {
  // Selectăm toate elementele care au clasa `toggle-examples`
  const toggleButtons = document.querySelectorAll('.toggle-examples');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Găsim lista de exemple corespunzătoare butonului apăsat
      const exampleList = button.nextElementSibling;
      
      // Dacă lista este ascunsă, o facem vizibilă și schimbăm iconița
      if (exampleList.classList.contains('hidden')) {
        exampleList.classList.remove('hidden');
        exampleList.classList.add('visible');
        button.textContent = '-';  // Schimbăm iconița la ↑
      } else {
        exampleList.classList.remove('visible');
        exampleList.classList.add('hidden');
        button.textContent = '+';  // Schimbăm iconița la ↓
      }
    });
  });
});









document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const info = document.getElementById('searchInfo');
  let currentIndex = -1;
  let matches = [];

  function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


  function clearHighlights() {
    matches.forEach(span => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
    matches = [];
    currentIndex = -1;
    info.textContent = '';
  }

  function highlightAll(term) {
  clearHighlights();
  if (!term) return;

  const normalizedTerm = removeDiacritics(term);
  const container = document.getElementById('searchContainer');

  function highlightNode(node) {
    if (node.nodeType === 3) { // text node
      const originalText = node.textContent;
      const normalizedText = removeDiacritics(originalText);

      const regex = new RegExp(normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

      let match;
      let lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let spanCreated = false;

      while ((match = regex.exec(normalizedText)) !== null) {
        // Partea de text înaintea match-ului
        const before = originalText.slice(lastIndex, match.index);
        if (before) fragment.appendChild(document.createTextNode(before));

        // Textul evidențiat (în original, cu diacritice)
        const matchedText = originalText.slice(match.index, match.index + match[0].length);

        const span = document.createElement('span');
        span.className = 'highlighted';
        span.textContent = matchedText;
        fragment.appendChild(span);
        matches.push(span);

        lastIndex = match.index + match[0].length;
        spanCreated = true;
      }

      if (spanCreated) {
        const after = originalText.slice(lastIndex);
        if (after) fragment.appendChild(document.createTextNode(after));
        node.parentNode.replaceChild(fragment, node);
      }
    } else if (node.nodeType === 1 && node.childNodes && !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(node.tagName)) {
      for (let i = 0; i < node.childNodes.length; i++) {
        highlightNode(node.childNodes[i]);
      }
    }
  }

    highlightNode(container);

    if (matches.length > 0) {
      info.textContent = `${matches.length} rezultat${matches.length > 1 ? 'e' : ''} găsit${matches.length > 1 ? 'e' : ''}.`;
    } else {
      info.textContent = 'Niciun rezultat găsit.';
    }
  }

  function scrollToCurrent() {
    if (currentIndex >= 0 && matches.length > 0) {
      matches.forEach((el, i) => {
        if (i === currentIndex) {
          el.classList.add('current-highlighted');
        } else {
          el.classList.remove('current-highlighted');
        }
      });
      matches[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      info.textContent = `${matches.length} rezultat${matches.length > 1 ? 'e' : ''} găsit${matches.length > 1 ? 'e' : ''}. Ești la rezultatul ${currentIndex + 1}.`;
    }
  }

  input.addEventListener('input', () => {
    highlightAll(input.value.trim());
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matches.length === 0) return;

      if (currentIndex === matches.length - 1) {
        alert('Ai ajuns la ultimul rezultat.');
        return;
      }

      currentIndex++;
      scrollToCurrent();
    }
  });
});




const scrollTopBtn = document.getElementById('scrollTopBtn');

function toggleScrollBtn() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollTopBtn.style.display = "flex";  // folosim flex ca să păstreze alinierea
  } else {
    scrollTopBtn.style.display = "none";
  }
}

window.onscroll = toggleScrollBtn;
window.onload = toggleScrollBtn;

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});





window.onload = function () {
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');

    chatToggle.addEventListener('click', () => {
      chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
    });

    chatClose.addEventListener('click', () => {
      chatBox.style.display = 'none';
    });
  };


function setupModal(openId, modalId, closeId) {
    const openBtn = document.getElementById(openId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    openBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  setupModal("openInimaModal", "inimaModal", "closeInimaModal");
  setupModal("openVaseModal", "vaseModal", "closeVaseModal");
  setupModal("openCirculatieModal", "circulatieModal", "closeCirculatieModal");