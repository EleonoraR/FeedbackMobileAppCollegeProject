/*
Program: ERutil.js
Purpose: Validation for forms,deleting tables, calculating
Author: Eleonora Rud
Last Updated: 2015-03-09
*/


function validateForm(){
	$("#erAddForm").validate(
		{
			rules: {
				erName: {
					required: true,
					rangelength:[2,30]
				},
				erEmail: {
					required: true,
					email: true
				},
				date: {
					required: true,
					date:true
				},
				erFoodQuality: {				
					range:[0,5]
				},
				erService: {	
					range:[0,5]
				},
				erValue: {	
					range:[0,5]
				}
			}, // end of rules
			messages: {
					erName: {
						required: "Please enter the business name.",
						rangelength: "Your name must be between {0} and {1} characters long."
					},
					erEmail: {
						 required: "Reviewer email is required",
						 email: "Email entered is invalid"
					},
					date: {
						required: "Review Date is required",
						date:true
					},
					erFoodQuality: {	
						range: "Please enter a value between {0} and {1}."
					},
					erService: {		
						range: "Please enter a value between {0} and {1}."
					}					
			}
		}  // end of argument array
	); // end of validate
	
	if($('#erAddForm').valid()) {
		var busName = $('#erName').val();
		var type = $('#erType').val();
		var email = $('#erEmail').val();
		var comment = $('#erComments').val();
		var reviewDate = $('#erDate').val();
		
		var rating = 'F';
		 if($('#erAddRating').prop('checked')){
			 rating = 'T';
		 }
		var foodQuality = $('#erFoodQuality').val();
		var serviceRating = $('#erService').val();
		var value = $('#erValue').val();	
		
		add_erreview(busName,type,email,comment,reviewDate,rating,foodQuality,serviceRating,value);		
	}
}

function validateEditForm(){
		$("#erEditForm").validate(
		{
			rules: {
				erEditName: {
					required: true,
					rangelength:[2,30]
				},
				erEditEmail: {
					required: true,
					email: true
				},
				erEditDate: {
					required: true,
					date:true
				},
				erEditFoodQuality: {				
					range:[0,5]
				},
				erEditService: {					
					range:[0,5]
				},
				erEditValue: {					
					range:[0,5]
				}
			}, // end of rules
			messages: {
					erEditName: {
						required: "Please enter the business name.",
						rangelength: "Your name must be between {0} and {1} characters long."
					},
					erEditEmail: {
						 required: "Reviewer email is required",
						 email: "Email entered is invalid"
					},
					erEditDate: {
						required: "Review Date is required",
						date:true
					},
					erEditFoodQuality: {						
						range: "Please enter a value between {0} and {1}."
					},
					erEditService: {						
						range: "Please enter a value between {0} and {1}."
					}					
			}
		}  // end of argument array
	); // end of validate
	
	if($('#erEditForm').valid()) {
		var busName = $('#erEditName').val();
		var type = $('#erEditType').val();
		var email = $('#erEditEmail').val();
		var comment = $('#erEditComments').val();
		var reviewDate = $('#erEditDate').val();
		
		var rating = 'F';
		 if($('#erEditRating').prop('checked')){
			 rating = 'T';
		 }
		var foodQuality = $('#erEditFoodQuality').val();
		var serviceRating = $('#erEditService').val();
		var value = $('#erEditValue').val();	
		
		updateReview(busName,type,email,comment,reviewDate,rating,foodQuality,serviceRating,value);	
	}
}

function toggleBox(chooseForm) {
	
	var checkBoxId = "#erAddRating";
	var divId = "#erAddRatingEntry";
	
	if(chooseForm === "erEditForm")
	{
		checkBoxId ="#erEditRating";
		divId = "#erEditRatingEntry";
	}
	
	if ($(checkBoxId).is(':checked'))
	{
		$(divId).show();
		$("#rating input").addClass("required");
	}
	else
	{
		$(divId).hide();
		$("#rating input").removeClass("required");
	}
}

function calculation(whichRating)
{
	var fqID = "#erFoodQuality";	
	var sqID = "#erService";
	var vID = "#erValue";
	var overAllID = "#erOverall";
	
	//only change if it the edit form
	if(whichRating==="erEditForm")
	{
		fqID = "#erEditFoodQuality";
        sqID = "#erEditService";
		vID = "#erEditValue";		
		overAllID = "#erEditOverall";
	}
	
	var fq = $(fqID).val() / 15;
	var sq = $(sqID).val() / 15;
	var v = $(vID).val() / 15;

    var or = fq+sq+v;
    $(overAllID).val(Math.round(or* 100));
}

function deleteReviewTable()
{
	if(confirm("All review records will be deleted permanently. Continue?"))
	{
		dropReviewTable();
		create_erreview();
	}
}

function saveDefault()
{
	var defaultEmail = $('#erDefaultEmail').val();
	localStorage.setItem('default_email', defaultEmail);
}

function validateEmail()
{
	$("#erEmailValidation").validate(
		{
			rules: {				
				defaultEmail: {
					required: true,
					email: true				
			}, // end of rules
			messages: {					
				defaultEmail: {	
						 required: "The email is required",					
						 email: "Email entered is invalid"
					}
			}
		} 
		}		// end of argument array
	); // end of validate	
	if(($('#erEmailValidation').valid()))
	{
		saveDefault();
		alert("The email has been saved");
	}
}
//Gets today's date
function getTodayDate() {
	var todayDate = new Date();

	var day = todayDate.getDate();
	var month = todayDate.getMonth()+1;
	var year = todayDate.getFullYear();

	if (day < 10)
	{
		day = '0' + day;
	} 

	if (month < 10)
	{
		month = '0' + month;
	} 

	return year + '-' + month + '-' + day;
}