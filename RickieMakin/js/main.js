/* ========================================================================= */
/*  Preloader Script
/* =========================================================================

window.onload = function () {
    document.getElementById('loading-mask').style.display = 'none';
} */

// Global Vars

GiveMode="whole";

macro = "https://script.google.com/macros/s/AKfycbybU9-gV3XIMrgjkE0onLZcQfe7_yXpDy_fBclHFaR5vGjLLCqNhLhXSHzuPYOb5xEr7Q/exec";

sheetID = "10WLo1fWiuVfTgDM9WB39jfwsGT3M2ZWuSM0xsEVAlJs";

$( document ).ready(fetchResults); // fetch data from backend to populate sheet, once document is ready

$(function(){
    /* ========================================================================= */
    /*  Menu item highlighting
    /* ========================================================================= */

    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() > 400) {
            jQuery("#navigation").css("background-color","#00C7FC");
            jQuery("#navigation").addClass("animated-nav");
        } else {
            jQuery("#navigation").css("background-color","transparent");
            jQuery("#navigation").removeClass("animated-nav");
        }
    });

    $('#nav').onePageNav({
        filter: ':not(.external)',
        scrollSpeed: 950,
        scrollThreshold: 1
    });

    // Slider Height
    var slideHeight = $(window).height();
    $('#home-carousel .carousel-inner .item, #home-carousel .video-container').css('height',slideHeight);

    $(window).resize(function(){'use strict',
        $('#home-carousel .carousel-inner .item, #home-carousel .video-container').css('height',slideHeight);
    });

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


function setGiveMode(mode) {

	if (mode=="whole") {
		GiveMode = "whole";
		val="none";
		document.getElementById("gift-total").readOnly=false;
	}
	else {
		GiveMode = "specific";
		val="inline";
		document.getElementById("gift-total").readOnly=true;
		recalcTotal();

	}
	
	document.getElementById("cause-selector").style.display=val;
	document.getElementById("cause-amount").style.display=val;
	document.getElementById("add-cause").style.display=val;
	document.getElementById("selection-instructions").style.display=val;

	// check if the gift table is populated and only display if "specific" and populated
	
	if (document.getElementById("gift-table").getElementsByTagName("tr").length>1) {
		document.getElementById("gift-table").style.display=val; // display
	}
	else
		document.getElementById("gift-table").style.display="none"; // display
	
	return;
}

function deleteGiftItem(elem) {
	

	elem.remove();
	recalcTotal();
	
	return;
}
	
function addGiftItem() {
	
	s=document.forms[0]["cause-list"];
	cause = s.options[s.selectedIndex].text;
	value = s.options[s.selectedIndex].value;

	a=document.forms[0]["cause-amount"];
	amount = a.value;
	
	row = document.createElement("tr")

	document.getElementById("gift-table").style.display="inline"; // ensure gift-table is displayed

	row.innerHTML="<td style='display:none'>"+value+"</td><td>"+cause+"</td><td>"+amount+"</td><td><i class='fa fa-trash-alt' onclick='deleteGiftItem(this.parentElement.parentElement);'></i></td>";
	document.getElementById("gift-table").getElementsByTagName("tbody")[0].appendChild(row);

	recalcTotal();
	
	return;
}

function recalcTotal() {
	
	g = document.getElementById("gift-table").getElementsByTagName("tr");
	
	t = 0;
	for (var i=1; i<g.length; i++) { // skip header row

		v = parseInt(g[i].childNodes[2].innerText);
		//alert(v);
		t += v;
	}
	
	document.getElementById("gift-total").value=t;

	return;
}

function submitContribution() {
	
	b = document.getElementById("msg-submit");
	b.style.backgroundColor="#aaaaaa";
	b.value="SUBMITTING ...";	
	b.disabled="disabled";
	
	//document.getElementById("spinner").style.display="block";
	
	inputs=document.getElementsByTagName("input")

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
	
	// fetch Messages
	
	procRange(sheetID,"Output!J3:K8", updateMessages);
	
	// fetch Recent Gifts
	
	procRange(sheetID,"Output!M3:O7", updateGifts);
	
}

function throwError() {
	
	//alert("Error!");
	
	document.getElementById("error").style.display="block";
}	

function updateCounter(data) {

	if( !data | data.length==0) {
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

function updateMessages(data) {
	
	if( !data | data.length==0) {
			throwError();
			return;
	}
	
	//alert("updateMessages: "+data.length+"\n"+data[0]);
	
	//alert(data);
	
	p = document.getElementById("testimonial").getElementsByTagName("p");
	
	s = document.getElementById("testimonial").getElementsByTagName("span");
	
	//alert("p length:"+p.length+"\ndata length:"+data.length);
	
	for (var r=0; r<data.length && r<p.length; r++) {
		
		s[r].innerText = data[r][0];
		p[r].innerText = data[r][1];
	}
	
}

function updateGifts(data) {

	if( !data | data.length==0) {
			throwError();
			return;
	}
	
	//alert("updateGifts: "+data.length+"\n"+data[0]);	
	
	//alert(data);
	
	rows = document.getElementById("recentGifts").getElementsByTagName("tr");
	
	for (var r=0; r<rows.length; r++) {
		
		cells = rows[r].getElementsByTagName("td");
		
		for (c in cells) {
			cells[c].innerText = data[r][c];
		}
	}
}