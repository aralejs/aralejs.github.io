<div id="${id}_suggestBox" class="fn-hide ${scClassName}">
	<script type="text/html" id="suggestItems">
		<ul>
		<% for (var i=0; i<items.length; i++){ %>
			<% var item = items[i]; %>
			<li class="ui-menu-item suggest_o"><%=item.value%></li>		
		<% } %>
		</ul>
	</script>
    <div id="${id}_suggestItems" class="ui-menu ui-popmenu ui-menu-radios fn-hide"></div>
</div>
