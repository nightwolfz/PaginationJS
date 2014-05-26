// you can enter your JS here!
$(function(){
	function Pagination(json){

		var debug = true;
	
		// public
		this.showPerPage = function(num){
			showPerPage = num;
		};
		this.sortByScore = function(num){
			debug && console.log("Sorting by score: " + num);
			sortByScore = (num == 1) ? -1 : 1;// -1 asc, 0 = none, 1 = desc
			sortByName = false;
			GenerateComments();
		};
		this.sortByName = function(bool){
			sortByScore = 0;
			sortByName = bool || !bool;
			GenerateComments();
		};
		
		// Which element to inject comments/pagination to
		this.setInjectionDiv = function(elem){
			debug && console.log("Injecting to "+ elem);
			paginationDiv = elem;
		};
	
		// private
		var showPerPage = 5;
		var sortByScore = 0;
		var sortByName = false;
		var currentPage = 1;
		var paginationDiv = ".reviews";
		
		var numberOfPages = function(){
			return Math.ceil(json.length / 5);
		}();
		
		// private constructor
		var __construct = function(that) {
			$(paginationDiv).append('<ul class="paginatedDiv_list"></ul>');
			GenerateComments();
			createPaginationHtml();
		}(this);

		function createPaginationHtml(){
			debug && console.log("Num of pages: " + numberOfPages);
			
			for (var num = 1; num < numberOfPages+1; num++) { 
				$(paginationDiv).append('<a class="paginationLink button">'+num+'</a> ');
			}
		}
		
		function GenerateComments(){
			$(".paginatedDiv_list").empty();
			
			if (sortByScore == 1){
				json = $(json).sort(function(a, b){
					return a.score > b.score ? 1 : -1;
				});
			}
			if (sortByScore == -1){
				json = $(json).sort(function(a, b){
					return a.score < b.score ? 1 : -1;
				});
			}
			if (sortByName){
				json = $(json).sort(function(a, b){
					return a.author.toLowerCase() > b.author.toLowerCase() ? 1 : -1;
				});
			}
			
			$(json).each(function(f){
				$(".paginatedDiv_list").append(
					$('<li class="one_review">')
					.append('<strong class="review_score">'+json[f]["score"]+'</strong>'
						+'<blockquote class="review_content">'+json[f]["content"]
						+'<cite>'+json[f]["author"]+'</cite></blockquote></li>'
				));
			});
			$(".paginatedDiv_list li").hide().slice((currentPage-1) * showPerPage, currentPage * showPerPage).show();
		};
		
		$(".paginationLink:first").addClass("pageActive");
		$(".paginationLink").on("click", function(){
			currentPage = parseInt($(this).text());
			$(".paginationLink").removeClass("pageActive");
			$(this).addClass( "pageActive");
			GenerateComments();
		});
		
	};
	
	var pagination = new Pagination(window.HotelReviews);
	pagination.setInjectionDiv(".reviews");
	
	$(".sortReviewsByScore").on("click", function(){
		pagination.sortByScore();
	});
	$(".sortReviewsByAuthor").on("click", function(){
		pagination.sortByName();
	});
});