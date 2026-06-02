#!/usr/bin/env python3
"""
Parseia /tmp/fifa.txt (extraído do PDF oficial da FIFA com hora de Brasília)
e gera /tmp/fifa-parsed.json com a lista canônica de todos os 104 jogos.
"""
import re
import json

# Códigos FIFA de 3 letras → Nome em PT (como aparece no nosso matches.json)
TEAM_CODE = {
    "MEX": "México", "RSA": "África do Sul", "KOR": "Coreia do Sul",
    "CZE": "República Tcheca", "CAN": "Canadá", "BIH": "Bósnia e Herzegovina",
    "USA": "EUA", "PAR": "Paraguai", "QAT": "Catar", "SUI": "Suíça",
    "BRA": "Brasil", "MAR": "Marrocos", "HAI": "Haiti", "SCO": "Escócia",
    "AUS": "Austrália", "TUR": "Turquia", "GER": "Alemanha", "CUW": "Curaçao",
    "NED": "Países Baixos", "JPN": "Japão", "CIV": "Costa do Marfim",
    "ECU": "Equador", "SWE": "Suécia", "TUN": "Tunísia", "ESP": "Espanha",
    "CPV": "Cabo Verde", "BEL": "Bélgica", "EGY": "Egito",
    "KSA": "Arábia Saudita", "URU": "Uruguai", "IRN": "Irã",
    "NZL": "Nova Zelândia", "FRA": "França", "SEN": "Senegal",
    "IRQ": "Iraque", "NOR": "Noruega", "ARG": "Argentina", "ALG": "Argélia",
    "AUT": "Áustria", "JOR": "Jordânia", "POR": "Portugal", "COD": "RD Congo",
    "ENG": "Inglaterra", "CRO": "Croácia", "GHA": "Gana", "PAN": "Panamá",
    "UZB": "Uzbequistão", "COL": "Colômbia",
}

# Fase no PDF → stage no JSON
STAGE_MAP = {
    "Primeira fase": "grupos",
    "Segundas de final": "32avos",
    "Oitavas de final": "oitavas",
    "Quartas de final": "quartas",
    "Semifinal": "semi",
    "Disputa do 3º lugar": "terceiro",
    "Decisão do 3º lugar": "terceiro",
    "Final": "final",
}

MONTH = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4, "maio": 5, "junho": 6,
    "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
}

with open("/tmp/fifa.txt", encoding="utf-8") as f:
    raw = f.read()

# Normaliza espaços múltiplos
lines = [re.sub(r"\s+", " ", ln).strip() for ln in raw.splitlines()]
lines = [ln for ln in lines if ln]  # drop empty

games = []
current_date = None  # (year, month, day)
current_year = 2026

# Regex helpers
DATE_RE = re.compile(r"^[a-zç-]+-?feira\s+(\d{1,2})\s+(\w+)\s+(\d{4})\s+Ver", re.IGNORECASE)
# Sometimes the day prefix has hyphen, sometimes not, also sábado/domingo
DATE_RE2 = re.compile(r"^(?:sábado|domingo)\s+(\d{1,2})\s+(\w+)\s+(\d{4})\s+Ver", re.IGNORECASE)

# Linha do match: "MEX 16:00 RSA" (com ou sem letras+números — pra mata-mata pode ser W73, 2A, 3ABCDF, etc)
MATCH_RE = re.compile(r"^([A-Z0-9]{2,7})\s+(\d{2}:\d{2})\s+([A-Z0-9]{2,7})$")

# Stage line: "Primeira fase" / "Segundas de final" etc
STAGE_LINE_RE = re.compile(r"^(Primeira fase|Segundas de final|Oitavas de final|Quartas de final|Semifinal|Disputa do 3º lugar|Decisão do 3º lugar|Final)$")

# Grupo + estádio: "Grupo A · Estádio da Cidade do México (Cidade do México)"
GROUP_STAD_RE = re.compile(r"^Grupo\s+([A-L])\s*·\s*(.+?)\s*\((.+?)\)$")
# Mata-mata estádio: "· Estádio de Houston (Houston)"
STAD_ONLY_RE = re.compile(r"^·?\s*(.+?)\s*\((.+?)\)$")

i = 0
pending = None  # dict com partial info enquanto coleta as 3 linhas
while i < len(lines):
    ln = lines[i]
    # Date line?
    m = DATE_RE.match(ln) or DATE_RE2.match(ln)
    if m:
        day = int(m.group(1))
        month_name = m.group(2).lower()
        year = int(m.group(3))
        if month_name in MONTH:
            current_date = (year, MONTH[month_name], day)
        i += 1
        continue
    # Match line?
    m = MATCH_RE.match(ln)
    if m and current_date:
        home, time_str, away = m.group(1), m.group(2), m.group(3)
        pending = {
            "date": current_date,
            "home": home,
            "away": away,
            "time": time_str,
        }
        i += 1
        # próximas 2 linhas: stage e (grupo+)estádio
        # mas pode ter linhas vazias entremeio (já removidas)
        # busca stage nas próximas 2 linhas
        stage_found = None
        for j in range(i, min(i + 3, len(lines))):
            sm = STAGE_LINE_RE.match(lines[j])
            if sm:
                stage_found = sm.group(1)
                i = j + 1
                break
        if not stage_found:
            # malformed, skip
            pending = None
            continue
        # próxima linha: estádio (com ou sem grupo)
        if i < len(lines):
            stad_ln = lines[i]
            gm = GROUP_STAD_RE.match(stad_ln)
            stadium = None
            city = None
            grupo = None
            if gm:
                grupo = gm.group(1)
                stadium = gm.group(2).strip()
                city = gm.group(3).strip()
                i += 1
            else:
                sm2 = STAD_ONLY_RE.match(stad_ln)
                if sm2:
                    stadium = sm2.group(1).strip()
                    city = sm2.group(2).strip()
                    i += 1
            pending.update({
                "stage": STAGE_MAP.get(stage_found, stage_found),
                "stage_pt": stage_found,
                "grupo": grupo,
                "stadium": stadium,
                "city": city,
                "home_team": TEAM_CODE.get(home, home),
                "away_team": TEAM_CODE.get(away, away),
            })
            games.append(pending)
            pending = None
        continue
    i += 1

# Print summary
by_stage = {}
for g in games:
    by_stage.setdefault(g["stage"], 0)
    by_stage[g["stage"]] += 1

print(f"Total parsed: {len(games)}")
for s, c in sorted(by_stage.items()):
    print(f"  {s}: {c}")

with open("/tmp/fifa-parsed.json", "w", encoding="utf-8") as f:
    json.dump(games, f, ensure_ascii=False, indent=2)
print("Saved: /tmp/fifa-parsed.json")
