<div>
<table class="ui-calendar">
    <thead>
        <tr class="ui-calendar-months">
            <td class="ui-calendar-previous-year">&lt;&lt;</td>
            <td class="ui-calendar-previous-month">&lt;</td>
            <td colspan="3"><span class="month">May</span> <span class="year">2012</span></td>
            <td class="ui-calendar-next-month">&gt;</td>
            <td class="ui-calendar-next-year">&gt;&gt;</td>
        </tr>
        <tr class="ui-calendar-weeks">
            {{#each weeks}}
            <td>{{this}}</td>
            {{/each}}
        </tr>
    </thead>
    <tbody>
        {{#table dates}}{{value}}{{/table}}
    </tbody>
    <tfoot>
        <tr>
            <td colspan="5">Today</td>
            <td colspan="2"><span class="ui-calendar-hour">{{active.hour}}</span> : {{active.minute}}</td>
        </tr>
    </tfoot>
</table>
</div>
