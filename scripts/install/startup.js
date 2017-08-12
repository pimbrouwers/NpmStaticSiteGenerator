require.config({});

var App = null;

require(['jquery', 'knockout', 'js/app', 'js/dom-bindings'], function($, ko, AppModel, DomBindings){       
    DomBindings.Register();    

    App = new AppModel();

    ko.applyBindings(App);  
    
    App.Initialize();
});
