// URL du déploiement Google Apps Script, se terminant par /exec.
const ENDPOINT = "https://script.google.com/macros/s/AKfycbyr6qx_MzZk-Cp2KpIEfaTBVdq-pSnaOk89pRvRAfq6saQZxCsfuCqNAqknX1w_oEbB/exec";

const form = document.getElementById("rsvp-form");
const status = document.getElementById("form-status");
const submitButton = form.querySelector('button[type="submit"]');
const guestFields = document.getElementById("additional-guests");
const guestInputs = guestFields.querySelectorAll("input");

function updateGuestFields() {
  const count = form.elements.guests.selectedIndex + 1;
  guestFields.hidden = count < 2;
  guestInputs.forEach((input, index) => {
    const active = index < count - 1;
    input.disabled = !active;
    input.required = active;
    input.parentElement.hidden = !active;
  });
}

form.elements.guests.addEventListener("change", updateGuestFields);
updateGuestFields();

window.addEventListener("pageshow", () => {
  submitButton.disabled = false;
  updateGuestFields();
});

form.addEventListener("submit", (event) => {
  if (!ENDPOINT || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(ENDPOINT)) {
    event.preventDefault();
    status.textContent = "Le formulaire n’est pas encore connecté. Merci de contacter les organisateurs.";
    return;
  }

  if (!form.elements.name.value.trim()) {
    event.preventDefault();
    status.textContent = "Merci d’indiquer votre nom et prénom.";
    form.elements.name.focus();
    return;
  }

  for (const input of guestInputs) {
    if (!input.disabled && !input.value.trim()) {
      event.preventDefault();
      status.textContent = "Merci d’indiquer le nom et prénom de chaque invité·e supplémentaire.";
      input.focus();
      return;
    }
  }

  if (form.elements.website.value) {
    event.preventDefault();
    status.textContent = "Votre réponse n’a pas pu être envoyée.";
    return;
  }

  form.action = ENDPOINT;
  submitButton.disabled = true;
  status.textContent = "Envoi en cours…";
});
