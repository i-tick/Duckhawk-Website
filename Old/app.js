//js
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});
// var x=$("#hello")[0];
// console.log(x);
var x=document.getElementById("hello");
console.log(x);
