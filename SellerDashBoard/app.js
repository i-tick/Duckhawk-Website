var firebaseConfig = {
    apiKey: "AIzaSyBGdT1NqdlmpGM7nt5cIKI2ypE-OTQnqz8",
    authDomain: "duckhawk-1699a.firebaseapp.com",
    databaseURL: "https://duckhawk-1699a.firebaseio.com",
    projectId: "duckhawk-1699a",
    storageBucket: "duckhawk-1699a.appspot.com",
    messagingSenderId: "310324939369",
    appId: "1:310324939369:web:6182a347acf5e883b930f8",
    measurementId: "G-7ZWXCJGJ2W"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



var firebaseRef = firebase.database().ref();

function getData(path) {

var data = [];

return firebaseRef.once('value')
.then(function(snap) {
  snap.child(path+'/').forEach(function(child) {  //I guess it should be child(player) and not child('thierschi') here
    data.push([child.key, child.val()]);
  });
    return data;
})

}

var app = angular.module('myApp', []);
var $scope1 ;

// app.config(function($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{');
//     $interpolateProvider.endSymbol('}]}');
//   });

app.controller('myCtrl', function($scope) {

    $scope.menu = "Dashboard"
   
    $scope.changeNameToProduct = function(){
        $scope.menu = "Products"
    }
    $scope.changeNameToOrder = function(){
        $scope.menu = "Orders"
    }
    $scope.changeNameDB = function (){
        $scope.menu = "Dashboard"
    }
    $scope.changeNameToProfile = function (){
        $scope.menu = "Profile"
    }
    $scope.changeNameToPayments = function (){
        $scope.menu = "Payments"
    }

});
     



var i = $('.nav-link');
var c = document.getElementById("productb");
var dboard = document.getElementById("dashboard");
var dbc = document.getElementById("db");


productb.onclick = function() {
    
    $('section.content').css('display','none');
    document.getElementById('productCont').style.display = 'block' ;

    i.removeClass('active');
    $('#productb').addClass('active');

   }

dbc.onclick = function() {
    $('section.content').css('display','none');
    dboard.style.display = "block";
    
    i.removeClass('active');
    $('#db').addClass('active');

}

document.getElementById('orderb').onclick = function() {
    $('section.content').css('display','none');
    document.getElementById('ordercont').style.display = "block";

    i.removeClass('active');
    $('#orderb').addClass('active');
}


// myacccont
document.getElementById('myacb').onclick = function() {
    $('section.content').css('display','none');
    document.getElementById('myacccont').style.display = "block";

    i.removeClass('active');
    $('#myacb').addClass('active');
}

//payb
document.getElementById('payb').onclick = function() {
    $('section.content').css('display','none');
    document.getElementById('paymentcont').style.display = "block";

    i.removeClass('active');
    $('#payb').addClass('active');
}


function SignOut(){
    firebase.auth().signOut().then(()=>{
        location.href = "https://duckhawk.in"
    })
}
