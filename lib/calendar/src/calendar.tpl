<div class="ui-calendar">
    <ul class="ui-calendar-navigation" data-role="navigation">
        <li class="ui-calendar-previous-year" data-role="prev-year">&lt;&lt;</li>
        <li class="ui-calendar-previous-month" data-role="prev-month">&lt;</li>
        <li class="ui-calendar-month-year" data-role="month-year">
        {{#with month.current}}
        <span class="month" data-role="mode-month" data-value="{{value}}">{{label}}</span>
        {{/with}}
        <span class="year" data-role="mode-year">{{year.current}}</span>
        </li>
        <li class="ui-calendar-next-month" data-role="next-month">&gt;</li>
        <li class="ui-calendar-next-year" data-role="next-year">&gt;&gt;</li>
    </ul>

    <ul class="ui-calendar-control" data-role="control">
        {{#if mode.date}}
        {{#each day.items}}
        <li class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{label}}</li>
        {{/each}}
        {{/if}}
    </ul>

    <div class="ui-calendar-datalist" data-role="datalist">
        {{#if mode.date}}
        {{#each date.items}}
        <ul class="ui-calendar-date-column">
            {{#each this}}
            <li class="{{status}} ui-calendar-day-{{day}}{{#unless available}} disabled{{/unless}}" data-role="date" data-date="{{date}}" data-month="{{month}}" data-year="{{year}}">{{date}}</li>
            {{/each}}
        </ul>
        {{/each}}
        {{/if}}

        {{#if mode.month}}
        {{#each month.items}}
        <ul class="ui-calendar-month-column">
            {{#each this}}
            <li {{#if selected}}class="focus"{{/if}} data-role="month" data-value="{{value}}">{{label}}</li>
            {{/each}}
        </ul>
        {{/each}}
        {{/if}}

        {{#if mode.year}}
        {{#each year.items}}
        <ul class="ui-calendar-year-column">
            {{#each this}}
            <li {{#if current}}class="focus"{{/if}} data-role="year" data-value="{{value}}">{{value}}</li>
            {{/each}}
        </ul>
        {{/each}}
        {{/if}}
    </div>

    <ul class="ui-calendar-footer">
        <li class="ui-calendar-today" data-role="today">{{i18n.today.value}}</li>
        <li class="ui-calendar-time" colspan="2" data-role="time"><span class="ui-calendar-hour">{{time.hour}}</span> : {{time.minute}}</li>
    </ul>
</div>
