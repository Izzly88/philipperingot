# Site de Philippe Ringot — mode d'emploi

Pour voir le site sur ton ordinateur, double-clique sur `index.html`. Aucun serveur ni outil n'est nécessaire.

## Où se trouve quoi

```
index.html              Page d'accueil (structure seulement, ne pas modifier)
galerie.html            Page qui affiche n'importe quelle galerie (ne pas modifier)
contenu.js              ← TOUT le contenu : galeries, œuvres, expositions, contacts
OPTIMISER-IMAGES.bat    ← à lancer après avoir ajouté des images
img/
  accueil/              Photos du diaporama d'accueil
  galeries/<nom>/       Une galerie = un dossier (+ sous-dossier vignettes/ créé automatiquement)
  expositions/          Affiches et photos d'expositions
  documents/            PDF (portfolio, dossiers d'exposition)
  artiste/              Portrait de l'artiste (un nouveau chaque année)
assets/css/style.css    Apparence (couleurs et polices en haut du fichier)
assets/js/site.js       Fonctionnement (rien à toucher normalement)
_originaux/             Copies de sauvegarde des images avant optimisation — NE PAS mettre en ligne
galery1-4.html, expo1.html   Anciennes adresses, redirigent vers les nouvelles pages
```

## Ajouter une œuvre dans une galerie existante

1. Copier la photo dans le dossier de la galerie, par exemple `img/galeries/vegetales/29.jpg`.
2. Double-cliquer sur `OPTIMISER-IMAGES.bat`. Il réduit la photo si elle est trop lourde, la remet droite si elle vient d'un téléphone, et crée la vignette.
3. Dans `contenu.js`, ajouter le nom du fichier dans la liste `oeuvres` de la galerie :
   ```js
   oeuvres: [
     "1.jpg", "7.jpg", "13.jpg", "19.jpg",
     ...
     "29.jpg",
   ],
   ```
   Pour ajouter une légende (titre, technique…), écrire l'œuvre ainsi :
   ```js
   { fichier: "29.jpg", titre: "Bouquet d'ombres", technique: "Cyanotype", dimensions: "50 × 65 cm", annee: "2026" },
   ```
4. Ouvrir `index.html` pour vérifier.

L'ordre de la liste donne l'ordre d'affichage : de gauche à droite, puis ligne suivante (4 colonnes sur grand écran).

Si tu oublies l'étape 3, `OPTIMISER-IMAGES.bat` te liste les images présentes dans un dossier mais absentes de `contenu.js`.

## Créer une nouvelle galerie

1. Créer un dossier dans `img/galeries/`, sans accent ni espace, par exemple `img/galeries/silhouettes/`, et y mettre les photos.
2. Lancer `OPTIMISER-IMAGES.bat`.
3. Dans `contenu.js`, copier un bloc de galerie complet (de `{` à `},`) et l'adapter :
   ```js
   {
     id: "silhouettes",              // = nom du dossier
     titre: "Silhouettes",
     description: "Texte facultatif affiché sous le titre.",
     couverture: "1.jpg",            // image de la carte sur la page d'accueil
     oeuvres: [
       "1.jpg", "2.jpg", "3.jpg",
     ],
   },
   ```

La galerie apparaît automatiquement sur la page d'accueil et dans les liens « galerie précédente / suivante ».

## Ajouter une exposition

1. Mettre l'affiche dans `img/expositions/` et, s'il y en a un, le PDF dans `img/documents/`.
2. Lancer `OPTIMISER-IMAGES.bat`.
3. Dans `contenu.js`, ajouter un bloc **en haut** de la liste `expositions` :
   ```js
   {
     titre: "Nom de l'exposition",
     dates: "Du 3 mars au 12 avril 2027",
     lieu: "Lille",
     affiche: "mon-affiche.jpg",
     document: "mon-dossier.pdf",     // facultatif : PDF, ou adresse "https://..."
     photos: ["vue1.jpg", "vue2.jpg"], // facultatif : diaporama de photos
   },
   ```
   Sans `document` ni `photos`, un clic sur l'affiche l'agrandit.

## Mise à jour annuelle de la démarche et du portrait

Tout se passe dans la rubrique `demarche` de `contenu.js` :

1. Mettre la nouvelle photo dans `img/artiste/` sous un nouveau nom, par exemple `portrait-2027.jpg`. Un nouveau nom évite que les visiteurs voient encore l'ancienne photo gardée en mémoire par leur navigateur.
2. Lancer `OPTIMISER-IMAGES.bat`.
3. Dans `contenu.js`, modifier :
   ```js
   demarche: {
     portrait: "portrait-2027.jpg",
     presentation: "Né en 1981, vit et travaille à Lille, France.",
     annee: "2027",
     paragraphes: [
       "Premier paragraphe du nouveau texte.",
       "Deuxième paragraphe.",
       { exergue: "Une phrase mise en valeur." },
       "Dernier paragraphe.",
     ],
     citation: {
       texte: "« Texte de la citation… »",
       source: "Nom de l'auteur, contexte, année",
     },
   },
   ```
   Pour ne pas afficher de citation : `citation: null,`

Astuce : pour coller un texte venant de Word, remplacer ses guillemets droits " par « » ou par \", sinon ils coupent le texte. Les apostrophes ’ et ' ne posent aucun problème.

L'ancienne photo peut être supprimée de `img/artiste/` (ou gardée en souvenir, elle ne s'affiche plus).

## Autres modifications courantes

| Je veux changer…                        | Où                                                  |
|-----------------------------------------|-----------------------------------------------------|
| les photos du diaporama d'accueil       | `img/accueil/` + `imagesAccueil` dans `contenu.js`  |
| l'e-mail, l'Instagram, le portfolio PDF | haut de `contenu.js`                                |
| les statistiques de visite (GoatCounter)  | `statistiques` en haut de `contenu.js`              |
| le texte de démarche, le portrait       | `img/artiste/` + `demarche` dans `contenu.js`       |
| les couleurs, les polices               | haut de `assets/css/style.css`                      |

## En cas de problème

- **La page est vide ou un bandeau rouge apparaît** : il y a une faute de syntaxe dans `contenu.js`. Le plus souvent, c'est une virgule oubliée entre deux éléments ou un guillemet non fermé. Appuie sur F12, onglet « Console » : le numéro de la ligne fautive y est indiqué.
- **Une image n'apparaît pas** : vérifie que le nom écrit dans `contenu.js` est exactement celui du fichier, y compris les majuscules (`1.JPG` ≠ `1.jpg` une fois en ligne).
- **Une modification n'apparaît pas** : recharge la page avec Ctrl + F5.

## Mise en ligne

Envoyer tout le dossier sur l'hébergement, **sauf** `_originaux/` (et ce fichier si tu veux).
