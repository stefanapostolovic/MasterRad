# Jezik specifičan za domen za kreiranje kurikuluma

CurriculumDSL je projekat u kojem će biti razvijen jezik specifičan za domen koji bi omogućavao jednostavno kreiranje skupa kurseva i pritom pružio standardizovan format za njihovo definisanje. Njegov cilj je da osobe koje nisu nužno softverski inženjeri mogu na brz i efikasan način da kreiraju kurseve u edukativne svrhe. Prednost kod korišćenja ovog jezika naspram klasične web aplikacije jeste brzina i jednostavnost kod kreiranja kurseva. Kada korisnik napravi jedan kurs, za svaki naredni će samo morati da izmeni vrednosti na ulazu, što je brže nego odraditi to isto putem korisničkog interfejsa. Pored toga, korisnik može dosta brže da unese više kurseva odjednom. Dodatna mogućnost koju će ovo rešenje da nudi jeste prikaz određenih statističkih podataka nakon završetka kursa, poput: koliko puta je korisnik pokušao neki test, usrednjena uspešnost po pokušajima, koji moduli su korisniku najviše legli, a koji najmanje, i tako dalje.

## Uputstvo za pokretanje
Projekat se može instalirati u virtualno okruženje na sledeći način:

```
git clone https://github.com/stefanapostolovic/MasterRad.git
python -m venv venv
venv\Scripts\activate
pip install -e MasterRad
```
Nakon toga aplikacija se može pokrenuti uz pomoć komande ```crc-run "[putanja do .crc datoteke]"```, ili samo putem komande ```crc-run```, u tom slučaju će se izgenerisati recept na osnovu ugrađenog primera.

Za pokretanje frontend aplikacije, uraditi sledeće:

```
cd MasterRad
cd frontend
npm install
npm start
```
## Koraci u definisanju

* Definisanje osnovnih informacija o kursu - ime kursa, preduslov pohadjanja kursa (da li je prethodno neophodno preći određeni kurs ili modul)
* Lista modula koji pripadaju kursu - Ime modula, tekstualni sadržaj modula, opciono video snimci ili slike kao propratni materijal, preduslov pristupanja modulu (slično kao i kod kursa)
* Testova koje je neophodno uraditi nakon prelaska materijala koji su deo modula, kao i na kraju samog kursa - ime testa, pitanja, uslov da se test smatra položenim (na primer tačnost od 85%)
* Pitanja - tip pitanja (sa ponuđenim odgovorima gde je jedan tačan odgovor, gde ima više tačnih odgovora, pitanja koja kao odgovor imaju ceo ili decimalan broj, pitanja čiji je odgovor tačno/netačno, pitanja slobodnog tipa), tekst pitanja, broj bodova koje pitanje nosi, tačan odgovor/odgovori
* Saveti za bolje savladavanje gradiva, kao i saveti za dalji napredak

## Primer

```
Name: "Kurikulum1"
Courses:
  C:
    Name: "Kurs1"
    Modules:
      M:
        Name: "Modul1"
        Text content: "tekst modula1"
        Images: 
          "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"

          "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM1.jpg"
        Videos:
          "https://www.youtube.com/watch?v=9NYfm2yKVJQ"

          "https://www.youtube.com/watch?v=DEuJ4Xq9UAI"
        Test:
          Name: "ModulTest1"
          Questions:
            Q:
              text: "Modul tekst1"
              type: open_ended
              Answer: - "modul odgovor 1"
              points: 4
          PassCriteria: percentage_required: 85

        Advice: "Advice module 1"
    
    Test:
      Name: "KursTest1"
      Questions:
        Q:
          text: "Kurs tekst1"
          type: single_choice
          Answers:
            - [x] "kurs1 tacan odgovor"
            - [ ] "kurs1 netacan odgovor"
          points: 3
          negativePoints: 1.5
      PassCriteria: number_of_correct_answers_required: 1
    
    Advice: "Advice course 1"

  C:
    Name: "Kurs2"
    Modules:
      M:
        Name: "Modul2"
        Text content: "tekst modula2"
        Images: 
          "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"

          "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM1.jpg"
        Videos:
          "https://www.youtube.com/watch?v=9NYfm2yKVJQ"

          "https://www.youtube.com/watch?v=DEuJ4Xq9UAI"
        Test:
          Name: "ModulTest2"
          Questions:
            Q:
              text: "Modul tekst2"
              type: multiple_choice
              Answers:
                - [x] "kurs2 tacan odgovor1"
                - [x] "kurs2 tacan odgovor2"
                - [ ] "kurs2 netacan odgovor"
              accept_partial_answer
              points: 6.4

            Q:
              text: "Modul tekst3"
              type: true_false
              Answer: true
              points: 10
          PassCriteria: percentage_required: 91

        Advice: "Advice module 2"
        Prerequisites: module: Modul1
    
    Test:
      Name: "KursTest2"
      Questions:
        Q:
          text: "Kurs tekst2"
          type: number
          Answer: 20.0
          points: 7
          negativePoints: 2.1
      PassCriteria: points_required: 4.5
    
    Advice: "Advice course 2"
    Prerequisites: course: Kurs1

```
