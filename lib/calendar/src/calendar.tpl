<div>
    <table class="ui-calendar">
        <thead>
            <tr class="ui-calendar-navigation">
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
        <tbody class="ui-calendar-datalist" data-role="datalist">
            <tr>
                <td colspan="7">
                    {{#if mode.date}}
                    {{#each date.items}}
                    <ul class="ui-calendar-date-column">
                        {{#each this}}
                        <li class="{{status}} week-{{day}}{{#unless available}} disabled{{/unless}}" data-role="date" data-date="{{date}}" data-month="{{month}}">{{date}}</li>
                        {{/each}}
                    </ul>
                    {{/each}}
                    {{/if}}

                    {{#if mode.month}}
                    {{#each month.items}}
                    <div class="ui-calendar-month-column">
                        {{#each this}}
                        <a>{{value}}</a>
                        {{/each}}
                    </div>
                    {{/each}}
                    {{/if}}
                </td>
            </tr>
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
