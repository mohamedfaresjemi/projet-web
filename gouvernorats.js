
function Gouvernorat(nom, region, population, chefLieu, superficie) {
    this.nom       = nom;
    this.region    = region;
    this.population = population;
    this.chefLieu  = chefLieu;
    this.superficie = superficie;
}


var gouvernorats = [
    new Gouvernorat("Tunis",     "Nord-Est", 1056247, "Tunis",     "346 km²"),
    new Gouvernorat("Ariana",    "Nord",      576088, "Ariana",    "482 km²"),
    new Gouvernorat("Bizerte",   "Nord",      568219, "Bizerte",   "3 685 km²"),
    new Gouvernorat("Sousse",    "Centre",    674971, "Sousse",    "2 669 km²"),
    new Gouvernorat("Kairouan",  "Centre",    570559, "Kairouan",  "6 712 km²"),
    new Gouvernorat("Sfax",      "Centre-Est",955421, "Sfax",      "7 545 km²"),
    new Gouvernorat("Tozeur",    "Sud-Ouest", 107912, "Tozeur",    "4 719 km²"),
    new Gouvernorat("Tataouine", "Sud",       149453, "Tataouine", "38 889 km²")
];


function genererTableau() {
    // Récupérer le <tbody> du tableau dynamique
    var tbody = document.getElementById("tbody-dynamique");
    if (!tbody) return; // Sécurité : l'élément doit exister

    // Vider le corps du tableau avant de le reconstruire
    tbody.innerHTML = "";

    // Parcourir chaque objet du tableau et créer une ligne HTML
    for (var i = 0; i < gouvernorats.length; i++) {
        ajouterLigne(gouvernorats[i], tbody);
    }
}


function ajouterLigne(gov, tbody) {
    // Utiliser le tbody passé en paramètre ou le trouver dans le DOM
    var corps = tbody || document.getElementById("tbody-dynamique");
    if (!corps) return;

    // Créer la ligne <tr>
    var tr = document.createElement("tr");

    // Créer chaque cellule avec les propriétés de l'objet
    var cellules = [
        gov.nom,
        gov.region,
        gov.population.toLocaleString("fr-FR"), // Format nombre français
        gov.chefLieu,
        gov.superficie
    ];

    cellules.forEach(function(valeur) {
        var td = document.createElement("td");
        td.textContent = valeur;
        tr.appendChild(td);
    });

    // Ajouter la ligne au corps du tableau
    corps.appendChild(tr);
}


function afficherDonnees(gov) {
    var zone = document.getElementById("resultat-recherche");
    if (!zone) return;

    // Construire le HTML de la fiche détaillée
    zone.innerHTML =
        "<div class='result-card'>" +
        "<h4><i class='fas fa-map-marker-alt'></i> " + gov.nom + "</h4>" +
        "<p><strong>Région :</strong> "      + gov.region                          + "</p>" +
        "<p><strong>Population :</strong> "  + gov.population.toLocaleString("fr-FR") + " hab.</p>" +
        "<p><strong>Chef-lieu :</strong> "   + gov.chefLieu                        + "</p>" +
        "<p><strong>Superficie :</strong> "  + gov.superficie                      + "</p>" +
        "</div>";

    // Rendre la zone visible
    zone.style.display = "block";
}


function ajouterGouvernorat() {
    // Récupérer les valeurs des champs
    var nom       = document.getElementById("add-nom").value.trim();
    var region    = document.getElementById("add-region").value.trim();
    var population = parseInt(document.getElementById("add-population").value.trim(), 10);
    var chefLieu  = document.getElementById("add-cheflieu").value.trim();
    var superficie = document.getElementById("add-superficie").value.trim();

    // Validation simple : tous les champs requis
    if (!nom || !region || isNaN(population) || !chefLieu || !superficie) {
        afficherMessage("add-message", "Veuillez remplir tous les champs correctement.", "error");
        return;
    }

    // Créer un nouvel objet Gouvernorat et l'ajouter au tableau
    var nouveau = new Gouvernorat(nom, region, population, chefLieu, superficie);
    gouvernorats.push(nouveau);

    // Mettre à jour l'affichage du tableau
    genererTableau();

    // Réinitialiser le formulaire
    document.getElementById("form-ajout").reset();

    // Confirmer l'ajout à l'utilisateur
    afficherMessage("add-message", "✅ " + nom + " a été ajouté avec succès !", "success");
}


function rechercherGouvernorat() {
    var motCle = document.getElementById("search-nom").value.trim().toLowerCase();
    var regionFiltre = document.getElementById("search-region").value.toLowerCase();

    var zone = document.getElementById("resultat-recherche");
    if (!zone) return;

    // Filtrer le tableau selon les critères
    var resultats = gouvernorats.filter(function(gov) {
        var matchNom    = !motCle    || gov.nom.toLowerCase().includes(motCle);
        var matchRegion = !regionFiltre || gov.region.toLowerCase().includes(regionFiltre);
        return matchNom && matchRegion;
    });

    // Afficher les résultats
    if (resultats.length === 0) {
        zone.innerHTML = "<p class='no-result'>❌ Aucun gouvernorat trouvé pour cette recherche.</p>";
    } else {
        var html = "<div class='results-list'>";
        html += "<p><strong>" + resultats.length + " résultat(s) trouvé(s) :</strong></p>";
        resultats.forEach(function(gov) {
            html +=
                "<div class='result-card'>" +
                "<h4><i class='fas fa-map-marker-alt'></i> " + gov.nom + "</h4>" +
                "<p><strong>Région :</strong> "     + gov.region                             + "</p>" +
                "<p><strong>Population :</strong> " + gov.population.toLocaleString("fr-FR") + " hab.</p>" +
                "<p><strong>Chef-lieu :</strong> "  + gov.chefLieu                           + "</p>" +
                "<p><strong>Superficie :</strong> " + gov.superficie                         + "</p>" +
                "</div>";
        });
        html += "</div>";
        zone.innerHTML = html;
    }

    zone.style.display = "block";
}


function afficherMessage(elementId, texte, type) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = texte;
    el.className   = "form-message " + type;
    el.style.display = "block";
    // Masquer automatiquement après 4 secondes
    setTimeout(function() { el.style.display = "none"; }, 4000);
}


document.addEventListener("DOMContentLoaded", function() {
    genererTableau();
});
