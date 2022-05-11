/* ========================================================================= */
/*  Preloader Script
/* =========================================================================

window.onload = function () {
    document.getElementById('loading-mask').style.display = 'none';
} */

// Global Vars

macro = "https://script.google.com/macros/s/AKfycbybU9-gV3XIMrgjkE0onLZcQfe7_yXpDy_fBclHFaR5vGjLLCqNhLhXSHzuPYOb5xEr7Q/exec";

sheetID = "10WLo1fWiuVfTgDM9WB39jfwsGT3M2ZWuSM0xsEVAlJs";

$( document ).ready(fetchResults); // fetch data from backend to populate sheet, once document is ready

$(function(){
    /* ========================================================================= */
    /*  Menu item highlighting
    /* ========================================================================= */

//    jQuery(window).scroll(function () {
//       if (jQuery(window).scrollTop() >= 0) {
//            jQuery("#navigation").css("background-color","#00C7FC");
//            jQuery("#navigation").addClass("animated-nav");
//        } else {
//            jQuery("#navigation").css("background-color","transparent");
//            jQuery("#navigation").removeClass("animated-nav");
//        }
//    });

    $('#nav').onePageNav({
        filter: ':not(.external)',
        scrollSpeed: 950,
        scrollThreshold: 1
    });

/*    // Slider Height
    var slideHeight = $(window).height();
    $('#home-carousel .carousel-inner .item, #home-carousel .video-container').css('height',slideHeight);

    $(window).resize(function(){'use strict',
        $('#home-carousel .carousel-inner .item, #home-carousel .video-container').css('height',slideHeight);
    });
*/
    // portfolio filtering

    $("#projects").mixItUp();

    //fancybox

    $(".fancybox").fancybox({
        padding: 0,

        openEffect : 'elastic',
        openSpeed  : 650,

        closeEffect : 'elastic',
        closeSpeed  : 550,
    });


    /* ========================================================================= */
    /*  Facts count
    /* ========================================================================= */

    "use strict";
    $(".fact-item").appear(function () {
        $(".fact-item [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });

/* ========================================================================= */
/*  On scroll fade/bounce fffect
/* ========================================================================= */

    $("#testimonial").owlCarousel({
        pagination : true, // Show bullet pagination
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true
    });

});

/* ========================================================================= */
/*  On scroll fade/bounce fffect
/* ========================================================================= */

    wow = new WOW({
        animateClass: 'animated',
        offset: 100,
        mobile: false
    });
    wow.init();

/* ---------------------------------------------------------------------- */
/*      Progress Bars
/* ---------------------------------------------------------------------- */

initProgress('.progress');

function initProgress(el){
    jQuery(el).each(function(){
        var pData = jQuery(this).data('progress');
        progress(pData,jQuery(this));
    });
}


            
function progress(percent, $element) {
    var progressBarWidth = 0;
    
    (function myLoop (i,max) {
        progressBarWidth = i * $element.width() / 100;
        setTimeout(function () {   
        $element.find('div').find('small').html(i+'%');
        $element.find('div').width(progressBarWidth);
        if (++i<=max) myLoop(i,max);     
        }, 10)
    })(0,percent);  
}   


function toggleCause(cause) {
	
	fig = document.getElementById(cause);
	opt = document.getElementById("opt-"+cause);
	
	if (opt.style.display=="inline") {
		
		// cause has been selected
		
		fig.style.border = "";
		fig.style.padding = "30px 30px";
		opt.style.display = "none";
	}
	else {
		// cause has not been selected
		
		fig.style.border="5px solid #00C7FC";
		fig.style.padding="10px 10px";
		opt.style="display: inline;";
	}
}

function setRequiem() {
	
	
	figs = document.getElementsByTagName("figure");
	for (f=0;f<figs.length; f++) {
		figs[f].style.border="";
	}
	
	figs[figs.length-1].style.border = "5px solid #00C7FC";
	fig.style.padding = "10px 10px";
	
	opts = document.getElementsByTagName("label");
	for (l=0; l<opts.length-1; l++) {
		if(opts[l].id == "opt-requiem") {
			opts[l].style.display="inline";
		}
		else {
			opts[l].style.display="none";
		}
	}
	
	//document.getElementById("claimMatch").style.display="block";
}	
	

function submitContribution() {

	
	b = document.getElementById("msg-submit");
	b.style.backgroundColor="#aaaaaa";
	b.value="SUBMITTING ...";	
	b.disabled="disabled";
	
	//document.getElementById("spinner").style.display="block";
	
	inputs=document.getElementsByTagName("label")

	for (i in inputs)
		inputs[i].disabled="disabled";

	document.getElementById("cause-list").disabled=true;

	document.getElementById("msg-txt").disabled="disabled";
	dels = document.getElementById("gift-table").getElementsByTagName("svg");

	for (d in dels)
		dels[d].onclick="";


	$('#submit-dialog').modal('show');
	
	procRange(sheetID,"Gifts!A1:B2", postGift);

return;
}

function postGift(data) {
	
	//alert("Row: "+data[0][0]+"\nGiftID: "+data[1][0]);
	
	if( !data | data.length==0) {
			throwError();
			return;
	}
	
	offset=data[0][0];
	giftID=data[1][0];
	
		
	document.getElementById("giftID").value = giftID;	// store giftID in hidden value in form

	name 	= document.getElementsByName("contribution")[0]["name"].value;
	email 	= document.getElementsByName("contribution")[0]["email"].value;
	message = document.getElementsByName("contribution")[0]["message"].value;
	gtype 	= document.getElementsByName("contribution")[0]["gift-type"].value;
	amount	= document.getElementsByName("contribution")[0]["total"].value;
	
	dt = new Date(Date.now()).toLocaleString().replace(",","");
	
	rows = document.getElementById("gift-table").getElementsByTagName("tr");
	
	instr = "{";
	
	for (r=1; r<rows.length; r++) {		// skip header row
		instr += rows[r].firstChild.innerText;
		instr += ":";
		instr += rows[r].firstChild.nextSibling.nextSibling.innerText;
		instr += ",";
	}
	
	instr += "}";
	instr=instr.replace(",}","}");
	
	if (gtype=="whole")
		instr="";
	
	gift = [giftID, dt, name,email,message,gtype,amount ,instr];
	
	range = "Gifts!B"+offset;

	giftStr=gift.join("|");
	
	url = macro+"?action=setRange&sheet="+sheetID+"&range="+range+"&value="+giftStr+"&callback=?"

	$.getJSON(url).fail(throwError);
	
	// build link URL
	
	l = document.getElementById("donationLink");
	details = "&amount="+amount+"&note_text=for:RickieMakin;from:"+email+";giftID="+giftID;
	
	l.href = l.href + details;

	b = document.getElementById("msg-submit");
	b.style.backgroundColor="#00c7fc";
	b.value="SUBMITTED";

	document.getElementById("response").style.display="block";
	document.getElementById("check").style.display="block";
	document.getElementById("spinner").style.display="none";
	
	//setTimeout($('#submit-dialog').modal('hide'),5000);
	
	setTimeout(function(){$('#submit-dialog').modal('hide')},2000);
	
	document.getElementById("msg-submit").scrollIntoView(true);
	
	return;	
}


function setCell(sheetID, rangeName, val) {

	url = macro+"?action=set&sheet="+sheetID+"&range="+rangeName+"&value="+val+"&callback=?"

	//alert(url);

	//$.getJSON(url,function(data){ alert(data.updatedRows);});

	$.getJSON(url).fail(throwError);

  return;

}


function procRange(sheetID, rangeName, func) {
    
	url = macro+"?action=getRange&sheet="+sheetID+"&range="+rangeName+"&callback=?"

	$.getJSON(url,func ).fail(throwError);


  return;
}



function fetchResults() {

	//var sheetID = "10WLo1fWiuVfTgDM9WB39jfwsGT3M2ZWuSM0xsEVAlJs";
	
	// fetch Counter

	procRange(sheetID,"Output!C2:F4",updateCounter);  // grab headers too to force array
	
	
}

function throwError() {
	
	//alert("Error!");
	
	$('#submit-dialog').modal('show');
	
	document.getElementById("spinner").style.display="none";
	document.getElementById("check").style.display="none";
		
	document.getElementById("error").style.display="block";
	
	return;
}	

function updateCounter(data) {

	if( !data) {
			throwError();
			return;
	}	
	//alert("updateCounter: "+data.length+"\n"+data[0]);
	
	// update total donations
	
	document.getElementById("totalDonations").innerText = data[1][0];
	
	// update count of donors
	
	document.getElementById("countDonors").innerText = data[1][1];
	
	// update funds remaining
	
	document.getElementById("fundsRemaining").innerText = data[1][2];

	// update days running
	
	document.getElementById("daysRunning").innerText = data[1][3];

}

