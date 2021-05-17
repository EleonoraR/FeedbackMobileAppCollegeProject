/*
Program: ERglobal.js
Purpose: create DB and table; document ready features
Author: Eleonora Rud
Last Updated: 2015-03-09
*/



function errorHandler(transaction, error) {
    alert("SQL error: " + error.message);
}

var db;
$(document).ready(function() {
	
	$('#erFoodQuality').on("input", function(){calculation("erAddForm");});
	$('#erService').on("input", function(){calculation("erAddForm");});
	$('#erValue').on("input", function(){calculation("erAddForm");});
	
	$('#erEditFoodQuality').on("input", function(){calculation("erEditForm");});
	$('#erEditService').on("input", function(){calculation("erEditForm");});
	$('#erEditValue').on("input", function(){calculation("erEditForm");});
	
	
	$('#erSave').on("tap", validateForm);
	$('#erClear').on("tap",deleteReviewTable);
	$('#erSaveDefault').on("tap",validateEmail);
	
	
	$('#erAddRating').on("click", function(){toggleBox("chooseForm");});
	$('#erEditRating').on("click",function(){toggleBox("erEditForm");});
	
	$('#erDate').val(getTodayDate);   
		
	$('#erUpdate').on("tap", validateEditForm);
	$('#erDelete').on('click',deleteReview);
	
	$('#erViewFeedBack').on("pageshow",populateReviewList);
	// open the database
	db = openDatabase('ERFeedbackDb','1.0','ERFeedbackDb',2 * 1024 * 1024);
	CreateTable();
	get_ertype();
	
}); // end ready

