# Wörtertrainer

Kleine Lern-App für die Primarschule: Englisch- und Französisch-Wortschatz sowie
Brüche. Eine einzige HTML-Datei, kein Build, kein Account, keine Werbung.
Läuft nach dem ersten Laden offline und lässt sich auf dem iPad wie eine
normale App auf den Home-Bildschirm legen.

**Live:** https://j-mue.github.io/lernen/

## Lernmethode

Grundprinzip: **Abrufen schlägt Anschauen.** Wiederholtes Durchlesen bringt wenig,
aktives Erinnern in kleinen, über Tage verteilten Portionen bringt viel.

- **Portionen statt Listen** – max. 7 Einträge pro Runde (`SESSION_SIZE`)
- **Leitner-System mit drei „Koffern"**
  - Box 0 = neu → jeden Tag
  - Box 1 = am Üben → nach 1 Tag
  - Box 2 = kann ich → nach 3 Tagen
  - Box 3 = Meister → nach 7 Tagen zum Auffrischen
  - Richtig = eine Box hoch, falsch = eine Box runter und nochmal in derselben Runde
- **Steigender Schwierigkeitsgrad** – neue Einträge zuerst als Auswahlfrage
  (erkennen), ab Box 1 muss getippt werden (abrufen)
- **Fehlerfreundlich** – kleine Tippfehler geben „Fast!" statt falsch.
  Ausnahme Mathe: dort exakter Vergleich, 1/3 ist nicht „fast" 1/4
- **Fortschritt sichtbar** – Koffer-Zähler und Sterne

## Fächer

| Fach | Inhalt |
|---|---|
| 🚑 English | 19 Wörter Notfall-Wortschatz (accident, injured, ambulance …) |
| 🎒 Français | 11 Wörter Schulsachen (le livre, la trousse …), inkl. Artikel |
| 🍰 Brüche | 19 Aufgaben, mit Erklärung nach jeder Antwort |

Besonderheiten:

- **Französisch:** Der Artikel gehört zur Antwort (`le livre`). Wort richtig,
  Artikel falsch → „Fast!" mit korrekter Form.
- **Brüche:** Kuchen und Balken werden als SVG gezeichnet (`pieSVG()` / `barSVG()`).
  Nach *jeder* Antwort folgt eine Erklärung nach festem Muster:
  „6 Teile → Nenner 6 (unten). 2 markiert → Zähler 2 (oben)." Die falschen
  Auswahlmöglichkeiten sind bewusst die typischen Fehler (umgedrehter Bruch 6/2,
  falsch gezählte Teile).
- **Aussprache:** Web Speech API. Vorgelesen wird nur das Wort, nicht der
  Beispielsatz. Bei Mathe wird die Wortform gesprochen („zwei Sechstel").

## Auf dem iPad einrichten

1. https://j-mue.github.io/lernen/ in **Safari** öffnen (nicht Chrome)
2. Teilen → **„Zum Home-Bildschirm"**
3. Die App vom Home-Bildschirm-Icon aus starten – ab jetzt immer von dort

Ergebnis: eigenes Icon, keine Browserleiste, offline lauffähig.

> **Wichtig:** Erst das Icon anlegen, dann üben. Eine Home-Bildschirm-Web-App hat
> in der Regel ihren eigenen Speicher, getrennt von Safari. Wer zuerst in Safari
> übt und das Icon später anlegt, findet den bisherigen Lernstand dort nicht wieder.

**Französische Stimme:** Fehlt sie, bleibt Safari bei französischer Sprachausgabe
stumm. Nachladen unter *Einstellungen → Bedienungshilfen → Gesprochene Inhalte →
Stimmen → Französisch*. Die App zeigt sonst einen Hinweis.

## Lernstand

Gespeichert unter dem Schlüssel `woerter-trainer-v2` in `localStorage`, also lokal
auf dem Gerät – nichts wird hochgeladen. Der Lernstand der Vorgängerversion
`notfall-englisch-v1` wird beim ersten Start übernommen.

Über **„Lernstand sichern"** auf dem Startbildschirm lässt sich der Fortschritt als
Text kopieren und später wieder einsetzen. Sinnvoll vor einem Gerätewechsel – und
als Absicherung, denn „Website-Daten löschen" räumt den Lernstand ersatzlos ab.

## Neue Wörter ergänzen

Alles steckt im Objekt `SUBJECTS` am Anfang des `<script>`-Blocks in `index.html`.
Ein Eintrag pro Wort:

```js
{id:"livre", de:"das Buch", fw:"le livre", ex:"Le livre est sur la table."}
```

- `id` – eindeutig, trägt den Lernstand (**nachträglich nicht mehr ändern**)
- `de` – was angezeigt wird (Deutsch)
- `fw` – die erwartete Antwort
- `ex` – Beispielsatz (wird angezeigt, nicht vorgelesen)
- Mathe zusätzlich: `ch` (3 falsche Auswahlmöglichkeiten), `say` (Wortform zum
  Vorlesen), `fig` (Grafik: `{kind:"pie"|"bar", n:Teile, k:markiert}`), `short`
  (Kurzlabel für die Übersicht)

Ein neues Fach = ein weiterer Schlüssel in `SUBJECTS`, ein Button im Switcher
(`tabXx`) und eine Zeile bei den Events (`setSubject`).

## Deployen

Push auf `main` → GitHub Pages veröffentlicht automatisch.

**Nach jeder inhaltlichen Änderung `VERSION` in `sw.js` hochzählen.** Sonst
behalten iPads den alten Cache und die neuen Wörter tauchen nie auf. Ebenso
`APP_VERSION` in `index.html` – die Nummer steht unter „Lernstand sichern" und
zeigt, ob das Gerät wirklich die neue Fassung hat.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | die komplette App |
| `manifest.webmanifest` | macht sie zur installierbaren PWA |
| `sw.js` | Service Worker für den Offline-Betrieb |
| `fonts/` | Baloo 2 und Nunito lokal, damit die App offline gleich aussieht |
| `brueche-uebungsblatt.pdf` | Übungsblatt Brüche, 5 Seiten A4 zum Ausdrucken |

## Übungsblatt Brüche

Fünf Seiten, dieselben Aufgabentypen wie in der App: Bruchteile bestimmen
(Kuchen, Balken, Streifen), Situationen zeichnen und teilen, Tabelle „Welchen
Kuchenteil erhält eine Person?", Wortform ↔ Bruch. **Seite 5 enthält die Lösungen**
– beim Ausdrucken für das Kind weglassen.

Markierte Flächen sind bewusst hell gehalten, damit Bleistift sichtbar bleibt;
funktioniert auch in Schwarz-Weiss.
