/**
 *      Show table
 */
$.getJSON("../html/prize.json", function (json) {
  var getData = json;
  var tableContainer = document.getElementsByClassName('dataTableContainer')[0];
  tableContainer.innerHTML += `<table class="ui unstackable celled table dataTable">
    <thead>
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Picture</th>
            <th>Delete</th>
        </tr>
    </thead>
      <tbody class="rable-rows">
     </tbody>
     <tfoot class="full-width">
    <tr>
      <th></th>
      <th colspan="4">
        <div class="ui right floated primary delete-btn button"> Delete selected
        </div>
      </th>
    </tr>
  </tfoot>
  </table>`;
  var tableRows = document.getElementsByClassName("rable-rows")[0];
  var checkboxIndex = 0;
  for (let i = 0; i < getData.length; i++) {
    tableRows.innerHTML += ` <tr>      
                              <td data-label="Name">${getData[i].name}</td>
                              <td data-label="Price">${getData[i].price}</td>
                              <td data-label="Link"><img src="${getData[i].link}" class="ui tiny rounded image">
                              ${getData[i].link}
                              </td>
                              <td data-label="Delete">
                                <div class="ui checkbox">
                                  <input type="checkbox" class="select-delete-${checkboxIndex++}" name="delete-${checkboxIndex-1}">
                                  <label></label>
                                </div>
                              </td>
                            </tr>`;
  }
});
/**
 * Adding new item to json
 */
$('.form').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: "../html/action.php",
    type: "POST",
    data: $(this).serialize(),
    success: function () {
      console.log('success!');
      $('.form')[0].reset();
    },
    error: function () {
      console.log('ERROR!');
    }
  });
  location.reload();
});
/**
 *           Dele from json
 */
var sendingArr=[];
$('body').on('click', '.delete-btn', function(){
  var checkedArray = $('input:checked').map(function(index, elem){
    return $(elem);
  });
  checkedArray.each(function(index, elem){
    var indexToDelete = elem.attr('name').toString().match(/[0-9]/);
    sendingArr.push(indexToDelete[0]);
    console.log(indexToDelete[0]);
  });
  console.log(sendingArr+' ARRRR');
  $.ajax({
    url: "../html/action.php",
    type: "POST",
    data: {deleteID: sendingArr},
    success: function () {
    },
    error: function () {
      console.log('ERROR!');
    }
  });

  location.reload();
})