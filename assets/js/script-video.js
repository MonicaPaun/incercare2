  // La încărcarea paginii, verificăm dacă există o temă salvată și o aplicăm
  window.addEventListener('load', () => {
    //const loader = document.getElementById('loader-wrapper');
    const modal = document.getElementById("logoModal");

// Verificăm dacă pagina curentă este sistemul-osos.html
  if (window.location.pathname.includes('videoclipuri.html')) {
    // Afișăm loader-ul pentru pagina
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
  
  
  
 
  