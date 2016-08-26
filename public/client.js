var urlMap = [];
var counter = 0;

$(document).ready(main);


function main() {
  $('#btn-add').on('click', addUrl);
  $('#btn-deleteAll').on('click', deleteAll);
  $('#btn-download').on('click', download);
  $('#ul-url').on('click', 'button', deleteOne);
  $('.alert').hide();
}

function showError(error) {
  //show error to user
  $('#error-area').text(error.toString());
  $('.alert').fadeIn();
}

function hideError() {
  //hide error
  $('.alert').hide();
}

function addUrl() {
  // add a single url
  hideError();
  var newurl = $('#input-url').val();
  try {
    verifyUrl(newurl);
  } catch (e) {
    showError(e);
    return
  }
  urlMap.push(newurl);
  showUrl(newurl);
  counter += 1;
  $('#input-url').val('');
}

function showUrl(newurl) {
  // add single url to html page
  var new_li = $('<li class="list-group-item" ' + 'data-id=' + counter.toString() +
    '>' + newurl + '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + '</li>');
  $('#ul-url').append(new_li);
}

function deleteAll() {
  //delete all urls
  $('#ul-url').html('');
  urlMap = [];
}

function download() {
  //begin to download the downloading code;
  hideError();
  console.log('Start to download:' + urlMap.toString());
  $.ajax({
    type: 'POST',
    url: '/download',
    contentType: 'application/json',
    data: JSON.stringify(urlMap)
  }).done(function(fileName) {
    window.open('/file/' + fileName);
  }).fail(function(jqXHR, status, errorMessage) {
    showError(errorMessage);
  });
}

function deleteOne() {
  // delete a single url
  var li = $(this).closest('li');
  var id = parseInt(li.data('id'));
  li.remove();
}


function verifyUrl(newurl) {
  let validationReg = /^(http|https)\:\/\/www\.youtube\.com/;
  if (!validationReg.exec(newurl)) throw new Error('Invalid Youtube url!');
}
