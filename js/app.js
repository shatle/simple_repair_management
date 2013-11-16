$(document).ready(function() {

  // Init page
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  // App 
  var App = {}

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

  window.App = App;
});
