# Wörtertrainer

Kleine Lern-App für die Primarschule: Englisch- und Französisch-Wortschatz,
Brüche und Schach für Einsteiger. Eine einzige HTML-Datei, kein Build, kein Account, keine Werbung.
Läuft nach dem ersten Laden offline und lässt sich auf dem iPad wie eine
normale App auf den Home-Bildschirm legen.

**Live:** https://j-mue.github.io/lernen/

## Lernmethode

Grundprinzip: **Abrufen schlägt Anschauen.** Wiederholtes Durchlesen bringt wenig,
aktives Erinnern in kleinen, über Tage verteilten Portionen bringt viel.

- **Portionen dort, wo es anstrengt** – neue Einträge laufen als Auswahlfrage
  (erkennen) und kommen deshalb **vollzählig** in eine Runde: lieber einmal den
  ganzen neuen Stoff sehen als ihn über Tage zerstückeln. Portioniert werden nur
  die Wiederholungen, die getippt werden müssen – max. 7 pro Runde
  (`SESSION_SIZE`), weil Abrufen die anstrengende Hälfte ist
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
| ♟️ Schach | 26 Einsteiger-Aufgaben mit Brettdiagrammen |

Besonderheiten:

- **Französisch:** Der Artikel gehört zur Antwort (`le livre`). Wort richtig,
  Artikel falsch → „Fast!" mit korrekter Form.
- **Brüche:** Kuchen und Balken werden als SVG gezeichnet (`pieSVG()` / `barSVG()`).
  Nach *jeder* Antwort folgt eine Erklärung nach festem Muster:
  „6 Teile → Nenner 6 (unten). 2 markiert → Zähler 2 (oben)." Die falschen
  Auswahlmöglichkeiten sind bewusst die typischen Fehler (umgedrehter Bruch 6/2,
  falsch gezählte Teile).
- **Schach:** Aufbau vom Erkennen der Figuren über ihre Werte und Zugregeln zu
  Feldnamen, Regeln (Schach, Matt, Patt, Rochade, Umwandlung) und erster Taktik
  (Gabel, Matt in einem Zug). 23 der 26 Aufgaben haben ein Brettdiagramm, das
  als SVG gezeichnet wird (`boardSVG()`). Bei den Zugregeln zeigen gelb markierte
  Felder das Bewegungsmuster – das Diagramm erklärt, die Frage prüft nur nach.
- **Aussprache:** Web Speech API. Vorgelesen wird nur das Wort, nicht der
  Beispielsatz. Bei Brüchen wird die Wortform gesprochen („zwei Sechstel").
  **Schach ist stumm** (`mute: true`): dort ist die Aussprache nicht der
  Lernstoff, ein vorgelesenes „e4" bringt nichts. In stummen Fächern
  verschwinden auch die 🔊-Knöpfe in Runde und Übersicht.

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
- `ch` – 3 falsche Auswahlmöglichkeiten (nötig für Brüche und Schach, weil sich
  dort keine sinnvollen Distraktoren aus den anderen Einträgen ziehen lassen)
- `say` – Wortform zum Vorlesen, z. B. `"E vier"` für `e4`
- `short` – Kurzlabel für die Übersicht
- `fig` – Grafik, drei Arten:
  - `{kind:"pie", n:Teile, k:markiert}` – Kuchen
  - `{kind:"bar", n:Teile, k:markiert}` – Balken
  - `{kind:"board", pieces:"Td4 ke8", marks:"e4 f5"}` – Schachbrett
- `exact` – `true` erzwingt exakten Vergleich ohne Tippfehler-Toleranz.
  Pro Fach setzbar (`exact: true` bei Brüche), pro Aufgabe übersteuerbar.

Merkmale, die für ein ganzes Fach gelten, stehen neben `label` und `lang`:

- `unit` / `one` – Mehrzahl und Einzahl der Einträge („Aufgaben" / „Aufgabe").
  Steuert auch die Koffer-Beschriftung auf dem Startbildschirm.
- `exact: true` – exakter Vergleich für alle Aufgaben des Fachs
- `mute: true` – keine Sprachausgabe. `say` bleibt in den Einträgen stehen,
  wird aber nicht verwendet; ein Entfernen von `mute` genügt, um Ton zu bekommen.
- `icon` – Symbol für den Reiter und die Fach-Anzeige in der Runde

### Schachdiagramme

`pieces` ist eine Liste durch Leerzeichen getrennt, ein Eintrag pro Figur:
**Grossbuchstabe = Weiss, Kleinbuchstabe = Schwarz**, dann das Feld.

| Buchstabe | Figur |
|---|---|
| `K` / `k` | König |
| `D` / `d` | Dame |
| `T` / `t` | Turm |
| `L` / `l` | Läufer |
| `S` / `s` | Springer |
| `B` / `b` | Bauer |

`"Te1 kg8 bf7 bg7 bh7"` heisst also: weisser Turm e1, schwarzer König g8,
schwarze Bauern f7, g7, h7. `marks` markiert Felder gelb, gleiches Format ohne
Figurenbuchstaben: `"a8 e8"`.

Gezeichnet wird mit den Unicode-Vollfiguren (♚♛♜♝♞♟) für beide Farben; Weiss
entsteht über Füllung und Kontur. Die Umriss-Zeichen (♔♕…) wären auf hellen
Feldern kaum zu sehen.

Ein neues Fach = ein weiterer Schlüssel in `SUBJECTS`, ein Button im Switcher
(`tabXx`) und eine Zeile bei den Events (`setSubject`).

## Deployen

Push auf `main` → GitHub Pages veröffentlicht automatisch.

**Nach jeder inhaltlichen Änderung `VERSION` in `sw.js` hochzählen.** Ebenso
`APP_VERSION` in `index.html` – die Nummer steht unter „Lernstand sichern" und
zeigt, ob das Gerät wirklich die neue Fassung hat.

Zwei Fallstricke, die im Service Worker bereits behandelt sind – beim Ändern
nicht wieder einbauen:

- **`no-store` beim Abrufen.** GitHub Pages liefert `index.html` mit
  `cache-control: max-age=600`. Ein normales `fetch()` im Worker bekommt
  dadurch bis zu 10 Minuten lang die alte Datei aus dem HTTP-Cache des Browsers
  – und schreibt sie über die frisch vorgeladene.
- **`event.waitUntil()` um jeden Cache-Schreibvorgang.** Ohne das darf der
  Browser den Worker beenden, sobald die Antwort ausgeliefert ist, also mitten
  im Schreiben. Der Cache hinkt dann dauerhaft eine Version hinterher und zeigt
  offline die alten Wörter.

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
