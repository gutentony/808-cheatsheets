// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search');
  const sections = document.querySelectorAll('.sec');
  const clearBtn = document.getElementById('clear-search');
  const countEl = document.getElementById('result-count');

  searchInput.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    clearBtn.style.display = q ? 'flex' : 'none';
    
    if (!q) {
      sections.forEach(s => { s.style.display = ''; });
      document.querySelectorAll('.ci, .bl li, .hr, .pr, .bi, .ei').forEach(el => {
        el.style.display = '';
        el.classList.remove('hl');
      });
      countEl.style.display = 'none';
      return;
    }

    let total = 0;
    sections.forEach(sec => {
      let found = false;
      const items = sec.querySelectorAll('.ci, .bl li, .hr, .pr, .bi, .ei');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = '';
          item.classList.add('hl');
          found = true;
          total++;
        } else {
          item.style.display = 'none';
          item.classList.remove('hl');
        }
      });
      // Also check section title
      const title = sec.querySelector('.st');
      if (title && title.textContent.toLowerCase().includes(q)) {
        found = true;
        sec.querySelectorAll('.ci, .bl li, .hr, .pr, .bi, .ei').forEach(item => {
          item.style.display = '';
        });
      }
      sec.style.display = found ? '' : 'none';
    });
    
    countEl.textContent = total + ' 個結果';
    countEl.style.display = 'inline';
  });

  clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });

  // Click-to-copy on all code elements
  document.querySelectorAll('code').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = '點擊複製';
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      const text = this.textContent.replace(/^\.\./,'CLAUDE_CODE_');
      navigator.clipboard.writeText(text).then(() => {
        showToast('已複製：' + text);
        this.classList.add('copied');
        setTimeout(() => this.classList.remove('copied'), 600);
      });
    });
  });

  // Also make perf-value and badge clickable
  document.querySelectorAll('.pv, .bd').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = '點擊複製';
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      const text = this.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('已複製：' + text);
        this.classList.add('copied');
        setTimeout(() => this.classList.remove('copied'), 600);
      });
    });
  });

  // Code blocks - copy entire block
  document.querySelectorAll('.cb').forEach(el => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = '📋 複製';
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigator.clipboard.writeText(el.textContent.replace('📋 複製','').trim()).then(() => {
        showToast('已複製程式碼區塊');
        btn.textContent = '✅ 已複製';
        setTimeout(() => btn.textContent = '📋 複製', 1500);
      });
    });
    el.style.position = 'relative';
    el.appendChild(btn);
  });
});

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => toast.className = 'toast', 1800);
}
