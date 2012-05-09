define(function(require, exports, module) {

    var ruleFactory = null;

    function registerRules(rules) {
        ruleFactory = rules;
        console.log('registerRules');
    }

    function _metaValidate(ele) {
    }

    function validateItem() {
    }

    function validateForm() {
    }

    exports.registerRules = registerRules;
});
