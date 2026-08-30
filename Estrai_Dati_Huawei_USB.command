#!/bin/bash
# ==============================================================================
#  LUCA HEALTH BLUEPRINT - ESTRAZIONE DIRETTA USB HUAWEI HEALTH (ADB / SQLITE)
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOOLS_DIR="$DIR/tools"
EXTRACT_DIR="$DIR/app/data/huawei_raw"

mkdir -p "$TOOLS_DIR" "$EXTRACT_DIR"

clear
echo "======================================================"
echo " 🔌 ESTRAZIONE DATI HUAWEI HEALTH VIA CAVO USB (ADB)"
echo "======================================================"
echo ""

# 1. Trova o scarica ADB
ADB_BIN="adb"
if ! command -v adb &> /dev/null; then
    if [ -f "/opt/homebrew/bin/adb" ]; then
        ADB_BIN="/opt/homebrew/bin/adb"
    elif [ -f "$TOOLS_DIR/platform-tools/adb" ]; then
        ADB_BIN="$TOOLS_DIR/platform-tools/adb"
    else
        echo "[*] ADB non trovato. Download automatico di Android Platform-Tools per macOS..."
        curl -L -s https://dl.google.com/android/repository/platform-tools-latest-darwin.zip -o "$TOOLS_DIR/platform-tools.zip"
        unzip -q -o "$TOOLS_DIR/platform-tools.zip" -d "$TOOLS_DIR"
        rm -f "$TOOLS_DIR/platform-tools.zip"
        chmod +x "$TOOLS_DIR/platform-tools/adb"
        ADB_BIN="$TOOLS_DIR/platform-tools/adb"
        echo "[+] Android Platform-Tools installato con successo in locale!"
    fi
fi

echo "[*] Controllo connessione dispositivo Android..."
echo "    Assicurati che:"
echo "    1. Il telefono sia collegato al Mac con il cavo USB."
echo "    2. Il 'Debug USB' sia ATTIVO nelle Opzioni Sviluppatore del telefono."
echo ""

# Riavvia server ADB
"$ADB_BIN" start-server > /dev/null 2>&1

DEVICES=$("$ADB_BIN" devices | grep -v "List of devices" | grep "device$" | awk '{print $1}')

if [ -z "$DEVICES" ]; then
    echo "⚠️  Nessun dispositivo Android rilevato o autorizzato."
    echo ""
    echo "Controlla lo schermo del tuo telefono Android:"
    echo "-> Se compare il popup 'Consentire debug USB da questo computer?',"
    echo "   metti la spunta su 'Consenti sempre' e tocca OK!"
    echo ""
    read -p "Premi [INVIO] dopo aver autorizzato il telefono per riprovare..."
    DEVICES=$("$ADB_BIN" devices | grep -v "List of devices" | grep "device$" | awk '{print $1}')
fi

if [ -z "$DEVICES" ]; then
    echo "❌ Dispositivo non trovato. Verifica il cavo USB e il Debug USB e riprova."
    echo ""
    read -p "Premi [INVIO] per uscire..."
    exit 1
fi

echo "✅ Dispositivo Android connesso: $DEVICES"
echo ""
echo "[*] Estrazione dati in corso da Huawei Health..."

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TARGET_DUMP="$EXTRACT_DIR/huawei_backup_$TIMESTAMP"
mkdir -p "$TARGET_DUMP"

# Tentativo 1: Estrazione diretta file SQLite dall'app
"$ADB_BIN" exec-out run-as com.huawei.health cat databases/health.db > "$TARGET_DUMP/health.db" 2>/dev/null
"$ADB_BIN" exec-out run-as com.huawei.health cat databases/sensor.db > "$TARGET_DUMP/sensor.db" 2>/dev/null
"$ADB_BIN" exec-out run-as com.huawei.health cat databases/HiHealthData.db > "$TARGET_DUMP/HiHealthData.db" 2>/dev/null

# Tentativo 2: Estrazione log e percorsi se presenti
"$ADB_BIN" pull /sdcard/Android/data/com.huawei.health/files/ "$TARGET_DUMP/files" 2>/dev/null
"$ADB_BIN" pull /sdcard/Huawei/Health/ "$TARGET_DUMP/health_folder" 2>/dev/null

# Esegui parser Python
python3 "$DIR/app/scripts/extract_huawei_db.py" "$TARGET_DUMP"

echo ""
echo "======================================================"
echo " 🎉 ESTRAZIONE COMPLETATA CON SUCCESSO!"
echo " 🌐 Apri l'app su http://localhost:3000 per visualizzare i dati."
echo "======================================================"
echo ""
read -p "Premi [INVIO] per chiudere..."
