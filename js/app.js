$(document).ready(function() {

  // Init page
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  function exportTableToCSV($table, filename) {

    var $rows = $table.find('tr:has(td), tr:has(th)'),

      // Temporary delimiter characters unlikely to be typed by keyboard
      // This is to avoid accidentally splitting the actual contents
      tmpColDelim = String.fromCharCode(11), // vertical tab character
      tmpRowDelim = String.fromCharCode(0), // null character

      // actual delimiter characters for CSV format
      colDelim = '","',
      rowDelim = '"\r\n"';

      // Grab text from table into CSV formatted string
    var csv = '"' + $rows.map(function (i, row) {
      var $row = $(row),
        $cols = $row.find('td, th');

        return $cols.map(function (j, col) {
          var $col = $(col),
              text = $col.text();

          return text.replace('"', '""'); // escape double quotes

        }).get().join(tmpColDelim);

    }).get().join(tmpRowDelim)
      .split(tmpRowDelim).join(rowDelim)
      .split(tmpColDelim).join(colDelim) + '"';

    // Data URI
    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    $(this)
      .attr({
      'download': filename+'.csv',
          'href': csvData,
          'target': '_blank'
    });
  }

  $("#export_excel").click(function(e) {

    //getting values of current time for generating the file name
    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
    //creating a temporary HTML link element (they support setting file names)
    // var a = document.createElement('a');
    exportTableToCSV.apply(this, [$('#pageList'), 'exported_table_' + postfix]);
    
    //triggering the function
    // a.click();
    //just in case, prevent default behaviour
    // e.preventDefault();
  });

  // App 
  var App = {}

  App.init = function(){
    var store = new App.Store(),
        view  = new App.View(),
        controller = new App.Controller();

    controller.startWith(store, view);
    store.__getHistory();
    view.init();
    view.refreshIndex(store);

    // Interface for testing
    App._Data = store.__content();
    App._Store = store;
    App._View = view;
    App._Controller = controller;
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
    var contents = {};
    
    this.addItem = function(obj_m, obj_u){
      var _machine = $.extend(App.Mmachine, obj_m),
          _user = $.extend(App.Muser, obj_u),
          _item = { machine: _machine, user: _user},
          _id = (new Date()).valueOf();

      //console.log('addItem......');
      //console.log(_item);
      //console.log('addItem......');

      contents[_id] = _item;

      window.localStorage.setItem('repairManagement', JSON.stringify(contents));
    }

    this.delItem = function(item_id){
      //console.log('delItem......');
      //console.log(item_id);
      //console.log('delItem......');

      delete contents[item_id]
      window.localStorage.setItem('repairManagement', JSON.stringify(contents));
    }

    this.updateItem = function(item_id, obj_m, obj_u){
      var _item = contents[item_id],
          _machine = $.extend(_item.machine, obj_m),
          _user = $.extend(_item.user, obj_u),
          _updated_at = (new Date()).valueOf();

      _item = {
        machine: _machine,
        user: _user,
        updated_at: _updated_at
      }

      //console.log('updateItem......');
      //console.log(_item);
      //console.log('updateItem......');

      contents[item_id] = _item;
      window.localStorage.setItem('repairManagement', JSON.stringify(contents));
    }

    this.findItem = function(item_id){
      return contents[item_id];
    }

    this.all = function(){
      var order_array = [];
      return order_array;
    }

    this.__content = function(){
      return contents;
    }

    this.__getHistory = function(){
      contents = $.parseJSON(window.localStorage.getItem('repairManagement')) || {};
    }
  }

  App.View = function(){
    var page_hash = {
                      index: '#pageList',
                      edit: '#pageEdit',
                      news: '#pageNew'
                    },
        page_ids = ['#pageList', '#pageEdit', '#pageNew'],
        edit_item_id = undefined,
        that = this;

    this.pageHash = function(){
      return page_hash;
    }

    this.setEditItemId = function(item_id){
      edit_item_id = item_id;
    }

    this.editItemId = function(){
      return edit_item_id;
    }

    this.fillEditPage = function(store, item_id){
      if(!store || !item_id){return false;}
      item = store.findItem(item_id);
      if(!item){return false;}
      //console.log('...fillEditPage...') 
      edit_item_id = item_id;

      $('#m_num_edit').val(item.machine.num);
      $('#m_count_edit').val(item.machine.count);
      $('#m_problem_edit').val(item.machine.problem);
      $('#m_solution_edit').val(item.machine.num);
      $('#m_repairman_edit').val(item.machine.repairman);

      $('#u_address_edit').val(item.user.address);
      $('#u_mobile_edit').val(item.user.mobile);
      $('#u_seller_edit').val(item.user.seller);
    }

    this.redirectPage = function(page_id){
      //console.log('redirectPage: '+ page_id);
      if(!page_id){return false;}
      $(page_ids.toString()).addClass('hide');
      $(page_id).removeClass('hide');
      $('#sidebar .list-group a').removeClass('active');
      $('#sidebar .list-group a[href='+page_id+']').addClass('active');
    }

    this.newMachine = function(){
      var _machine = {};
      _machine.num = $('#m_num').val();
      _machine.count = parseInt($('#m_count').val());
      _machine.problem = $('#m_problem').val();
      _machine.solution = $('#m_solution').val();
      _machine.repairman = $('#m_repairman').val();
      return _machine;
    }

    this.newUser = function(){
      var _user = {};
      _user.address = $('#u_address').val();
      _user.mobile = $('#u_mobile').val();
      _user.seller = $('#u_seller').val();
      return _user;
    }

    this.editMachine = function(){
      var _machine = {};
      _machine.num = $('#m_num_edit').val();
      _machine.count = parseInt($('#m_count_edit').val());
      _machine.problem = $('#m_problem_edit').val();
      _machine.solution = $('#m_solution_edit').val();
      _machine.repairman = $('#m_repairman_edit').val();
      
      return _machine;
    }

    this.editUser = function(){
      var _user = {};
      _user.address = $('#u_address_edit').val();
      _user.mobile = $('#u_mobile_edit').val();
      _user.seller = $('#u_seller_edit').val();

      return _user;
    }

    this.refreshIndex = function(store){
      //console.log('..........refreshIndex......');
      var i = 1, machine, user,
          data = store.__content();

      $('table.table tbody').empty();
      

      for(var item in data){
        //console.log(item)
        machine = data[item].machine,
        user = data[item].user;
        var tmp = that.__indexLineTemplate(i, item, machine.num, machine.repairman, user.mobile);
        //console.log('for: '+tmp);
        $('table tbody').append(tmp);
        i++; 
      }

    }

    this.__indexLineTemplate = function(tr_index,item_id, m_num, m_repairman, u_mobile){
      return  '<tr><td>'+tr_index+
                '</td><td>'+m_num+
                '</td><td>'+m_repairman+
                '</td><td>'+u_mobile+
                '</td><td>'+
                  '<div class="btn-group">'+
                    '<button class="btn btn-default action" action="edit" target="'+item_id+'">编辑</button>'+
                    '<button class="btn btn-default action" action="destroy" target='+item_id+'>删除</button>'+
                  '</div>'+
              '</td><tr>';
    }

    this.init = function(){
      that.redirectPage(page_hash.index);
    }
  }

  App.Controller = function(){
    var view = undefined,
        store = undefined,
        that = this,
        actions = ['index', 'create', 'edit', 'update', 'destroy'];

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
      $('#main').on('click','.action', function(evt){
        var act = $(evt.target).attr('action');
        if (actions.indexOf(act) == -1){return false;}
        //console.log('GetIn action: '+act)

        switch (act){
          case 'index':
            view.redirectPage(view.pageHash().index);
            break;
          case 'edit':
            view.fillEditPage(store, $(evt.target).attr('target'));
            view.redirectPage(view.pageHash().edit);
            break;
          case 'create':
            var obj_m = view.newMachine(),
                obj_u = view.newUser();
            store.addItem(obj_m, obj_u);
            view.refreshIndex(store);
            view.redirectPage(view.pageHash().index);
            break;
          case 'update':
            var item_id = view.editItemId(),
                obj_m = view.editMachine(),
                obj_u = view.editUser();
            store.updateItem(item_id, obj_m, obj_u);
            view.refreshIndex(store);
            break;
          case 'destroy':
            store.delItem($(evt.target).attr('target'))
            view.refreshIndex(store);
            view.redirectPage(view.pageHash().index);
            break;
        }
      });
    }
  }

  App.init();
  window.App = App;
});
