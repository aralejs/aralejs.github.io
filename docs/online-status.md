# Online Status

- order: 9

--------------

## Arale

<div id="status-arale"></div>


## Gallery

<div id="status-gallery"></div>


## Alipay

<div id="status-alipay"></div>


<script>
seajs.config({
    alias: {
        'jquery': 'jquery/1.7.2/jquery',
        'status-arale': 'http://aralejs.alipay.im/status-arale.js',
        'status-gallery': 'http://aralejs.alipay.im/status-gallery.js',
        'status-alipay': 'http://aralejs.alipay.im/status-alipay.js'
    }
});
seajs.use(['jquery', 'status-arale', 'status-gallery', 'status-alipay'],
function($, arale, gallery, alipay) {
console.log(arale);
});
</script>
