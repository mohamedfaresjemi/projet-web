
function lancerBanniere() {
    var span = document.getElementById("texte-defilant");
    if (!span) return;

    /**
     * Met à jour le texte de la bannière avec la date/heure actuelle.
     * Appelée toutes les secondes pour afficher l'heure en temps réel.
     */
    function mettreAJourTexte() {
        var maintenant = new Date();

        // Formater la date en français : JJ/MM/AAAA
        var jour   = maintenant.getDate().toString().padStart(2, "0");
        var mois   = (maintenant.getMonth() + 1).toString().padStart(2, "0");
        var annee  = maintenant.getFullYear();
        var dateStr = jour + "/" + mois + "/" + annee;

        // Formater l'heure : HH:MM:SS
        var hh = maintenant.getHours().toString().padStart(2, "0");
        var mm = maintenant.getMinutes().toString().padStart(2, "0");
        var ss = maintenant.getSeconds().toString().padStart(2, "0");
        var heureStr = hh + ":" + mm + ":" + ss;

        // Composer le message complet
        span.textContent =
            "🌟  Bienvenue au site web TN TOUNSIA !  " +
            "Aujourd'hui " + dateStr + ",  " +
            "et l'heure actuelle est " + heureStr +
            "  🌙  |  🌟  Bienvenu au site web TN TOUNSIA !  " +
            "Aujourd'hui " + dateStr + ",  " +
            "et l'heure actuelle est " + heureStr + "  🌙";
    }

    // Mise à jour immédiate puis toutes les secondes
    mettreAJourTexte();
    setInterval(mettreAJourTexte, 1000);

    // Animation CSS de défilement via propriété transform
    var position = 0;        // Position courante en pixels
    var vitesse  = 1.2;      // Pixels par frame

    /**
     * Déplace le texte vers la gauche à chaque frame.
     * Réinitialise la position quand le texte a entièrement défilé.
     */
    function animer() {
        position -= vitesse;

        // Réinitialiser quand tout le texte est sorti à gauche
        var largeurTexte = span.offsetWidth;
        if (Math.abs(position) > largeurTexte) {
            position = window.innerWidth; // Repartir depuis la droite
        }

        span.style.transform = "translateX(" + position + "px)";
        requestAnimationFrame(animer);
    }

    // Lancer l'animation
    animer();
}



// Tableau des images de la galerie (minimum 3)
var imagesGalerie = [
    { src: "hero-tunisia.jpg",       legende: "Les paysages magnifiques de Tunisie" },
    { src: "medina-door.jpg",        legende: "La Médina historique" },
    { src: "patrimoine-eljem.jpg",   legende: "L'Amphithéâtre d'El Jem" },
    { src: "tunisian-food.jpg",      legende: "La gastronomie tunisienne" },
    { src: "coucous.jpg",            legende: "Le couscous, plat national" }
];

var indexImageActuelle = 0;  // Index de l'image actuellement affichée
var intervalleGalerie  = null; // Référence à l'intervalle pour pouvoir l'arrêter

/**
 * Initialise la galerie d'images :
 * - Crée les éléments HTML pour chaque image
 * - Lance la rotation automatique
 * - Crée les points indicateurs
 */
function initGalerie() {
    var galerie = document.getElementById("galerie");
    var dotsZone = document.getElementById("galerie-dots");
    if (!galerie) return;

    // Créer un élément <img> et une légende pour chaque image
    imagesGalerie.forEach(function (imgObj, index) {
        // Conteneur de l'image
        var div = document.createElement("div");
        div.id = "slide-" + index;
        div.style.cssText =
            "position:absolute; top:0; left:0; width:100%; height:380px;" +
            "opacity:0; transition:opacity 0.8s ease; display:flex;" +
            "flex-direction:column; align-items:center; justify-content:flex-end;";

        // Balise image
        var img = document.createElement("img");
        img.src = imgObj.src;
        img.alt = imgObj.legende;
        img.style.cssText =
            "width:100%; height:380px; object-fit:cover; border-radius:14px;";

        // Légende superposée
        var legende = document.createElement("p");
        legende.textContent = imgObj.legende;
        legende.style.cssText =
            "position:absolute; bottom:0; left:0; right:0;" +
            "background:rgba(0,0,0,0.55); color:#fff; text-align:center;" +
            "padding:.7rem 1rem; font-size:.9rem; border-radius:0 0 14px 14px;";

        div.appendChild(img);
        div.appendChild(legende);
        galerie.appendChild(div);

        // Fixer la hauteur du conteneur galerie
        galerie.style.height = "380px";

        // Créer le point indicateur correspondant
        if (dotsZone) {
            var dot = document.createElement("span");
            dot.id  = "dot-" + index;
            dot.style.cssText =
                "display:inline-block; width:10px; height:10px;" +
                "border-radius:50%; background:#ccc; margin:0 4px; cursor:pointer;";

            // Clic sur un point → aller directement à cette image
            dot.addEventListener("click", function () {
                afficherImage(index);
            });

            dotsZone.appendChild(dot);
        }
    });

    // Afficher la première image
    afficherImage(0);

    // Lancer la rotation automatique (3 secondes par image)
    intervalleGalerie = setInterval(function () {
        var suivant = (indexImageActuelle + 1) % imagesGalerie.length;
        afficherImage(suivant);
    }, 3000); // 3 000 ms = 3 secondes minimum par image
}

/**
 * Affiche l'image à l'index donné et masque les autres.
 * Met également à jour les points indicateurs.
 * @param {number} index - Index de l'image à afficher
 */
function afficherImage(index) {
    // Masquer l'image actuellement affichée
    var slideActuel = document.getElementById("slide-" + indexImageActuelle);
    if (slideActuel) { slideActuel.style.opacity = "0"; }

    // Mettre à jour le point actif
    var dotActuel = document.getElementById("dot-" + indexImageActuelle);
    if (dotActuel) { dotActuel.style.background = "#ccc"; }

    // Mettre à jour l'index
    indexImageActuelle = index;

    // Afficher la nouvelle image
    var slideNouveau = document.getElementById("slide-" + indexImageActuelle);
    if (slideNouveau) { slideNouveau.style.opacity = "1"; }

    // Mettre en surbrillance le nouveau point
    var dotNouveau = document.getElementById("dot-" + indexImageActuelle);
    if (dotNouveau) { dotNouveau.style.background = "#e44c4c"; }
}


document.addEventListener("DOMContentLoaded", function () {
    lancerBanniere();
    initGalerie();
});
