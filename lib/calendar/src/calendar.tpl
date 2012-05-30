<div>
<table class="ui-calendar">
    <thead>
        <tr class="ui-calendar-months">
            <td class="ui-calendar-previous-year">&lt;&lt;</td>
            <td class="ui-calendar-previous-month">&lt;</td>
            <td colspan="3"><span class="month">{{active.month}}</span> <span class="year">{{active.year}}</span></td>
            <td class="ui-calendar-next-month">&gt;</td>
            <td class="ui-calendar-next-year">&gt;&gt;</td>
        </tr>
        <tr class="ui-calendar-weeks">
            {{#each weeks}}
            <td>{{this}}</td>
            {{/each}}
        </tr>
    </thead>
    <tbody class="ui-calendar-dates">
        {{#table dates}}
        <td class="{{label}}{{#unless available}} disable{{/unless}}">{{value}}</td>
        {{/table}}
    </tbody>
    <tfoot>
        <tr>
            <td colspan="5">Today</td>
            <td colspan="2"><span class="ui-calendar-hour">{{active.hour}}</span> : {{active.minute}}</td>
        </tr>
    </tfoot>
</table>
</div>
