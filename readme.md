# Feature Model

<img src="feature_model/public/projet.png" alt="projet" />

## Description


## Prérequis

- Node.js récent et npm installés sur votre machine.

## Installation pour le développement

### Cloner le projet

Pour cloner le projet, utilisez la commande suivante :

```bash
git clone git@github.com:isJlaiel/projet_annuel.git
```
### Installation et démarrage du Backend

naviguez dans le répertoire :

```bash
cd feature_model_api
```
Installez les dépendances :

```bash
npm install
```
Démarrez le serveur backend :

```bash
npm run start
```


### Installation et démarrage du Frontend

naviguez dans le répertoire :

```bash
cd feature_model
```
Installez les dépendances :

```bash
npm install
```
Démarrez le serveur backend :

```bash
npm run dev
```

### Utilisation de Docker
#### Prérequis pour Docker
Docker installé
Ajouter l'utilisateur courant au groupe docker pour pouvoir exécuter Docker sans sudo.
Construire et lancer l'application avec Docker

Construire les conteneurs :

```bash

docker compose build --build-arg USER_UID=${UID}
# Ou pour les versions plus anciennes de Docker :
docker-compose build --build-arg USER_UID=${UID}
```
lancer l'application 

```bash
docker-compose up
# Ou pour les versions plus anciennes de Docker :
docker compose up 
```
