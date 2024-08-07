# Jezik specifičan za domen za kreiranje kurikuluma

CurriculumDSL je projekat u kojem će biti razvijen jezik specifičan za domen koji bi omogućavao jednostavno kreiranje skupa kurseva i pritom pružio standardizovan format za njihovo definisanje. Njegov cilj je da osobe koje nisu nužno softverski inženjeri mogu na brz i efikasan način da kreiraju kurseve u edukativne svrhe. Prednost kod korišćenja ovog jezika naspram klasične web aplikacije jeste brzina i jednostavnost kod kreiranja kurseva. Kada korisnik napravi jedan kurs, za svaki naredni će samo morati da izmeni vrednosti na ulazu, što je brže nego odraditi to isto putem korisničkog interfejsa. Pored toga, korisnik može dosta brže da unese više kurseva odjednom. Dodatna mogućnost koju će ovo rešenje da nudi jeste prikaz određenih statističkih podataka nakon završetka kursa, poput: koliko puta je korisnik pokušao neki test, usrednjena uspešnost po pokušajima, koji moduli su korisniku najviše legli, a koji najmanje, i tako dalje.

## Uputstvo za pokretanje

## Koraci u definisanju

* Definisanje osnovnih informacija o kursu - ime kursa, preduslov pohadjanja kursa (da li je prethodno neophodno preći određeni kurs ili modul)
* Lista modula koji pripadaju kursu - Ime modula, tekstualni sadržaj modula, opciono video snimci ili slike kao propratni materijal, preduslov pristupanja modulu (slično kao i kod kursa)
* Testova koje je neophodno uraditi nakon prelaska materijala koji su deo modula, kao i na kraju samog kursa - ime testa, pitanja, uslov da se test smatra položenim (na primer tačnost od 85%)
* Pitanja - tip pitanja (sa ponuđenim odgovorima gde je jedan tačan odgovor, gde ima više tačnih odgovora, pitanja koja kao odgovor imaju ceo ili decimalan broj, pitanja čiji je odgovor tačno/netačno, pitanja slobodnog tipa), tekst pitanja, broj bodova koje pitanje nosi, tačan odgovor/odgovori
* Saveti za bolje savladavanje gradiva, kao i saveti za dalji napredak

## Primer
