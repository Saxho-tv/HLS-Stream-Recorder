---

# HLS Stream Recorder 🎙️

> ⚙️ A lightweight tool to automatically record HLS audio streams (`.m3u8`) hour by hour, with smart filename management, hourly rotation and automatic cleanup of old recordings.

---

## 🧾 Features

- Continuous recording of HLS streams (supports `.m3u8`, `.mp3`, etc.)
- Hourly file splitting: a new file is created on every new hour
- Smart filename organization: `Stream-Name-monday-14h.aac`
- Automatic deletion of files older than 7 days
- Centralized configuration via `config.json`
- Timestamped logs using local timezone (configurable)
- Compatible with AAC or MP3 audio streams

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [FFmpeg](https://ffmpeg.org/) installed and available in system `PATH`
- Node Package Manager (`npm` or `yarn`)

---

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/hls-stream-recorder.git
cd hls-stream-recorder
```

2. Install dependencies:

```bash
npm install
```

3. Configure your streams in `config.json`:

```json
{
  "PORT": 3000,
  "RECORDING_FOLDER": "recordings",
  "TIMEZONE": "Europe/Paris",
  "STREAMS": [
    {
      "name": "France Inter",
      "url": "https://live.franceinter.fr/franceinter"
    },
    {
      "name": "France Info",
      "url": "https://live.franceinfo.fr/franceinfo"
    }
  ]
}
```

4. Start the application:

```bash
npm start
```

---

## 🗂️ Recording Structure

Files are saved in the folder defined in `config.json` (`recordings/` by default), named based on:
- Stream name
- Weekday
- Recording hour

Example:  
`France-Inter-tuesday-14h.aac`

---

## 🕒 Automatic Management

- On each hour change, a new file is created.
- Files older than 7 days are automatically deleted.

---

## 📝 Logs

All actions are logged with timestamps:

```
[2025-04-05 14:23:10] Starting continuous recording for France Inter at 2025-04-05 14:23:10
[2025-04-05 14:23:11] Creating new file: recordings/France-Inter-saturday-14h.aac
[2025-04-05 15:00:01] New hour detected (15): Arrêt de l'enregistrement en cours.
```

---
#FRENCH

# 📦 Enregistreur de flux HLS

> ⚙️ Un outil léger pour enregistrer automatiquement des flux audio HLS (`.m3u8`) heure par heure, avec gestion des noms de fichiers, rotation horaire et suppression automatique des anciens enregistrements.

---

## 🧾 Fonctionnalités

- Enregistrement continu des flux HLS (compatible `.m3u8`, `.mp3`, etc.)
- Découpage horaire automatique : un nouveau fichier est créé à chaque nouvelle heure.
- Organisation intelligente des fichiers : `Nom-du-flux-lundi-14h.aac`
- Suppression automatique des fichiers plus vieux que 7 jours
- Configuration centralisée via `config.json`
- Horodatage des logs au fuseau horaire local (configurable)
- Compatible avec les flux audio AAC ou MP3

---

## 📦 Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure recommandée)
- [FFmpeg](https://ffmpeg.org/) installé et accessible dans le `PATH` système
- Node Package Manager (`npm` ou `yarn`)

---

## 🔧 Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/votre-nom/hls-stream-recorder.git
cd hls-stream-recorder
```

2. Installez les dépendances :

```bash
npm install
```

3. Configurez vos flux dans `config.json` :

```json
{
  "PORT": 3000,
  "RECORDING_FOLDER": "recordings",
  "TIMEZONE": "Europe/Paris",
  "STREAMS": [
    {
      "name": "France Inter",
      "url": "https://live.franceinter.fr/franceinter"
    },
    {
      "name": "France Info",
      "url": "https://live.franceinfo.fr/franceinfo"
    }
  ]
}
```

4. Lancez l'application :

```bash
npm start
```

---

## 🗂️ Structure des enregistrements

Les fichiers sont sauvegardés dans le dossier défini dans `config.json` (`recordings/` par défaut), avec un nom basé sur :
- Nom du flux
- Jour de la semaine
- Heure d'enregistrement

Exemple :  
`France-Inter-mardi-15h.aac`

---

## 🕒 Gestion automatique

- À chaque changement d’heure, un nouveau fichier est créé.
- Les fichiers plus vieux que 7 jours sont automatiquement supprimés.

---

## 📝 Logs

Toutes les actions sont logguées dans la console avec un horodatage :

```
[2025-04-05 14:23:10] Starting continuous recording for France Inter at 2025-04-05 14:23:10
[2025-04-05 14:23:11] Création du fichier : recordings/France-Inter-samedi-14h.aac
[2025-04-05 15:00:01] Nouvelle heure détectée (15) : Arrêt de l'enregistrement en cours.
```

---

## 📜 Licence

MIT License – Voir le fichier [LICENSE](LICENSE) pour plus d’informations.

---
