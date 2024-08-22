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
cd curriculum-management
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
    Name: "Projektovanje softvera"
    Description: 
    "Projektovanje softvera (PSW) je kurs na 4. godini studijskog programa Računarstva i automatike. Cilj predmeta je da upozna studenta sa aktivnostima i izazovima koji postoje u okviru razrađenog procesa razvoja složenog softverskog sistema u velikom timu."

    Modules:
      M:
        Name: "Agilno planiranje i razvoj softvera"
        Description: 
        "Cilj: Kako isplanirati i organizovati posao je ključni element svakog rada, bez obzira na projekat i industriju. Sa malo planiranja, razvojni timovi troše vreme razvijajući funkcionalnosti koje ne donose vrednost po cenu bitnih elemenata softvera koje ne stižu da naprave. Sa previše planiranja, timovi konstruišu detaljne planove koji se gotovo uvek bacaju i izbegavaju da se prilagode novim informacijama i okolnostima. Kako bi izbegli ove probleme i pronašli tu zlatnu sredinu, učićemo kako da agilno planiramo i razvijamo naša softverska rešenja. Do kraja ove lekcije ćeš upoznati sve strategije i tehnike koje su ti potrebne da kreneš efikasno planiranje i organizaciju razvoja projektnog zadatka."

        Text content: 
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam diam libero, posuere et vulputate vel, finibus a erat. Aliquam erat volutpat. Morbi eget erat et lacus efficitur porta non et nulla. Ut at tortor in tortor ornare pellentesque. Donec non lectus ac nisi volutpat lacinia sit amet malesuada turpis. Nunc gravida accumsan ligula, nec dictum ex tincidunt vitae. Donec molestie quam vel sagittis rhoncus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lacinia non eros non consequat. Fusce dignissim diam lobortis lacus dictum lacinia. Fusce ac fringilla enim, vel pharetra augue. In ac urna placerat, ullamcorper lacus vitae, interdum nunc. Nam consequat, neque vitae pulvinar pulvinar, nisi odio scelerisque enim, sed sollicitudin lectus eros lacinia augue.

        Quisque vehicula rhoncus consequat. Suspendisse feugiat in urna eu commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum dignissim mauris et augue rutrum dictum. Sed ornare ex et ipsum viverra sagittis. Nunc euismod bibendum mi, nec vestibulum ligula viverra sed. Nullam suscipit, ipsum non venenatis vehicula, lectus ante maximus ante, eu dignissim lacus lorem quis diam. Phasellus interdum neque lacinia tortor accumsan fringilla. Phasellus faucibus sodales malesuada. Pellentesque porttitor porttitor consectetur. Cras convallis velit vel urna finibus, vitae blandit sapien hendrerit. Cras varius, mauris at cursus fringilla, mi sapien tristique est, in convallis risus metus vel lacus. Nullam quis mollis tortor. Ut eget eros libero"

        Images: 
          Url: "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"
          Description: "Opis slike 1"

          Url: "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"
          Description: "Opis slike 2"

        Videos:
          Url: "https://www.youtube.com/watch?v=9NYfm2yKVJQ"
          Description: "Opis videa 1"

          Url: "https://www.youtube.com/watch?v=DEuJ4Xq9UAI"
          Description: "Opis videa 2"

        Test:
          Name: "Kurs1 Modul1 Test"
          Questions:
            Q:
              text: "Modul tekst1"
              type: open_ended
              Answer: - "modul odgovor 1"
              points: 4
          PassCriteria: percentage_required: 85

        Advice: "Advice module 1"
      M:
        Name: "Dizajn vođen domenom - Taktike"
        Description: 
        "Cilj: Domain-Driven Design is just object-oriented design done right.

        Dizajn softvera koji je vođen biznis domenom nam pomaže da proizvedemo moćno rešenje. Takvo rešenje: (1) ispunjava trenutne zahteve biznisa, (2) sadrži potencijal da jednostavno podrži nove zahteve i (3) proizvedi neočekivanu vrednost našim klijentima.

        Da bismo gradili softver po DDD-u, neophodno je da imamo relativno snažno poznavanje principa čistog koda i prakse inženjeringa zahteva. Nad tim temeljem dodajemo niz takozvanih strateških i taktičkih šablona koje definiše oblast DDD-a. Strateški šabloni su bliži praksi inženjeringa zahteva i arhitekture softverskog rešenja. Taktički šabloni su bliži kodu i bave se dizajnom klasa i njihovih relacija. U sklopu ove lekcije ćemo da načnemo strateške šablone, no glavni fokus će nam biti na taktičkim šablonima."

        Text content: 
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam diam libero, posuere et vulputate vel, finibus a erat. Aliquam erat volutpat. Morbi eget erat et lacus efficitur porta non et nulla. Ut at tortor in tortor ornare pellentesque. Donec non lectus ac nisi volutpat lacinia sit amet malesuada turpis. Nunc gravida accumsan ligula, nec dictum ex tincidunt vitae. Donec molestie quam vel sagittis rhoncus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lacinia non eros non consequat. Fusce dignissim diam lobortis lacus dictum lacinia. Fusce ac fringilla enim, vel pharetra augue. In ac urna placerat, ullamcorper lacus vitae, interdum nunc. Nam consequat, neque vitae pulvinar pulvinar, nisi odio scelerisque enim, sed sollicitudin lectus eros lacinia augue.

        Quisque vehicula rhoncus consequat. Suspendisse feugiat in urna eu commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum dignissim mauris et augue rutrum dictum. Sed ornare ex et ipsum viverra sagittis. Nunc euismod bibendum mi, nec vestibulum ligula viverra sed. Nullam suscipit, ipsum non venenatis vehicula, lectus ante maximus ante, eu dignissim lacus lorem quis diam. Phasellus interdum neque lacinia tortor accumsan fringilla. Phasellus faucibus sodales malesuada. Pellentesque porttitor porttitor consectetur. Cras convallis velit vel urna finibus, vitae blandit sapien hendrerit. Cras varius, mauris at cursus fringilla, mi sapien tristique est, in convallis risus metus vel lacus. Nullam quis mollis tortor. Ut eget eros libero"

        Images: 
          Url: "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"
          Description: "Opis slike 1"

          Url: "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"
          Description: "Opis slike 2"

        Videos:
          Url: "https://www.youtube.com/watch?v=9NYfm2yKVJQ"
          Description: "Opis videa 1"

          Url: "https://www.youtube.com/watch?v=DEuJ4Xq9UAI"
          Description: "Opis videa 2"

        Test:
          Name: "Kurs1 Modul2 Test"
          Questions:
            Q:
              text: "Kurs 1 Modul 1 tekst"
              type: open_ended
              Answer: - "Kurs 1 modul 1 odgovor"
              points: 6
            Q:
              text: "Kurs 1 Modul 2 tekst"
              type: single_choice
              Answers:
                - [x] "kurs1 modul2 tacan odgovor"
                - [ ] "kurs1 modul2 netacan odgovor"
          points: 3
          negativePoints: 1.5
          PassCriteria: percentage_required: 20

        Advice: "Advice module 2"
        Prerequisites: module: "Agilno planiranje i razvoj softvera"
    
    Test:
      Name: "KursTest1"
      Questions:
        Q:
          text: "Kurs 1 pitanje 1"
          type: single_choice
          Answers:
            - [x] "kurs1 tacan odgovor"
            - [ ] "kurs1 netacan odgovor"
          points: 3
          negativePoints: 1.5
        Q:
          text: "Modul tekst1"
          type: open_ended
          Answer: - "modul odgovor 1"
          points: 4
        Q:
          text: "Modul tekst2"
          type: multiple_choice
          Answers:
            - [x] "kurs2 tacan odgovor1"
            - [ ] "kurs2 netacan odgovor1"
            - [x] "kurs2 tacan odgovor2"
            - [ ] "kurs2 netacan odgovor2"
          accept_partial_answer
          points: 6.4
          negativePoints: 1
        Q:
          text: "Modul tekst3"
          type: true_false
          Answer: true
          points: 10
        Q:
          text: "Kurs tekst2"
          type: number
          Answer: 20.0
          points: 7
          negativePoints: 2.1
      PassCriteria: number_of_correct_answers_required: 1
    
    Advice: "Advice course 1"

  C:
    Name: "XML i veb servisi"
    Description: 
    "XML i veb servisi je kurs na 4. godini studijskih programa Računarstvo i automatika i Informacioni inženjering. Cilj predmeta je da upozna studente sa konceptima servisno orijentisanih arhitektura, sa akcentom na mikroservisnoj arhitekturi."

    Modules:
      M:
        Name: "Razvoj vođen testovima"
        Description: 
        "Cilj: Do sada smo koristili primere zgrade ili automobila kao anaologiju za softver, sa idejom da želimo da napravimo stabilnu zgradu koja se neće urušiti. Novija literatura, poput Pragmatičnog Programera ili Growing Object-Oriented Software, Guided by Tests koristi primer bašte ili biljke kao analogiju za softver. Ideja je da želimo da negujemo i pospešujemo razvoj našeg rešenja kao što bismo želeli da negujemo baštu koju nam donosi plodove, odnosno korist kroz godine ili decenije.U sklopu ove lekcije učimo kako da pišemo automatske testove koji će pomoći našim softverskim sistemima da rastu i razvijaju se u stabilna i složena rešenja. Videćemo kako se pravi kvalitetan automatski test i na kraju ćemo naučiti kako da integrišemo pisanje testova u razvoj softvera prateći test-driven development (TDD) metodologiju."

        Text content: 
        "Donec commodo risus vitae risus rhoncus, eget bibendum augue blandit. Phasellus lobortis felis et lorem sodales, sit amet maximus arcu elementum. Fusce non felis augue. Aenean euismod eget tortor eu fermentum. Fusce quis consequat lorem, a iaculis ligula. Nulla facilisi. Proin suscipit purus id lorem tincidunt consectetur. Suspendisse potenti. Proin ut pharetra orci, in rutrum mauris. Proin ut sem sit amet purus iaculis imperdiet ac non libero.

        Vivamus faucibus velit sit amet leo bibendum sagittis. Proin urna turpis, facilisis ut leo sit amet, consequat dapibus erat. Proin at mauris lacus. Morbi efficitur elit vel posuere molestie. Fusce dictum a velit eget dapibus. Pellentesque porttitor condimentum odio. Integer faucibus nisi ex, pellentesque maximus ligula malesuada ac. Donec at lacinia lacus, ut porta elit. In sapien arcu, bibendum id suscipit quis, commodo at arcu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis id mattis sapien. Phasellus a lorem neque. Nullam faucibus fringilla massa, nec finibus lectus consectetur eu. Fusce laoreet blandit augue ac vulputate. Vestibulum eget purus feugiat eros lacinia accumsan. Curabitur sollicitudin bibendum risus, nec gravida quam pharetra eu."

        Images: 
          Url: "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"
          Description: "Opis slike 1"

          Url: "https://marketplace.canva.com/EAFNsV8XtFc/1/0/1067w/canva-white-modern-recipe-card-g0ij-n11PwM.jpg"
          Description: "Opis slike 2"

        Videos:
          Url: "https://www.youtube.com/watch?v=9NYfm2yKVJQ"
          Description: "Opis videa 1"

          Url: "https://www.youtube.com/watch?v=DEuJ4Xq9UAI"
          Description: "Opis videa 2"
          
        Test:
          Name: "Kurs 2 Modul1 Test"
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
              negativePoints: 1

            Q:
              text: "Modul tekst3"
              type: true_false
              Answer: true
              points: 10
          PassCriteria: percentage_required: 91

        Advice: "Advice module 2"
        Prerequisites: module: "Agilno planiranje i razvoj softvera"
    
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
    Prerequisites: course: "Projektovanje softvera"
```
