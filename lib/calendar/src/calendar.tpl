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
        <tr>
            <td></td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
        </tr>
        <tr>
            <td>7</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>13</td>
        </tr>
        <tr>
            <td>14</td>
            <td>15</td>
            <td>16</td>
            <td>17</td>
            <td>18</td>
            <td>19</td>
            <td>20</td>
        </tr>
        <tr>
            <td>21</td>
            <td>22</td>
            <td>23</td>
            <td>24</td>
            <td>25</td>
            <td>26</td>
            <td>27</td>
        </tr>
        <tr>
            <td>28</td>
            <td>29</td>
            <td>30</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="5">Today</td>
            <td colspan="2"><span class="ui-calendar-hour">12</span> : 22</td>
        </tr>
    </tfoot>
</table>
</div>
