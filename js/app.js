$(document).ready(function() {

  // Init page
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  // App 
  var App = {}

  App.init = function(){
    var store = new App.Store(),
        view  = new App.View(),
        controller = new App.Controller();

    controller.startWith(store, view);
  }

  // Model
  App.Mmachine = {
    num: 0,
    count: 0,
    problem: '',
    solution: '',
    repairman: ''
  }

  App.Muser = {
    address: '',
    mobile: '',
    seller: ''
  }

  // Store data which uses LocalStorage
  App.Store = function(){
    var content = {};
    
    this.addItem = function(obj_m, obj_u){
      var _machine = $.extend(App.Mmachine, obj_m),
          _user = $.extend(App.Muser, obj_u),
          _record = { machine: _machine, user: _user},
          _id = (new Date()).valueOf();
      
      content[_id] = _record;
    }

    this.delItem = function(record_id){
      delete content[record_id]
    }

    this.updateItem = function(record_id, obj_m, obj_u){
      var _record = content[record_id],
          _machine = $.extend(_record.machine, obj_m),
          _user = $.extend(_record.user, obj_u),
          _updated_at = (new Date()).valueOf();

      content[record_id] = {
        machine: _machine,
        user: _user,
        updated_at: _updated_at
      }
    }
  }

  App.View = function(){
    var page_hash = {
                      index: '#pageList',
                      edit: '#pageEdit',
                      news: '#pageNew'
                    },
        page_ids = ['#pageList', '#pageEdit', '#pageNew'],
        that = this;

    this.pageHash = function(){
      return page_hash;
    }

    this.redirectPage = function(page_id){
      if(!page_id){return false;}
      console.log('redirectPage: '+ page_id);
      $(page_ids.toString()).addClass('hide');
      $(page_id).removeClass('hide');
    }

    this.init = function(){
      that.redirectPage('index');
    }
  }

  App.Controller = function(){
    var view = undefined,
        store = undefined,
        that = this,
        actions = ['index', 'create', 'update', 'destroy'];

    this.startWith = function(s, v){
      view = v;
      store = s;

      that.__bindRedirect();
      that.__bindOperations();
    }

    this.__bindRedirect = function(){
      $('.redirect').on('click',function(evt){
        evt.preventDefault();
        view.redirectPage($(evt.target).attr('href'));
      });
    }

    this.__bindOperations = function(){
      $('.action').on('click', function(evt){
        var act = $(evt.target).attr('action');
        if (actions.indexOf(act) == -1){return false;}

        switch (act){
          case 'index':
            view.redirectPage(view.pageHash.index);
            break;
          case 'create':
            view.redirectPage(view.pageHash.index);
            break;
          case 'update':
            break;
          case 'destroy':
            view.redirectPage(view.pageHash.index);
            break;
        }
      });
    }
  }

  App.init();
  window.App = App;
});
