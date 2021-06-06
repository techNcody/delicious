$('table tbody tr td').on('click', function () {
  console.log('Hello from the table row');
  $('#myModal').modal('show');
  $('#email').val($(this).closest('tr').children()[0].textContent);
  $('#address').val($(this).closest('tr').children()[1].textContent);
  $('#contactPerson').val($(this).closest('tr').children()[2].textContent);
  $('#mealType').val($(this).closest('tr').children()[3].textContent);
  $('#contactPersonMobileNumber').val(
    $(this).closest('tr').children()[4].textContent
  );
});
