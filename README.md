<h1>🎬 CINEMANIA — Digital Movie Discovery Platform</h1>

<p><em>A modern, responsive movie discovery experience powered by real-time film data.</em></p>

<p>
  <strong>Cinemania</strong> is a fully responsive, multi-page web application developed as a collaborative
  group project within the <strong>GoIT Full Stack Developer Program</strong>.
  The platform allows users to discover trending movies, explore upcoming releases,
  manage a personal movie library, and view detailed movie information using real-time data from
  <strong>The Movie Database (TMDB) API</strong>.
</p>

<hr />

<h2>🌐 Live Demo</h2>
<p>
  👉 <a href="https://january-javascript-project.github.io/cinemania/" target="_blank" rel="noopener">
  GitHub Pages — Cinemania</a>
</p>

<hr />

<h2>📋 Table of Contents</h2>
<ol>
  <li><a href="#about-the-project">About the Project</a></li>
  <li><a href="#api-integration">API Integration</a></li>
  <li><a href="#core-features">Core Features (MVP)</a></li>
  <li><a href="#additional-features">Additional Features</a></li>
  <li><a href="#technical-requirements">Technical Requirements</a></li>
  <li><a href="#project-structure">Project Structure</a></li>
  <li><a href="#technologies-used">Technologies Used</a></li>
  <li><a href="#team-members">Team Members & Responsibilities</a></li>
  <li><a href="#screenshots">Screenshots</a></li>
  <li><a href="#license">License</a></li>
</ol>

<hr />

<h2 id="about-the-project">📖 About the Project</h2>
<p>
  Cinemania simulates a real-world movie discovery platform.
  Users can browse trending films, search movies by keyword or year,
  explore upcoming releases, and manage a personalized movie library.
</p>

<p>
  The application is designed with a <strong>Mobile-First</strong> approach and
  follows modern frontend best practices including semantic HTML,
  modular CSS architecture, and asynchronous JavaScript logic.
</p>

<hr />

<h2 id="api-integration">🎞️ API Integration</h2>
<ul>
  <li>API Provider: <a href="https://www.themoviedb.org/" target="_blank">TMDB</a></li>
  <li>Documentation: <a href="https://developer.themoviedb.org/docs" target="_blank">TMDB Docs</a></li>
</ul>

<hr />

<h2 id="core-features">✨ Core Features (MVP)</h2>
<ul>
  <li>Mobile-first responsive layout (320px / 768px / 1280px)</li>
  <li>Theme switcher (Dark / Light) with localStorage persistence</li>
  <li>Hero section with daily trending movie</li>
  <li>Movie detail modal with trailer support</li>
  <li>My Library with add/remove logic (localStorage)</li>
  <li>Footer with team modal (GoIT Students)</li>
</ul>

<hr />

<h2 id="additional-features">🚀 Additional Features</h2>
<ul>
  <li>Weekly Trends & Upcoming This Month sections</li>
  <li>Catalog search with year filter</li>
  <li>Server-side pagination</li>
  <li>Load more functionality</li>
  <li>Scroll-to-top button</li>
  <li>Global loader (spinner) for async requests</li>
</ul>

<hr />

<h2 id="technical-requirements">⚙️ Technical Requirements</h2>
<ul>
  <li>Semantic HTML5</li>
  <li>Modern-normalize integrated</li>
  <li>Fonts via <code>@font-face</code></li>
  <li>Optimized retina-ready images</li>
  <li>All static assets under <code>src/images</code></li>
  <li>Passed W3C HTML & CSS validation</li>
  <li>PageSpeed score ≥ 80%</li>
  <li>No console errors</li>
  <li>Published on GitHub Pages</li>
</ul>

<hr />

<h2 id="project-structure">🏗️ Project Structure</h2>
<pre>
src/
 ├── css/
 ├── js/
 ├── images/
 │   ├── footer/
 │   └── readme/
 ├── partials/
 ├── index.html
 ├── my-library.html
 └── main.js
</pre>

<hr />

<h2 id="technologies-used">🛠️ Technologies Used</h2>
<ul>
  <li>HTML5</li>
  <li>CSS3 (Flexbox & Grid)</li>
  <li>Vanilla JavaScript (ES6+)</li>
  <li>Vite</li>
  <li>Git & GitHub</li>
  <li>TMDB API</li>
</ul>

<hr />

<h2 id="team-members">👥 Geliştirici Ekip & Sorumluluklar</h2>

<ul>
  <li>
    <strong>Çiğdem Ergal</strong> — Team Lead<br />
    <em>Sorumluluk:</em> Header & Liderlik<br />
    <a href="https://github.com/CigdemErgal" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/%C3%A7i%C4%9Fdem-ergal/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Halenur Gürel</strong> — Scrum Master<br />
    <em>Sorumluluk:</em> Hero & Scrum Yönetimi<br />
    <a href="https://github.com/halenurgurel" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/halenurgurel/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Ali Hamza Çakmak</strong> — Developer<br />
    <em>Sorumluluk:</em> Modals (Detail & Trailer)<br />
    <a href="https://github.com/MRMARUL" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/ali-hamza-%C3%A7akmak-8112553a8/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Aslıhan Erdal</strong> — Developer<br />
    <em>Sorumluluk:</em> Upcoming This Month<br />
    <a href="https://github.com/ERDLL0" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/aslihan-erdal/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Burak Gökay</strong> — Developer<br />
    <em>Sorumluluk:</em> Weekly Trends<br />
    <a href="https://github.com/bgokay007-tech" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/burak-g%C3%B6kay-196b66348/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Kerem Yıldırım</strong> — Developer<br />
    <em>Sorumluluk:</em> Catalog<br />
    <a href="https://github.com/keremyldrm61" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/kerem-y%C4%B1ld%C4%B1r%C4%B1m-0053a5191/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Yusuf Soylu</strong> — Developer<br />
    <em>Sorumluluk:</em> Pagination<br />
    <a href="https://github.com/soylu1092" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/yusuf-soylu-525236306/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Nur Seda Ağgünlü</strong> — Developer<br />
    <em>Sorumluluk:</em> My Library<br />
    <a href="https://github.com/nursedaaggunlu" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/nur-seda-aggunlu/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Zehra Yazıcı</strong> — Developer<br />
    <em>Sorumluluk:</em> My Library Hero<br />
    <a href="https://github.com/zehrayazici" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/zehrayazici/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>

  <li>
    <strong>Kutluhan Gül</strong> — Developer<br />
    <em>Sorumluluk:</em> Footer & Team Modal<br />
    <a href="https://github.com/kutluhangil" target="_blank">
      <img src="src/images/readme/github-icon.svg" alt="GitHub" width="18" />
    </a>
    <a href="https://www.linkedin.com/in/kutluhangil/" target="_blank">
      <img src="src/images/readme/linkedin-icon.svg" alt="LinkedIn" width="18" />
    </a>
  </li>
</ul>

<hr />

<h2 id="screenshots">📸 Screenshots</h2>

<p><strong>Desktop Views</strong></p>
<p>
  <img src="./src/images/readme/desktop_home.png" width="30%" />
  <img src="./src/images/readme/desktop_catalog.png" width="30%" />
  <img src="./src/images/readme/desktop_library.png" width="30%" />
</p>

<p><strong>Tablet & Mobile Views</strong></p>
<p>
  <img src="./src/images/readme/tablet_home.png" width="30%" />
  <img src="./src/images/readme/mobile_home.png" width="30%" />
  <img src="./src/images/readme/ui_kit.png" width="30%" />
</p>

<hr />

<h2 id="license">📜 License</h2>
<p>
  This project was created for <strong>educational purposes</strong> as part of the GoIT Full Stack Developer program.
  <br />
  © 2024 Cinemania — All rights reserved.
</p>
