require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// On se connecte à la base de données
const databasePath = process.env.DATABASE_URL || './database.db';
const db = new sqlite3.Database(databasePath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion :', err.message);
    return;
  }
  console.log('Connecté à la base de données SQLite :', databasePath);
});

// On lit le fichier SQL
const sql = fs.readFileSync('./seed.sql', 'utf8');

// On exécute le contenu
db.exec(sql, (err) => {
  if (err) {
    console.error("Erreur lors de l'exécution du seed :", err.message);
  } else {
    console.log('Seed exécuté avec succès ! Les données sont en base.');
  }
  db.close();
});
