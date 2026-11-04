/**
 * Formular-Versand über Netlify Forms (kein eigenes Backend nötig).
 * Lokal (astro dev / preview) wird der Versand simuliert.
 */
const encode = (data: FormData) =>
  new URLSearchParams([...data.entries()].map(([k, v]) => [k, String(v)])).toString();

const isLocal = () => ['localhost', '127.0.0.1'].includes(location.hostname) || import.meta.env.DEV;

export async function submitForm(form: HTMLFormElement) {
  const data = new FormData(form);
  if (isLocal()) {
    await new Promise((r) => setTimeout(r, 700));
    return;
  }
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export function showSuccess(form: HTMLFormElement) {
  const body = form.querySelector<HTMLElement>('[data-form-body]');
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  if (body) body.hidden = true;
  if (success) {
    success.hidden = false;
    success.focus();
  }
}

export function initForms(selector = '[data-form]') {
  document.querySelectorAll<HTMLFormElement>(selector).forEach((form) => {
    if (form.dataset.formReady) return;
    form.dataset.formReady = 'true';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const label = form.querySelector<HTMLElement>('[data-submit-label]');
      const error = form.querySelector<HTMLElement>('[data-form-error]');
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const original = label?.textContent;

      if (label) label.textContent = 'Wird gesendet …';
      if (button) button.disabled = true;
      if (error) error.hidden = true;

      try {
        await submitForm(form);
        showSuccess(form);
      } catch {
        if (error) {
          error.hidden = false;
          error.textContent =
            'Das hat leider nicht geklappt. Bitte versuch es noch einmal oder ruf uns an: 06534 9494300.';
        }
      } finally {
        if (label && original) label.textContent = original;
        if (button) button.disabled = false;
      }
    });
  });
}
