const historyEl = document.getElementById('history');
const diaryHistoryEl = document.getElementById('diary-history');
const moodButtonsContainer = document.getElementById('mood-buttons');
const buttons = document.querySelectorAll('#mood-buttons button');
const dateHeader = document.getElementById('date-header');

const tabMoods = document.getElementById('tab-moods');
const tabDiary = document.getElementById('tab-diary');
const moodsSection = document.getElementById('moods-section');
const diarySection = document.getElementById('diary-section');

const diaryInput = document.getElementById('diary-input');
const saveDiaryBtn = document.getElementById('save-diary-btn');

const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');

let moodEntries = {};
let diaryEntries = {};

// Format date as "Month Day, Year"
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Format time as "HH:MM AM/PM"
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

// Update the date header with a line break between lines
function updateDateHeader() {
  const today = new Date();
  const formattedDate = formatDate(today);
  dateHeader.textContent = `today is: \n${formattedDate}`;
}
updateDateHeader();

// Load existing entries from localStorage
if (localStorage.getItem('moodEntries')) {
  moodEntries = JSON.parse(localStorage.getItem('moodEntries'));
}
if (localStorage.getItem('diaryEntries')) {
  diaryEntries = JSON.parse(localStorage.getItem('diaryEntries'));
}

renderHistory();
renderDiaryHistory();

// Tab switching logic
tabMoods.addEventListener('click', () => {
  tabMoods.classList.add('active');
  tabDiary.classList.remove('active');
  moodsSection.style.display = '';
  diarySection.style.display = 'none';
});

tabDiary.addEventListener('click', () => {
  tabDiary.classList.add('active');
  tabMoods.classList.remove('active');
  diarySection.style.display = '';
  moodsSection.style.display = 'none';
});

// Add mood entry on mood button click
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const mood = button.getAttribute('data-mood');
    const now = new Date();
    const dateKey = formatDate(now);

    if (!moodEntries[dateKey]) moodEntries[dateKey] = [];

    moodEntries[dateKey].push({
      mood,
      time: formatTime(now),
      imgSrc: button.querySelector('img').src,
      imgAlt: button.querySelector('img').alt
    });

    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    renderHistory();
  });
});

// Save diary entry on button click
saveDiaryBtn.addEventListener('click', () => {
  const text = diaryInput.value.trim();
  if (!text) return alert("Please write something before saving.");

  const now = new Date();
  const dateKey = formatDate(now);

  if (!diaryEntries[dateKey]) diaryEntries[dateKey] = [];

  diaryEntries[dateKey].push({
    text,
    time: formatTime(now)
  });

  localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
  diaryInput.value = '';
  renderDiaryHistory();
});

// Create menu with delete option for each entry
function createMenu(deleteCallback) {
  const container = document.createElement('div');
  container.className = 'menu-container';

  const button = document.createElement('button');
  button.className = 'menu-button';
  button.textContent = '⋮';

  const dropdown = document.createElement('div');
  dropdown.className = 'menu-dropdown';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  deleteBtn.addEventListener('click', () => {
    dropdown.classList.remove('show');
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteCallback();
    }
  });

  dropdown.appendChild(deleteBtn);
  container.appendChild(button);
  container.appendChild(dropdown);

  // Toggle dropdown visibility on button click
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });

  return container;
}

// Render mood history
function renderHistory() {
  historyEl.innerHTML = '';

  const sortedDates = Object.keys(moodEntries).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(dateKey => {
    const dateSection = document.createElement('div');
    dateSection.style.marginBottom = '30px';

    const dateTitle = document.createElement('h3');
    dateTitle.textContent = dateKey;
    dateTitle.style.color = '#33691E';
    dateTitle.style.fontFamily = "'Fuzzy Bubbles', cursive";
    dateTitle.style.marginBottom = '10px';

    dateSection.appendChild(dateTitle);

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.paddingLeft = '0';

    moodEntries[dateKey].forEach((entry, index) => {
      const li = document.createElement('li');
      li.style.background = 'white';
      li.style.borderRadius = '10px';
      li.style.padding = '12px 20px';
      li.style.marginBottom = '12px';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.justifyContent = 'space-between';
      li.style.boxShadow = '0 2px 6px rgba(124, 179, 66, 0.1)';
      li.style.color = '#6D4C41';

      const leftDiv = document.createElement('div');
      leftDiv.style.display = 'flex';
      leftDiv.style.alignItems = 'center';

      const img = document.createElement('img');
      img.src = entry.imgSrc;
      img.alt = entry.imgAlt;
      img.width = 28;
      img.height = 28;
      img.style.marginRight = '15px';

      const text = document.createElement('span');
      text.textContent = `${entry.time} — ${entry.mood}`;

      leftDiv.appendChild(img);
      leftDiv.appendChild(text);

      const menu = createMenu(() => {
        moodEntries[dateKey].splice(index, 1);
        if (moodEntries[dateKey].length === 0) {
          delete moodEntries[dateKey];
        }
        localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
        renderHistory();
      });

      li.appendChild(leftDiv);
      li.appendChild(menu);
      ul.appendChild(li);
    });

    dateSection.appendChild(ul);
    historyEl.appendChild(dateSection);
  });
}

// Render diary history
function renderDiaryHistory() {
  diaryHistoryEl.innerHTML = '';

  const sortedDates = Object.keys(diaryEntries).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(dateKey => {
    const dateSection = document.createElement('div');
    dateSection.style.marginBottom = '30px';

    const dateTitle = document.createElement('h3');
    dateTitle.textContent = dateKey;
    dateTitle.style.color = '#33691E';
    dateTitle.style.fontFamily = "'Fuzzy Bubbles', cursive";
    dateTitle.style.marginBottom = '10px';

    dateSection.appendChild(dateTitle);

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.paddingLeft = '0';

    diaryEntries[dateKey].forEach((entry, index) => {
      const li = document.createElement('li');
      li.style.background = 'white';
      li.style.borderRadius = '10px';
      li.style.padding = '12px 20px';
      li.style.marginBottom = '12px';
      li.style.color = '#6D4C41';
      li.style.boxShadow = '0 2px 6px rgba(124, 179, 66, 0.1)';
      li.style.whiteSpace = 'pre-wrap'; // preserve line breaks
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';

      const textSpan = document.createElement('span');
      textSpan.textContent = `${entry.time} — ${entry.text}`;
      textSpan.style.flex = '1';

      const menu = createMenu(() => {
        diaryEntries[dateKey].splice(index, 1);
        if (diaryEntries[dateKey].length === 0) {
          delete diaryEntries[dateKey];
        }
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
        renderDiaryHistory();
      });

      li.appendChild(textSpan);
      li.appendChild(menu);
      ul.appendChild(li);
    });

    dateSection.appendChild(ul);
    diaryHistoryEl.appendChild(dateSection);
  });
}

// --- Carousel scrolling logic ---

const scrollAmount = 95; // 70px button + 25px gap

scrollLeftBtn.addEventListener('click', () => {
  moodButtonsContainer.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  });
});

scrollRightBtn.addEventListener('click', () => {
  moodButtonsContainer.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
});
