export function createLoader(text = 'Loading...') {
  const wrapper = document.createElement('div');
  wrapper.className = 'app-loader';
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-live', 'polite');

  const spinner = document.createElement('div');
  spinner.className = 'app-loader__spinner';
  spinner.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.className = 'app-loader__text';
  label.textContent = text;

  wrapper.appendChild(spinner);
  wrapper.appendChild(label);

  return wrapper;
}

export function mountLoader(target, text) {
  const el =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;
  const loader = createLoader(text);
  el.innerHTML = '';
  el.appendChild(loader);
  return loader;
}

export function removeLoader(target) {
  const el =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const loader = el.querySelector('.app-loader');
  if (loader) loader.remove();
}

export async function withLoader(target, action, text) {
  const loader = mountLoader(target, text);
  try {
    return await action();
  } finally {
    if (loader) loader.remove();
  }
}
