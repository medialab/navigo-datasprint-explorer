# Exploration des données Navigo pour le datasprint 2022

Outil de génération de visualisations pour explorer les données de la [base Navigo](https://navigocorpus.hypotheses.org/).

**Utilisation** : https://medialab.github.io/navigo-datasprint-explorer/

Cet outil a été développé dans le cadre du projet [ANR PORTIC](https://anr.portic.fr/portic/), visant notamment à étudier ces données.

## Installation

```
git clone https://github.com/medialab/navigo-datasprint-explorer.git
cd navigo-datasprint-explorer
sh install.sh
```

## Développement

```
npm run dev
```

Rendez-vous à l'adresse http://localhost:9000/ avec un navigateur web.

***Stack*** : React v17.0.2, Vega v5.21.0, Bulma v0.9.3, Webpack v5.68.0, Python v3.10.1

## Mise en production

```
npm run build
```

Une *GitHub action* intégré met automatiquement à jour (via les commandes ci-dessus) l'outil en ligne à chaque *commit* sur la branche *main*.