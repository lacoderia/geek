$(function() {

	$.ajax({
    type: "GET",
    url: "/counties_all.json",
    data_type: "json",
    success: function(data, textStatus, jqXHR) {
			var availableTags = data; 
			$( "#tags" ).autocomplete({
				select: function(event, ui) {
					event.preventDefault();
					$("#tags").val(ui.item.label);
				},
	      source: availableTags
  	  });
    },
    error: function() {
			alert("Error obteniendo colonias");
    } 
  });
});
