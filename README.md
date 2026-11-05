# Carnet d'observation des sols

> Projet individuel du SAS DFS, brief 3 (sujet : [SUJET.md](SUJET.md)). Remplacez chaque ✏️ par votre texte, puis supprimez cette ligne.

## Contexte

 *Nous devons créer une application <<Carnet d'observartion des sols>>, qui sera utiliser par un assistant de terrain Agritech. Sur le terrain,cet assistant observera différents points de sol et relèvera leur (id), la parcelle concernée, la texture du sol, le pH et l'etat d'humidité.
Son besoin est d'enregistrer les informations, de les retrouver facilement et de répérer les valeurs qui doivent etre vérifiées avec le coach agronome.
Au démarrage du programme, un menu s'affichera pour permettre à l'utilisateur de choisir une action : 
1.Ajouter des observations.
2.Lister les observations enregistrées.
3.Rechercher des observation par point, parcelle ou texture.
4.Trier les informations par pH.
5.Afficher une synthèse des observations.*

## Prérequis et lancement

- Node.js 20 ou plus récent, Git ; aucune bibliothèque à installer.

```bash
git clone https://github.com/VOTRE-COMPTE/brief-3-carnet-sols.git
cd brief-3-carnet-sols
node app.js
npm test
```

Sous PowerShell, si `npm` est bloqué : `npm.cmd test`.

## Fonctionnalités

✏️ *Cochez seulement ce qui marche : `- [x]`.*

- [x] Données lues et enregistrées dans `donnees/observations.json`
- [x] Ajouter une observation, saisies invalides refusées sans arrêter le programme
- [x] Lister les observations, message si le carnet est vide
- [x] Rechercher par point ou par parcelle ; filtrer par texture
- [x] Trier par pH
- [x] Synthèse : pH minimum et maximum, nombre par texture, points à discuter (pH < 5,5)
- [x] Bonus : supprimer et modifier une observation (choix 6 et 7)
- [x] Bonus : tri par pH décroissant, texture la plus fréquente

## Données

✏️ *Le fichier, le nombre d'observations, les champs (voir [docs/dictionnaire-donnees.md](docs/dictionnaire-donnees.md)), le pH sans unité. Rappelez qu'elles sont fictives.*

## Limites

-Le carnet n'enregistre pas le moment de l'observation.
-La texture et l'etat d'humidité ne sont pas mesurables.
-Le carnet ne donne pas de localisation précise ou coordonées.
-Le carnet ne note pas la culture présente, ni la météo

## Documents

[Dictionnaire des données](docs/dictionnaire-donnees.md) · [Tâches](docs/taches.md) · [Relevé des tests](docs/releve-tests.md) · [Journal de recherche](docs/journal-recherche.md) · [Fiche agronomique](docs/fiche-agronomique.md) · [Fiche individuelle](docs/fiche-individuelle.md)

## Auteur

✏️ *Yedanh Guy Richmond TOURE, RichmondToure. Entraide : KONE Fatoumata,N'Diamoi Angaman , sur quoi.*
