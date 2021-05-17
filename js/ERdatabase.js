/*
Program: Erdatabase.js
Purpose: database functions
Author: Eleonora Rud
Last Updated: 2015-03-09
*/

/* Create table */
function CreateTable() {
	db.transaction(function (tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS ertype(type_id INTEGER PRIMARY KEY AUTOINCREMENT,type_name VARCHAR)',null,sR,fR);

	tx.executeSql('INSERT INTO ertype (type_id, type_name) VALUES(1,"Coffee Shop")');
	tx.executeSql('INSERT INTO ertype (type_id, type_name) VALUES(2,"Canadian")');
	tx.executeSql('INSERT INTO ertype (type_id, type_name) VALUES(3,"Asian")');
	tx.executeSql('INSERT INTO ertype (type_id, type_name) VALUES(4,"Other")');
	
	create_erreview();
	
	});
}

function populateReviewList() {
	//get all reviews from database
	db.readTransaction(function (tx) {
		tx.executeSql("SELECT * FROM erreview ", [], function (tx, results) {
			var listView = $("#erFeedBackList");
			var listItem = "";
			
			for( var i = 0; i <results.rows.length; i++)
			{
				var row = results.rows.item(i);	
				var rating = Math.round(100*((row.rating1 + row.rating2 + row.rating3)/15));
				
				listItem += '<li class="erListItem" data-icon="false" data-row-id="'+ row.id + '">';
				listItem +='<a href ="#erEditFeedback">';
				listItem +='<h2>'+ row.business_name +'</h2>';
				listItem +='<p>';
				listItem +='Reviewer Email: '+ row.reviewer_email+ '<br>';
				listItem +='Comments: ' + row.reviewer_comments+ '<br>';
				listItem +='Overall Rating: ' + rating + '<br>';
				listItem +='</p>';
				listItem +='</a>';
				listItem +='</li>';
			}			
			listView.html(listItem);
			listView.listview('refresh');
			
			//for each list item add click event and save the id in the local storage
			$(".erListItem").on('tap', function(){
				
				var reviewId = this.getAttribute('data-row-id');				
				localStorage.setItem('reviewId',reviewId);
				populateEditForm();
			})
		},fR)
	});	
}

//populate the edit form
function populateEditForm()
{
		db.readTransaction(function (tx) {
		tx.executeSql("SELECT * FROM erreview WHERE id = ?", [localStorage.getItem("reviewId")], function (tx, results) {
			var getSelectList = $("#erType");
			
			for( var i = 0; i <results.rows.length; i++)
			{
				var row = results.rows.item(i);	
				//get element
				$("#erEditName").val(row.business_name);
				$("#erEditType").val(row.type_id);
				$("#erEditType").selectmenu('refresh');
				$("#erEditEmail").val(row.reviewer_email);
				$("#erEditComments").val(row.reviewer_comments);
				$("#erEditDate").val(row.review_date);
				
				if(row.has_rating === 'T')
				{   						
					$("#erEditRating").attr('checked',true).checkboxradio('refresh');
					
					toggleBox("erEditForm");
					
					$("#erEditFoodQuality").val(row.rating1);
					$("#erEditService").val(row.rating2);
					$("#erEditValue").val(row.rating3);
					
					calculation("erEditForm");	
				}
				else
				{
					$("#erEditRating").attr('checked',false).checkboxradio('refresh');
					
					$("#erEditFoodQuality").val("");
					$("#erEditService").val("");
					$("#erEditValue").val("");
					$("#erEditOverall").val("");
					
					toggleBox("erEditForm");
				}
			}			
			
		},fR)
	});
}

//delete the review from review list
function deleteReview()
{
	if(confirm("Do you want to delete the record?"))
	{
		db.transaction(function(tx){
		tx.executeSql("DELETE FROM erreview WHERE id=?", [localStorage.getItem("reviewId")], function (tx, results) {
		
		//Show review page
		$.mobile.changePage('#erViewFeedBack');
		},fR)
	});
	}
	
	
}

function updateReview(busName,type,email,comment,reviewDate,rating,foodQuality,serviceRating,value)
{
	if(confirm("Do you want to update the record?"))
	{
		db.transaction(function(tx){
		tx.executeSql("UPDATE erreview set business_name=?, type_id=?,reviewer_email =?, reviewer_comments=?"
         +",review_date=?,has_rating=?,rating1=?,rating2=?,rating3=?"
	     + "WHERE id=?", [busName,type,email,comment,reviewDate,rating,foodQuality,serviceRating,value, localStorage.getItem("reviewId")], function (tx, results) {
			alert("The review is updated.");
		
			//Show review page
			$.mobile.changePage('#erViewFeedBack');
		},fR)
	});
	}
}
	
//Create type table
function get_ertype()
{
	db.readTransaction(function (tx) {
		tx.executeSql("SELECT * FROM ertype ORDER BY type_name DESC;", [], function (tx, results) {
			var getSelectList = $("#erType");
			var getEditList = $("#erEditType");
			
			for( var i = 0; i <results.rows.length; i++)
			{
				var row = results.rows.item(i);				
				getSelectList.append($('<option></option>').val(row.type_id)
														  .html(row.type_name));
														  
				getEditList.append($('<option></option>').val(row.type_id)
														  .html(row.type_name));
			}			
			getSelectList.val('4');
		},fR)
	});
}

/* Remove entire table */
// to clear all records (run in Console)

function dropReviewTable() {
	var query = 'DROP TABLE erreview;';
try {
		db.transaction(function (transaction) {
		transaction.executeSql(query, [], null, errorHandler);
	});
	}
	catch (e) {
	alert("Error: Unable to drop table " + e + ".");
		return;
	}
}
function sR(a,b){

	// The query was successfully!
}

function fR(a,b){

	// Oops! There was an issue let's alert it the user.
	alert(b.message);
}
function create_erreview()
{
	db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS erreview(id INTEGER PRIMARY KEY AUTOINCREMENT,business_name VARCHAR,type_id INTEGER, reviewer_email VARCHAR, reviewer_comments TEXT, review_date DATE,has_rating VARCHAR, rating1 INTEGER, rating2 INTEGER, rating3 INTEGER)',null,sR,fR);		
	
	});
}

function add_erreview(busName,type,email,comment,reviewDate,rating,foodQuality,serviceRating,value)
{
	//Creating review table
	db.transaction(function (tx) {
		tx.executeSql("INSERT INTO erreview (business_name,type_id, reviewer_email, reviewer_comments, review_date, has_rating, rating1, rating2, rating3) VALUES(?,?,?,?,?,?,?,?,?)",
		[busName,type,email,comment,reviewDate,rating,foodQuality,serviceRating,value],function(tx,results){
			alert("New review added.");
			
			$('#erAddForm').trigger('reset');
			$('#erDate').val(getTodayDate); 
		},fR);
	});
}
