const SPREADSHEET_ID = "19z5ra86M9dvZBlQo0f8JwjTwXs4KdhtLoT0ks1a2mK0";
const SHEET_NAME = "Réponses RSVP";
const HEADERS = ["Date", "Nom et prénom", "Présence", "Nombre de personnes", "Hébergement", "Message"];
const GUESTS_HEADER = "Noms des invités supplémentaires";

function responsePage(title, message) {
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + title + '</title></head><body style="font-family:sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.6">' +
    '<h1>' + title + '</h1><p>' + message + '</p>' +
    '<p>Vous pouvez revenir au site avec le bouton retour de votre navigateur.</p></body></html>'
  );
}

function safeCell(value) {
  return /^[\s]*[=+\-@]/.test(value) ? "'" + value : value;
}

function doPost(event) {
  const data = event && event.parameter;
  if (!data || data.website || typeof data.name !== "string" ||
      typeof data.attending !== "string" || typeof data.guests !== "string" ||
      typeof data.lodging !== "string" || typeof data.message !== "string") {
    return responsePage("Envoi impossible", "Les données envoyées sont incomplètes. Revenez au formulaire et réessayez.");
  }

  const name = data.name.trim();
  const message = data.message.trim();
  const validGuests = ["1 personne", "2 personnes", "3 personnes", "4 personnes"];
  const guestCount = validGuests.indexOf(data.guests);
  const guestKeys = ["guest2", "guest3", "guest4"];
  const hasGuestFields = guestKeys.some(key => Object.prototype.hasOwnProperty.call(data, key));
  const additionalGuests = guestKeys.slice(0, guestCount).map(key =>
    typeof data[key] === "string" ? data[key].trim() : ""
  );
  const validLodging = [
    "Pas besoin d’hébergement",
    "Chambre double (120 DT / nuit — tarif préférentiel invités)",
    "À définir / me contacter"
  ];
  if (!name || name.length > 200 || message.length > 5000 ||
      !["oui", "non"].includes(data.attending) ||
      guestCount < 0 || !validLodging.includes(data.lodging) ||
      (hasGuestFields && additionalGuests.some(guest => !guest || guest.length > 200))) {
    return responsePage("Envoi impossible", "Vérifiez les informations du formulaire puis réessayez.");
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([...HEADERS, GUESTS_HEADER]);
    }
    const lastColumn = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    let guestsColumn = headers.indexOf(GUESTS_HEADER) + 1;
    if (!guestsColumn) {
      guestsColumn = lastColumn + 1;
      sheet.getRange(1, guestsColumn).setValue(GUESTS_HEADER);
    }
    const row = [
      new Date(), safeCell(name), data.attending, data.guests,
      data.lodging, safeCell(message)
    ];
    while (row.length < guestsColumn) row.push("");
    row[guestsColumn - 1] = safeCell(additionalGuests.filter(Boolean).join("\n"));
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return responsePage("Merci pour votre réponse !", "Votre réponse a bien été enregistrée.");
  } catch (error) {
    console.error("Erreur d’enregistrement RSVP", error);
    return responsePage("Envoi impossible", "Votre réponse n’a pas pu être enregistrée. Veuillez réessayer ou contacter les organisateurs.");
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
