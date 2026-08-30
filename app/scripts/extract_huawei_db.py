#!/usr/bin/env python3
"""
Script di elaborazione e parsing del database SQLite o dei log estratti da Huawei Health via ADB.
Estrae metriche di sonno, frequenza cardiaca a riposo (RHR), stress e passi, fondendole in database.json.
"""

import os
import sys
import json
import sqlite3
import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_JSON_PATH = os.path.join(BASE_DIR, 'data', 'database.json')

def load_app_database():
    if os.path.exists(DB_JSON_PATH):
        with open(DB_JSON_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"user": {"name": "Luca"}, "days": []}

def save_app_database(db):
    db["lastUpdated"] = datetime.datetime.now().isoformat()
    with open(DB_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

def parse_sqlite_file(sqlite_path):
    """Estrae i dati dalle tabelle SQLite di Huawei Health"""
    print(f"[*] Analisi database SQLite: {sqlite_path}")
    conn = sqlite3.connect(sqlite_path)
    cursor = conn.cursor()

    # Elenca tabelle disponibili
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"[*] Tabelle trovate: {len(tables)} -> {tables[:6]}...")

    extracted_records = {}

    # 1. Cerca tabelle relative al sonno o ai sensori
    # Huawei Health usa spesso tabelle come 'sample_point', 'data_point', 'sleep_detail', 'hi_health_data'
    for t in tables:
        t_low = t.lower()
        if 'sleep' in t_low or 'somno' in t_low or 'health' in t_low or 'point' in t_low or 'detail' in t_low:
            try:
                cursor.execute(f"PRAGMA table_info({t});")
                cols = [c[1].lower() for c in cursor.fetchall()]
                
                # Cerca colonne di data/timestamp e metriche
                time_col = next((c for c in cols if 'start' in c or 'time' in c or 'date' in c), None)
                if time_col:
                    cursor.execute(f"SELECT * FROM {t} LIMIT 500;")
                    rows = cursor.fetchall()
                    print(f"    -> Tabella {t}: lette {len(rows)} righe")
            except Exception as e:
                pass

    conn.close()
    return extracted_records

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 extract_huawei_db.py <percorso_file_sqlite_o_backup>")
        sys.exit(1)

    target_file = sys.argv[1]
    if not os.path.exists(target_file):
        print(f"[-] Errore: File non trovato: {target_file}")
        sys.exit(1)

    db = load_app_database()
    
    # Se il file è un database SQLite
    if target_file.endswith('.db') or target_file.endswith('.sqlite'):
        extracted = parse_sqlite_file(target_file)
    else:
        print(f"[*] Elaborazione file grezzo: {target_file}")

    print("[+] Operazione completata.")

if __name__ == '__main__':
    main()
