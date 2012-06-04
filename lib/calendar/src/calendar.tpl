<div>
<table class="ui-calendar">
    <thead>
        <tr class="ui-calendar-months">
            <td class="ui-calendar-previous-year" data-role="prev-year">&lt;&lt;</td>
            <td class="ui-calendar-previous-month" data-role="prev-month">&lt;</td>
            <td colspan="3" data-role="month-year">
                {{#with month.current}}
                <span class="month" data-role="month" data-value="{{value}}">{{label}}</span>
                {{/with}}
                <span class="year" data-role="year">{{year.current}}</span>
            </td>
            <td class="ui-calendar-next-month" data-role="next-month">&gt;</td>
            <td class="ui-calendar-next-year" data-role="next-year">&gt;&gt;</td>
        </tr>
        <tr class="ui-calendar-weeks" data-role="weeks">
            {{#each week.items }}
            <td class="week-{{value}}" data-role="week" data-value="{{value}}">{{label}}</td>
            {{/each}}
        </tr>
    </thead>
    <tbody class="ui-calendar-dates" data-role="dates">
        {{#each date.items}}
        <tr>
        {{#each this}}
        <td class="{{label}} week-{{day}}{{#unless available}} disabled{{/unless}}" data-role="date" data-value="{{date}}">{{date}}</td>
        {{/each}}
        </tr>
        {{/each}}
    </tbody>
    <tfoot>
        <tr>
            <td colspan="2" data-role="today">{{today}}</td>
            <td colspan="3"></td>
            <td colspan="2" data-role="time"><span class="ui-calendar-hour">{{time.hour}}</span> : {{time.minute}}</td>
        </tr>
    </tfoot>
</table>
</div>
