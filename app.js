/* ========================================================
   AI Learning Dashboard — Application Logic
   ======================================================== */

// ─────────── State ───────────
const state = {
  roadmap: [
    { id: 'python',  name: 'Python',             icon: '🐍', pct: 90, color: '#3b82f6' },
    { id: 'numpy',   name: 'NumPy',              icon: '🔢', pct: 80, color: '#a78bfa' },
    { id: 'pandas',  name: 'Pandas',             icon: '🐼', pct: 70, color: '#f472b6' },
    { id: 'dataviz', name: 'Data Visualization',  icon: '📊', pct: 65, color: '#22d3ee' },
    { id: 'ml',      name: 'Machine Learning',    icon: '🤖', pct: 45, color: '#fb923c' },
    { id: 'dl',      name: 'Deep Learning',        icon: '🧠', pct: 25, color: '#f87171' },
    { id: 'genai',   name: 'Generative AI',        icon: '✨', pct: 15, color: '#34d399' },
  ],

  topicSubtopics: {
    python:   ['Variables & Data Types', 'Control Flow', 'Functions', 'OOP', 'File Handling', 'Error Handling', 'Modules & Packages', 'List Comprehensions', 'Decorators', 'Generators'],
    numpy:    ['Array Creation', 'Indexing & Slicing', 'Array Operations', 'Broadcasting', 'Linear Algebra', 'Random Module', 'Reshaping', 'Aggregation Functions'],
    pandas:   ['Series & DataFrames', 'Indexing', 'Filtering', 'GroupBy', 'Merging & Joining', 'Pivot Tables', 'Handling Missing Data', 'Time Series'],
    dataviz:  ['Matplotlib Basics', 'Seaborn', 'Plotly', 'Histograms', 'Scatter Plots', 'Heatmaps', 'Interactive Charts'],
    ml:       ['Supervised Learning', 'Unsupervised Learning', 'Regression', 'Classification', 'Model Evaluation', 'Feature Engineering', 'Ensemble Methods'],
    dl:       ['Neural Networks', 'Backpropagation', 'CNNs', 'RNNs', 'Transfer Learning', 'GANs'],
    databases:['SQL Basics', 'Joins', 'Aggregations', 'NoSQL Intro', 'MongoDB', 'Database Design'],
  },

  tasks: [
    { id: 1, text: 'Learn Linear Regression',    done: true  },
    { id: 2, text: 'Practice NumPy arrays',       done: true  },
    { id: 3, text: 'Study Classification',         done: false },
    { id: 4, text: 'Complete ML quiz',             done: false },
    { id: 5, text: 'Work on AI mini project',      done: false },
  ],

  projects: [
    { id: 1, name: 'Student Performance Predictor', difficulty: 'Beginner',      techs: ['Python','Pandas','Scikit-learn'],   pct: 100 },
    { id: 2, name: 'House Price Prediction',         difficulty: 'Beginner',      techs: ['Python','NumPy','Linear Regression'], pct: 100 },
    { id: 3, name: 'Spam Email Classifier',          difficulty: 'Intermediate',  techs: ['Python','NLP','Naive Bayes'],        pct: 100 },
    { id: 4, name: 'Movie Recommendation System',    difficulty: 'Intermediate',  techs: ['Python','Pandas','Collaborative Filtering'], pct: 75 },
    { id: 5, name: 'AI Chatbot',                     difficulty: 'Advanced',      techs: ['Python','Transformers','LangChain'],  pct: 40 },
    { id: 6, name: 'Image Classifier (CNN)',          difficulty: 'Advanced',      techs: ['Python','TensorFlow','Keras'],        pct: 100 },
  ],

  weeklyHours: [2, 3, 1, 4, 2, 5, 3],
  weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

  currentTopics: ['Supervised Learning', 'Unsupervised Learning', 'Regression', 'Classification', 'Model Evaluation'],

  profile: {
    name: 'Tanishka Naik',
    role: 'Aspiring AI / Data Science Engineer',
    skills: ['Python', 'NumPy', 'Pandas', 'Machine Learning'],
  },

  nextTaskId: 6,
  nextProjectId: 7,
};

// ─────────── DOM References ───────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─────────── Toast Notification ───────────
function showToast(message, icon = '✅') {
  const container = $('#toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast__icon">${icon}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ─────────── Sidebar Navigation ───────────
function initNavigation() {
  const navItems = $$('.nav-item');
  const sidebarOverlay = $('#sidebarOverlay');
  const sidebar = $('#sidebar');
  const menuBtn = $('#menuBtn');
  const profileBtn = $('#sidebarProfileBtn');

  // Page mapping for learning-path topics
  const topicPages = { python: 'python', numpy: 'numpy', pandas: 'pandas', dataviz: 'dataviz', ml: 'ml', dl: 'dl', databases: 'databases' };

  function navigateTo(pageId) {
    // Close sidebar on mobile
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');

    // Update active nav
    navItems.forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Hide all pages
    $$('.page').forEach(p => p.classList.remove('active'));

    // Show the right page
    if (pageId === 'dashboard') {
      $('#page-dashboard').classList.add('active');
    } else if (pageId === 'projects') {
      $('#page-projects').classList.add('active');
      renderProjectsPage();
    } else if (pageId === 'profile') {
      $('#page-profile').classList.add('active');
      renderProfilePage();
    } else if (pageId === 'settings') {
      $('#page-settings').classList.add('active');
    } else if (topicPages[pageId]) {
      showTopicDetail(pageId);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  profileBtn.addEventListener('click', () => navigateTo('profile'));

  // Mobile menu
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
  });
}

// ─────────── Topic Detail Page ───────────
function showTopicDetail(topicId) {
  const page = $('#page-topic-detail');
  page.classList.add('active');

  const topicMap = {
    python:   { name: 'Python 🐍',            desc: 'Master the fundamentals of Python programming.' },
    numpy:    { name: 'NumPy 🔢',             desc: 'Learn numerical computing with NumPy arrays.' },
    pandas:   { name: 'Pandas 🐼',            desc: 'Data manipulation and analysis with Pandas.' },
    dataviz:  { name: 'Data Visualization 📊', desc: 'Create compelling charts and visualizations.' },
    ml:       { name: 'Machine Learning 🤖',   desc: 'Understand ML algorithms and model building.' },
    dl:       { name: 'Deep Learning 🧠',      desc: 'Dive into neural networks and deep learning.' },
    databases:{ name: 'Databases 🗄️',         desc: 'Learn SQL, NoSQL, and database design.' },
  };

  const info = topicMap[topicId] || { name: topicId, desc: '' };
  const roadmapItem = state.roadmap.find(r => r.id === topicId);
  const pct = roadmapItem ? roadmapItem.pct : 50;
  const subtopics = state.topicSubtopics[topicId] || [];

  $('#topicDetailTitle').textContent = info.name;
  $('#topicDetailSub').textContent = info.desc;
  $('#topicDetailPct').textContent = pct + '%';

  setTimeout(() => {
    $('#topicDetailBar').style.width = pct + '%';
  }, 100);

  const container = $('#topicSubList');
  container.innerHTML = subtopics.map((st, i) => {
    const completed = i < Math.floor(subtopics.length * (pct / 100));
    return `
      <div class="task-item">
        <button class="task-checkbox ${completed ? 'checked' : ''}" data-topic="${topicId}" data-idx="${i}">
          ${completed ? '✓' : ''}
        </button>
        <span class="task-item__text ${completed ? 'done' : ''}">${st}</span>
      </div>
    `;
  }).join('');

  // Toggle sub-topic completion
  container.querySelectorAll('.task-checkbox').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('checked');
      btn.textContent = btn.classList.contains('checked') ? '✓' : '';
      btn.nextElementSibling.classList.toggle('done');
      showToast('Topic status updated');
    });
  });
}

// ─────────── Roadmap Rendering ───────────
function renderRoadmap() {
  const container = $('#roadmapContainer');
  container.innerHTML = state.roadmap.map(item => {
    const status = item.pct >= 90 ? 'Completed' : item.pct > 0 ? 'In Progress' : 'Not Started';
    const statusClass = item.pct >= 90 ? 'status--completed' : item.pct > 0 ? 'status--in-progress' : 'status--not-started';
    return `
      <div class="roadmap-item" data-id="${item.id}">
        <div class="roadmap-item__icon" style="background:${item.color}18;color:${item.color}">${item.icon}</div>
        <div class="roadmap-item__info">
          <div class="roadmap-item__top">
            <span class="roadmap-item__name">${item.name}</span>
            <span class="roadmap-item__pct">${item.pct}%</span>
          </div>
          <div class="roadmap-item__bar">
            <div class="roadmap-item__bar-fill" style="width:0%;background:${item.color}"></div>
          </div>
        </div>
        <span class="roadmap-item__status ${statusClass}">${status}</span>
      </div>
    `;
  }).join('');

  // Animate bars
  setTimeout(() => {
    container.querySelectorAll('.roadmap-item').forEach(el => {
      const id = el.dataset.id;
      const item = state.roadmap.find(r => r.id === id);
      el.querySelector('.roadmap-item__bar-fill').style.width = item.pct + '%';
    });
  }, 200);
}

// ─────────── Currently Learning ───────────
function renderCurrentLearning() {
  const container = $('#currentTopics');
  container.innerHTML = state.currentTopics.map(t => `<span class="topic-chip">${t}</span>`).join('');
  setTimeout(() => {
    $('#currentProgressFill').style.width = '45%';
  }, 400);
}

// ─────────── Tasks ───────────
function renderTasks() {
  const container = $('#taskList');
  container.innerHTML = state.tasks.map(t => `
    <div class="task-item" data-id="${t.id}">
      <button class="task-checkbox ${t.done ? 'checked' : ''}" data-task-id="${t.id}">
        ${t.done ? '✓' : ''}
      </button>
      <span class="task-item__text ${t.done ? 'done' : ''}">${t.text}</span>
    </div>
  `).join('');

  updateTaskCount();

  // Toggle task
  container.querySelectorAll('.task-checkbox').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.taskId);
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.done = !task.done;
        btn.classList.toggle('checked');
        btn.textContent = task.done ? '✓' : '';
        btn.nextElementSibling.classList.toggle('done');
        updateTaskCount();
        showToast(task.done ? 'Task completed!' : 'Task unchecked', task.done ? '✅' : '⬜');
      }
    });
  });
}

function updateTaskCount() {
  const done = state.tasks.filter(t => t.done).length;
  $('#taskCountLabel').textContent = `${done}/${state.tasks.length} done`;
}

function initTaskAdd() {
  const input = $('#newTaskInput');
  const btn = $('#addTaskBtn');

  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    state.tasks.push({ id: state.nextTaskId++, text, done: false });
    input.value = '';
    renderTasks();
    showToast('New task added!', '📝');
  }

  btn.addEventListener('click', addTask);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });
}

// ─────────── Projects ───────────
function projectCardHTML(p) {
  const diffClass = p.difficulty === 'Beginner' ? 'difficulty--beginner' :
                    p.difficulty === 'Intermediate' ? 'difficulty--intermediate' : 'difficulty--advanced';
  const statusText = p.pct === 100 ? 'Completed' : p.pct > 0 ? `${p.pct}% Complete` : 'Not Started';
  const statusColor = p.pct === 100 ? 'var(--accent-green)' : p.pct > 0 ? 'var(--accent-blue)' : 'var(--text-muted)';

  return `
    <div class="project-card">
      <div class="project-card__header">
        <div class="project-card__icon">🗂️</div>
        <span class="project-card__difficulty ${diffClass}">${p.difficulty}</span>
      </div>
      <h3 class="project-card__name">${p.name}</h3>
      <div class="project-card__techs">
        ${p.techs.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
      <div class="project-card__status">
        <span class="project-card__status-text" style="color:${statusColor}">${statusText}</span>
        <div class="project-card__progress">
          <div class="project-card__progress-fill" style="width:${p.pct}%"></div>
        </div>
      </div>
    </div>
  `;
}

function renderProjects() {
  const grid = $('#projectsGrid');
  grid.innerHTML = state.projects.map(projectCardHTML).join('');
}

function renderProjectsPage() {
  const grid = $('#projectsGridFull');
  grid.innerHTML = state.projects.map(projectCardHTML).join('');
}

// ─────────── Stats ───────────
function animateStats() {
  setTimeout(() => {
    const overallPct = Math.round(state.roadmap.reduce((s, r) => s + r.pct, 0) / state.roadmap.length);
    $('#overallProgressBar').style.width = overallPct + '%';
    $('#overallPctText').textContent = overallPct + '%';

    const completedProjects = state.projects.filter(p => p.pct === 100).length;
    $('#projectsCompletedText').textContent = completedProjects;
  }, 300);
}

// ─────────── Weekly Chart (Canvas) ───────────
let chartAnimationFrame;

function drawChart() {
  const canvas = $('#weeklyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // High-DPI support
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  const maxVal = Math.max(...state.weeklyHours, 1);
  const padding = { top: 20, right: 20, bottom: 40, left: 44 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const barCount = state.weekDays.length;
  const barGap = 12;
  const barWidth = Math.min((chartW - barGap * (barCount - 1)) / barCount, 48);
  const totalBarsW = barCount * barWidth + (barCount - 1) * barGap;
  const startX = padding.left + (chartW - totalBarsW) / 2;

  // Clear
  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(148,163,184,.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + chartH * (1 - i / 4);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(((maxVal * i) / 4).toFixed(0) + 'h', padding.left - 8, y + 4);
  }

  // Bars
  state.weeklyHours.forEach((val, i) => {
    const x = startX + i * (barWidth + barGap);
    const barH = (val / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    // Gradient bar
    const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = grad;
    roundedRect(ctx, x, y, barWidth, barH, 6);

    // Glow
    ctx.shadowColor = 'rgba(59,130,246,.25)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Value on top
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(val + 'h', x + barWidth / 2, y - 8);

    // Day label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(state.weekDays[i], x + barWidth / 2, padding.top + chartH + 22);
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  if (h < r * 2) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function initChartRefresh() {
  $('#randomizeChartBtn').addEventListener('click', () => {
    state.weeklyHours = state.weeklyHours.map(() => Math.floor(Math.random() * 6) + 1);
    drawChart();
    showToast('Chart data refreshed', '📊');
  });
}

// ─────────── Modals ───────────
function initModals() {
  // Goal modal
  const goalModal = $('#goalModal');
  $('#addGoalBtn').addEventListener('click', () => goalModal.classList.add('open'));
  $('#closeGoalModal').addEventListener('click', () => goalModal.classList.remove('open'));
  $('#cancelGoalBtn').addEventListener('click', () => goalModal.classList.remove('open'));
  goalModal.addEventListener('click', (e) => { if (e.target === goalModal) goalModal.classList.remove('open'); });

  $('#saveGoalBtn').addEventListener('click', () => {
    const title = $('#goalTitleInput').value.trim();
    if (!title) { showToast('Please enter a goal title', '⚠️'); return; }
    goalModal.classList.remove('open');
    showToast(`Goal "${title}" added!`, '🎯');
    $('#goalTitleInput').value = '';
  });

  // Project modal
  const projectModal = $('#projectModal');
  const openProjectModal = () => projectModal.classList.add('open');
  $('#addProjectBtn').addEventListener('click', openProjectModal);
  $('#addProjectBtn2').addEventListener('click', openProjectModal);
  $('#closeProjectModal').addEventListener('click', () => projectModal.classList.remove('open'));
  $('#cancelProjectBtn').addEventListener('click', () => projectModal.classList.remove('open'));
  projectModal.addEventListener('click', (e) => { if (e.target === projectModal) projectModal.classList.remove('open'); });

  $('#saveProjectBtn').addEventListener('click', () => {
    const name = $('#projectNameInput').value.trim();
    if (!name) { showToast('Please enter a project name', '⚠️'); return; }
    const difficulty = $('#projectDifficultySelect').value;
    const techs = $('#projectTechInput').value.split(',').map(t => t.trim()).filter(Boolean);
    state.projects.push({ id: state.nextProjectId++, name, difficulty, techs: techs.length ? techs : ['Python'], pct: 0 });
    projectModal.classList.remove('open');
    renderProjects();
    renderProjectsPage();
    showToast(`Project "${name}" created!`, '🚀');
    $('#projectNameInput').value = '';
    $('#projectTechInput').value = '';
  });
}

// ─────────── Profile Page ───────────
function renderProfilePage() {
  $('#profileName').textContent = state.profile.name;
  $('#profileRole').textContent = state.profile.role;
  $('#profileSkills').innerHTML = state.profile.skills.map(s => `<span class="skill-badge">${s}</span>`).join('');
  $('#profileNameInput').value = state.profile.name;
  $('#profileRoleInput').value = state.profile.role;
  $('#profileSkillsInput').value = state.profile.skills.join(', ');
}

function initProfile() {
  $('#saveProfileBtn').addEventListener('click', () => {
    state.profile.name = $('#profileNameInput').value.trim() || state.profile.name;
    state.profile.role = $('#profileRoleInput').value.trim() || state.profile.role;
    state.profile.skills = $('#profileSkillsInput').value.split(',').map(s => s.trim()).filter(Boolean);
    renderProfilePage();

    // Update sidebar
    $('.profile-info__name').textContent = state.profile.name;
    showToast('Profile updated successfully!', '👤');
  });
}

// ─────────── Settings ───────────
function initSettings() {
  $$('.toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('on');
      showToast('Setting updated', '⚙️');
    });
  });

  $('#resetProgressBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      state.roadmap.forEach(r => r.pct = 0);
      state.tasks.forEach(t => t.done = false);
      renderRoadmap();
      renderTasks();
      animateStats();
      showToast('All progress has been reset', '🔄');
    }
  });
}

// ─────────── Window Resize ───────────
function initResize() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawChart, 200);
  });
}

// ─────────── Initialization ───────────
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderRoadmap();
  renderCurrentLearning();
  renderTasks();
  initTaskAdd();
  renderProjects();
  animateStats();
  initModals();
  initProfile();
  initSettings();
  initResize();

  // Draw chart after a short delay to ensure layout is stable
  setTimeout(drawChart, 400);
  initChartRefresh();
});
