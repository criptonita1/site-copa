#!/usr/bin/env python3
"""
Sincroniza canais por jogo no matches.json com a lista enviada pelo usuário.

Source: /tmp/canais.txt (cola do filtro por emissora no fifa.com/pt)
Target: src/data/matches.json (fonte da verdade do site)

Estratégia:
- Pra cada CANAL, parseia lista de jogos (par home × away).
- CazéTV = "todos os jogos" (104).
- Reporta diffs antes de aplicar:
  * Jogos onde JSON tem canal X mas usuário NÃO listou → REMOVE canal
  * Jogos onde usuário listou canal X mas JSON NÃO tem → ADICIONA canal
- Aplica updates SÓ na fase de grupos (e abertura). Knockout fica intacto
  exceto CazéTV que sempre cobre todos.
- Atualiza canaisConfirmados=true em todo jogo de grupos (usuário confirmou).
"""
import re
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CANAIS_TXT = "/tmp/canais.txt"
JSON_PATH = ROOT / "src/data/matches.json"
BACKUP = "/tmp/matches.before-channel-sync.json"

# Mapping de nome usado pelo usuário → ID interno do canal
CHANNEL_NAME_TO_ID = {
    "sbt": "sbt",
    "caze tv": "cazetv",
    "cazetv": "cazetv",
    "cazé tv": "cazetv",
    "sportv": "sportv",
    "sporttv": "sportv",  # typo do user
    "globoplay": "globoplay",
    "n sports": "nsports",
    "nsports": "nsports",
    "globo": "globo",
    "ge tv": "getv",
    "getv": "getv",
}

# Normalização de nomes de seleção (variações comuns → nome canônico no JSON)
TEAM_NORMALIZE = {
    "Holanda": "Países Baixos",
    "República da Coreia": "Coreia do Sul",
    "RD do Congo": "RD Congo",
    "República democrática do Congo": "RD Congo",
    "Coréia do Sul": "Coreia do Sul",
}

# Detecta linhas de fronteira (cabeçalho de canal). Aceita "Canal:" ou
# "cAZE TV - TODOS OS JOGOS"
CHANNEL_HEADER_RE = re.compile(
    r"^\s*(SBT|cAZE\s*TV|CazéTV|Cazé\s*TV|Caze\s*TV|SporTV|SportTV|GloboPlay|N\s*Sports|Globo|GE\s*TV)\s*[:\-]\s*(TODOS OS JOGOS)?\s*$",
    re.IGNORECASE,
)
DATE_LINE_RE = re.compile(
    r"^\s*(segunda|terça|quarta|quinta|sexta|sábado|domingo)-?feira?\s+\d+\s+\w+\s+\d{4}\s*$",
    re.IGNORECASE,
)
TIME_LINE_RE = re.compile(r"^\s*(\d{2}:\d{2})\s*$")


def normalize_team(name: str) -> str:
    name = name.strip()
    return TEAM_NORMALIZE.get(name, name)


def parse_canais(path: str) -> dict[str, list[tuple[str, str]]]:
    """Retorna {channel_id: [(home, away), ...]}."""
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()

    channels: dict[str, list[tuple[str, str]]] = {}
    current_channel = None
    current_pair: list[str] = []

    i = 0
    while i < len(lines):
        ln = lines[i].rstrip("\n")
        # Channel header?
        m = CHANNEL_HEADER_RE.match(ln)
        if m:
            ch_name_raw = re.sub(r"\s+", " ", m.group(1).lower()).strip()
            todos = m.group(2)
            # Match EXATO primeiro (evita "Globo" cair em "globoplay")
            ch_id = CHANNEL_NAME_TO_ID.get(ch_name_raw)
            if not ch_id:
                # Fallback: igualdade após remover espaços
                key_compact = ch_name_raw.replace(" ", "")
                for k, v in CHANNEL_NAME_TO_ID.items():
                    if k.replace(" ", "") == key_compact:
                        ch_id = v
                        break
            if ch_id:
                current_channel = ch_id
                channels.setdefault(current_channel, [])
                if todos and "todos" in todos.lower():
                    channels[current_channel].append(("*ALL*", "*ALL*"))
            current_pair = []
            i += 1
            continue
        # Pra cada jogo: queremos detectar a sequência:
        #   <home>  (linha não vazia, não date, não time, não tem "·", não "Primeira fase", etc.)
        #   <empty>
        #   <HH:MM>
        #   <empty>
        #   <away>
        if current_channel is None:
            i += 1
            continue
        # Date line — só seta contexto, não inicia game
        if DATE_LINE_RE.match(ln):
            i += 1
            continue
        # Time line — gatilho pra coletar par
        tm = TIME_LINE_RE.match(ln)
        if tm:
            # Olha pra trás (skipa empty) pra achar home
            home = None
            j = i - 1
            while j >= 0 and not lines[j].strip():
                j -= 1
            if j >= 0:
                cand = lines[j].rstrip("\n").strip()
                if cand and not DATE_LINE_RE.match(cand) and "·" not in cand and "Primeira fase" not in cand and "Grupo" not in cand:
                    home = cand
            # Olha pra frente (skipa empty) pra achar away
            away = None
            k = i + 1
            while k < len(lines) and not lines[k].strip():
                k += 1
            if k < len(lines):
                cand = lines[k].rstrip("\n").strip()
                if cand and not DATE_LINE_RE.match(cand) and "·" not in cand and "Primeira fase" not in cand:
                    away = cand
            if home and away:
                channels[current_channel].append(
                    (normalize_team(home), normalize_team(away))
                )
            i += 1
            continue
        i += 1

    return channels


def main():
    parsed = parse_canais(CANAIS_TXT)

    print("\n📋 Canais parseados:")
    for ch, games in parsed.items():
        if games and games[0] == ("*ALL*", "*ALL*"):
            print(f"  {ch}: TODOS OS JOGOS")
        else:
            print(f"  {ch}: {len(games)} jogos")

    with open(JSON_PATH) as f:
        data = json.load(f)

    # Backup
    Path(BACKUP).write_text(json.dumps(data, ensure_ascii=False, indent=2))

    # Pra cada jogo do JSON, computa o set canais ESPERADO
    expected_per_id: dict[str, set[str]] = {}

    for m in data["matches"]:
        mid = m["id"]
        stage = m["stage"]
        is_group_phase = stage in ("grupos", "abertura")
        expected: set[str] = set()

        for ch_id, games in parsed.items():
            if games and games[0] == ("*ALL*", "*ALL*"):
                # Cobre todos
                expected.add(ch_id)
                continue
            if not is_group_phase:
                # Pra knockout: usuário não mandou data, então mantém o
                # estado atual desses canais (não confirma nem nega).
                if ch_id in m.get("canais", []):
                    expected.add(ch_id)
                continue
            # Procura no parse desse canal pelo par
            for home, away in games:
                if (
                    (m["mandante"] == home and m["visitante"] == away)
                    or (m["mandante"] == away and m["visitante"] == home)
                ):
                    expected.add(ch_id)
                    break

        expected_per_id[mid] = expected

    # Diff report
    print("\n🔍 Discrepâncias por jogo (só grupos/abertura):\n")
    changes: list[str] = []
    for m in data["matches"]:
        if m["stage"] not in ("grupos", "abertura"):
            continue
        current = set(m.get("canais", []))
        expected = expected_per_id[m["id"]]
        added = expected - current
        removed = current - expected
        if added or removed:
            line = f"  {m['id']} {m['horarioBrasilia']} {m['mandante']} × {m['visitante']}"
            if added:
                line += f" | + {sorted(added)}"
            if removed:
                line += f" | - {sorted(removed)}"
            changes.append(line)
            print(line)

    print(f"\n  Total de jogos alterados (grupos): {len(changes)}")

    # Aplica
    for m in data["matches"]:
        expected = expected_per_id[m["id"]]
        if not expected:
            continue
        # Mantém ordem canônica dos canais (mesma de canais.ts)
        ORDER = ["globo", "sbt", "cazetv", "sportv", "nsports", "globoplay", "getv"]
        m["canais"] = [c for c in ORDER if c in expected]
        # Pra grupos, canaisConfirmados=True (usuário enviou a lista oficial)
        if m["stage"] in ("grupos", "abertura"):
            m["canaisConfirmados"] = True

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    # Conta canaisConfirmados final
    confirmed = sum(1 for m in data["matches"] if m.get("canaisConfirmados"))
    print(f"\n✅ Aplicado. canaisConfirmados=True em {confirmed} jogos.")
    print(f"   Backup: {BACKUP}")


if __name__ == "__main__":
    main()
