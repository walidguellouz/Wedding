# Connecter les réponses à Google Sheets

Le formulaire envoie les réponses à un service Google Apps Script. Après l'envoi,
une page Google confirme l'enregistrement ou indique une erreur. La feuille
reçoit les réponses dans un nouvel onglet « Réponses RSVP », sans modifier les
autres onglets. Les noms des invités supplémentaires sont enregistrés dans une
colonne dédiée ; les réponses précédentes restent inchangées.

1. Connectez-vous au compte propriétaire de la feuille Google Sheets indiquée.
2. Dans cette feuille, ouvrez **Extensions > Apps Script**.
3. Dans l'éditeur, remplacez le code du projet par le contenu de
   [google-apps-script.gs](google-apps-script.gs), puis enregistrez.
4. Sélectionnez **Déployer > Nouveau déploiement > Application Web**.
   Choisissez **Exécuter en tant que : moi** et **Qui a accès : tout le monde**,
   puis déployez et autorisez l'accès demandé par Google. Ne partagez pas les
   identifiants de votre compte. Si Google affiche un avertissement de sécurité,
   ne le contournez pas : vérifiez le projet et les autorisations demandées.
5. Copiez l'URL de l'application Web qui se termine par `/exec`, puis collez-la
   entre les guillemets de `ENDPOINT` dans [script.js](script.js).
6. Publiez le site mis à jour. Envoyez une réponse de test depuis le site et
   vérifiez sa présence dans l'onglet « Réponses RSVP ».

L'URL publique permet à toute personne qui la connaît d'envoyer des réponses :
elle ne donne pas accès à la lecture de la feuille, mais ne protège pas contre
les soumissions indésirables. Gardez la feuille privée. Si le code Apps Script
change, mettez à jour le déploiement pour utiliser la nouvelle version.
