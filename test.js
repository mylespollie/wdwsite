// var Person = class {
// 	constructor(uniqname, first, last, email, phone){
// 		this.uniqname = uniqname;
// 		this.first = first;
// 		this.last = last;
// 		this.email = email;
// 		this.phone = phone;
// 	}
// }
// var Service = class {
// 	constructor(name, svcOwner, offerings){
// 		this.name = name;
// 		this.svcOwner = svcOwner;
// 		this.offerings = offerings;
// 	}
// }
// var serviceOffering = class {
// 	constructor(name, service, typeName, opEmail, engEmail, opContacts, engContacts, svcLink, hipChat, tags){
// 		this.name = name;
// 		this.service = service;
// 		this.typeName = typeName;
// 		this.opEmail = opEmail;
// 		this.engEmail = engEmail;
// 		this.opContacts = opContacts;
// 		this.engContacts = engContacts;
// 		this.svcLink = svcLink;
// 		this.hipChat = hipChat;
// 		this.tags = tags;
// 	}
// }

/*Will need to adjust these URLs later*/
var searchAll = "http://localhost:9200/whodoeswhat/_search?q=";
var searchPeople = "http://localhost:9200/whodoeswhat/person/_search?q=";
var searchService = "http://localhost:9200/whodoeswhat/service/_search?q=";
var searchOffering = "http://localhost:9200/whodoeswhat/serviceoffering/_search?q=";

$(document).ready(function(){
	$(".tablinks").click(function(event) {
		event.preventDefault();							//prevent reloading the page
		$(".tablinks").removeClass('active');
		$(this).addClass('active');
		var domElement = $ ( this ).get( 0 );
		var searchType = domElement.textContent;       //Get the text content of whichever tab was clicked
		var placeholder = "Search ";
		placeholder = placeholder.concat(searchType).concat("...");
		document.getElementById("mySearch").placeholder = placeholder;
	});

	/*Click event for clicking Service Offerings*/
	$(document).on('click', 'li.list-group-item', function (){
		$("#modalClick").modal("show");

		var domElement = $(this).get(0);
		var url = (searchOffering + (domElement.textContent));
		$(".modal-content").empty();

		/*Grab JSON and create card with service offering information*/
		$.getJSON(url, function(result){
			var typeName = result.hits.hits[0]._source["type name"];
			var engEmail = result.hits.hits[0]._source["engineering email"];
			var engContacts = result.hits.hits[0]._source["engineering contacts"];
			var opEmail = result.hits.hits[0]._source["operations email"]
			var opContacts = result.hits.hits[0]._source["operations contacts"];
			var tags = result.hits.hits[0]._source.tags;
			console.log(result);
			htmlText = '<div class="col-sm-6 col-md-4 col-lg-3 mt-4>';
			htmlText += '<div class="card id="modalCard">';
			htmlText += '<div class="card-block">';
			htmlText += '<h4 class="card-title">' + domElement.textContent + '</h4>';
			htmlText += '<div class="meta">';
			htmlText += '<a>' + result.hits.hits[0]._source["type name"] + '</a>';
			htmlText += '</div>';
			htmlText += '<div class="card-text">';
			htmlText += '<table class="table table-user-information">';
			htmlText += '<tbody>';
			htmlText += '<tr>';
			htmlText += '<td>Engineering Email</td>';
			htmlText += '<td><a href="mailto:' + engEmail +'">' + engEmail + '</a></td>';
			htmlText += '</tr>';
			htmlText += '<tr>';
			htmlText += '<td>Engineering Contacts</td>';
			htmlText += '<td>';
			for(var i = 0; i < engContacts.length; i++){
				htmlText += '<ul class="list-inline">';
				htmlText += '<li class="list-inline-item"><a href="mailto:' + engContacts[i] +'@umich.edu">' + engContacts[i] + '@umich.edu</a></li>';
				htmlText += '</ul>';
			}
			htmlText += '</td>';
			htmlText += '</tr>';

			htmlText += '<tr>';
			htmlText += '<td>Operations Email</td>';
			htmlText += '<td><a href="mailto:' + opEmail +'">' + opEmail + '</a></td>';
			htmlText += '</tr>';
			htmlText += '<tr>';
			htmlText += '<td>Operations Contacts</td>';
			htmlText += '<td>';
			for(var i = 0; i < opContacts.length; i++){
				htmlText += '<ul class="list-inline">';
				htmlText += '<li class="list-inline-item"><a href="mailto:' + opContacts[i] +'@umich.edu">' + opContacts[i] + '@umich.edu</a></li>';
				htmlText += '</ul>';
			}
			htmlText += '</td>';
			htmlText += '</tr>';

			htmlText += '<tr>';
			htmlText += '<td>Tags</td>';
			htmlText += '<td>';
			htmlText += '<ul class="list-inline">';
			for(var i = 0; i < tags.length; i++){
				htmlText += '<li class="list-inline-item">' + tags[i] + '</li>';
			}
			htmlText += '</ul>';
			htmlText += '</td>';
			htmlText += '</tr>';

			htmlText += '</tbody>';
			htmlText += '</table>';
			htmlText += '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
			$(".modal-content").append(htmlText);
		});
	});

	/*Make pressing enter trigger search button*/
	$('.featurette').keypress(function (e) {
		var key = e.which;
		if(key == 13)
		{
			$('#searchButton').click();
			return false;
		}
	});

	/*Perform search for people or services depending on which tab is active*/
	$('#searchButton').click(function (){
		var url;
		if($('#PeopleTab').hasClass('active')){
			url = searchPeople;
			searchType = 'person';
		}
		else if($('#ServicesTab').hasClass('active')){
			url = searchService;
			searchType = 'service';
		}
		var searchTerm = document.getElementById("mySearch").value;
		url = url.concat(searchTerm);
		var result;

		$.getJSON(url, function(result){
			$('.container').empty();

			console.log(result);			//FOR DEBUGGING
			if(!result.hits.hits.length){
				$(".container").append("<div class = noresults>No results</div>");
			}
			if(searchType == "person"){
				for(var i = 0; i < result.hits.hits.length; i++){
					var first;
					var last = result.hits.hits[i]._source.last;
					var uniqname = result.hits.hits[i]._source.uniqname;
					var email = result.hits.hits[i]._source.email;
					var number = result.hits.hits[i]._source.phone;

					/* If first name field contains multiple names only use the first*/
					if(Array.isArray(result.hits.hits[i]._source.first)){
						first = result.hits.hits[i]._source.first["0"];
					}
					else{
						first = result.hits.hits[i]._source.first;
					}

					var htmlText = '<div class="row">';
					htmlText += '<div class="col-sm-6 col-md-4 col-lg-3 mt-4">';
					htmlText += '<div class="card">';
					htmlText += '<div class="card-block">';
					htmlText += '<h4 class="card-title">' + first + " " + last + '</h4>';
					htmlText += '<div class="meta">';
					htmlText += '<a>' + uniqname + '</a>';
					htmlText += '</div>';
					htmlText += '<div class="card-text">';
					htmlText += '<table class="table table-user-information">';
					htmlText += '<tbody>';
					htmlText += '<tr>';
					htmlText += '<td>Email:</td>';
					htmlText += '<td><a href="mailto:' + uniqname +'@umich.edu">' + email + '</a></td>';
					htmlText += '</tr>';
					htmlText += '<tr>';
					htmlText += '<td>Phone No.</td>';
					htmlText += '<td>' + number + '</td>';
					htmlText += '</tr>';
					htmlText += '</tbody>';
					htmlText += '</table>';
					htmlText += '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
					$(".container").append(htmlText);
				}
			}
			else if(searchType == "service"){
				for(var i = 0; i < result.hits.hits.length; i++){
					var name = result.hits.hits[i]._source.name;
					var svcOwner = result.hits.hits[i]._source["Service Owner"];
					var ieIndicator = result.hits.hits[i]._source["I/E Indicator"];
					var htmlText = '<div class="row">';
					htmlText += '<div class="col-sm-6 col-md-4 col-lg-3 mt-4">';
					htmlText += '<div class="card">';
					htmlText += '<div class="card-block">';
					htmlText += '<h4 class="card-title">' + name + '</h4>';
					htmlText += '<div class="meta">';
					htmlText += '<a>' + "Service Owner: " + svcOwner + '</a>';
					htmlText += '</div>';
					htmlText += '<div class="card-text">';
					htmlText += '<table class="table table-user-information">';
					htmlText += '<tbody>';
					htmlText += '<tr>';
					htmlText += '<td>Service Offerings: </td>';
					htmlText += '<td>';
					htmlText += '<div id="svcOfferings">';
					for(var j = 0; j < result.hits.hits[i]._source.Offerings.length; j++){
						htmlText += '<li class="list-group-item" data-toggle="modal" data-target="#myModal">' + result.hits.hits[i]._source.Offerings[j] + '</li>';
					}
					htmlText += '</div>';
					htmlText += '</td>';
					htmlText += '</tr>';
					htmlText += '</tbody>';
					htmlText += '</table>';
					htmlText += '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
					$(".container").append(htmlText);
				}
			}
		});
	});
});