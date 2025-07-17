const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");

buttons.forEach((item) => {
  item.onclick = () => {
    if (item.id == "clear") {
      display.innerText = "";
    } else if (item.id == "backspace") {
      let string = display.innerText.toString();
      display.innerText = string.substr(0, string.length - 1);
    } else if (display.innerText != "" && item.id == "equal") {
      display.innerText = eval(display.innerText);
    } else if (display.innerText == "" && item.id == "equal") {
      display.innerText = "Empty!";
      setTimeout(() => (display.innerText = ""), 2000);
    } else {
      display.innerText += item.id;
    }
  };
});

const themeToggleBtn = document.querySelector(".theme-toggler");
const calculator = document.querySelector(".calculator");
const toggleIcon = document.querySelector(".toggler-icon");
let isDark = true;
themeToggleBtn.onclick = () => {
  calculator.classList.toggle("dark");
  themeToggleBtn.classList.toggle("active");
  isDark = !isDark;
};


  
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
  if (window.location.pathname.includes('calculator.html')) {
    // Afișăm loader-ul pentru pagina sistemul-osos.html
   // loader.style.display = 'flex';  // Asigură-te că loader-ul este vizibil

   // setTimeout(() => {
    //  loader.classList.add('loader-close');
    //  setTimeout(() => {
      //  loader.style.display = 'none';
    //    sessionStorage.setItem("loaderShown", "true");
    //  }, 1000); 
  //  }, 2500);
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
  
    // Dacă e refresh și NU suntem pe index, redirecționează
    const isNotHome = !window.location.pathname.endsWith("index.html") && !window.location.pathname.endsWith("/");
    if (isRefresh && isNotHome) {
        sessionStorage.removeItem("loaderShown");
        window.location.href = "index.html";
    }
  });
  
  
  function toggleTheme() {
    document.body.classList.toggle("dark");
    const icon = document.querySelector("#theme-toggle i");
  
    if (document.body.classList.contains("dark")) {
        icon.classList.add("bx-sun");
        icon.classList.remove("bx-moon");
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.add("bx-moon");
        icon.classList.remove("bx-sun");
        localStorage.setItem("theme", "light");
    }
  }
  
  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
  });
  
  const userToggle = document.getElementById('user-toggle');
  const userMenu = document.getElementById('user-menu');
  
  userToggle.addEventListener('click', () => {
    userMenu.classList.toggle('show');
  });
  
  document.addEventListener('click', function(event) {
    if (!userToggle.contains(event.target)) {
        userMenu.classList.remove('show');
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
  
  
  document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", function() {
    // Nu mai oprim comportamentul implicit
    // Browserul va naviga direct fără întârziere
  });
});
  function toggleDetalii(element) {
    element.classList.toggle("active");
  }
  
  