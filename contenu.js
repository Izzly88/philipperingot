/* ==========================================================================
   CONTENU DU SITE — c'est le seul fichier à modifier pour mettre à jour le site.

   Règles à respecter (sinon la page reste vide) :
   - chaque texte est entre guillemets "..." ;
   - chaque élément d'une liste est suivi d'une virgule ;
   - pour mettre un guillemet " dans un texte, écrire \" (ou utiliser « »).

   Mode d'emploi complet : voir LISEZMOI.md
   ========================================================================== */

const SITE = {

  /* ---------------------------------------------------------------- Général */
  artiste: "Philippe Ringot",
  sousTitre: "Céramique · Cyanotype · Gravure · Dessin · Peinture",
  email: "dendrobiumphi@hotmail.fr",
  instagram: "https://www.instagram.com/dendrobium1981/",
  portfolio: "img/documents/portfolio.pdf",

  /* Statistiques de visite GoatCounter (sans cookies) : le code choisi à l'inscription
     sur goatcounter.com, par exemple "philipperingot". Laisser "" pour désactiver. */
  statistiques: "philipperingot",

  /* Photos qui défilent en plein écran sur la page d'accueil (dossier img/accueil/) */
  imagesAccueil: ["fond1.jpg", "fond2.jpg", "fond3.jpg"],


  /* ------------------------------------------------- L'artiste et sa démarche
     À mettre à jour chaque année :
     - portrait    : photo dans img/artiste/ (conseil : un nouveau nom chaque année,
                     ex. "portrait-2027.jpg", pour que les visiteurs ne voient pas l'ancienne)
     - annee       : affichée dans la signature sous le texte
     - paragraphes : un texte entre guillemets par paragraphe, suivi d'une virgule.
                     Pour une phrase mise en valeur (en bleu, plus grande) :
                        { exergue: "Tout est Offrande en art !" },
     - citation    : texte d'une autre personne affiché dans un encadré
                     (mettre citation: null pour ne pas en afficher)
  */
  demarche: {
    portrait: "portrait-2026.jpg",
    presentation: "Né en 1981, vit et travaille à Lille, France.",
    annee: "2026",
    paragraphes: [
      "Mon travail explore les relations entre le corps, le paysage/environnement et les formes invisibles qui organisent le vivant.",
      "La forme et la matière occupent une place déterminante dans ma démarche. Elles nourrissent mon imaginaire, structurent ma réflexion et orientent mes choix plastiques. Mes recherches portent notamment sur les formes organiques, minérales et végétales liées à la mémoire silencieuse, à la transformation et à la réhabilitation.",
      "Le processus de travail commence par des phases d’observation, de lecture, d’écriture, de croquis et de tests. Il se poursuit par un inventaire des formes offertes par les matériaux — fragments, résidus, éléments composés ou décomposés — dont j’étudie la présence et l’expression propre.",
      "Mon approche s’appuie sur l’expérimentation de différents médiums : céramique, cyanotype, gravure, dessin et peinture. Cette pluralité me permet de faire coexister textures, empreintes, silhouettes et fragments de souvenirs au sein de paysages ou de formes hybrides.",
      "La notion d’offrande occupe aujourd’hui une place importante dans mon travail, qu’elle se manifeste dans mes bouquets en ombres ou dans mes silhouettes représentées de dos. Ces figures, volontairement réduites ou floues, expriment une posture d’attention, de retrait et de disponibilité envers l’espace ou le paysage.",
      { exergue: "Tout est Offrande en art !" },
      "L’œuvre est envisagée comme un espace de réflexion, de contemplation ou de mise en mouvement, à la fois pour moi et pour le regardeur. Elle s’inscrit dans un ensemble de gestes où mémoire, matière et forme contribuent à questionner les liens entre le vivant, le minéral et le temps.",
    ],
    citation: {
      texte: "« …C’est que les artistes ont ce pouvoir de rendre de la valeur à des choses qui sans cela n’en n’auraient plus. Certaines des formes prises au piège de la céramique et des tableaux de Philippe RINGOT évoquent, pour qui sait les voir, quelque chose de ces cicatrices magnifiées par l’art. La légèreté de ces formes arachnéennes acéphales qui semblent tout droit s’échapper du four de cuisson de la céramique nous rappelle aussi que dans ce processus de rétablissement, dans la nature, la liberté peut prendre toutes les formes et que le fatalisme n’y est pas de mise… »",
      source: "Extrait du texte du Dr Jean-Paul Kornobis pour l’exposition Formes Végétales, 2023",
    },
  },


  /* --------------------------------------------------------------- Galeries
     Une galerie = un dossier dans img/galeries/ + un bloc ci-dessous.

     - id          : nom du dossier dans img/galeries/ (sans accent ni espace)
     - titre       : nom affiché
     - description : texte facultatif affiché en haut de la galerie ("" pour aucun)
     - couverture  : image affichée sur la page d'accueil
     - oeuvres     : liste des images, dans l'ordre d'affichage (de gauche à droite,
                     ligne par ligne). Deux façons d'écrire une œuvre :
                        "12.jpg",
                        { fichier: "12.jpg", titre: "Racines", technique: "Céramique émaillée",
                          dimensions: "30 × 20 cm", annee: "2024" },
                     Les champs titre / technique / dimensions / annee sont tous facultatifs.
  */
  galeries: [
    {
      id: "minerales",
      titre: "Formes minérales",
      description: "",
      couverture: "25.jpg",
      oeuvres: [
        "1.jpg", "13.jpg", "19.jpg", "7.jpg",
        "2.jpg", "14.jpg", "20.jpg", "8.jpg",
        "3.jpg", "15.jpg", "21.jpg", "9.png",
        "4.jpg", "16.jpg", "22.jpg", "10.jpg",
        "5.jpg", "17.jpg", "23.jpg", "11.jpg",
        "6.jpg", "18.jpg", "24.jpg", "12.jpg",
      ],
    },
    {
      id: "vegetales",
      titre: "Formes végétales",
      description: "",
      couverture: "couverture.jpg",
      oeuvres: [
        "1.jpg", "7.jpg", "13.jpg", "19.jpg",
        "2.jpg", "8.jpg", "14.jpg", "26.jpg",
        "3.jpg", "9.jpg", "15.jpg", "20.jpg",
        "4.jpg", "10.jpg", "16.jpg", "21.jpg",
        "5.jpg", "27.jpg", "17.jpg", "22.jpg",
        "28.jpg", "11.jpg", "18.jpg", "23.jpg",
        "6.jpg", "12.jpg", "25.jpg", "24.jpg",
      ],
    },
    {
      id: "peauformes",
      titre: "La peau et ses formes",
      description: "",
      couverture: "31.jpg",
      oeuvres: [
        "1.jpg", "13.jpg", "19.jpg", "7.jpg",
        "2.jpg", "14.jpg", "20.jpg", "8.jpg",
        "3.jpg", "15.jpg", "21.jpg", "9.jpg",
        "4.jpg", "16.jpg", "22.jpg", "10.jpg",
        "5.jpg", "17.jpg", "23.jpg", "11.jpg",
        "6.jpg", "18.jpg", "24.jpg", "12.jpg",
        "25.jpg", "26.jpg", "27.jpg", "28.jpg",
        "29.jpg", "30.jpg", "31.jpg", "32.jpg",
        "33.jpg",
      ],
    },
    {
      id: "divers",
      titre: "Œuvres diverses",
      description: "",
      couverture: "1.jpg",
      oeuvres: [
        "1.jpg", "13.jpg", "19.jpg", "7.jpg",
        "2.jpg", "14.jpg", "12.jpg", "8.jpg",
        "3.jpg", "15.jpg", "18.jpg", "9.jpg",
        "4.jpg", "16.jpg", "6.jpg", "10.jpg",
        "5.jpg", "17.jpg", "11.jpg",
      ],
    },
  ],


  /* ----------------------------------------------------------- Expositions
     De la plus récente à la plus ancienne. Pour en ajouter une, copier un bloc { ... },
     en haut de la liste.

     - titre, dates, lieu : textes affichés
     - affiche  : image dans img/expositions/
     - document : (facultatif) PDF dans img/documents/ OU adresse d'un site "https://..."
                  ouvert au clic sur l'affiche
     - photos   : (facultatif) images de img/expositions/ montrées en diaporama au clic.
                  Sans document ni photos, le clic agrandit simplement l'affiche.
  */
  expositions: [
    {
      titre: "Abstraits mais pas trop",
      dates: "2025",
      lieu: "Paris",
      affiche: "abstraitsmpt.jpg",
    },
    {
      titre: "Le Porte Savon",
      dates: "De 2025 à 2027",
      lieu: "Douai",
      affiche: "portesavon.jpg",
      document: "portesavon.pdf",
    },
    {
      titre: "La peau et ses formes",
      dates: "Du 27 septembre au 16 novembre 2024",
      lieu: "Douai",
      affiche: "affichelpesf.jpg",
      document: "lpesfa4combo.pdf",
    },
    {
      titre: "Les nuits de la crypte",
      dates: "Du 22 mars au 7 avril 2024",
      lieu: "Lille",
      affiche: "crypte2k24.jpg",
      document: "crypte2k24.pdf",
    },
    {
      titre: "Le jeu en vaut la chandelle",
      dates: "2022 – 2024",
      lieu: "Biennale de céramique de petite forme",
      affiche: "CandleGame.jpg",
      document: "CandleGameExpl.pdf",
    },
    {
      titre: "Formes végétales",
      dates: "Du 3 juin au 15 juillet 2023",
      lieu: "Marquette-lez-Lille",
      affiche: "formesvegetales_expos.jpg",
      photos: ["flyer1.jpg", "flyer2.jpg"],
    },
    {
      titre: "Brick Project",
      dates: "Janvier 2022",
      lieu: "Roubaix",
      affiche: "brick_project_expo.png",
      document: "brick_project1.pdf",
    },
  ],
};
