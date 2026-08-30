#!/bin/bash
# ==============================================================================
#  LUCA HEALTH BLUEPRINT - LAUNCHER macOS
#  Doppio clic per avviare il server locale e aprire l'applicazione nel browser.
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/app"

echo "======================================================"
echo " 🚀 AVVIO DI LUCA HEALTH BLUEPRINT..."
echo " 🔒 Ambiente 100% Locale, Privato e Sicuro"
echo "======================================================"

# Apri il browser dopo 1.5 secondi
(sleep 1.5 && open "http://localhost:3333") &

# Avvia il server Node.js
node server.js
