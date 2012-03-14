<div id="${content_id}" class="aralex-calcontainer" style="display:none">
	<div class="aralex-calendar">
		<script type="text/html" id="tmpl_days">
			<% for (var i=0; i<days.length; i++){ %>
				<% if(i%7==0) { %><div class="w<%=i%>"><% } %>
				<% 
					var classes = ['calcell'];
					if(dates[i] == today){
						classes.push('today');
					}
					if(selected.length>1){
						if(dates[i]==selected[0]) {
							classes.push('selected');
						}
						if(dates[i]==selected[selected.length-1]) {
							classes.push('selected');
						}
					}else{
						if(dates[i]==selected[0]){
							classes.push('selected');
						}
					}
					for(var j=0; j<selected.length; j++) {
						if(dates[i] == selected[j] && dates[i] != today && i>0 ) {
							classes.push('activeable');
						}
					}
					var c_year  = parseFloat(dates[i].split(delimiter)[0]);
					var c_month = parseFloat(dates[i].split(delimiter)[1]);
					var c_day   = parseFloat(dates[i].split(delimiter)[2]);
					var selector = "selector";
					if($Date(c_year,c_month,c_day).date < mindate.date || $Date(c_year,c_month, c_day).date > maxdate.date) {
						classes.push('oom');
						selector = '';
					}else{
						if(dates[i].split(delimiter)[1] != month && !full_selector){
							classes.push('oom');
							selector = '';
						}
					}
				
				%>
				<span class="<%=classes.join(' ')%>">
					<%if($A(classes).indexOf("oom") >= 0){%>
						<a class="gray" href="javascript:void(0)" data-date="<%=dates[i]%>"><%=days[i]%></a>
					<%}else{%>
						<a class="<%=selector%>" href="javascript:void(0)" data-date="<%=dates[i]%>"><%=days[i]%></a>
					<%}%>
				</span>
				<% if(i%7==6) { %></div><% } %>
			<% } %>
		</script>
	
		<script type="text/html" id="tmpl_header">
			<%
				s_month = 1;
				e_month = 12;
				if(year == mindate.year){
					s_month = mindate.month;
				}
				if(year == maxdate.year){
					e_month = maxdate.month;
				}
				
			%>
			<% if(year+s_month.toString()!=mindate.year+""+month) { %>
				<a href="#" class="calnavleft changedate" data-changedate="<%=predate%>">上一月</a>
			<% } %>
			<% if(!dropfilter) { %>
				<span class="header-year"><%=year%>年</span> <span class="header-month"><%=month%>月</span> 
			<% } else { %>
				<select class="drop-year-select filterchange">
					<% for (var i=0;i<drop_section.length;i++) { %>
						<%
							var default_smonth = 1;
							if(i==0){
								default_smonth = mindate.month;
							}
						%>
						<% if(drop_section[i] == year) { %>
							<option value="<%=(drop_section[i]+delimiter)%><%=default_smonth%>" selected="selected"><%=drop_section[i]%></option>
						<% } else { %>
							<option value="<%=(drop_section[i]+delimiter)%><%=default_smonth%>"><%=drop_section[i]%></option>
						<% } %>
					<% } %>
				</select> 年
				<select class="drop-month-select filterchange">
					<% for (var i=s_month;i<=e_month;i++) { %>
						<% if(i == month) { %>
							<option value="<%=(year+delimiter)%><%=i%>" selected="selected"><%=i%></option>
						<% } else { %>
							<option value="<%=(year+delimiter)%><%=i%>"><%=i%></option>
						<% } %>	
					<% } %>
				</select> 月
			<% } %>
			<% if(year+e_month.toString()!=maxdate.year+""+month) { %>
				<a href="#" class="calnavright changedate" data-changedate="<%=nextdate%>">下一月</a>
			<% } %>
			</div>
		</script>
	
		<script type="text/html" id="tmpl_weeks">
			<% for (var i=0; i<weeks.length; i++){ %>
				<span class="calweekdaycell"><%=weeks[i]%></span>
			<% } %>
		</script>
		<div class="calheader" id="${id}_tmpl_header">
			<div class="calcurrentdate"></div>
		</div>
		<div class="calweekdayrow" id="${id}_tmpl_weeks"></div>
		<div class="calbody" id="${id}_tmpl_days"></div>
	</div>
</div>
