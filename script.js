document.addEventListener('DOMContentLoaded', () => {
  const courses = [
    { code: 'CSE 104', title: 'Electrical Circuit Analysis', category: 'Hardware & Electronics', type: 'Theory' },
    { code: 'CSE 104L', title: 'Electrical Circuit Analysis Lab', category: 'Hardware & Electronics', type: 'Lab' },
    { code: 'CSE 201', title: 'Discrete Mathematics', category: 'AI & Math', type: 'Theory' },
    { code: 'CSE 203', title: 'Data Structure', category: 'Software & Algorithms', type: 'Theory' },
    { code: 'CSE 203L', title: 'Data Structure Lab', category: 'Software & Algorithms', type: 'Lab' },
    { code: 'CSE 204', title: 'Digital Logic Design', category: 'Hardware & Electronics', type: 'Theory' },
    { code: 'CSE 204L', title: 'Digital Logic Design Lab', category: 'Hardware & Electronics', type: 'Lab' },
    { code: 'CSE 210', title: 'Electronics I', category: 'Hardware & Electronics', type: 'Theory' },
    { code: 'CSE 210L', title: 'Labwork based on CSE 210', category: 'Hardware & Electronics', type: 'Lab' },
    { code: 'CSE 211', title: 'Algorithms', category: 'Software & Algorithms', type: 'Theory' },
    { code: 'CSE 211L', title: 'Labwork based on CSE 211', category: 'Software & Algorithms', type: 'Lab' },
    { code: 'CSE 213', title: 'Object Oriented Programming', category: 'Software & Algorithms', type: 'Theory' },
    { code: 'CSE 213L', title: 'Labwork based on CSE 213', category: 'Software & Algorithms', type: 'Lab' },
    { code: 'CSE 216', title: 'Microprocessor, Interfacing and Assembly Language', category: 'Hardware & Electronics', type: 'Theory' },
    { code: 'CSE 216L', title: 'Labwork based on CSE 216', category: 'Hardware & Electronics', type: 'Lab' },
    { code: 'CSE 303', title: 'Database Management', category: 'Software & Algorithms', type: 'Theory' },
    { code: 'CSE 303L', title: 'Labwork based on CSE 303', category: 'Software & Algorithms', type: 'Lab' },
    { code: 'CSE 310', title: 'Electronics II', category: 'Hardware & Electronics', type: 'Theory' },
    { code: 'CSE 310L', title: 'Labwork based on CSE 310', category: 'Hardware & Electronics', type: 'Lab' },
    { code: 'CSE 315', title: 'Design of Operating System', category: 'Systems & Networks', type: 'Theory' },
    { code: 'CSE 316', title: 'Computer Networks', category: 'Systems & Networks', type: 'Theory' },
    { code: 'CSE 316L', title: 'Labwork based on CSE 316', category: 'Systems & Networks', type: 'Lab' },
    { code: 'CSE 317', title: 'Numerical Methods', category: 'AI & Math', type: 'Theory' },
    { code: 'CSE 425', title: 'Artificial Intelligence', category: 'AI & Math', type: 'Theory' }
  ];

  const root = document.documentElement;
  const searchInput = document.querySelector('#course-search');
  const courseGrid = document.querySelector('#course-grid');
  const countLabel = document.querySelector('#course-count');
  const emptyState = document.querySelector('#empty-state');
  const filterButtons = [...document.querySelectorAll('.filter-pill')];
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  let activeFilter = 'All';

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeButton.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
    themeButton.querySelector('.theme-label').textContent = isDark ? 'Light mode' : 'Dark mode';
  };

  const makeCourseCard = ({ code, title, category, type }) => {
    const article = document.createElement('article');
    article.className = 'course-card';
    article.innerHTML = `<span class="course-code">${code}</span><div class="course-copy"><h3>${title}</h3><span class="course-category">${category}</span></div><span class="course-type${type === 'Lab' ? ' lab' : ''}">${type}</span>`;
    return article;
  };

  const renderCourses = () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const visibleCourses = courses.filter((course) => {
      const matchesSearch = `${course.code} ${course.title}`.toLocaleLowerCase().includes(query);
      const matchesFilter = activeFilter === 'All'
        || (activeFilter === 'Labs Only' ? course.type === 'Lab' : course.category === activeFilter);
      return matchesSearch && matchesFilter;
    });

    courseGrid.replaceChildren(...visibleCourses.map(makeCourseCard));
    courseGrid.setAttribute('aria-busy', 'false');
    countLabel.innerHTML = `<strong>${visibleCourses.length}</strong> of ${courses.length} courses`;
    emptyState.hidden = visibleCourses.length > 0;
  };

  setTheme(getPreferredTheme());
  renderCourses();
  document.querySelector('#current-year').textContent = new Date().getFullYear();

  searchInput.addEventListener('input', renderCourses);
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      renderCourses();
    });
  });

  themeButton.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  });

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    navLinks.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    navLinks.classList.toggle('is-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  const sectionLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  const copyButton = document.querySelector('#copy-summary');
  const toast = document.querySelector('#toast');
  let toastTimer;
  const summary = 'Israt Jahan Liya (Student ID: 2121198) is a Computer Science & Engineering student at Independent University, Bangladesh. She has completed 24 theory and lab courses spanning software and algorithms, systems and networks, hardware and electronics, artificial intelligence, and mathematics.';

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.classList.add('is-visible');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
    } catch (error) {
      toast.querySelector('span').textContent = '!';
      toast.lastChild.textContent = ' Clipboard access unavailable';
      toast.classList.add('is-visible');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
        toast.querySelector('span').textContent = '✓';
        toast.lastChild.textContent = ' Academic summary copied';
      }, 2600);
    }
  });
});
