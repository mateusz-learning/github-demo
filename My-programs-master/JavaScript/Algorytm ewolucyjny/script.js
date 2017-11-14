window.onload = program;

function program() {
	var obiekt = new LosujOsobnika();
	obiekt.nasluchiwaniePrzyciskow();
	document.getElementById("potwierdz_wspolczynniki").addEventListener("click", function() {
		obiekt.poprawne_dane = obiekt.sprawdzPonowniePola();
		
		if (obiekt.poprawne_dane) {
			obiekt.zmienWidok();
			
			var obliczenia = new Obliczenia();
			obliczenia.wypelnijPopulacje();
			obliczenia.obliczPrzystosowaniePopulacji();
			obliczenia.przebiegEwolucji();
			
			var wykres = new Wykres(obliczenia.kolejne_pokolenia);
		}
	});
}

function Obliczenia() {
	this.populacja = [];
	this.populacja_przystosowanie = [];
	this.wybrana_populacja = [];
	this.nowa_populacja = [];
	this.przystosowanie_populacji = 0;
	this.kolejne_pokolenia = [];
	this.wspolczynnik_mutacji = document.getElementById("wybrany_wspolczynnik_mutacji").value;
	this.wspolczynnik_krzyzowania = document.getElementById("wybrany_wspolczynnik_krzyzowania").value;
	this.liczba_powtorzen = document.getElementById("wybrana_liczba_powtorzen").value;
	this.wylosowana_liczba = 0;
	
	this.przebiegEwolucji = function() {
		this.kolejne_pokolenia.push(this.przystosowanie_populacji);
		var operacja, wylosowany_wspolczynnik, i;
		var licznik = 0;
		
		while (licznik < this.liczba_powtorzen) {
			this.koloRuletki();
			
			for (i=0; i<6; i++) {
				wylosowany_wspolczynnik = Math.random();
				
				if (wylosowany_wspolczynnik < this.wspolczynnik_mutacji) {
					this.mutacjaOsobnika(i, Math.floor(Math.random() * 8));
				}
			}
			
			for (i=0; i<3; i++) {
				wylosowany_wspolczynnik = Math.random();
				
				if (wylosowany_wspolczynnik < this.wspolczynnik_krzyzowania) {
					this.krzyzowanieOsobnikow(i*2, i*2+1, Math.floor(Math.random() * 7 + 1));
				}
			}
			
			this.populacja = this.wybrana_populacja.slice();
			this.obliczPrzystosowaniePopulacji();
			this.kolejne_pokolenia.push(this.przystosowanie_populacji);
			
			licznik += 1;
		}
	}
	
	this.wypelnijPopulacje = function() {
		var osobniki = document.getElementById("populacja").getElementsByTagName("input");
		
		for (var i=0; i<osobniki.length; i++) {
			this.populacja.push(parseInt(osobniki[i].value, 2));
		}
	}
	
	this.obliczPrzystosowaniePopulacji = function() {
		this.przystosowanie_populacji = 0;
		this.populacja_przystosowanie.length = 0;
		var liczba;
		
		for (var i=0; i<this.populacja.length; i++) {
			liczba = this.populacja[i];
			this.populacja_przystosowanie.push(-Math.round(Math.pow(liczba, 2)/60) + 5*liczba + 25);
			this.przystosowanie_populacji += this.populacja_przystosowanie[i];
		}
	}
	
	this.koloRuletki = function() {
		var losowanie, licznik;
		this.obliczPrzystosowaniePopulacji();
		this.wybrana_populacja.length = 0;
		while (this.wybrana_populacja.length != 6) {
			losowanie = Math.floor(Math.random() * this.przystosowanie_populacji) + 1;
			licznik = -1;
			
			while (losowanie > 0) {
				licznik += 1;
				losowanie -= this.populacja_przystosowanie[licznik];
			}
			
			this.wybrana_populacja.push(this.populacja[licznik]);
		}
	}
	
	this.mutacjaOsobnika = function(indeks_osobnika, indeks_mutowanej_wartosci) {
		this.wybrana_populacja[indeks_osobnika] = this.wybrana_populacja[indeks_osobnika] ^ Math.pow(2, indeks_mutowanej_wartosci);
	}
	
	this.krzyzowanieOsobnikow = function(indeks_osobnika_1, indeks_osobnika_2, indeks) {
		var maska_binarna_lewa = 0;
		var maska_binarna_prawa = 0;
		
		for (var i=0; i<indeks; i++) {
			maska_binarna_prawa += 1 << i;
		}
		maska_binarna_lewa = 255 - maska_binarna_prawa;
		
		var lewy_fragment_osobnika_1 = this.wybrana_populacja[indeks_osobnika_1] & maska_binarna_lewa;
		var prawy_fragment_osobnika_1 = this.wybrana_populacja[indeks_osobnika_1] & maska_binarna_prawa;
		var lewy_fragment_osobnika_2 = this.wybrana_populacja[indeks_osobnika_2] & maska_binarna_lewa;
		var prawy_fragment_osobnika_2 = this.wybrana_populacja[indeks_osobnika_2] & maska_binarna_prawa;
		this.wybrana_populacja[indeks_osobnika_1] = lewy_fragment_osobnika_1 + prawy_fragment_osobnika_2;
		this.wybrana_populacja[indeks_osobnika_2] = lewy_fragment_osobnika_2 + prawy_fragment_osobnika_1;
	}
}

function LosujOsobnika() {
	this.poprawne_dane = false;
	
	this.nasluchiwaniePrzyciskow = function() {
		var przyciski_losuj = document.getElementsByTagName("button");
		
		for (var i=0; i<przyciski_losuj.length; i++) {
			if (przyciski_losuj[i].id.indexOf("losowo") > -1) {
				document.getElementById(przyciski_losuj[i].id).addEventListener("click", this.losuj);
			}
		}
		document.getElementById("potwierdz").addEventListener("click", this.potwierdz);
		document.getElementById("zmien").addEventListener("click", this.ponownieWprowadzDane);
		document.getElementById("dalej").addEventListener("click", this.wprowadzWspolczynnikiMutacji);
		document.getElementById("wybrany_wspolczynnik_mutacji").addEventListener("blur", this.sprawdzKonkretnePole);
		document.getElementById("wybrany_wspolczynnik_krzyzowania").addEventListener("blur", this.sprawdzKonkretnePole);
		document.getElementById("wybrana_liczba_powtorzen").addEventListener("blur", this.sprawdzKonkretnePole);
	}
	
	this.losuj = function() {
		if (this.id == "losowo") {
			for (var i=0; i<6; i++) {
				losuj_pole(i+1);
			}
		}
		else if (this.id.indexOf("losowo_") > -1) {
			losuj_pole(this.id[this.id.length-1]);
		}
		
		function losuj_pole(nr_id) {
			var losowa_liczba = "";
			for (var i=0; i<8; i++)
				losowa_liczba += Math.floor(Math.random() * 2);
			
			document.getElementById("osobnik_" + nr_id).value = losowa_liczba;
		}
	}
	
	this.potwierdz = function() {
		var pola_tekstowe = document.getElementById("populacja").getElementsByTagName("input");
		var czy_poprawne_dane = true;
		
		for (var i=0; i<pola_tekstowe.length; i++) {
			for (var j=0; j<pola_tekstowe[i].value.length; j++) {
				if (!(pola_tekstowe[i].value[j] == "0" || pola_tekstowe[i].value[j] == "1")) {
					var do_usuniecia = pola_tekstowe[i].value;
					pola_tekstowe[i].value = do_usuniecia.slice(0, j) + do_usuniecia.slice(j+1, do_usuniecia.length);
					j--;
				}
			}
			
			if (pola_tekstowe[i].value.length == 8) {
				pola_tekstowe[i].className = pola_tekstowe[i].className.replace("niepoprawne_dane", "poprawne_dane");
			}
			else {
				pola_tekstowe[i].className = "niepoprawne_dane";
				czy_poprawne_dane = false;
			}
		}
		
		if (!czy_poprawne_dane)
			return;
		
		for (var i=0; i<pola_tekstowe.length; i++) {
			document.getElementById("osobnik_" + (i+1)).disabled = true;
			document.getElementById("losowo_" + (i+1)).style.display = "none";
		}
		
		document.getElementById("losowo").style.display = "none";
		document.getElementById("potwierdz").style.display = "none";
		document.getElementById("czy_kontynuowac").style.display = "block";
		document.getElementById("zmien").style.display = "inline";
		document.getElementById("dalej").style.display = "inline";
	}
	
	this.ponownieWprowadzDane = function() {
		var pola_tekstowe = document.getElementById("populacja").getElementsByTagName("input");
		
		for (var i=0; i<pola_tekstowe.length; i++) {
			document.getElementById("osobnik_" + (i+1)).disabled = false;
			document.getElementById("losowo_" + (i+1)).style.display = "inline";
		}
		
		document.getElementById("losowo").style.display = "inline";
		document.getElementById("potwierdz").style.display = "block";
		document.getElementById("czy_kontynuowac").style.display = "none";
		document.getElementById("zmien").style.display = "none";
		document.getElementById("dalej").style.display = "none";
	}
	
	this.wprowadzWspolczynnikiMutacji = function() {
		document.getElementById("czy_kontynuowac").style.display = "none";
		document.getElementById("zmien").style.display = "none";
		document.getElementById("dalej").style.display = "none";
		document.getElementById("wspolczynniki").style.display = "inline-block";
	}
	
	this.sprawdzKonkretnePole = function() {
		function sprawdzWartosc(wartosc_pola) {
			wartosc_pola.value = wartosc_pola.value.replace(/,/g, ".");
			wartosc_pola.value = parseFloat(wartosc_pola.value).toFixed(2);
			
			if (wartosc_pola.value == "NaN") {
				document.getElementById(wartosc_pola.id).size = 30;
				document.getElementById(wartosc_pola.id).value = "proszę podać poprawną wartość";
			}
			else {
				if (wartosc_pola.id == "wybrany_wspolczynnik_mutacji" || wartosc_pola.id == "wybrany_wspolczynnik_krzyzowania" ) {
					if (wartosc_pola.value < 0) {
						document.getElementById(wartosc_pola.id).size = 20;
						document.getElementById(wartosc_pola.id).value = 0.00.toFixed(2);
					}
					else if (wartosc_pola.value > 1) {
						document.getElementById(wartosc_pola.id).size = 20;
						document.getElementById(wartosc_pola.id).value = 1.00.toFixed(2);
					}
					else {
						document.getElementById(wartosc_pola.id).size = 20;
					}
				}
				else {
					if (wartosc_pola.value < 10) {
						document.getElementById(wartosc_pola.id).size = 20;
						document.getElementById(wartosc_pola.id).value = 10;
					}
					else if (wartosc_pola.value > 100) {
						document.getElementById(wartosc_pola.id).size = 20;
						document.getElementById(wartosc_pola.id).value = 100;
					}
					else {
						document.getElementById(wartosc_pola.id).size = 20;
						wartosc_pola.value = parseInt(wartosc_pola.value);
					}
				}
			}
		}
		
		sprawdzWartosc(this);
	}
	
	this.sprawdzPonowniePola = function() {
		var czy_poprawne_dane = true;
		var pola_tekstowe = document.getElementById("wspolczynniki").getElementsByTagName("input");
		var wartosc_wspolczynnika_mutacji = document.getElementById("wybrany_wspolczynnik_mutacji").value;
		var wartosc_wspolczynnika_krzyzowania = document.getElementById("wybrany_wspolczynnik_krzyzowania").value;
		var liczba_powtorzen = document.getElementById("wybrana_liczba_powtorzen").value;
		
		if (wartosc_wspolczynnika_mutacji > wartosc_wspolczynnika_krzyzowania && !isNaN(wartosc_wspolczynnika_mutacji)) {
			czy_poprawne_dane = false;
			document.getElementById("wspolczynnik_informacja").style.display = "block";
		}
		else {
			document.getElementById("wspolczynnik_informacja").style.display = "none";
		}
		
		for (var i=0; i<pola_tekstowe.length; i++) {
			if (pola_tekstowe[i].value.length > 4 || pola_tekstowe[i].id.indexOf("wybrany_wspolczynnik") > -1) {
				if (isNaN(pola_tekstowe[i].value)) {
					pola_tekstowe[i].className = "niepoprawne_dane";
					czy_poprawne_dane = false;
				}
				else {
					pola_tekstowe[i].className = pola_tekstowe[i].className.replace("niepoprawne_dane", "poprawne_dane");
				}
			}
			else {
				if (pola_tekstowe[i].value.length > 5 || isNaN(pola_tekstowe[i].value) == true) {
					pola_tekstowe[i].className = "niepoprawne_dane";
					czy_poprawne_dane = false;
				}
				else {
					pola_tekstowe[i].className = pola_tekstowe[i].className.replace("niepoprawne_dane", "poprawne_dane");
				}
			}
		}
		
		return czy_poprawne_dane;
	}
	
	this.zmienWidok = function() {
		document.getElementById("informacje").style.display = "none";
		document.getElementById("potwierdz_wspolczynniki").style.display = "none";
		document.getElementById("wspolczynniki").style.marginTop = "10px";
		document.getElementById("wybrany_wspolczynnik_mutacji").disabled = true;
		document.getElementById("wybrany_wspolczynnik_krzyzowania").disabled = true;
		document.getElementById("wybrana_liczba_powtorzen").disabled = true;
	}
}

function Wykres(wartosci) {
	this.dane_wykresu = wartosci;
	document.getElementById("wykres_kolejnych_populacji").style.border = "1px solid black";
	
	google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);
		function drawChart() {
			var data = google.visualization.arrayToDataTable([
				['Numer', 'Numer populacji; Wartość przystosowania'],
				[1, wartosci[0]]
			]);
			
			for (var i=1; i<wartosci.length; i++) {
				data.addRow([i+1, wartosci[i]]);
			}
			
			var options = {
				title: 'Wykres przystosowania populacji',
				hAxis: {title: 'Pokolenia', minValue: 0, maxValue: 100},
				vAxis: {title: 'Przystosowanie', minValue: 0, maxValue: 2400},
				fontSize: '18',
				legend: 'none',
				pointSize: 2.5
			};
			var chart = new google.visualization.ScatterChart(document.getElementById('wykres_kolejnych_populacji'));
			chart.draw(data, options);
		}
}
