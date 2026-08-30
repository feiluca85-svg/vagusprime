#!/bin/bash
# ==============================================================================
#  PUBBLICAZIONE VAGUSPRIME SU GITHUB PAGES (100% ONLINE E ZERO-KNOWLEDGE)
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

clear
echo "======================================================"
echo " 🌐 PUBBLICAZIONE VAGUSPRIME SU GITHUB PAGES"
echo " 🔒 Architettura 100% Zero-Knowledge & Privacy Protetta"
echo "======================================================"
echo ""

git add index.html manifest.json css js icons docs .gitignore DIETA_SETTIMANALE_E_MEAL_PREP.md GUIDA_ACQUISTI_E_LINK_PRODOTTI.md
git commit -m "Deploy VagusPrime Biohacking PWA" > /dev/null 2>&1 || true

echo "[*] Repository pronto per la sincronizzazione."
echo ""
echo "Per pubblicarlo sul tuo profilo GitHub (feiluca85-svg):"
echo "1. Vai su https://github.com/new e crea un nuovo repository pubblico chiamato: vagusprime"
echo "2. Poi incolla ed esegui questi due comandi nel terminale:"
echo ""
echo "   git remote add origin https://github.com/feiluca85-svg/vagusprime.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Su GitHub vai in: Settings -> Pages -> Source: 'Deploy from a branch' (main / root)."
echo "   La tua app sarà subito attiva e accessibile ovunque a questo indirizzo:"
echo "   👉 https://feiluca85-svg.github.io/vagusprime"
echo ""
echo "======================================================"
read -p "Premi [INVIO] per chiudere..."
