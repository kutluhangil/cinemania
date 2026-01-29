

// Sayfa yüklendiğinde header fonksiyonunu çalıştır
//document.addEventListener('DOMContentLoaded', () => {
  //  initHeader();

//});



export function initHeader() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // tema kontrolü(varsayılan dark ve localStorage)
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(`${currentTheme}-theme`);

    if (currentTheme === 'light') {
        themeSwitch.checked = true;
    }

    // tema değişikliği

    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    //// 2. Aktif Sayfa Vurgulama Mantığı
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    if (link.getAttribute('href').includes(currentPath) && currentPath !== '/') {
      link.classList.add('active');
    } else if (currentPath === '/' || currentPath.includes('index.html')) {
      document.querySelector('#home-link')?.classList.add('active');
    }
  });
}

