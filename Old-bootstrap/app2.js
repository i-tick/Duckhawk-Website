var pid;
var cat;
var firebaseConfig = {
    apiKey: "AIzaSyBGdT1NqdlmpGM7nt5cIKI2ypE-OTQnqz8",
    authDomain: "duckhawk-1699a.firebaseapp.com",
    databaseURL: "https://duckhawk-1699a.firebaseio.com",
    projectId: "duckhawk-1699a",
    storageBucket: "duckhawk-1699a.appspot.com",
    messagingSenderId: "310324939369",
    appId: "1:310324939369:web:c290e9fdf3a88b4bb930f8",
    measurementId: "G-Y3CR0HNHNW"
  };

  
firebase.initializeApp(firebaseConfig); 

window.onload = function () {
    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }
    // document.getElementById('here').innerHTML = data.name;
    this.console.log(params);
    this.console.log(data.cat,data.id);
    data.id = data.id.replace('#', ''); 
    this.console.log(data.cat,data.id);
    var database = firebase.database();

  database.ref('Products/'+data.cat+"/"+data.id+"/").once('value').then(function(snapshot) {
    console.log(snapshot.val());
    var prodimg = document.getElementById('prodimg');
    prodimg.setAttribute("src",snapshot.val().imgurl)
  });
}

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});

