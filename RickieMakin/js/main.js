/* ========================================================================= */
/*  Preloader Script
/* =========================================================================

window.onload = function () {
    document.getElementById('loading-mask').style.display = 'none';
} */

// Global Vars

GiveMode="whole";


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
b.value="CHECKING";	
b.disabled="disabled";
inputs=document.getElementsByTagName("input")

for (i in inputs)
	inputs[i].disabled="disabled";

document.getElementById("cause-list").disabled=true;

document.getElementById("msg-txt").disabled="disabled";
dels = document.getElementById("gift-table").getElementsByTagName("svg");

for (d in dels)
	dels[d].onclick="";



setTimeout(function () {
						b = document.getElementById("msg-submit");
						b.style.backgroundColor="#00c7fc";
						b.value="SUBMITTED";
						document.getElementById("response").style.display="block";
					}, 3000); 

return;
}



function getCell(sheetID, rangeName, htmlID) {

  if(!sheetID)
    sheetID = '1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8';
  if (!rangeName)
    rangeName = 'Experiment!B3';
    
	url = "https://script.google.com/macros/s/AKfycbwARmLZht0rIZHsB61HljietXbQ29BFj0mtxZTeUpXzvAmg0VhLO1uYRsr62_MSDNE/exec?action=get&sheet="+sheetID+"&range="+rangeName+"&callback=?"

	//alert(url);

	$.getJSON(url,function(data){ document.getElementById(htmlID).value=data; });
//	$.getJSON(url,function(data){ alert(data[0]);});
  // var values = Sheets.Spreadsheets.Values.get(sheetID, rangeName).values;

 
  return;
}

function setCell(sheetID, rangeName, val) {

  if(!sheetID)
    sheetID = '1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8';
  if (!rangeName)
    rangeName = 'Experiment!B3';
  
  if (!val)
    val = 2;

	url = "https://script.google.com/macros/s/AKfycbwARmLZht0rIZHsB61HljietXbQ29BFj0mtxZTeUpXzvAmg0VhLO1uYRsr62_MSDNE/exec?action=set&sheet="+sheetID+"&range="+rangeName+"&value="+val+"&callback=?"

	//alert(url);

	//$.getJSON(url,function(data){ alert(data.updatedRows);});

	$.getJSON(url);

	if (rangeName == "Experiment!B1") { // if setting UserID, reset portfolio parameters		
		setParameters();
	}
  return;

}

function getRange(sheetID, rangeName, htmlID) {

  if(!sheetID)
    sheetID = '1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8';
  if (!rangeName)
    rangeName = 'Experiment!B3';
    
	url = "https://script.google.com/macros/s/AKfycbxlJlqJYGmM9aUgU85yKBIoDEkD8MRDV1tCdmVO21jROeXPIJcm8q0OB-abmyTpyBihjg/exec?action=getRange&sheet="+sheetID+"&range="+rangeName+"&callback=?"



//	alert(url);

$.getJSON(url,function(data){ Range2Table(htmlID, data); });
// $.getJSON(url,function(data){ alert(data.length);});
  // var values = Sheets.Spreadsheets.Values.get(sheetID, rangeName).values;

 
  return;
}

function Range2Table(htmlID, data) {

	t = document.createElement("table");
	t.id=htmlID+"-table";
	
	for (r=0; r<data.length; r++) {
		row = document.createElement("tr");
		t.appendChild(row);
		for (c=0; c<data[r].length; c++) {
			col = document.createElement("td");
			col.innerText = data[r][c];
			row.appendChild(col);
		}
	}
	
	document.getElementById(htmlID).appendChild(t);
	
//	alert(htmlID + data.length);
	return;
}