/* ==========================================================================
   Construction des pages à partir de contenu.js.
   Normalement, il n'y a rien à modifier ici pour mettre à jour le contenu.
   ========================================================================== */

(function () {
  "use strict";

  /* Si contenu.js contient une erreur (virgule ou guillemet oublié), SITE n'existe pas :
     on affiche un message clair plutôt qu'une page vide. */
  if (typeof SITE === "undefined") {
    document.body.insertAdjacentHTML("afterbegin",
      '<div class="erreur-contenu"><strong>Le fichier contenu.js contient une erreur.</strong> ' +
      "Vérifiez la dernière modification : une virgule ou un guillemet oublié ? " +
      "(Touche F12 puis onglet « Console » pour voir le numéro de ligne.)</div>");
    return;
  }

  /* ------------------------------------------------------------ Outils */

  const $ = (id) => document.getElementById(id);

  function echapper(texte) {
    return String(texte == null ? "" : texte)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function dossierGalerie(galerie) { return "img/galeries/" + galerie.id + "/"; }

  // Une œuvre peut être écrite "12.jpg" ou { fichier: "12.jpg", titre: ... }
  function normaliserOeuvre(oeuvre) {
    return typeof oeuvre === "string" ? { fichier: oeuvre } : oeuvre;
  }

  function legendeOeuvre(oeuvre) {
    const details = [oeuvre.technique, oeuvre.dimensions, oeuvre.annee].filter(Boolean).join(" · ");
    return { titre: oeuvre.titre || "", details: details };
  }

  // Image avec vignette : si la vignette n'existe pas encore, on charge l'image en grand.
  function htmlImage(dossier, fichier, alt, classe) {
    const grande = dossier + fichier;
    return '<img class="' + (classe || "") + '" src="' + echapper(dossier + "vignettes/" + fichier) + '" ' +
      'data-secours="' + echapper(grande) + '" alt="' + echapper(alt) + '" loading="lazy" decoding="async">';
  }

  document.addEventListener("error", function (e) {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.secours && img.src.indexOf(img.dataset.secours) === -1) {
      img.src = img.dataset.secours;
    }
  }, true);

  const icones = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" class="plein"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    precedent: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    suivant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    fermer: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  const surAccueil = document.body.dataset.page === "accueil";
  const prefixe = surAccueil ? "" : "index.html";

  /* ------------------------------------------------------- En-tête et pied */

  function construireEntete() {
    $("entete").innerHTML =
      '<a class="entete__nom" href="' + (prefixe || "#haut") + '">' + echapper(SITE.artiste) + "</a>" +
      '<button class="entete__burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">' + icones.menu + "</button>" +
      '<nav class="entete__menu" id="menu" aria-label="Navigation principale"><ul>' +
        '<li><a href="' + prefixe + '#artiste">L\'artiste</a></li>' +
        '<li><a href="' + prefixe + '#oeuvres">Œuvres</a></li>' +
        '<li><a href="' + prefixe + '#expositions">Expositions</a></li>' +
        '<li><a href="' + echapper(SITE.portfolio) + '" target="_blank" rel="noopener">Portfolio</a></li>' +
      "</ul>" +
      '<div class="entete__icones">' +
        '<a href="' + echapper(SITE.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + icones.instagram + "</a>" +
        '<a href="mailto:' + echapper(SITE.email) + '" aria-label="Envoyer un e-mail">' + icones.email + "</a>" +
      "</div></nav>";

    const burger = $("burger");
    const entete = $("entete");
    burger.addEventListener("click", function () {
      const ouvert = entete.classList.toggle("entete--ouvert");
      burger.setAttribute("aria-expanded", ouvert);
    });
    // Sur mobile, refermer le menu après un clic sur un lien
    $("menu").addEventListener("click", function (e) {
      if (e.target.closest("a")) { entete.classList.remove("entete--ouvert"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  function construirePied() {
    $("pied").innerHTML =
      '<div class="pied__contact">' +
        '<a href="mailto:' + echapper(SITE.email) + '">' + icones.email + "<span>" + echapper(SITE.email) + "</span></a>" +
        '<a href="' + echapper(SITE.instagram) + '" target="_blank" rel="noopener">' + icones.instagram + "<span>Instagram</span></a>" +
      "</div>" +
      '<p class="pied__copyright">© ' + new Date().getFullYear() + " " + echapper(SITE.artiste) +
      " — Tous droits réservés · Réalisation DJE-WebDev</p>";
  }

  /* --------------------------------------------------------------- Accueil */

  function construireDiaporama() {
    $("hero-nom").textContent = SITE.artiste;
    $("hero-sous-titre").textContent = SITE.sousTitre || "";
    const conteneur = $("diapos");
    const images = SITE.imagesAccueil || [];
    conteneur.innerHTML = images.map(function (fichier, i) {
      return '<div class="hero__diapo' + (i === 0 ? " hero__diapo--active" : "") + '" ' +
        "style=\"background-image:url('img/accueil/" + encodeURI(fichier) + "')\"></div>";
    }).join("");
    if (images.length < 2) return;
    const diapos = conteneur.children;
    let courante = 0;
    setInterval(function () {
      diapos[courante].classList.remove("hero__diapo--active");
      courante = (courante + 1) % diapos.length;
      diapos[courante].classList.add("hero__diapo--active");
    }, 6000);
  }

  function construireListeGaleries() {
    $("liste-galeries").innerHTML = SITE.galeries.map(function (g) {
      const nb = g.oeuvres.length;
      return '<li><a class="carte-galerie" href="galerie.html?id=' + encodeURIComponent(g.id) + '">' +
        '<div class="carte-galerie__image">' + htmlImage(dossierGalerie(g), g.couverture, g.titre) + "</div>" +
        '<h3 class="carte-galerie__titre">' + echapper(g.titre) + "</h3>" +
        '<p class="carte-galerie__nombre">' + nb + " œuvre" + (nb > 1 ? "s" : "") + "</p>" +
        "</a></li>";
    }).join("");
  }

  function lienExterne(adresse) { return /^https?:\/\//.test(adresse); }

  function construireExpositions() {
    const liste = SITE.expositions;
    $("liste-expositions").innerHTML = liste.map(function (expo, i) {
      let ouverture, etiquette;
      if (expo.document) {
        const href = lienExterne(expo.document) ? expo.document : "img/documents/" + expo.document;
        ouverture = 'href="' + echapper(href) + '" target="_blank" rel="noopener"';
        etiquette = lienExterne(expo.document) ? "Site" : "PDF";
      } else {
        ouverture = 'href="#" data-expo="' + i + '"';
        etiquette = expo.photos && expo.photos.length ? expo.photos.length + " photo" + (expo.photos.length > 1 ? "s" : "") : "";
      }
      return '<li><a class="carte-expo" ' + ouverture + ">" +
        '<div class="carte-expo__affiche">' + htmlImage("img/expositions/", expo.affiche, "Affiche : " + expo.titre) +
          (etiquette ? '<span class="carte-expo__etiquette">' + etiquette + "</span>" : "") + "</div>" +
        '<h3 class="carte-expo__titre">' + echapper(expo.titre) + "</h3>" +
        '<p class="carte-expo__dates">' + echapper(expo.dates) + "</p>" +
        '<p class="carte-expo__lieu">' + echapper(expo.lieu) + "</p>" +
        "</a></li>";
    }).join("");

    $("liste-expositions").addEventListener("click", function (e) {
      const lien = e.target.closest("[data-expo]");
      if (!lien) return;
      e.preventDefault();
      const expo = liste[+lien.dataset.expo];
      const fichiers = expo.photos && expo.photos.length ? expo.photos : [expo.affiche];
      visionneuse.ouvrir(fichiers.map(function (f) {
        return { src: "img/expositions/" + f, titre: expo.titre, details: [expo.dates, expo.lieu].filter(Boolean).join(" · ") };
      }), 0);
    });
  }

  // Met en évidence la rubrique visible dans le menu
  function suivreRubriques() {
    if (!("IntersectionObserver" in window)) return;
    const liens = document.querySelectorAll('.entete__menu a[href^="#"]');
    const observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        liens.forEach(function (a) { a.classList.toggle("actif", a.getAttribute("href") === "#" + entree.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["artiste", "oeuvres", "expositions"].forEach(function (id) { observateur.observe($(id)); });
  }

  /* --------------------------------------------------------------- Galerie */

  function construireGalerie() {
    const id = new URLSearchParams(location.search).get("id");
    const index = Math.max(0, SITE.galeries.findIndex(function (g) { return g.id === id; }));
    const galerie = SITE.galeries[index];
    const dossier = dossierGalerie(galerie);
    const oeuvres = galerie.oeuvres.map(normaliserOeuvre);

    document.title = galerie.titre + " — " + SITE.artiste;
    $("galerie-titre").textContent = galerie.titre;
    $("galerie-description").textContent = galerie.description || "";
    if (!galerie.description) $("galerie-description").hidden = true;

    // Mosaïque : les œuvres sont réparties colonne par colonne, dans l'ordre de lecture
    // (gauche → droite, puis ligne suivante), comme écrit dans contenu.js.
    const mosaique = $("mosaique");
    const elements = oeuvres.map(function (oeuvre, i) {
      const leg = legendeOeuvre(oeuvre);
      const alt = leg.titre || galerie.titre + " — œuvre " + (i + 1);
      const a = document.createElement("a");
      a.className = "mosaique__oeuvre";
      a.href = dossier + oeuvre.fichier;
      a.dataset.index = i;
      a.innerHTML = htmlImage(dossier, oeuvre.fichier, alt) +
        (leg.titre || leg.details
          ? '<span class="mosaique__legende"><strong>' + echapper(leg.titre) + "</strong>" + echapper(leg.details) + "</span>"
          : "");
      return a;
    });

    let nbColonnes = 0;
    function disposer() {
      const largeur = mosaique.clientWidth;
      const n = largeur < 560 ? 2 : largeur < 900 ? 3 : 4;
      if (n === nbColonnes) return;
      nbColonnes = n;
      mosaique.innerHTML = "";
      const colonnes = [];
      for (let c = 0; c < n; c++) {
        const col = document.createElement("div");
        col.className = "mosaique__colonne";
        mosaique.appendChild(col);
        colonnes.push(col);
      }
      elements.forEach(function (el, i) { colonnes[i % n].appendChild(el); });
    }
    disposer();
    window.addEventListener("resize", disposer);

    mosaique.addEventListener("click", function (e) {
      const lien = e.target.closest(".mosaique__oeuvre");
      if (!lien) return;
      e.preventDefault();
      visionneuse.ouvrir(oeuvres.map(function (o) {
        const leg = legendeOeuvre(o);
        return { src: dossier + o.fichier, titre: leg.titre, details: leg.details };
      }), +lien.dataset.index);
    });

    // Liens vers la galerie précédente / suivante
    const nb = SITE.galeries.length;
    if (nb > 1) {
      const prec = SITE.galeries[(index - 1 + nb) % nb];
      const suiv = SITE.galeries[(index + 1) % nb];
      $("galerie-navigation").innerHTML =
        '<a href="galerie.html?id=' + encodeURIComponent(prec.id) + '">' + icones.precedent + "<span>" + echapper(prec.titre) + "</span></a>" +
        '<a href="galerie.html?id=' + encodeURIComponent(suiv.id) + '"><span>' + echapper(suiv.titre) + "</span>" + icones.suivant + "</a>";
    }
  }

  /* ----------------------------------------------------------- Visionneuse */

  const visionneuse = (function () {
    let elements = [], position = 0, racine, image, titre, details, compteur, dernierFocus;

    function creer() {
      racine = document.createElement("div");
      racine.className = "visionneuse";
      racine.setAttribute("role", "dialog");
      racine.setAttribute("aria-modal", "true");
      racine.setAttribute("aria-label", "Visionneuse d'images");
      racine.hidden = true;
      racine.innerHTML =
        '<button class="visionneuse__bouton visionneuse__fermer" aria-label="Fermer">' + icones.fermer + "</button>" +
        '<button class="visionneuse__bouton visionneuse__prec" aria-label="Image précédente">' + icones.precedent + "</button>" +
        '<figure class="visionneuse__cadre"><img alt=""><figcaption>' +
          '<span class="visionneuse__titre"></span><span class="visionneuse__details"></span>' +
          '<span class="visionneuse__compteur"></span></figcaption></figure>' +
        '<button class="visionneuse__bouton visionneuse__suiv" aria-label="Image suivante">' + icones.suivant + "</button>";
      document.body.appendChild(racine);
      image = racine.querySelector("img");
      titre = racine.querySelector(".visionneuse__titre");
      details = racine.querySelector(".visionneuse__details");
      compteur = racine.querySelector(".visionneuse__compteur");

      racine.querySelector(".visionneuse__fermer").addEventListener("click", fermer);
      racine.querySelector(".visionneuse__prec").addEventListener("click", function () { aller(-1); });
      racine.querySelector(".visionneuse__suiv").addEventListener("click", function () { aller(1); });
      racine.addEventListener("click", function (e) { if (e.target === racine || e.target.classList.contains("visionneuse__cadre")) fermer(); });

      document.addEventListener("keydown", function (e) {
        if (racine.hidden) return;
        if (e.key === "Escape") fermer();
        if (e.key === "ArrowLeft") aller(-1);
        if (e.key === "ArrowRight") aller(1);
      });

      // Balayage du doigt sur mobile
      let departX = null;
      racine.addEventListener("touchstart", function (e) { departX = e.touches[0].clientX; }, { passive: true });
      racine.addEventListener("touchend", function (e) {
        if (departX === null) return;
        const ecart = e.changedTouches[0].clientX - departX;
        if (Math.abs(ecart) > 50) aller(ecart > 0 ? -1 : 1);
        departX = null;
      });
    }

    function afficher() {
      const el = elements[position];
      image.src = el.src;
      image.alt = el.titre || "";
      titre.textContent = el.titre || "";
      details.textContent = el.details || "© " + SITE.artiste;
      compteur.textContent = elements.length > 1 ? (position + 1) + " / " + elements.length : "";
      racine.classList.toggle("visionneuse--seule", elements.length < 2);
      // Précharger les voisines pour un défilement fluide
      [1, -1].forEach(function (d) {
        const voisine = elements[(position + d + elements.length) % elements.length];
        if (voisine) new Image().src = voisine.src;
      });
    }

    function aller(sens) {
      if (elements.length < 2) return;
      position = (position + sens + elements.length) % elements.length;
      afficher();
    }

    function ouvrir(liste, depart) {
      if (!racine) creer();
      elements = liste;
      position = depart || 0;
      dernierFocus = document.activeElement;
      afficher();
      racine.hidden = false;
      document.body.classList.add("sans-defilement");
      racine.querySelector(".visionneuse__fermer").focus();
    }

    function fermer() {
      racine.hidden = true;
      image.removeAttribute("src");
      document.body.classList.remove("sans-defilement");
      if (dernierFocus) dernierFocus.focus();
    }

    return { ouvrir: ouvrir };
  })();

  /* ---------------------------------------------------------- Statistiques */

  // GoatCounter : ne compte pas les visites quand le site est ouvert depuis l'ordinateur.
  function activerStatistiques() {
    if (!SITE.statistiques || location.protocol === "file:") return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = "https://" + SITE.statistiques + ".goatcounter.com/count";
    document.head.appendChild(script);
  }

  /* ------------------------------------------------------------ Démarrage */

  activerStatistiques();

  construireEntete();
  construirePied();
  if (surAccueil) {
    construireDiaporama();
    construireListeGaleries();
    construireExpositions();
    suivreRubriques();
  } else {
    construireGalerie();
  }
})();
