// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    // Add functionality to login and data query buttons
    document.getElementById("loginbutton").addEventListener("click", login);
    document.getElementById("databutton").addEventListener("click", queryOBP);
    document.getElementById("backbutton4").addEventListener("click",emptyTable);
    // document.getElementById("it").addEventListener("click",queryAcc);
    // document.getElementById("it").addEventListener("click", queryTrans);
}


// Initialise token variable
var token;

// Function sends AJAX request to OBP to authorize user credentials and receive token.
function login(){
    console.log("confirming details");

    // Declare variables equal to user input
    username = document.getElementById("user").value;
    password = document.getElementById("pass").value;
    console.log(username);
    console.log(password);

    // Sends request to OBP to authorize user.
    $.ajax({
            url: "https://apisandbox.openbankproject.com/my/logins/direct",
            type:"POST",
            dataType: "json",
            crossDomain: true,
            cache: false,
            contentType: "application/json, charset=utf-8",
            xhrFields: {
                        withCredentials: true
            },

            // Takes username and password variables and consumer key for authorisation
            beforeSend: function(xhr) {
                     xhr.setRequestHeader("Authorization", 'DirectLogin username="jaakko.fi.29@example.com", password="8132cf", consumer_key="lyyph2kcn3pkmbpcst44s425mnbbh5sorrtz5105"')
            },

            // On success indicates success to user and sets token value to the token received
            success: function success(data, textStatus, jQxhr ){
            	console.log("in success, Token: " + data.token);
            	document.getElementById("indicator").innerHTML="Success";
            	token = data.token;
                window.location.href="#page2"
            },

            // On error throws error message
            error: function fail( jqXhr, textStatus, errorThrown ){
            	console.log("in error");
            	document.getElementById("indicator").innerHTML="Failure";
            }
    });
 }


// Takes a bank ID as a parameter, sets a new variable to this ID and activates queryAcc
function output_bank(b) {
        console.log("Bank ID: "+b);
        bankid = b
        Acc()

}


// Appends bank full name, short name and ID for each bank in the table on page 2. Creates buttons in the bank full name data column which activates output_bank function, sending bank.id as a parameter, when clicked
function appendRow(bank){
    $("#tablebody").append("<tr><td><button onclick=output_bank('"+bank.id+"')>" + bank.full_name + "</button></td><td>" + bank.short_name + "</td><td>" +bank.id + "</td></tr>");

}


// Function sends data request to OBP for list of banks available to the logged-in user and receives JSON object in return with bank data
function queryOBP(){
    console.log("in query");
    $.ajax({
	    url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks",
	    type: "GET",
        dataType:"json",
        crossDomain: true,
	    cache: false,
	    contentType:"application/json; charset=utf-8",

        // Authorisation of request
	    beforeSend: function(xhr) {
		    xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
	    },

        // On success changes to page 3 and iterates through bank data using the appendRow function
	    success: function( data, textStatus, jQxhr ){
	        console.log("in query success");
	        console.log(data);
	        window.location.href="#page3"
            data.banks.forEach(appendRow);
	    },

        // On error throws error message
	    error: function( jqXhr, textStatus, errorThrown ){
		    console.log("in query error");
	    }
    });
}

// Takes account ID as a parameter and sets acc_id variable to the ID. Initiates queryTrans function
function output_acc(a){
    console.log("Acc ID: "+a);
    acc_id = a
    Transection()
    // Transection1()
}


// Appends account IDs to a table on page 3 using data received from queryAcc. Creates buttons which when clicked activate transaction retrieval
function appendAcc(account){
    $("#tablebody2").append("<tr><td><button onclick=output_acc('"+account.id+"')>" + account.id + "</button></td><td></td><td></td></tr>");
}


// Sends AJAX request to OBP for account ID information for a given bankid. Receives a JSON object in return with list of account IDs.
function Acc(){
    console.log("in Acc");
    // if (bankid = "gh.29.it"){
    $.ajax({
        url:  "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/gh.29.fi/accounts/private",
	    type: "GET",
        dataType:"json",
        crossDomain: true,
	    cache: false,
	    contentType:"application/json; charset=utf-8",

	    beforeSend: function(xhr) {
		    xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
	    },

        // On success changes to page4 and iterates through accounts using the appendAcc function
	    success: function( data, textStatus, jQxhr ){
	        console.log("in Acc success");
	        console.log(data);
	        window.location.href="#page4"
            data.accounts.forEach(appendAcc);

	    },
          

        // On error throws error message
	    error: function( jqXhr, textStatus, errorThrown ){
		    console.log("in query error");
	    }
    });}
    // else document.getElementById("indicator").innerHTML = "not found";


function appendTrans(trans){
        document.getElementById("amnt").innerHTML = "Amount (" + trans.details.value.currency + ")"
        document.getElementById("bal").innerHTML = "Balance (" + trans.details.value.currency + ")"
        date_and_time = trans.details.completed
        date = date_and_time.substring(0,10)
        time = date_and_time.substring(12,19)
        $("#tablebody3").append("<tr><td>" + date + "</td><td>" + trans.details.description + "</td><td>" + trans.details.value.amount + "</td><td>" + trans.details.new_balance.amount + "</td></tr>");
}


function Transection(){
    console.log("in Transection");
    $.ajax({
            url:  "https://apisandbox.openbankproject.com/obp/v4.0.0/my/banks/gh.29.fi/accounts/28aa4e5c-c89f-45d9-8b06-946f42d3ac0a/transactions",
    	    type: "GET",
            dataType:"json",
            crossDomain: true,
    	    cache: false,
    	    contentType:"application/json; charset=utf-8",

    	    beforeSend: function(xhr) {
    		    xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
    	    },

            // On success changes to page5 and iterates through accounts using the appendAcc function
    	    success: function( data, textStatus, jQxhr ){
    	        console.log("in Acc success");
    	        console.log(data);
    	        window.location.href="#page5"
                data.transactions.forEach(appendTrans);

    	    },

            // On error throws error message
    	    error: function( jqXhr, textStatus, errorThrown ){
    		    console.log("in query error");
    	    }
        });

}
// function Transection1(){
//     console.log("in Transection1");
//     $.ajax({
//             url:  "https://apisandbox.openbankproject.com/obp/v4.0.0/my/banks/gh.29.fi/accounts/9c0502d7-c076-424d-a2bc-cb689edb4734/transactions",
//     	    type: "GET",
//             dataType:"json",
//             crossDomain: true,
//     	    cache: false,
//     	    contentType:"application/json; charset=utf-8",

//     	    beforeSend: function(xhr) {
//     		    xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
//     	    },

//             // On success changes to page5 and iterates through accounts using the appendAcc function
//     	    success: function( data, textStatus, jQxhr ){
//     	        console.log("in Acc success");
//     	        console.log(data);
//     	        window.location.href="#page5"
//                 data.transactions.forEach(appendTrans);

//     	    },

//             // On error throws error message
//     	    error: function( jqXhr, textStatus, errorThrown ){
//     		    console.log("in query error");
//     	    }
//         });

// }

function emptyTable(){
    $("#tablebody2").empty();
}
