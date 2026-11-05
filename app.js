// Carnet d'observation des sols — point d'entrée : le menu.
// À vous d'écrire tout le menu : accueil, chargement des données, menu affiché avant chaque choix,
// actions, sortie et gestion des erreurs. Comportement et textes imposés : fiches/3-ajouter-lister.md.
// Lancer : node app.js
import { demander, fermerSaisie, ouvrirSaisie } from './src/saisie.js';
import { chargerJson, enregistrerJson } from './src/stockage.js';
import { HUMIDITES, TEXTURES, ajouterObservation, formaterObservation, listerObservations, trouverParId } from './src/registre.js';
import { filtrerParParcelle, filtrerParTexture, trierParPh } from './src/recherche.js';
import { SEUIL_PH_A_DISCUTER, compterParTexture, phMinMax, pointsADiscuter } from './src/synthese.js';
import { CHAMPS_MODIFIABLES, modifierObservation } from './src/bonus.js';

const FICHIER_DONNEES = 'donnees/observations.json';

//--------------Afichages--------------

function afficherAccueil(){
  console.log('====================================================');
  console.log('       Ferme pédagogique    ');
  console.log('====================================================');
}

function afficherMenu() {
  console.log('');
  console.log('-----------------------MENU------------------');
  console.log('1. Ajouter une observation');
  console.log('2. Lister les observations');
  console.log('3. Rechercher (point, parcelle, texture)');
  console.log('4. Trier par pH');
  console.log('5. Synthèse des observations');
  console.log('6. Supprimer une observation');
  console.log('7. Modifier une observation');
  console.log('0. Quitter');
}

//-------------Actions-------------

//Choix 1 : poser les cinq questions, vérifier, ajouter, enregistrer.
async function ajouter(observations) {
  console.log('---- Ajouter une observation ----');

  const id = await demander('Point observé(ex. S11) : ');
  if(id === null) return;
  const parcelle = await demander('Parcelle (ex. P1) : ')
  if(parcelle === null) return;
  const  texture = await demander(`texture (${TEXTURES.join(',')}): `);
  if(texture === null) return;
  const pH = await demander('pH (nombre de 0 à 14, sans unité, virgule accptée) : ');
  if (pH === null) return;
  const etatHumide = await demander(`État d'humidité (${HUMIDITES.join(',')}) : `);
  if (etatHumide === null) return;

  // Normalisation avant vérification : majuscule pour le point et la parcelle,
  // minuscule pour la texture et l'état d'humidité, le pH reste tel quel.
  const saisie = {
    id: id.toUpperCase(),
    parcelle: parcelle.toUpperCase(),
    texture: texture.toLowerCase(),
    pH,
    etatHumidite: etatHumide.toLowerCase(),
  };

  const erreurs = ajouterObservation(observations, saisie);
  if (erreurs.length > 0) {
    console.log('Observation refusée :');
    for (const erreur of erreurs) {
      console.log(` -${erreur}`);
    }
    console.log(`Le carnet compte toujours ${observations.length} observation(s).`);
    return;
  }

  await enregistrerJson(FICHIER_DONNEES, observations);
  console.log(`observation ${saisie.id} ajoutée. Le carnet compte ${observations.length} observation.`)
}

//Choix 2 : lister.
function lister(observations) {
  console.log(`---- Liste des observations (${observations.length}) ----`);
  console.log(listerObservations(observations));
}

//Choix 3 : recherche par poiunt, parcelle ou texture.
async function rechercher(observations) {
  console.log('--- Rechercher ---');
  console.log('1. Par point (identifiant)');
  console.log('2. Par parcelle');
  console.log('3. Les observations d\'une texture' );
  const sousChoix = await demander ('Votre choix : ');
  if (sousChoix === null) return;

  switch(sousChoix) {
    case '1' : {
      const saisie = await demander ('Point : ');
      if (saisie === null) return;
      const id = saisie.toUpperCase();
      const observation = trouverParId(observations, id);
      console.log(observation === undefined ? `Observation ${id} introuvable.` : formaterObservation(observation));
      break;
    }
    case '2' : {
      const saisie = await demander ('Parcelle : ');
      if (saisie === null) return;
      const parcelle = saisie.toUpperCase();
      const trouve = filtrerParParcelle(observations, parcelle);
      console.log(`${trouve.length} observation(s) sur la parcelle ${parcelle} :`);
      console.log(listerObservations(trouve));
      break;
    }
    case '3' : {
      const saisie = await demander('Texture : ');
      if (saisie === null) return;
      const texture = saisie.toLowerCase();
      const trouve = filtrerParTexture(observations, texture);
      console.log(`${trouve.length} observation(s) de texture ${texture} :`);
      console.log(listerObservations(trouve));
      break;
    }
    default :
    console.log('Choix inconnu : retour au menu.');
  }
}

// Choix 4 : trier par pH (le carnet d'origine ne change pas d'ordre).
async function trier(observations) {
  console.log('--- Trier ---');
  console.log('1. Par pH croissant'); 
  const sousChoix = await demander ('Votre choix : ');
  if (sousChoix === null) return;

  if (sousChoix === '1') {
    console.log(listerObservations(trierParPh(observations)));
  }else{
    console.log('Choix inconnu : retour au menu');
  }
}

// Choix 5 : synthèse.
function synthèse(observations) {
  console.log(`--- Synthèse des observations ---`);
  console.log(`Nombre d'observations : ${observations.length}`);

  const bornes = phMinMax(observations);
  if (bornes === null) {
    console.log('pHminimum et maximum : aucune donnée');
  }else {
    console.log(`pH minimum : ${bornes.min} . pH : ${bornes.max}`);
  }

  console.log('Observations par texture : ');
  for (const [texture, nombre] of Object.entries(compterParTexture(observations))) {
    console.log(`  ${texture} : ${nombre}`);
  }

  // Bonus : juste après les lignes par texture.
const frequente = textureLaPlusFréquente(observations);
if (frequente === null) {
  console.log('Texture la plus frequente : aucune donnée');
}else{
  console.log(`Texture la plus fréquente : ${frequente.texture} (${frequente.nombre} observation(s))`);
}


  const aDiscuter = pointsADiscuter(observations, SEUIL_PH_A_DISCUTER);
  console.log(`Point à discuter avec le coach (pH <${SEUIL_PH_A_DISCUTER}) : ${aDiscuter.length}`);
  for (const observation of aDiscuter) {
    console.log(`  ${formaterObservation(observation)}`);
  }

  console.log('Rappels : le pH est sans unité. Aucune moyenne de pH n\'est calculée (échelle logarithmique).');
  console.log('Cest points ne sont pas un diagnostique de fertilisation : ils servent à préparer l\'échange avec le coach.');
}

// Choix 6 (bonus) : supprimer une observation. 
async function supprimer(observations) {
  const saisie = await demander ('Identifiant : ');
  if (saisie === null) return;
  const id = saisie.toUpperCase();

  const supprimee = supprimerObservation(observations, id);
  if (supprimee === undefined) {
    console.log(`Observation ${id} introuvable.`);
    return;

  }

  await enregistrerJson(FICHIER_DONNEES, observations);
  console.log(`Observation ${id} supprimée. Le carnet compte ${observations.length} observation(s).`);
} 

//Choix 7 (bonus): modifier un champ d'une observation.
async function modifier(observations){
  const saisieId = await demander ('Nouvelle valeur : ');
  if (valeurSaisie === null) return;
  const id = saisieId.toUpperCase();

  const champ = await demander(`Champ à modifier (${CHAMPS_MODIFIABLES.join(',')}) : `);
  if (champ === null) return;
  const valeurSaisie = await demander ('Nouvelle valeur : ');
  if (valeurSaisie === null) return;

  //Meme normalisation qu'à l'ajout. Le nom du champ reste tel quel ("pH" est sensible à la casse).
  let valeur = valeurSaisie;
  if (champ === 'parcelle') valeur = valeurSaisie.toUpperCase();
  if (champ === 'texture' || champ === 'etatHumidite') valeur = valeurSaisie.toLowerCase();

  const erreurs = modifierObservation(observations, id, champ, valeur);
  if (erreurs.length >0) {
    console.log('Modification refusée :');
    for ( const erreur of erreurs) {
      console.log(`  -${erreur}`);

    }
    return;
  }
  await enregistrerJson(FICHIER_DONNEES, observations);
  console.log(`Observation ${id} modifiée.`);
} 


// ------------- Programme principal -------------

async function main() {
  ouvrirSaisie();
  afficherAccueil();

  // Changement des données : si ça échoue, on continue avec un carnet vide.
  let observations = [];
  try {
    observations = await chargerJson(FICHIER_DONNEES);
    console.log(`${observations.length} observation(s) chargée(s) depuis ${FICHIER_DONNEES}.`); 
  }catch (erreur) {
    console.log(`Impossible de lire ${FICHIER_DONNEES} : ${erreur.message}. Le carnet démarre vide.`);
    observations = [];
  }

  let continuer = true;
  while (continuer) {
    afficherMenu();
    const choix = await demander('Votre choix : ');

    // Saisie fermée (Ctr+c) : on quitte.
    if (choix === null) {
      break;
    }

    try{
      switch (choix) {
        case '1' : 
          await ajouter(observations);
          break;
        case '2' :
          lister(observations);
          break;
        case '3' : 
          await rechercher(observations);
          break;
        case '4' :
          await trier(observations);
          break;
        case '5' :
          synthèse(observations);
          break;
        case '6' :
          await supprimer(observations);
          break;
        case '7' : 
          await modifier(observations);
          break; 
        case '0' :
          console.log('Au revoir !');
          continuer = false;
          break;
        default:
          console.log("Le choix", choix, "Tapez un chiffre du menu");
      }
    }catch (erreur) {
      // Aucune erreur n'arrete le programme : le menu revient toujours.
      if (String(erreur.message).startsWith('TODO')){
        console.log(`A compléter : ${erreur.message}`);
      }else{
        console.log(`Erreur inattendue : ${erreur.message}`);
      }
    }
  }

  fermerSaisie();
}

main();
