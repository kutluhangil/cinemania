

const developers = [
    {
        name: 'Çiğdem Ergal',
        role: 'Team Lead',
        image: new URL('../images/footer/cigdem.webp', import.meta.url).href,
        github: 'https://github.com/CigdemErgal',
        linkedin: 'https://www.linkedin.com/in/%C3%A7i%C4%9Fdem-ergal/',
    },
    {
        name: 'Halenur Gürel',
        role: 'Scrum Master',
        image: new URL('../images/footer/halenur.webp', import.meta.url).href,
        github: 'https://github.com/halenurgurel',
        linkedin: 'https://www.linkedin.com/in/halenurgurel/',
    },
    {
        name: 'Ali Hamza Çakmak',
        role: 'Developer',
        image: new URL('../images/footer/ali.webp', import.meta.url).href,
        github: 'https://github.com/MRMARUL',
        linkedin: 'https://www.linkedin.com/in/ali-hamza-%C3%A7akmak-8112553a8/',
    },
    {
        name: 'Aslıhan Erdal',
        role: 'Developer',
        image: new URL('../images/footer/aslihan.webp', import.meta.url).href,
        github: 'https://github.com/ERDLL0',
        linkedin: 'https://www.linkedin.com/in/aslihan-erdal/',
    },
    {
        name: 'Burak Gökay',
        role: 'Developer',
        image: new URL('../images/footer/burak.webp', import.meta.url).href,
        github: 'https://github.com/bgokay007-tech',
        linkedin: 'https://www.linkedin.com/in/burak-g%C3%B6kay-196b66348/',
    },
    {
        name: 'Kerem Yıldırım',
        role: 'Developer',
        image: new URL('../images/footer/kerem.webp', import.meta.url).href,
        github: 'https://github.com/keremyldrm61',
        linkedin:
            'https://www.linkedin.com/in/kerem-y%C4%B1ld%C4%B1r%C4%B1m-0053a5191/',
    },
    {
        name: 'Kutluhan Gül',
        role: 'Developer',
        image: new URL('../images/footer/kutluhan.webp', import.meta.url).href,
        github: 'https://github.com/kutluhangil',
        linkedin: 'https://www.linkedin.com/in/kutluhangil/',
    },
    {
        name: 'Nur Seda Ağgünlü',
        role: 'Developer',
        image: new URL('../images/footer/nurseda.webp', import.meta.url).href,
        github: 'https://github.com/nursedaaggunlu',
        linkedin: 'https://www.linkedin.com/in/nur-seda-aggunlu/',
    },
    {
        name: 'Yusuf Soylu',
        role: 'Developer',
        image: new URL('../images/footer/yusuf.webp', import.meta.url).href,
        github: 'https://github.com/soylu1092',
        linkedin: 'https://www.linkedin.com/in/yusuf-soylu-525236306/',
    },
    {
        name: 'Zehra Yazıcı',
        role: 'Developer',
        image: new URL('../images/footer/zehra.webp', import.meta.url).href,
        github: 'https://github.com/zehrayazici',
        linkedin: 'https://www.linkedin.com/in/zehrayazici/',
    },
];

const svgs = {
    github: new URL('../images/footer/github-icon.svg', import.meta.url).href,
    linkedin: new URL('../images/footer/linkedin-icon.svg', import.meta.url)
        .href,
};

function createTeamCard(dev) {
    return `
    <li class="team-card">
      <img
        src="${dev.image}"
        alt="${dev.name}"
        class="team-image"
        loading="lazy"
        onerror="this.src='https://placehold.co/200x200?text=${encodeURIComponent(
        dev.name
    )}'"
      />
      <h3 class="team-name">${dev.name}</h3>
      <p class="team-role">${dev.role}</p>
      <div class="social-links">
        <a href="${dev.github
        }" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
          <span class="social-mask-icon" style="-webkit-mask-image: url('${svgs.github}'); mask-image: url('${svgs.github}');"></span>
        </a>
        <a href="${dev.linkedin
        }" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
           <span class="social-mask-icon" style="-webkit-mask-image: url('${svgs.linkedin}'); mask-image: url('${svgs.linkedin}');"></span>
        </a>
      </div>
    </li>
  `;
}

function renderTeam() {
    const teamList = document.querySelector('.team-list');
    if (!teamList) return;

    const markup = developers.map(createTeamCard).join('');
    teamList.innerHTML = markup;
}

export function initFooter() {
    const footerLink = document.querySelector('#footer-link');
    const backdrop = document.querySelector('.backdrop');
    // Kapatma düğmesini özel olarak seçiyoruz
    const closeBtn = document.querySelector('[data-modal-close]');

    if (!footerLink || !backdrop) return;

    // Ekibi oluştur (ilk açılışta veya init aşamasında)
    renderTeam();

    const openModal = (e) => {
        e.preventDefault();
        backdrop.classList.remove('is-hidden');
        document.body.style.overflow = 'hidden'; // kaydırmayı engelle
    };

    const closeModal = () => {
        backdrop.classList.add('is-hidden');
        document.body.style.overflow = '';
    };

    footerLink.addEventListener('click', openModal);

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Arka plana tıklayınca kapat
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            closeModal();
        }
    });

    // ESC tuşuna basınca kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !backdrop.classList.contains('is-hidden')) {
            closeModal();
        }
    });
}

// Scroll to Top Logic
const scrollToTopBtn = document.querySelector('.scroll-to-top');

if (scrollToTopBtn) {
    // Show button when scrolling down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('is-visible');
        } else {
            scrollToTopBtn.classList.remove('is-visible');
        }
    });

    // Smooth scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
