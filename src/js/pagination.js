export function initPagination(rootSelector, onPageChange) {
  const root = document.querySelector(rootSelector);
  if (!root) throw new Error(`Pagination root not found: ${rootSelector}`);

  const prevBtn = root.querySelector('.page-btn.prev');
  const nextBtn = root.querySelector('.page-btn.next');
  const numbersEl = root.querySelector('.page-numbers');

  let page = 1;
  let totalPages = 0;

  function show() {
    root.classList.add('is-visible');
  }

  function hide() {
    root.classList.remove('is-visible');
    numbersEl.innerHTML = '';
  }

  function setNavButtons() {
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages || totalPages === 0;
  }

  function formatPageNumber(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function uniqClean(model, total) {
    const cleaned = [];

    for (const item of model) {
      const last = cleaned[cleaned.length - 1];

      if (item === '...' && last === '...') continue;
      if (typeof item === 'number' && item === last) continue;

      cleaned.push(item);
    }

    if (cleaned[0] !== 1) cleaned.unshift(1);
    if (cleaned[cleaned.length - 1] !== total) cleaned.push(total);

    const final = [];
    for (let i = 0; i < cleaned.length; i += 1) {
      const cur = cleaned[i];
      const prev = final[final.length - 1];
      const next = cleaned[i + 1];

      if (
        cur === '...' &&
        typeof prev === 'number' &&
        typeof next === 'number'
      ) {
        if (next - prev === 2) {
          final.push(prev + 1);
          continue;
        }
        if (next - prev <= 1) continue;
      }

      final.push(cur);
    }

    return final;
  }

  function buildModel(current, total) {
    const cur = clamp(current, 1, total);

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (cur <= 2) {
      return uniqClean([1, 2, 3, '...', total], total);
    }

    if (cur >= total - 1) {
      return uniqClean([1, '...', total - 2, total - 1, total], total);
    }

    return uniqClean([1, '...', cur - 1, cur, cur + 1, '...', total], total);
  }

  function render() {
    if (totalPages <= 1) {
      hide();
      return;
    }

    show();
    setNavButtons();

    const model = buildModel(page, totalPages);

    numbersEl.innerHTML = model
      .map(item => {
        if (item === '...') return `<span class="ellipsis">…</span>`;

        const active = item === page ? 'is-active' : '';
        return `
          <button class="page-number ${active}" type="button" data-page="${item}">
            ${formatPageNumber(item)}
          </button>
        `;
      })
      .join('');
  }

  prevBtn.addEventListener('click', () => {
    if (page <= 1) return;
    page -= 1;
    onPageChange(page);
  });

  nextBtn.addEventListener('click', () => {
    if (page >= totalPages) return;
    page += 1;
    onPageChange(page);
  });

  numbersEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-page]');
    if (!btn) return;

    const next = Number(btn.dataset.page);
    if (!Number.isFinite(next) || next === page) return;

    page = next;
    onPageChange(page);
  });

  return {
    set(total, current = 1) {
      totalPages = Number(total) || 0;
      page = clamp(Number(current) || 1, 1, Math.max(1, totalPages));
      render();
    },
    reset() {
      page = 1;
      totalPages = 0;
      hide();
    },
    getPage() {
      return page;
    },
  };
}
