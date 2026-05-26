/**
 * src/scripts/quote-form.ts — Logique du formulaire de devis.
 *
 * Rôle : valider et soumettre le formulaire `/contact/` vers
 * Web3Forms (api.web3forms.com/submit). Sans backend à héberger.
 *
 * Documenté en un seul endroit pour déboguer le formulaire :
 *   - validation client (champs requis, e-mail, téléphone FR, RGPD) ;
 *   - états visuels (idle, sending, success, error) avec aria-live ;
 *   - honeypot natif Web3Forms (`botcheck`) + champ `subject` ;
 *   - dégradation gracieuse : sans JS, le `<form action>` natif POSTe
 *     directement vers Web3Forms (qui répond par sa propre page).
 *
 * Lié au markup : src/components/sections/QuoteForm.astro.
 * Variable d'env : PUBLIC_WEB3FORMS_KEY (cf. .env.example).
 *
 * Si le formulaire ne marche pas, regarde ICI en premier.
 */

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

type FormState = 'idle' | 'sending' | 'success' | 'error';

interface Messages {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  consent: string;
  sending: string;
  success: string;
  error: string;
  network: string;
}

const messages: Messages = {
  required: 'Ce champ est obligatoire.',
  invalidEmail: 'Veuillez saisir une adresse e-mail valide.',
  invalidPhone:
    'Veuillez saisir un numéro de téléphone français valide (10 chiffres).',
  consent:
    'Vous devez accepter la politique de confidentialité pour envoyer la demande.',
  sending: 'Envoi en cours…',
  success:
    'Votre demande est bien envoyée. Nous vous recontactons sous 24 h ouvrées. Pour une urgence, appelez le 06 03 34 03 05.',
  error:
    "Une erreur est survenue lors de l'envoi. Merci de réessayer dans un instant ou d'appeler le 06 03 34 03 05.",
  network:
    "Connexion impossible. Vérifiez votre connexion internet et réessayez, ou appelez le 06 03 34 03 05.",
};

/**
 * Validation française du téléphone : accepte 10 chiffres, avec ou sans
 * espaces / points / tirets. Première chiffre 0 (mobile et fixe).
 */
function isValidFrenchPhone(value: string): boolean {
  const digits = value.replace(/[\s.\-]/g, '');
  return /^0\d{9}$/.test(digits);
}

function isValidEmail(value: string): boolean {
  // Validation pragmatique : présence de @ et un point dans le domaine.
  // Le regex strict RFC 5322 est inutilisable en pratique.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Affiche / masque le message d'erreur d'un champ. Le markup attend
 * un <p class="quote-form__error" id="<field>-error" hidden>...</p>
 * à côté du champ, et un `aria-describedby` sur l'input.
 */
function setFieldError(
  form: HTMLFormElement,
  fieldName: string,
  message: string | null,
): void {
  const input = form.elements.namedItem(fieldName) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  const errorEl = form.querySelector<HTMLElement>(`#${fieldName}-error`);
  if (!input || !errorEl) return;

  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    input.setAttribute('aria-invalid', 'true');
  } else {
    errorEl.textContent = '';
    errorEl.hidden = true;
    input.removeAttribute('aria-invalid');
  }
}

function clearAllErrors(form: HTMLFormElement): void {
  form
    .querySelectorAll<HTMLElement>('.quote-form__error')
    .forEach((el) => {
      el.textContent = '';
      el.hidden = true;
    });
  form
    .querySelectorAll<HTMLElement>('[aria-invalid]')
    .forEach((el) => el.removeAttribute('aria-invalid'));
}

function validate(form: HTMLFormElement): boolean {
  let ok = true;

  const name = (form.elements.namedItem('name') as HTMLInputElement | null)
    ?.value.trim() ?? '';
  if (!name) {
    setFieldError(form, 'name', messages.required);
    ok = false;
  }

  const phone = (form.elements.namedItem('phone') as HTMLInputElement | null)
    ?.value.trim() ?? '';
  if (!phone) {
    setFieldError(form, 'phone', messages.required);
    ok = false;
  } else if (!isValidFrenchPhone(phone)) {
    setFieldError(form, 'phone', messages.invalidPhone);
    ok = false;
  }

  const email = (form.elements.namedItem('email') as HTMLInputElement | null)
    ?.value.trim() ?? '';
  if (email && !isValidEmail(email)) {
    setFieldError(form, 'email', messages.invalidEmail);
    ok = false;
  }

  const consent = form.elements.namedItem('consent') as HTMLInputElement | null;
  if (!consent?.checked) {
    setFieldError(form, 'consent', messages.consent);
    ok = false;
  }

  return ok;
}

function setState(form: HTMLFormElement, state: FormState): void {
  form.dataset.state = state;

  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const live = form.querySelector<HTMLElement>('[data-form-live]');

  if (button) {
    button.disabled = state === 'sending';
  }
  if (label) {
    label.textContent =
      state === 'sending' ? messages.sending : 'Envoyer ma demande';
  }
  if (live) {
    if (state === 'success') live.textContent = messages.success;
    else if (state === 'error') live.textContent = messages.error;
    else live.textContent = '';
  }
}

async function submitForm(form: HTMLFormElement): Promise<void> {
  setState(form, 'sending');

  const formData = new FormData(form);

  /* Si la clé Web3Forms n'est pas configurée, on bascule en erreur
     explicite côté UI (utile en dev). En prod la clé est en place. */
  const accessKey = formData.get('access_key');
  if (!accessKey || typeof accessKey !== 'string' || accessKey.length < 8) {
    console.error(
      '[QuoteForm] PUBLIC_WEB3FORMS_KEY non configurée. Voir .env.example.',
    );
    setState(form, 'error');
    return;
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });
    const data = (await response.json()) as { success?: boolean };

    if (response.ok && data.success) {
      setState(form, 'success');
      form.reset();
      // Garder la case de consentement décochée volontairement.
    } else {
      setState(form, 'error');
    }
  } catch (err) {
    console.error('[QuoteForm] Envoi échoué :', err);
    const live = form.querySelector<HTMLElement>('[data-form-live]');
    if (live) live.textContent = messages.network;
    setState(form, 'error');
  }
}

/**
 * Lie le formulaire — appelé au chargement.
 */
function bind(form: HTMLFormElement): void {
  if (form.dataset.bound) return;
  form.dataset.bound = '1';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);
    if (!validate(form)) return;
    void submitForm(form);
  });

  /* Au changement d'un champ en erreur, on efface l'erreur (UX standard). */
  form.querySelectorAll<HTMLInputElement>('[aria-invalid]').forEach((el) => {
    el.addEventListener('input', () => {
      const name = el.getAttribute('name');
      if (name) setFieldError(form, name, null);
    });
  });
}

function init(): void {
  const form = document.querySelector<HTMLFormElement>(
    'form.quote-form[data-quote-form]',
  );
  if (form) bind(form);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // View Transitions Astro (au cas où).
  document.addEventListener('astro:page-load', init);
}
