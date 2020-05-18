#
# **Feature**

Login i registracija korisnika

## **Item**

Korisnik ima mogućnost kreiranja korisničkog računa.

### **Task**

- Kreirati izgled prozora za registraciju
- Implementirati validaciju polja forme
- Implementirati slanje podataka iz forme ka serveru
- Kreirati izgled glavnog prozora nakon uspješne registracije
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost da se loguje na aplikaciju (koristeći lozinku).

### **Task**

- Kreirati izgled prozora za login
- Implementirati validaciju polja forme
- Implementirati slanje podataka iz forme ka serveru
- Implementirati ponašanje sistema u slučaju da su podaci odbijeni prilikom logina
- Kreirati izgled glavnog prozora nakon uspješne prijave u aplikaciju
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik ima mogućnost da se loguje koristeći biometriju (otisak prsta ili face recognition u zavisnosti šta telefon podržava).

### **Task**

- Kreirati izgled prozora za login
- Implementirati validaciju biometrije.
- Implementirati slanje podataka iz forme ka serveru
- Implementirati ponašanje sistema u slučaju da su podaci odbijeni prilikom logina
- Kreirati izgled glavnog prozora nakon uspješne prijave u aplikaciju
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik ima mogućnost odjavljivanja sa aplikacije.

### **Task**

- Kreirati izgled i poziciju button-a za odjavu.
- Implementirati povratak podataka na stanje prije login-a.
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik se automatski odjavljuje sa aplikacije prilikom zatvaranja iste radi sprječavanja zloupotrebe.

### **Task**

- Implementirati detektovanje zatvaranja i povratak na podataka na stanje prije login-a.
- Uraditi push koda
- Napraviti pull request

#
# **Feature**

Uređivanje korisničkog računa

## **Item**

Korisnik mora imati mogućnost oporavka lozinke u slučaju da je zaboravio staru lozinku.

### **Task**

- Implementirati prikaza opcije za oporavak lozinke i forme
- Implementirati slanje podataka ka serveru zbog dozvole oporavka
- Implementirati slanje nove lozinke serveru
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost promjene lozinke ukoliko želi, pod uslovom da zna staru.

**Task**

- Implementirati prikaza opcije za promjenu lozinke i forme
- Implementirati slanje podataka ka serveru zbog provjere stare lozinke
- Implementirati slanje nove lozinke serveru
- Uraditi push koda
- Napraviti pull request

#
# **Feature**

Skeniranje QR koda

## **Item**

Korisnik ima mogućnost skeniranja statičkog QR koda.

**Task**

- Implementirati prikaz prostora pregleda kroz kameru.
- Implementirati parsiranje statičkog QR koda
- Implementirati spašavanje podataka računa
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik ima mogućnost skeniranja dinamičkog QR koda.

**Task**

- Implementirati prikaz prostora pregleda kroz kameru.
- Implementirati parsiranje dinamičkog QR koda
- Implementirati spašavanje podataka računa
- Uraditi push koda
- Napraviti pull request

#
# **Feature**

Pregled fiskalnog računa koji se plaća

## **Item**

Korisnik mora imati mogućnost pregleda računa prije plaćanja.

**Task**

- Implementirati prikaz svih bitnih podataka vezanih za račun
- Uraditi push koda
- Napraviti pull request

#
# **Feature**

Menadžment bankovnih računa

## **Item**

Korisnik ima mogućnost pregleda bankovnih računa (jednog ili više).

**Task**

- Implementirati prikaza opcije za pregled bankovnih računa.
- Implementirati dohvatanje podataka sa servera i prikaz bankovnih računa.
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik ima mogućnost dodavanja bankovnog računa (jednog ili više).

**Task**

- Implementirati prikaza opcije za dodavanje računa i forme
- Implementirati validaciju podataka forme.
- Implementirati zahtjev za dodavanje prema serveru sa podacima.
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost brisanja bankovnog računa (jednog ili više)..

**Task**

- Implementirati prikaza opcije za dodavanje računa i forme
- Implementirati validaciju podataka forme.
- Implementirati zahtjev za brisanje prema serveru sa podacima.
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik prima obavještenje ukoliko dodani bankovni račun nije validan.

**Task**

- Implementirati zahtjev prema serveru za provjeru bankovnog računa.
- Implementirati prikaz obavještenja u slučaju promašaja.
- Uraditi push koda
- Napraviti pull request

#
# **Feature**

Plaćanje

## **Item**

Korisnik mora biti obaviješten ukoliko vrši plaćanje bez dodanog bankovnog računa.

**Task**

- Implementirati detekciju da nije dodan račun pri plaćanju
- Implementirati prikaz obavijesti
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost odabira bankovnog računa sa kojeg želi platiti ukoliko ih ima više.

**Task**

- Implementirati dobavljanje računa sa servera
- Implementirati prikaz računa i opcije odabira
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik prima obavještenje u slučaju da transakciju nije moguće izvršiti iz različitih razloga (npr nedovoljno novca na računu).

**Task**

- Implementirati provjeru stanja računa i ostalog
- Implementirati obustavu plaćanja i prikaz obavijesti
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik treba imati sigurnu transakciju.

**Task**

- Provjeriti da se podaci jedino spašavaju na serveru
- Provjeriti da korisnik samo može prebaciti određen iznos i da je to zabilježeno
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost transfera novca preko QR koda na račun drugog korisnika.

**Task**

- Implementirati skeniranje QR koda
- Implementirati upućivanje zahtjeva za transfer ka serveru
- Implementirati prikaz obavijesti
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost unosa iznosa novca koji mu je potrebno prebaciti na račun (dinamički QR kod).

**Task**

- Implementirati skeniranje dinamičkog QR koda
- Implementirati upućivanje zahtjeva za transfer ka serveru
- Implementirati prikaz obavijesti
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost prikaza QR koda ukoliko osoba koja prebacuje novac želi specificirati iznos (statički QR kod).

**Task**

- Implementirati prikaz statičkog koda
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost odabira računa za priliv novca.

**Task**

- Implementirati prikaz picker-a za račune
- Implementirati slanje pdoataka sljedećem modulu
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost odabira računa za odliv novca.

**Task**

- Implementirati prikaz picker-a za račune
- Implementirati slanje pdoataka sljedećem modulu
- Uraditi push koda
- Napraviti pull request

#
# **Feature**

Pregled osnovnih info o transakcijama i računu

## **Item**

Korisnik mora imati mogućnost sortiranja transakcija, i to:

1. po bankovnim računima
2. po predefinisanom vremenskom periodu
3. po merchantima (koliko je potrošio u Bingu, koliko u nekoj knjižari, koliko u restoranu…)

**Task**

- Implementirati prikaz svih transakcija
- Implementirati dobavljane podataka sa servera
- Implementirati prikaz opcije sortiranja
- Implementirati funkcionalnost sortiranja
- Uraditi push koda
- Napraviti pull request

## **Item**

Korisnik mora imati mogućnost filtriranja transakcija, i to:

1. po bankovnim računima
2. po predefinisanom vremenskom periodu
3. po merchantima (koliko je potrošio u Bingu, koliko u nekoj knjižari, koliko u restoranu…)

**Task**

- Implementirati prikaz opcije filtriranja
- Implementirati funkcionalnost filtriranja
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost pregleda transakcija slanja novca.

**Task**

- Implementirati dobavljanje podataka transakcija sa servera
- Implementirati odabir vrste transakcija slanja novca
- Implementirati prikaz transakcija
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost primanja push-notifikacije u slučaju neuspješne transakcije novca (plaćanja).

**Task**

- Implementirati prikaz notifikacija u tabu
- Implementirati detekciju tog slučaja
- Implementirati da se klikom na notifkaciju prikažu transakcije
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost primanja push-notifikacije prilikom uspješnog transfera novca. (slanje i primanje novca)

**Task**

- Implementirati prikaz notifikacija u tabu
- Implementirati detekciju tog slučaja
- Implementirati da se klikom na notifkaciju prikažu transakcije
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost primanja push-notifikacije prilikom neuspješnog transfera novca.

**Task**

- Implementirati prikaz notifikacija u tabu
- Implementirati detekciju tog slučaja
- Implementirati da se klikom na notifkaciju prikažu transferi
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost primanja push-notifikacije u slučaju da izvršim transakciju iznad 500 KM (upozorenje).

**Task**

- Implementirati prikaz notifikacija u tabu
- Implementirati detekciju tog slučaja
- Implementirati da se klikom na notifkaciju prikažu transakcije
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost primanja push-notifikacije u slučaju da je dostignut neki limit mjesečnih troškova (npr iznad 1000 KM -upozorenje).

**Task**

- Implementirati prikaz notifikacija u tabu
- Implementirati detekciju tog slučaja
- Implementirati da se klikom na notifkaciju prikažu transakcije
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost primanja push-notifikacije u slučaju da izvršim plaćanje nakon kojeg će na mom računu ostati 5 ili manje KM (upozorenje).

**Task**

- Implementirati prikaz notifikacija u tabu
- Implementirati detekciju tog slučaja
- Implementirati da se klikom na notifkaciju prikažu transakcije
- Uraditi push koda
- Napraviti pull request

## **Item**

Kao korisnik želim imati mogućnost promjene &#39;uslova&#39; pod kojim će mi doći notifikacija za account balance (ako pređem određeni iznos novca prilikom jedne transakcije, mjesečni limit i ako količina novca na mom računu nakon određene transakcije iznosi manje od željene kolčine novca).

**Task**

- Implementirati prikaza uslova
- Implementirati slanje podataka ka modulima koji
- Uraditi push koda
- Napraviti pull request
