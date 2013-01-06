(function( $ ){
 var globalSettings; 	
  /* ----- METHODES PUBLICS -----*/
  var methods = {
    init : function( options ) { 
        var settings = $.extend( {
		   o : this,
		   'artiste' : 'Boris Vian',
		   displayBio : function(info) {
				debug(info);
				if (typeof info.results!== "undefined" ) {
					if (info.results.bindings.length==0) {
						return false;
					}
					var auteur= info.results.bindings[0]
					if (typeof auteur!== "undefined" ){
						var divBio=$('<div>').addClass("liensPlusAuteur");
						divBio.append($('<h4>').html(auteur.nom.value));
					}
					if (typeof auteur.image!== "undefined" ){
						var imgA = $("<img>").attr("src",auteur.image.value.replace("200px","100px")).addClass('bio');
						divBio.append(imgA);
					}
					if (info.results.bindings.length>2) {
						var intBinding=1;
						while (intBinding < info.results.bindings.length && info.results.bindings[intBinding].sujets.value==info.results.bindings[intBinding-1].sujets.value){
							intBinding+=1;
						}
						if (intBinding==info.results.bindings.length)
							var booSearchBroader=true;
						else
							var booSearchBroader=false;
						
						var arrLaureate =[];
						for (var i = 0 ; i < info.results.bindings.length; i++){
							if (booSearchBroader==false)
							{
								if (typeof info.results.bindings[i].sujets!== "undefined" ){
									var Sujet = info.results.bindings[i].sujets.value;
								}
								else var Sujet = ""
							}
							else
							{
								if (typeof info.results.bindings[i].sujetsBroader!== "undefined" ){
									var Sujet = info.results.bindings[i].sujetsBroader.value;
								}
								else var Sujet =""
							}
							if (Sujet.toLowerCase().indexOf("lauréat d")!=-1 || Sujet.toLowerCase().indexOf("meilleur")!=-1 || Sujet.toLowerCase().indexOf("prix")!=-1) {
								if ($.inArray(Sujet, arrLaureate) == -1) {
									arrLaureate.push(Sujet);
								}
							}
						}
						if (arrLaureate.length>0){
							var divPrix = $('<div class="prixContainer">');
							var lPrix=$("<ul>");
							for (var iPrix=0;iPrix<arrLaureate.length;iPrix++) {
								var textLien=arrLaureate[iPrix];
								while (textLien.indexOf(" ") !=-1) {
									textLien=textLien.replace(" ","_");
								}
								var aPrix=$("<span>").html(arrLaureate[iPrix]);
							
								lPrix.append($("<li>").addClass("lienPrix").append(aPrix));
							}
							divPrix.append(lPrix);
							divBio.append($("<h5>Distinctions</h5>"));
							divBio.append(divPrix);
						}
					}
					if (typeof auteur.abstract!== "undefined" ){
						if (typeof auteur.source!== "undefined" )
						var infoDiv=$('<h5>Biographie</h5><div class="summary hide"><p>'+htmlDecode(auteur.abstract.value)+'</p>&nbsp;Source : <a target="_blank" class="lienwiki" href="'+ auteur.source.value +'">Wikipédia</a></div>');
						else
						var infoDiv=$('<h5>Biographie</h5><div class="summary hide"><p>'+htmlDecode(auteur.abstract.value)+'</p></div>');
						var cacheDiv=$('<div class="cache">')
						infoDiv.hover(
						function () {
							$(this).removeClass("hide");
							$(this).addClass("show");
							cacheDiv.addClass("displayNone");
							cacheDiv.removeClass("displayBlock");
						},
						function () {
							$(this).removeClass("show");
							$(this).addClass("hide");
							cacheDiv.removeClass("displayNone");
							cacheDiv.addClass("displayBlock");
						}
						);
						cacheDiv.hover(
						function () {
							infoDiv.removeClass("hide");
							infoDiv.addClass("show");
							cacheDiv.addClass("displayNone");
							cacheDiv.removeClass("displayBlock");
						},
						function () {
							infoDiv.removeClass("show");
							infoDiv.addClass("hide");
							cacheDiv.removeClass("displayNone");
							cacheDiv.addClass("displayBlock");
						}
						);
						var containerDiv=$('<div class="infoContainer">');
						containerDiv.append(infoDiv);
						containerDiv.append(cacheDiv);
						divBio.append(containerDiv);
					}
					if (typeof auteur.image!== "undefined" || typeof auteur.abstract!== "undefined" ){
						globalSettings.o.append(divBio);
					}
				}
		   },
		   displayListe : function(info) {
				debug(info);
				if (typeof info.results!== "undefined" ) {
					/*var titrePage=info.dbpediaUrl;
					while (titrePage.indexOf("_") !=-1) {
						titrePage=titrePage.replace("_"," ");
					}
					$('#titrePrix').append($("<h2>").html(titrePage.replace("Lauréat","Lauréats")));*/
					for (var i = 0 ; i < info.results.bindings.length; i++){
						var auteur= info.results.bindings[i]
						var divAuteur=$("<div>").addClass("personne")
						if (typeof auteur.nom!== "undefined" ){
							if (auteur.nom.value.indexOf("(")!=-1) auteur.nom.value=auteur.nom.value.substr(0,auteur.nom.value.indexOf("(")).trim();
							var nom=$("<h3>").addClass("nom").html(auteur.nom.value);
							divAuteur.append(nom);
						}
						if (typeof auteur.image!== "undefined" ){
							var img = $("<img>").attr("src",auteur.image.value.replace("200px","100px"))
							divAuteur.append(img);
						}
						if (typeof auteur.abstract!== "undefined" ){
							var shortText = jQuery.trim(htmlDecode(auteur.abstract.value)).substring(0, 200).split(" ").slice(0, -1).join(" ") + "...";
							var resume=$("<p>").addClass("resume").html(shortText);
							divAuteur.append(resume);
						}
						var aPrix=$("<a>").attr("href","/medias/search.aspx?Instance=EXPLOITATION&SC=DEFAULT&QUERY=Author_idx:"+auteur.nom.value);
						aPrix=aPrix.html("Voir les oeuvres de " + auteur.nom.value)
						divAuteur.append(aPrix);
						globalSettings.o.append(divAuteur);
					}
				}
			}
		}, options);
		globalSettings=settings;
		debug ("settins loaded");
    }, 
	prix : function (sPrix) {
		var sparqlQuery ='PREFIX db:<http://fr.dbpedia.org/resource/>PREFIX dbo: <http://dbpedia.org/ontology/>PREFIX dcterms:<http://purl.org/dc/terms/>PREFIX cat:<http://fr.dbpedia.org/resource/Catégorie:>SELECT DISTINCT ?nom,?abstract,?image,?source WHERE { ?auteur dcterms:subject cat:' + sPrix +'.?auteur rdfs:label ?nom.OPTIONAL {?auteur dbo:thumbnail ?image.} OPTIONAL {?auteur foaf:isPrimaryTopicOf ?source} OPTIONAL {?auteur rdfs:comment ?abstract }} ORDER BY ?nom'
		var jqxhr = $.ajax({
			url: 'http://fr.dbpedia.org/sparql/',
			data: {
				query: sparqlQuery,
				format: 'application/json'
			},
			type : 'get',
			contentType: 'application/json',
			dataType: 'jsonp',
			success: globalSettings.displayListe,
			error: function(error) {
				debug(error);
			}
		});
	},
	info : function (sAuteur) {
		if(typeof sAuteur=== "undefined" )
			var sAuteur = _cleanAuteur(settings.artiste);
			
		$.support.cors = true;
		var theThis=this;
		var sparqlQuery = 'PREFIX db:<http://fr.dbpedia.org/resource/>PREFIX dbo: <http://dbpedia.org/ontology/>PREFIX dcterms:<http://purl.org/dc/terms/>SELECT DISTINCT ?nom,?abstract,?image,?sujets,?sujetsBroader,?source WHERE {{?auteur rdfs:label "'+ sAuteur +'"@fr} UNION {?auteur foaf:name "'+ sAuteur +'"@fr}. ?auteur rdfs:label ?nom {?auteur a dbo:Person} UNION {?auteur a foaf:Person} OPTIONAL { ?auteur dcterms:subject ?URIsujets. ?URIsujets rdfs:label ?sujets. OPTIONAL {?auteur foaf:isPrimaryTopicOf ?source} OPTIONAL {?URIsujets skos:broader ?URIsujetsBroader. ?URIsujetsBroader rdfs:label ?sujetsBroader }} OPTIONAL {?auteur dbo:thumbnail ?image.}OPTIONAL {?auteur dbo:abstract ?abstract}}';
		var jqxhr = $.ajax({
			url: 'http://fr.dbpedia.org/sparql/',
			data: {
				query: sparqlQuery,
				format: 'application/json'
			},
			type : 'get',
			contentType: 'application/json',
			dataType: 'jsonp',
			success: globalSettings.displayBio, 			
			error:  function(error) {
				debug(error);
			}
		});
	}
  };
  
  /*------ FONCTIONS PRIVEES ----- */
  // Fonction de débogage
	var debug = function(str) {
		if (window.console && console.log) {console.log(str);}
	}
	var _cleanAuteur= function (sAuteur){
		if (sAuteur.indexOf("(")!=-1) sAuteur=sAuteur.substr(0,sAuteur.indexOf("(")).trim();
		if (sAuteur.indexOf(",")!=-1){
			var arrAuteur=sAuteur.split(',');
			sAuteur=arrAuteur[1].trim()+ " " + arrAuteur[0].trim();
		}
		return sAuteur;
	}
	var htmlDecode=function(value){
		return $('<div/>').html(value).text();
	}	 
	$.fn.dbCata = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.dbCata' );
		}    
	};
})( jQuery );