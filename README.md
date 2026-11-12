# 🪙 Coin Hunters — AI Game Lab

**Przeglądarkowa gra 2D tworzona podczas zdalnych warsztatów programowania dla dzieci w wieku około 11 lat.**

Coin Hunters to projekt edukacyjny, w którym uczestnicy **projektują, uruchamiają, testują i rozwijają własną grę**, a następnie wspólnie grają online. Kurs łączy doświadczenie wyniesione ze **Scratcha i Tynkera**, podstawy JavaScriptu oraz świadome korzystanie ze sztucznej inteligencji (*vibe coding*).

> **Najważniejsza zasada:** AI pomaga tworzyć kod, ale to dzieci decydują, jak ma działać gra, testują efekty i uczą się rozumieć wprowadzane zmiany.

## 🎮 Gra — pomysł i zasady

Gracze poruszają się po dwuwymiarowej planszy z widokiem z góry, zbierają monety i rywalizują o punkty. Rozgrywka ma być prosta do zrozumienia, dynamiczna i łatwa do rozbudowywania.

**Podstawowa wersja (MVP):**
- Sterowanie postacią klawiszami **WASD** lub **strzałkami**.
- Plansza z przeszkodami i obsługą kolizji.
- Monety pojawiające się na planszy i zwiększające wynik.
- Licznik czasu, koniec rundy i ekran rezultatów.
- Możliwość restartu i rozegrania kolejnej rundy.

**Pomysły na rozwój:**
- Różne rodzaje monet, skrzynie skarbów i ukryte przejścia.
- Bonusy: przyspieszenie, tarcza, magnes na monety.
- Pułapki, ruchome przeszkody i własne mapy.
- Personalizowane kolory lub wygląd postaci.
- Tryby gry: zbieranie skarbów, berek, drużyny, przetrwanie.
- **Multiplayer online:** prywatne pokoje z kodem, 2–8 graczy, wspólna punktacja i rewanże.

> Lista pomysłów jest inspiracją, nie sztywną specyfikacją. Uczestnicy współdecydują o rozwoju gry.

## 🎯 Cele edukacyjne

Kurs jest skierowany do osób, które poznały już proste reguły i zdarzenia w Scratchu lub Tynkerze, ale **nie muszą znać JavaScriptu**.

Po kursie uczestnik powinien potrafić:
1. Wyjaśnić, czym różnią się **HTML**, **CSS** i **JavaScript**.
2. Rozpoznać podstawowe elementy kodu: **zmienne, warunki, funkcje, zdarzenia, pętle**.
3. Samodzielnie zmienić prosty fragment logiki gry i sprawdzić rezultat.
4. Podzielić pomysł na małe zadania i opisać oczekiwane zachowanie.
5. Przygotować zrozumiałą prośbę do AI oraz ocenić, czy wynik działa prawidłowo.
6. Znaleźć prosty błąd, użyć konsoli przeglądarki i przetestować poprawkę.
7. Zrozumieć podstawową ideę multiplayera: **przeglądarka ↔ serwer ↔ inni gracze**.
8. Współpracować przy rozwijaniu wspólnego projektu i szanować pomysły innych.

**Metoda:** krótkie wprowadzenie → małe zadanie → próba z AI → test → wyjaśnienie kodu → wspólna zabawa. Nie uczymy się przez bezrefleksyjne kopiowanie długich skryptów.

### Współpraca na Padlecie

Na wspólnej tablicy uczestnicy mogą zgłaszać pomysły na monety, plansze i zasady gry oraz rozwijać propozycje innych. Na zajęciach wspólnie wybieramy pomysł, który chcemy przetestować w grze. [Coin Hunters – pomysły na Padlecie](https://padlet.com/kubaru/coin-hunters-pomys-y-s025e4e6b6zduw05o01g)

## 📅 Ramowy plan: 10 zajęć po 60–90 minut

| Zajęcia | Temat | Efekt widoczny dla dziecka |
| --- | --- | --- |
| 1 | Poznajemy projekt, HTML i JavaScript; pierwsze uruchomienie | Postać na planszy i podstawowe sterowanie |
| 2 | Zmienne, współrzędne i zdarzenia klawiatury | Zmiana szybkości i wyglądu postaci |
| 3 | Warunki, kolizje, monety i punktacja | Można zbierać skarby i zdobywać punkty |
| 4 | Funkcje, czas rundy i ekran wyniku | Pierwsza pełna gra jednoosobowa |
| 5 | Vibe coding: pomysł → prompt → zmiana → test | Własny bonus lub przeszkoda |
| 6 | Debugowanie i bezpieczne eksperymenty | Samodzielne poprawianie błędów i cofanie zmian |
| 7 | Czym jest serwer? Wprowadzenie do multiplayera | Dwóch graczy widzi się w jednym pokoju |
| 8 | Synchronizacja gry i uczciwa punktacja | Wspólne monety, wyniki i proste zasady sieciowe |
| 9 | Projektowanie nowych map i testy zespołowe | Wspólna wersja gry gotowa do turnieju |
| 10 | Publikacja, prezentacja pomysłów i turniej | Rozgrywka online z całą grupą |

Plan jest elastyczny: część sieciowa jest bardziej wymagająca, więc **prowadzący przygotowuje wcześniej działający szkielet serwera i komunikacji**, a uczestnicy rozwijają zrozumiałe fragmenty gry. Jeśli grupa potrzebuje więcej czasu, priorytetem pozostaje grywalna wersja lokalna.

## 🧰 Stack techniczny

| Obszar | Technologia | Dlaczego? |
| --- | --- | --- |
| Struktura i wygląd | **HTML5 + CSS** | Podstawy tworzenia stron, łatwo zobaczyć rezultat |
| Logika gry | **JavaScript** | Działa w przeglądarce, czytelny na poziomie prostych zadań |
| Grafika 2D | **Canvas 2D** | Bez zewnętrznego silnika na starcie |
| Edytor | **Visual Studio Code** | Dostępny na laptopach uczestników |
| Kod źródłowy | **Git + GitHub** | Wersjonowanie przez prowadzącego; kopie lokalne dla dzieci |
| Hosting wersji przeglądarkowej | **GitHub Pages** | Prosta publikacja statycznych plików przez HTTPS |
| Multiplayer — etap późniejszy | **Node.js + Socket.IO (WebSocket)** | Wspólne pokoje, synchronizacja i zasady gry |
| Hosting backendu — etap późniejszy | Usługa obsługująca stale działający proces Node.js i WebSockety | Serwer gry dostępny dla uczestników przez internet |

**Wersja startowa nie wymaga** konta GitHub dziecka, StackBlitz, Node.js ani instalowania pakietów. Można ją uruchomić lokalnie, otwierając `index.html` w przeglądarce. Jeśli później pojawią się moduły ES, pobieranie plików przez `fetch()` lub inne funkcje ograniczane dla `file://`, skorzystamy z lokalnego serwera HTTP (np. Live Server w VS Code).

**Ważne:** GitHub Pages hostuje tylko frontend (HTML, CSS, JavaScript, grafiki). **Nie uruchamia backendu multiplayer**. Serwer Node.js będzie wdrożony oddzielnie, a przeglądarki połączą się z nim przez bezpieczne **WSS**.

### Planowana struktura projektu

Na początku celowo utrzymujemy wszystko w **jednym pliku**:

```text
coin-hunters/
├── index.html
└── README.md
```

Dopiero gdy gra urośnie, rozdzielimy kod:

```text
coin-hunters/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── game.js          # pętla gry i sterowanie
│   ├── rules.js         # zasady, punkty i bonusy
│   └── multiplayer.js   # klient sieciowy — później
├── assets/
├── server/              # backend Node.js — później
└── README.md
```

W multiplayerze **serwer rozstrzyga o zbieraniu monet i punktacji**, a przeglądarki pokazują stan gry i wysyłają akcje graczy. To ogranicza rozbieżności i nadużycia.

## 🚀 Uruchomienie i publikacja

### Dla uczestnika — praca lokalna

1. Pobierz paczkę ZIP z wersją startową przygotowaną przez prowadzącego.
2. Rozpakuj ją do własnego folderu na laptopie.
3. Otwórz `index.html` w Chrome lub Edge.
4. Otwórz ten sam plik w VS Code, zmień drobny element i zapisz (`Ctrl+S`).
5. Odśwież stronę (`F5`) i sprawdź efekt.

Każde dziecko ma **własną kopię projektu**, dlatego może eksperymentować bez psucia gry innych osób. Przed większą zmianą warto skopiować działający plik jako wersję zapasową.

### Wersja pokazowa online

**Gra:** https://kubaru555.github.io/coin-hunters/

**Kod źródłowy:** https://github.com/kubaru555/coin-hunters

Publikacja: **GitHub → Settings → Pages → Deploy from a branch → `master` / `(root)`**.

Aktualnie publiczny link służy do oglądania i testowania opublikowanej wersji. **Nie oznacza, że każde dziecko edytuje własny kod online** — do tego używa lokalnej kopii. Kiedy dodamy multiplayer, wszyscy będą mogli dołączyć do jednego serwera poprzez opublikowaną wersję gry.

## 🤖 AI i vibe coding — jak używamy

Wykorzystujemy AI jako **asystenta projektowania, programowania i debugowania**, a nie automat wykonujący całą pracę zamiast uczestników.

### Cykl pracy z AI

1. **Wymyśl:** co konkretnie ma się zmienić w grze?
2. **Opisz:** kiedy nowa funkcja działa i jaki ma dać efekt?
3. **Poproś o małą zmianę:** najlepiej jedną funkcję na raz.
4. **Uruchom i przetestuj:** czy zachowanie jest zgodne z pomysłem?
5. **Zrozum:** które linie odpowiadają za nową mechanikę?
6. **Popraw:** samodzielnie zmień parametr lub poproś o wyjaśnienie błędu.

**Przykładowy prompt dziecka:**

> W grze Coin Hunters dodaj czerwoną monetę. Po jej zebraniu postać ma poruszać się dwa razy szybciej przez 5 sekund. Nie zmieniaj pozostałych zasad. Pokaż tylko potrzebne zmiany i wyjaśnij prostymi słowami, za co odpowiadają.

**Przykładowy prompt debugujący:**

> Po zebraniu czerwonej monety postać przyspiesza, ale już nie zwalnia. Znajdź możliwą przyczynę, zaproponuj małą poprawkę i powiedz, jak ją przetestować.

### AI a wiek uczestników

Uczestnicy mają około **11 lat**, dlatego:

- Nie wymagamy od nich samodzielnego zakładania kont w usługach AI lub serwisach programistycznych z wyższym minimalnym wiekiem.
- **Interakcję z ChatGPT prowadzi osoba dorosła**, np. przez udostępnianie ekranu i wspólne formułowanie promptów. Nie zakładamy indywidualnych kont ChatGPT dla dzieci.
- Prowadzący weryfikuje wygenerowane zmiany przed użyciem we wspólnej wersji i tłumaczy ich działanie.
- Nie podajemy AI imion i nazwisk dzieci, danych kontaktowych, haseł ani innych informacji prywatnych.
- Nie kopiujemy bez sprawdzania całych, niezrozumiałych projektów ani kodu uruchamiającego nieznane polecenia.
- AI może się mylić — **działający test jest ważniejszy niż pewnie brzmiąca odpowiedź**.

Przy doborze konkretnego narzędzia zawsze sprawdzamy jego aktualne warunki użytkowania i wymagania wiekowe.

## 🔒 Bezpieczeństwo gry online

Projekt zakłada środowisko odpowiednie dla dzieci:
- Prywatne pokoje z krótkimi kodami i możliwością usunięcia uczestnika przez prowadzącego.
- Nicki zamiast prawdziwych nazwisk; bez otwartego czatu na początek.
- Brak publicznej tabeli zawierającej dane osobowe uczestników.
- Walidacja danych z przeglądarek po stronie serwera, ograniczenie częstotliwości wiadomości i limit graczy w pokoju.
- Wspólna gra wyłącznie podczas kontrolowanych sesji na pierwszym etapie.
- Przed publicznym udostępnieniem multiplayera: testy bezpieczeństwa, zasady moderacji i podstawowa polityka retencji ewentualnych danych.

## 🗺️ Etapy rozwoju

- [x] Założenie publicznego repozytorium i konfiguracja GitHub Pages.
- [ ] **v0.1:** plansza, ruch postaci i monety.
- [ ] **v0.2:** kolizje, czas rundy i punktacja.
- [ ] **v0.3:** bonusy, mapy i proste rozszerzenia tworzone przez dzieci.
- [ ] **v0.4:** wspólny serwer i prywatne pokoje multiplayer.
- [ ] **v1.0:** turniej online i publikacja wspólnej gry.

## 👩‍🏫 Dla prowadzącego

Przed każdą lekcją przygotuj:
- Jedną **działającą wersję startową** i prosty sposób jej przywrócenia.
- Jedno główne zadanie i opcjonalne rozszerzenie dla szybszych uczestników.
- Krótki pokaz pojęcia programistycznego, które stoi za daną funkcją.
- Gotowe przykłady dobrego promptu i błędu do wspólnego rozwiązania.
- Czas na uruchomienie, prezentację efektów i przetestowanie pomysłów grupy.

**Kryterium sukcesu:** każde dziecko może powiedzieć: *„To ja wymyśliłem tę funkcję, wiem mniej więcej, jak działa, i potrafię ją zmienić”.*

---

**Status:** projekt edukacyjny w budowie. Najpierw powstaje grywalna wersja jednoosobowa, później multiplayer. Dokument będzie aktualizowany wraz z postępem kursu.
