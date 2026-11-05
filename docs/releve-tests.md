# Relevé des tests

> Écrivez le résultat attendu avant d'essayer. Un écart n'est pas une faute : notez-le, corrigez, refaites le test.

**Calculs à la main** : refaites à la main les résultats de référence de `SUJET.md`, puis comparez avec votre programme.
-Nombre total d'observation :  10
-pH minimum : 4.8
-pH maximum : 7.6
-Nombre de textures :   sableux (3) sur S01; S04; S08
                        limoneux (4) sur S02; S05; S07; S10
                        argileux (3) sur S03; S06; S09
-"id": "S04",
    "parcelle": "P2",
    "texture": "sableux",
    "pH": 4.8
    "etatHumidite": "sec"
-S99 : introuvable

**Essais dans le menu** : un ajout valide (encore là après redémarrage), chaque règle refusée, une recherche introuvable, chaque tri, la synthèse, un choix inconnu.

|       Action            |                  Attendu                    |        Obtenu                |      Testeur  |
| ---                     | ---                                         | ---                          | ---           |
|   ajout valide          | l'observation doit etre ajoutée             |                              |    |
|chaque règle refusée     |     Aucune observation enregistrée          |                              |     |
|une recherche introuvable|       introuvable                           |                              |    |
|chaque tri (pH croissant)|         tri succès                          |                              |    |
|la synthèse              | affichage des statistiqyues de l'observation|                              |     |
|un choix inconnu         |        Aucune observation enregistrée       |                              |     |

**Sur un autre poste** (`git clone`, `node app.js`, `npm test`, en suivant le README) : ✏️
