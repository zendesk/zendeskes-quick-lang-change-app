(function() {
    "use strict";
    return {
        fav_container: null,
        container: null,
        spinner: null,
        button: null,
        requests:{
            getAllLocales: function(){
                return{
                    url:"/api/v2/locales/public.json",
                    type:"GET"
                };
            },
            doChangeLocale: function(uID,locale){
                return{
                    url: "/api/v2/users/"+uID+".json",
                    type: "PUT",
                    dataType: 'json',
                    data: {"user":{"locale_id":locale}}
                };
            }
        },
        events: {
            'pane.activated':'initialize',
            'click #change_it':'changeLocale',
            'click .fav_btn':'changeLocale'
        },

        initialize: function() {
            this.populateDD();
        },
        validSettings: function(locales){
            return locales.length >= 2
        },
        hideStuff: function(){
            this.button.hide();
            this.spinner.show();
            this.fav_container.hide();
            this.container.hide();
        },
        showStuff: function(){
            this.fav_container.empty();
            this.fav_container.show();
            this.button.show();
            this.spinner.hide();
        },
        populateDD: function(){
            var fav_list = this.setting('fav').split(',');
            if(this.validSettings(fav_list)){
                this.switchTo('main');
                var currentLocale = this.currentUser().locale();
                //Get all languages
                var localeList = this.ajax('getAllLocales');
                //hide the container and show the spinner.
                this.container = this.$('#lang_choser');
                this.spinner = this.$('#loading');
                this.button = this.$('#change_it');
                this.fav_container = this.$('#fav_langs');
                this.hideStuff();
                this.when(localeList).done(function(data){
                    this.container.empty();
                    this.container.show();
                    this.showStuff();
                    _.each(data.locales, function(locale){
                        //Fill in the dropdown
                        this.container.append('<option id="'+locale.locale+'" value="'+locale.id+'">('+locale.locale+') '+locale.name+'</option>');
                    },this);
                        for(var i = 0;i<fav_list.length;i++){
                            if(i==8){
                                break;
                            }else{
                                if(i%2 === 0){
                                    this.fav_container.append('<div><button id="b_'+this.getLocaleID(fav_list[i],data.locales)+'" class="fav_btn">'+fav_list[i]+'</button><button id="b_'+this.getLocaleID(fav_list[i+1],data.locales)+'" class="fav_btn">'+fav_list[i+1]+'</button></div>');
                                }
                            }
                        }
                });
            }else{
                this.switchTo('error');
            }
        },
        markCurrentLocale: function(locale){
            this.$('#'+locale).attr('selected',true);
        },
        changeLocale: function(e){
            var localeToChange ="";
            if(e.currentTarget.className == "fav_btn"){
                localeToChange = e.currentTarget.id;
                localeToChange = localeToChange.replace('b_','');
            }else{
                localeToChange = this.$('#lang_choser').val();
            }
            this.ajax('doChangeLocale',this.currentUser().id(),localeToChange).done(function(data){
                services.notify('Language Changed. There is no way we can refresh your browser using an app so if you wouldn’t mind hitting the curly little arrow by your url bar… that would be great! <3', 'notice');
                this.popover('hide');
            });
        },
        getLocaleID:function(locale,list){
            console.log(list);
            console.log("Looking for " + locale);
            var res_locale = _.find(list, function(llist){
                return locale == llist.locale;
            });
            return res_locale.id;
        }

    };

}());
