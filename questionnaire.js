
document.addEventListener("DOMContentLoaded", function () {
    var groupe = document.getElementById("rating-group");
    if (!groupe) return;

    // Créer 10 boutons dynamiquement avec addEventListener
    for (var i = 1; i <= 10; i++) {
        (function (note) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "rating-btn";
            btn.textContent = note;

            // Gestion du clic sur un bouton de note
            btn.addEventListener("click", function () {
                // Enregistrer la valeur dans le champ caché
                document.getElementById("q-note").value = note;

                // Mettre en surbrillance le bouton sélectionné
                var boutons = groupe.querySelectorAll(".rating-btn");
                boutons.forEach(function (b) { b.classList.remove("selected"); });
                btn.classList.add("selected");
            });

            groupe.appendChild(btn);
        })(i);
    }
});


function validerNom() {
    var champ = document.getElementById("q-nom");
    var erreur = document.getElementById("err-nom");
    var valeur = champ.value.trim();

    if (valeur.length < 3) {
        // Afficher l'erreur et marquer le champ invalide
        champ.classList.add("invalid");
        champ.classList.remove("valid");
        erreur.classList.add("visible");
        return false;
    }
    // Champ valide : marquer en vert et cacher l'erreur
    champ.classList.remove("invalid");
    champ.classList.add("valid");
    erreur.classList.remove("visible");
    return true;
}


function validerEmail() {
    var champ  = document.getElementById("q-email");
    var erreur = document.getElementById("err-email");
    var valeur = champ.value.trim();

    // Expression régulière basique pour valider le format email
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(valeur)) {
        champ.classList.add("invalid");
        champ.classList.remove("valid");
        erreur.classList.add("visible");
        return false;
    }
    champ.classList.remove("invalid");
    champ.classList.add("valid");
    erreur.classList.remove("visible");
    return true;
}


function validerAge() {
    var champ  = document.getElementById("q-age");
    var erreur = document.getElementById("err-age");

    if (!champ.value) {
        champ.classList.add("invalid");
        champ.classList.remove("valid");
        erreur.classList.add("visible");
        return false;
    }
    champ.classList.remove("invalid");
    champ.classList.add("valid");
    erreur.classList.remove("visible");
    return true;
}


function validerCommentaire() {
    var champ  = document.getElementById("q-commentaire");
    var erreur = document.getElementById("err-commentaire");
    var valeur = champ.value.trim();

    if (valeur.length < 10) {
        champ.classList.add("invalid");
        champ.classList.remove("valid");
        erreur.classList.add("visible");
        return false;
    }
    champ.classList.remove("invalid");
    champ.classList.add("valid");
    erreur.classList.remove("visible");
    return true;
}


function validerQuestionnaire() {
    // Lancer les 4 validations et stocker les résultats
    var nomOk        = validerNom();
    var emailOk      = validerEmail();
    var ageOk        = validerAge();
    var commentaireOk = validerCommentaire();

    // Si tout est valide, afficher le message de succès
    if (nomOk && emailOk && ageOk && commentaireOk) {
        document.getElementById("success-banner").style.display = "block";
        // Faire défiler jusqu'au message de confirmation
        document.getElementById("success-banner").scrollIntoView({ behavior: "smooth" });
    }
}


function reinitialiserQuestionnaire() {
    // Réinitialiser les champs texte
    ["q-nom", "q-email", "q-commentaire"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) { el.value = ""; el.classList.remove("valid", "invalid"); }
    });

    // Réinitialiser le select
    var age = document.getElementById("q-age");
    if (age) { age.selectedIndex = 0; age.classList.remove("valid", "invalid"); }

    // Réinitialiser les radios et checkboxes
    document.querySelectorAll("input[type='radio'], input[type='checkbox']")
        .forEach(function (el) { el.checked = false; });

    // Réinitialiser la notation
    document.getElementById("q-note").value = "";
    document.querySelectorAll(".rating-btn")
        .forEach(function (b) { b.classList.remove("selected"); });

    // Cacher tous les messages d'erreur
    document.querySelectorAll(".error-msg").forEach(function (el) {
        el.classList.remove("visible");
    });

    // Cacher la bannière de succès
    document.getElementById("success-banner").style.display = "none";
}


document.addEventListener("DOMContentLoaded", function () {
    // Valider chaque champ dès que l'utilisateur quitte le champ
    document.getElementById("q-nom").addEventListener("blur", validerNom);
    document.getElementById("q-email").addEventListener("blur", validerEmail);
    document.getElementById("q-age").addEventListener("change", validerAge);
    document.getElementById("q-commentaire").addEventListener("blur", validerCommentaire);
});
