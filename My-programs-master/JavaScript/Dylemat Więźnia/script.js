window.onload = main;

function main() {
	var gracz = new Zawodnik();
	var komputer = new Przeciwnik("losowo");
	var gra = new Gra(10);

	$(document).ready(function(){
		$("#zasady").click(function(){
			$("#zasady_tekst").toggle();
		});

		$("#wspolpraca").click(function(){
			console.log(gracz.numer_rundy);
			gracz.decyzja = "wspolpraca";
			komputer.podejmijDecyzje();
			gracz.porownaj(gracz, komputer);
			$("#gracz_decyzja").text(gracz.decyzja);
			$("#komputer_decyzja").text(komputer.decyzja);
			$("#gracz_wynik").text(gracz.punkty_biezaca_runda);
			$("#komputer_wynik").text(komputer.punkty_biezaca_runda);
			$("#suma_punktow_gracza").text(gracz.punkty);
			$("#suma_punktow_komputera").text(komputer.punkty);
			$("#kolejne_rundy").append("<tr><td>" + gracz.numer_rundy + "</td><td>" + gracz.decyzja +"</td><td>" + gracz.punkty_biezaca_runda + "</td><td>" + gracz.numer_rundy + "</td><td>" + komputer.decyzja + "</td><td>" + komputer.punkty_biezaca_runda + "</td></tr>");
			$(".numer_rundy").text(gracz.numer_rundy++);
		});

		$("#zdrada").click(function(){
			gracz.decyzja = "zdrada";
			komputer.podejmijDecyzje();
			gracz.porownaj(gracz, komputer);
			$("#gracz_decyzja").text(gracz.decyzja);
			$("#komputer_decyzja").text(komputer.decyzja);
			$("#gracz_wynik").text(gracz.punkty_biezaca_runda);
			$("#komputer_wynik").text(komputer.punkty_biezaca_runda);
			$("#suma_punktow_gracza").text(gracz.punkty);
			$("#suma_punktow_komputera").text(komputer.punkty);
			$("#kolejne_rundy").append("<tr><td>" + gracz.numer_rundy + "</td><td>" + gracz.decyzja +"</td><td>" + gracz.punkty_biezaca_runda + "</td><td>" + gracz.numer_rundy + "</td><td>" + komputer.decyzja + "</td><td>" + komputer.punkty_biezaca_runda + "</td></tr>");
			$(".numer_rundy").text(gracz.numer_rundy++);
			
		});
	});
}

function Gra(liczba_rund) {
	this.liczba_rund = liczba_rund;
}

function Zawodnik() {
	this.decyzja = "";
	this.punkty = 0;
	this.punkty_biezaca_runda = 0;
	this.numer_rundy = 1;

	this.porownaj = function(g1, g2) {
		if(g1.decyzja == g2.decyzja) {
			if(g1.decyzja == "wspolpraca") {
				g1.dodajPunkty(3);
				g2.dodajPunkty(3);
				
				
			}
			else {
				g1.dodajPunkty(1);
				g2.dodajPunkty(1);
			}
		}
		else {
			if(g1.decyzja == "wspolpraca" && g2.decyzja == "zdrada") {
				g1.dodajPunkty(0);
				g2.dodajPunkty(5);
			}
			else {
				g1.dodajPunkty(5);
				g2.dodajPunkty(0);
			}
		}
	}

	this.dodajPunkty = function(ile) {
		this.punkty += ile;
		this.punkty_biezaca_runda = ile;
	}
}

function Przeciwnik(strategia) {
	this.strategia = strategia;
	
	this.mozliwe_decyzje = new Array(2);
	mozliwe_decyzje = ["wspolpraca", "zdrada"];
	this.decyzja = "";
	
	this.podejmijDecyzje = function() {
		switch(strategia) {
			case "losowo":
				this.decyzja = mozliwe_decyzje[Math.floor(Math.random() * 2)];
			break;
		case "algorytm":
			break;
		} 
	}
}

Przeciwnik.prototype = new Zawodnik();
