
/* 
   DONNÉES DU JEU — Liste des mots tunisiens avec indices
  */

// Tableau d'objets : chaque objet représente un défi de mot
var motsDuJeu = [
    { mot: "MEDINA",     indice: "Vieille ville arabe, cœur historique des villes tunisiennes." },
    { mot: "HARISSA",    indice: "Condiment épicé rouge, emblème de la cuisine tunisienne." },
    { mot: "KAIROUAN",   indice: "Quatrième ville sainte de l'Islam, située au centre de la Tunisie." },
    { mot: "COUSCOUS",   indice: "Plat national tunisien à base de semoule." },
    { mot: "CARTHAGE",   indice: "Ancienne cité punique près de Tunis, classée UNESCO." },
    { mot: "SAHARA",     indice: "Grand désert qui couvre le sud de la Tunisie." },
    { mot: "BIZERTE",    indice: "Ville portuaire du nord, connue pour ses fortifications." }
];

/* 
   VARIABLES D'ÉTAT DU JEU
    */
var indexMotActuel = 0;    // Index du mot en cours dans le tableau
var score          = 0;    // Score du joueur
var reponseEnCours = [];   // Lettres choisies par le joueur (tableau de caractères)
var lettresDispos  = [];   // Tableau : { lettre, indexOriginal, used }

/* 
   INITIALISATION — Charger le premier mot au démarrage
   */

document.addEventListener("DOMContentLoaded", function () {
    // Mettre à jour le compteur total de mots
    document.getElementById("mot-total").textContent = motsDuJeu.length;

    // Charger le premier mot
    chargerMot(indexMotActuel);

    // Initialiser la démo de propagation
    initPropagation();
});

/* 
   FONCTION : Charger un mot et afficher ses lettres mélangées
    */


function chargerMot(index) {
    var motObj = motsDuJeu[index];

    // Afficher l'indice
    document.getElementById("hint-texte").textContent = motObj.indice;

    // Vider la zone de réponse et le feedback
    reponseEnCours = [];
    document.getElementById("zone-reponse").innerHTML = "";
    document.getElementById("feedback-jeu").textContent = "";
    document.getElementById("feedback-jeu").className = "";

    // Mettre à jour le compteur de mot actuel
    document.getElementById("mot-actuel-num").textContent = index + 1;

    // Construire le tableau de lettres disponibles avec état
    lettresDispos = motObj.mot.split("").map(function (lettre, i) {
        return { lettre: lettre, indexOriginal: i, used: false };
    });

    // Mélanger les lettres (algorithme Fisher-Yates)
    melangerTableau(lettresDispos);

    // Afficher les tuiles de lettres
    afficherLettresMelangees();
}


function melangerTableau(tableau) {
    for (var i = tableau.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = tableau[i];
        tableau[i] = tableau[j];
        tableau[j] = temp;
    }
}

/**
 * Crée et affiche les tuiles de lettres dans le conteneur #lettres-melangees.
 * Utilise addEventListener pour gérer le clic sur chaque tuile.
 */
function afficherLettresMelangees() {
    var conteneur = document.getElementById("lettres-melangees");
    conteneur.innerHTML = ""; // Vider avant de recréer

    // Parcourir chaque lettre et créer une tuile
    lettresDispos.forEach(function (item, index) {
        var tuile = document.createElement("button");
        tuile.type = "button";
        tuile.className = "lettre-tuile";
        tuile.textContent = item.lettre;
        tuile.id = "tuile-" + index;

        // Griser si déjà utilisée
        if (item.used) { tuile.classList.add("used"); tuile.disabled = true; }

        // Écouter le clic avec addEventListener
        tuile.addEventListener("click", function () {
            // Empêcher le clic sur une lettre déjà utilisée
            if (item.used) return;

            // Marquer la lettre comme utilisée
            item.used = true;
            tuile.classList.add("used");
            tuile.disabled = true;

            // Ajouter la lettre à la réponse en cours
            reponseEnCours.push({ lettre: item.lettre, indexDispos: index });

            // Afficher la lettre dans la zone de réponse
            ajouterLettreReponse(item.lettre, reponseEnCours.length - 1);
        });

        conteneur.appendChild(tuile);
    });
}

/**
 * Ajoute une lettre cliquable dans la zone de réponse.
 * Cliquer dessus la retire de la réponse et la remet dans les lettres disponibles.
 * @param {string} lettre      - La lettre à afficher
 * @param {number} posReponse  - Position dans reponseEnCours
 */
function ajouterLettreReponse(lettre, posReponse) {
    var zone = document.getElementById("zone-reponse");

    var tuile = document.createElement("div");
    tuile.className = "lettre-reponse";
    tuile.textContent = lettre;
    tuile.dataset.pos = posReponse; // Stocker la position pour retrouver l'item

    // Clic : retirer la lettre de la réponse
    tuile.addEventListener("click", function () {
        var pos = parseInt(tuile.dataset.pos, 10);

        // Retrouver l'objet correspondant dans lettresDispos
        var indexDispos = reponseEnCours[pos].indexDispos;

        // Remettre la lettre disponible
        lettresDispos[indexDispos].used = false;
        var tuileSource = document.getElementById("tuile-" + indexDispos);
        if (tuileSource) {
            tuileSource.classList.remove("used");
            tuileSource.disabled = false;
        }

        // Retirer de reponseEnCours (marquer comme null)
        reponseEnCours[pos] = null;

        // Retirer la tuile du DOM
        zone.removeChild(tuile);
    });

    zone.appendChild(tuile);
}

/* 
   FONCTION : Vérifier la réponse du joueur
   */

/**
 * Compare la réponse du joueur avec le mot correct.
 * Met à jour le score et affiche un retour visuel.
 */
function verifierReponse() {
    // Construire le mot à partir de reponseEnCours (ignorer les null)
    var motJoueur = reponseEnCours
        .filter(function (item) { return item !== null; })
        .map(function (item) { return item.lettre; })
        .join("");

    var motCorrect = motsDuJeu[indexMotActuel].mot;
    var feedback   = document.getElementById("feedback-jeu");

    if (motJoueur === motCorrect) {
        // Bonne réponse : incrémenter le score
        score++;
        document.getElementById("score-val").textContent = score;
        feedback.textContent = "✅ Bravo ! \"" + motCorrect + "\" est correct !";
        feedback.className   = "feedback-correct";
    } else if (motJoueur.length === 0) {
        feedback.textContent = "⚠️ Veuillez sélectionner des lettres.";
        feedback.className   = "feedback-faux";
    } else {
        feedback.textContent = "❌ Ce n'est pas correct. Essayez encore ou passez au suivant.";
        feedback.className   = "feedback-faux";
    }
}

/* 
   FONCTION : Passer au mot suivant
    */

/**
 * Charge le mot suivant dans la liste.
 * Si tous les mots sont terminés, affiche le score final.
 */
function motSuivant() {
    indexMotActuel++;

    if (indexMotActuel >= motsDuJeu.length) {
        // Fin du jeu : afficher le score final
        document.getElementById("feedback-jeu").textContent =
            "🎉 Jeu terminé ! Score final : " + score + " / " + motsDuJeu.length;
        document.getElementById("feedback-jeu").className = "feedback-correct";
        document.getElementById("lettres-melangees").innerHTML = "";
        document.getElementById("zone-reponse").innerHTML = "";
        document.getElementById("hint-texte").textContent = "Rejouer pour recommencer.";
    } else {
        chargerMot(indexMotActuel);
    }
}

/* 
   FONCTION : Recommencer le jeu depuis le début
    */

/**
 * Remet le score à zéro et recharge le premier mot.
 */
function reinitialiserJeu() {
    indexMotActuel = 0;
    score          = 0;
    document.getElementById("score-val").textContent = 0;
    chargerMot(0);
}

/* 
   DÉMO : PROPAGATION D'ÉVÉNEMENTS (Event Bubbling)
    */

/**
 * Initialise les écouteurs d'événements pour la démonstration
 * de la propagation (bubbling) et stopPropagation.
 */
function initPropagation() {
    var log       = document.getElementById("event-log");
    var divExt    = document.getElementById("div-externe");
    var divMil    = document.getElementById("div-milieu");
    var divInt    = document.getElementById("div-interne");
    var btnStop   = document.getElementById("btn-stop");
    var btnClear  = document.getElementById("btn-clear-log");

    /**
     * Ajoute un message dans le journal avec horodatage.
     * @param {string} message - Le texte à afficher
     * @param {string} couleur - La couleur du message
     */
    function logEvent(message, couleur) {
        var p = document.createElement("p");
        var now = new Date();
        var heure = now.getHours().toString().padStart(2, "0") + ":" +
                    now.getMinutes().toString().padStart(2, "0") + ":" +
                    now.getSeconds().toString().padStart(2, "0");
        p.textContent = "[" + heure + "] " + message;
        p.style.color = couleur || "#a8ff78";
        log.appendChild(p);
        // Auto-scroll vers le bas
        log.scrollTop = log.scrollHeight;
    }

    /* -- Div EXTERNE -- écoute le clic (reçoit l'événement en dernier via bubbling) */
    divExt.addEventListener("click", function (e) {
        logEvent("🔴 DIV EXTERNE a reçu le clic (bubbling atteint le plus haut niveau).", "#ff7675");
    });

    /* -- Div MILIEU -- écoute le clic (reçoit l'événement en deuxième) */
    divMil.addEventListener("click", function (e) {
        logEvent("🟠 DIV MILIEU a reçu le clic.", "#fdcb6e");
    });

    /* -- Div INTERNE -- écoute le clic (l'événement part d'ici) */
    divInt.addEventListener("click", function (e) {
        logEvent("🟢 DIV INTERNE a reçu le clic en premier (source de l'événement).", "#55efc4");
    });

    /* -- Bouton STOP -- utilise stopPropagation() pour bloquer la remontée */
    btnStop.addEventListener("click", function (e) {
        logEvent("🚫 Bouton STOP : event.stopPropagation() appelé → l'événement ne remonte plus.", "#74b9ff");

        // stopPropagation empêche l'événement de remonter vers div-interne, div-milieu et div-externe
        e.stopPropagation();
    });

    /* -- Bouton Vider le journal -- */
    btnClear.addEventListener("click", function () {
        log.innerHTML = '<p style="color:#888">— Journal vidé. Cliquez sur les éléments ci-dessus —</p>';
    });

    /* -- Démo : survol de la souris sur div-interne -- */
    divInt.addEventListener("mouseover", function (e) {
        divInt.style.boxShadow = "0 0 10px rgba(39,174,96,0.4)";
    });
    divInt.addEventListener("mouseout", function (e) {
        divInt.style.boxShadow = "none";
    });

    /* -- Démo : touche clavier pour afficher la note dans le log -- */
    document.addEventListener("keydown", function (e) {
        logEvent("⌨️ Touche pressée : \"" + e.key + "\"", "#a29bfe");
    });
}































