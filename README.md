# Maps for Wikivoyage

## Introduction

This is an experimentation of the [Kartographer extension](https://www.mediawiki.org/wiki/Extension:Kartographer) customized for Wikivoyage.

- Phabricator ticket https://phabricator.wikimedia.org/T132971
- Maps discussion https://www.mediawiki.org/wiki/Talk:Maps
- Chat with us on *freenode* in #wikimedia-interactive

## Installation

- `git clone https://github.com/juliengirault/wikivoyage-maps.git`
- `cd wikivoyage-maps && npm install`

### Running the examples on mediawiki

- Build the files:
 ```
 npm run build
 ```
 
- This will generate two files:
 ```
 Mediawiki:Kartographer.css
 Mediawiki:Kartographer.js
 ```
- On wiki, 

  - You must have Kartographer installed. See [instructions](https://www.mediawiki.org/wiki/Extension:Kartographer#Installation).

  - Create `Mediawiki:Kartographer.js`, and put contents from `dist/Mediawiki:Kartographer.js`.

  - Create `Mediawiki:Kartographer.css`, and put contents from `dist/Mediawiki:Kartographer.css`.

  - Visit an article with a map.
