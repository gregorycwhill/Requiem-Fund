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

function deleteGiftItem(item) {
	
	r = document.getElementById(item);
	r.remove();
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
	row.id = Math.trunc(Math.random()*1000000);

	document.getElementById("gift-table").style.display="inline"; // ensure gift-table is displayed

	row.innerHTML="<td>"+cause+"</td><td>"+amount+"</td><td><i class=\"fa fa-trash-alt\" onclick=\"deleteGiftItem(this.parentElement.parentElement.id);\"></i></td><td  style='display: none'>"+value+"</td>";
	document.getElementById("gift-table").getElementsByTagName("tbody")[0].appendChild(row);

	recalcTotal();
	
	return;
}

function recalcTotal() {
	
	g = document.getElementById("gift-table").getElementsByTagName("tr");
	
	t = 0;
	for (i in g) {
		
		if(g[i].id) {
			v = parseInt(g[i].childNodes[1].innerText);
			//alert(v);
			t += v;
		}
	}
	
	document.getElementById("gift-total").value=t;

	return;
}

function submitContribution() {
	
	b = document.getElementById("msg-submit");
	b.style.backgroundColor="#aaaaaa";
	b.value="SUBMITTING ...";	
	b.disabled="disabled";
	inputs=document.getElementsByTagName("input")

	for (i in inputs)
		inputs[i].disabled="disabled";

	document.getElementById("cause-list").disabled=true;

	document.getElementById("msg-txt").disabled="disabled";
	dels = document.getElementById("gift-table").getElementsByTagName("svg");

	for (d in dels)
		dels[d].onclick="";

	procRange(sheetID,"Gifts!A1:B2", postGift);

return;
}

function postGift(data) {
	
	//alert("Row: "+data[0][0]+"\nGiftID: "+data[1][0]);
	
	document.getElementById("giftID").value = data[1][0];	// store giftID in hidden value in form

	gift = ["1234",Date.now(), "Display","email","Message","Fund","$1234","{0:100,1:234,5:6422}"];
	
	range = "Gifts!B20";

	giftStr=gift.join("|");
	
	url = macro+"?action=setRange&sheet="+sheetID+"&range="+range+"&value="+giftStr+"&callback=?"

	$.getJSON(url);
	
	// build link URL
	
	l = document.getElementById("donationLink");
	amt = document.getElementById("gift-total").value;
	giftID = document.getElementById("giftID").value;
	
	details = "&amount="+amt+"&note_text=for:RickieMakin;giftID="+giftID;
	
	l.href = l.href + details;

	b = document.getElementById("msg-submit");
	b.style.backgroundColor="#00c7fc";
	b.value="SUBMITTED";
	document.getElementById("response").style.display="block";

	return;	
}


function setCell(sheetID, rangeName, val) {

	url = macro+"?action=set&sheet="+sheetID+"&range="+rangeName+"&value="+val+"&callback=?"

	//alert(url);

	//$.getJSON(url,function(data){ alert(data.updatedRows);});

	$.getJSON(url);

  return;

}


function procRange(sheetID, rangeName, func) {
    
	url = macro+"?action=getRange&sheet="+sheetID+"&range="+rangeName+"&callback=?"

	$.getJSON(url,func );


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
	

function updateCounter(data) {
	
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