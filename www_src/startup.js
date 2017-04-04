define(['jquery', 'knockout'], function($, ko){
    //custom bindings
    ko.bindingHandlers.bgSlider = {
        init: function (element) {
            console.log(element);
        }
    };
    

    ko.applyBindings({});
});