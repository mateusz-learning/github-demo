window.onload = main;

function main() {
	var plansza = new Plansza();
	plansza.narysuj_uklad_wspolrzednych();
	
	$(document).ready(function() {
		$('#liczba_punktow_pole').change(function() {
			plansza.liczba_punktow = $('#liczba_punktow_pole').val();
		})
		
		$("#liczba_punktow_potwierdz").click(function(){
			$("#litery" ).empty();
			$("#x_y" ).empty();
			$("#pola_wyboru" ).empty();
			for (var i=0; i<plansza.liczba_punktow; i++) {
				$("#litery").append("<p>" + String.fromCharCode(65+i) + "</p>");
				$("#x_y").append("<p>(x, y)</p>");
				$("#pola_wyboru").append("<select id='x_" + i +"'class='pola_wyboru_punktow'></select><select id='y_" + i + "'class='pola_wyboru_punktow'></select><br>");
				for (var j=0; j<11; j++) {
					$("#x_" + i).append("<option value='" + j + "'>" + j + "</option>");
					$("#y_" + i).append("<option value='" + j + "'>" + j + "</option>");
				}
			}
			
			plansza.utworz_punkty(plansza.liczba_punktow);
			
			for (var i=0; i<plansza.liczba_punktow; i++) {
				$("#x_"+i).change(function() {
					plansza.punkty[$(this).index()/3][0] = parseInt($("#"+this.id).val());
				});
				$("#y_"+i).change(function() {
					plansza.punkty[($(this).index()-1)/3][1] = parseInt($("#"+this.id).val());
				});
			}
			
			$("#dalej").show(800);
    	});
		
		
		$("#dalej").click(function(){
			plansza.sprawdz_punkty();
			if (plansza.punkty_ok == true) {
				$("#punkty_przed_wybraniem").hide();
				$("#punkty_po_wybraniu").show();
				$("#liczba_punktow_pole").prop('disabled', true);
				$(".pola_wyboru_punktow").prop('disabled', true);
				$("#informacje_start").hide();
				$("#liczba_punktow_potwierdz").hide();
				$("#dalej").hide();
				plansza.wylicz_trase();
				plansza.rysuj_trase();
				
				$("#wyniki").append("<h3>Odległości pomiędzy kolejnymi punktami wynoszą:</h3>");
				for (var i=0; i<plansza.poszczegolne_odleglosci.length; i++) {
					$("#wyniki").append("<p>" + plansza.poszczegolne_odleglosci[i].toFixed(3) + "</p>");
				}
				$("#wyniki").append("<p>Całkowita droga jest równa: " + plansza.laczna_odleglosc.toFixed(3) + "</p>");
			}
			else {
				$("#informacje_ostrzezenie").show().delay(6000).fadeOut();
				$("#informacje_start").hide();
			}
    	});
	});
}

function Plansza() {
	this.liczba_punktow = 3;
	this.punkty_ok = false;
	this.punkty = new Array();
	this.droga = new Array();
	this.poszczegolne_odleglosci = new Array();
	this.laczna_odleglosc = 0;
	var canvas = document.getElementById('plansza');
	var rysuj_uklad_wspolrzednych = canvas.getContext('2d');
	var rysuj_punkty = canvas.getContext('2d');	
	
	this.utworz_punkty = function(ile) {
		this.punkty = [];
		for (var i=0; i<ile; i++) {
			this.punkty.push([0, 0]);
		}
	}
	
	this.rysuj_trase = function() {
		
		for (var i=0; i<this.droga.length; i++) {
			rysuj_uklad_wspolrzednych.beginPath();
			rysuj_uklad_wspolrzednych.arc(this.droga[i][0]*50+50, 550-(this.droga[i][1]*50), 4, 0, Math.PI*2, true);
			rysuj_uklad_wspolrzednych.fillStyle = "red";
			rysuj_uklad_wspolrzednych.fill();
			rysuj_uklad_wspolrzednych.closePath();
		}
		
		for (var i=0; i<this.droga.length-1; i++) {
			rysuj_uklad_wspolrzednych.beginPath();
			rysuj_uklad_wspolrzednych.moveTo(this.droga[i][0]*50+50, 550-(this.droga[i][1]*50));
			rysuj_uklad_wspolrzednych.lineTo(this.droga[i+1][0]*50+50,  550-(this.droga[i+1][1]*50));
			rysuj_uklad_wspolrzednych.lineWidth = 3;
			rysuj_uklad_wspolrzednych.strokeStyle = "green";
			rysuj_uklad_wspolrzednych.stroke();
			rysuj_uklad_wspolrzednych.closePath();
		}
		
			rysuj_uklad_wspolrzednych.beginPath();
			rysuj_uklad_wspolrzednych.moveTo(this.droga[this.droga.length-1][0]*50+50, 550-(this.droga[this.droga.length-1][1]*50));
			rysuj_uklad_wspolrzednych.lineTo(this.droga[0][0]*50+50,  550-(this.droga[0][1]*50));
			rysuj_uklad_wspolrzednych.lineWidth = 3;
			rysuj_uklad_wspolrzednych.setLineDash([6]);
			rysuj_uklad_wspolrzednych.strokeStyle = "green";
			rysuj_uklad_wspolrzednych.stroke();
			rysuj_uklad_wspolrzednych.closePath();
	}
	
	this.wylicz_trase = function(punkty) {
		this.droga.push(this.punkty[0]);
		this.punkty.splice(0, 1);
		
		var odleglosc_najkrotsza = 9999;
		var odleglosc_obecna = 0;
		var licznik = 0;
		var suma = 0;
		
		while (this.punkty.length != 1) {
			odleglosc_najkrotsza = 9999;
			
			for (var i=0; i<this.punkty.length; i++) {
				odleglosc_obecna = Math.sqrt(Math.pow(this.droga[this.droga.length-1][0] - this.punkty[i][0], 2) + Math.pow(this.droga[this.droga.length-1][1] - this.punkty[i][1], 2));

				if (odleglosc_obecna <= odleglosc_najkrotsza) {
					odleglosc_najkrotsza = odleglosc_obecna;
					licznik = i;
				}
			}
			
			this.droga.push(this.punkty[licznik]);
            this.punkty.splice(licznik, 1);
            suma = suma + odleglosc_najkrotsza;
			this.poszczegolne_odleglosci.push(odleglosc_najkrotsza);
            odleglosc_najkrotsza = 0;
            odleglosc_obecna = 0;
            licznik = 0;
		}
		
		    suma = suma + Math.sqrt(Math.pow(this.droga[this.droga.length-1][0] - this.punkty[0][0], 2) + Math.pow(this.droga[this.droga.length-1][1] - this.punkty[0][1], 2));
			this.poszczegolne_odleglosci.push(Math.sqrt(Math.pow(this.droga[this.droga.length-1][0] - this.punkty[0][0], 2) + Math.pow(this.droga[this.droga.length-1][1] - this.punkty[0][1], 2)));
			this.droga.push(this.punkty[0]);
			this.punkty.splice(this.punkty[0]);
			suma = suma + Math.sqrt(Math.pow(this.droga[this.droga.length-1][0] - this.droga[0][0], 2) + Math.pow(this.droga[this.droga.length-1][1] - this.droga[0][1], 2));
			this.poszczegolne_odleglosci.push(Math.sqrt(Math.pow(this.droga[this.droga.length-1][0] - this.droga[0][0], 2) + Math.pow(this.droga[this.droga.length-1][1] - this.droga[0][1], 2)));
			this.laczna_odleglosc = suma;
	}
	
	this.sprawdz_punkty = function() {
		for (var i=0; i<this.liczba_punktow-1; i++) {
			for (var j=i+1; j<this.liczba_punktow; j++) {
				if (this.punkty[i][0] == this.punkty[j][0]) {
					if (this.punkty[i][1] == this.punkty[j][1]) {
						this.punkty_ok = false;
						return;
					}
				}
			}
		}
		this.punkty_ok = true;
	}
	
	this.narysuj_uklad_wspolrzednych = function() {
		rysuj_uklad_wspolrzednych.beginPath();
		rysuj_uklad_wspolrzednych.moveTo(50, 550);
		rysuj_uklad_wspolrzednych.lineTo(50, 25);
		rysuj_uklad_wspolrzednych.moveTo(50, 550);
		rysuj_uklad_wspolrzednych.lineTo(575, 550);
		rysuj_uklad_wspolrzednych.lineWidth = 2;
		rysuj_uklad_wspolrzednych.stroke();
		rysuj_uklad_wspolrzednych.closePath();

		rysuj_uklad_wspolrzednych.beginPath();
		rysuj_uklad_wspolrzednych.moveTo(45, 25);
		rysuj_uklad_wspolrzednych.lineTo(55, 25);
		rysuj_uklad_wspolrzednych.lineTo(50, 10);
		rysuj_uklad_wspolrzednych.moveTo(575, 555);
		rysuj_uklad_wspolrzednych.lineTo(575, 545);
		rysuj_uklad_wspolrzednych.lineTo(585, 550);
		rysuj_uklad_wspolrzednych.fill();
		rysuj_uklad_wspolrzednych.closePath();

		rysuj_uklad_wspolrzednych.beginPath();
		for (var i=100; i<=550; i+=50) {
			rysuj_uklad_wspolrzednych.moveTo(i, 545);
			rysuj_uklad_wspolrzednych.lineTo(i, 555);
		}
		for (var i=500; i>=50; i-=50) {
			rysuj_uklad_wspolrzednych.moveTo(45, i);
			rysuj_uklad_wspolrzednych.lineTo(55, i);
		}
		rysuj_uklad_wspolrzednych.stroke();
		rysuj_uklad_wspolrzednych.closePath();


		rysuj_uklad_wspolrzednych.beginPath();
		rysuj_uklad_wspolrzednych.lineWidth = 1;
		for (var i=100; i<=550; i+=50) {
			rysuj_uklad_wspolrzednych.moveTo(i, 550);
			rysuj_uklad_wspolrzednych.lineTo(i, 50);
			rysuj_uklad_wspolrzednych.font = "20px Times";
			if (i<=500)
				rysuj_uklad_wspolrzednych.fillText((i-50)/50, i-5, 575);
		}
		for (var i=500; i>=50; i-=50) {
			rysuj_uklad_wspolrzednych.moveTo(50, i);
			rysuj_uklad_wspolrzednych.lineTo(550, i);
			rysuj_uklad_wspolrzednych.font = "20px Times";
			if (i>=100)
				rysuj_uklad_wspolrzednych.fillText((550-i)/50, 30, i+5);
		}
		rysuj_uklad_wspolrzednych.fillText(0, 45, 575);
		rysuj_uklad_wspolrzednych.fillText(10, 540, 575);
		rysuj_uklad_wspolrzednych.fillText(10, 22, 56);
		rysuj_uklad_wspolrzednych.setLineDash([1]);
		rysuj_uklad_wspolrzednych.stroke();
		rysuj_uklad_wspolrzednych.setLineDash([0]);
		rysuj_uklad_wspolrzednych.closePath();
	}
}
