
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

// if(!navigator.onLine){
//   alert("Please torn On mobile data");
// }

  function locationfun(){
    document.getElementById('locationbox').style.width = "500px";
}

function clearlocationSearchbox(){
    document.getElementById('locationbox').style.width = "0px";
    document.getElementById('locationin').value = "";
}

function openSignUPform(){
    document.getElementById('signup').style.display = "block";
    document.getElementById('login').style.display = "none";
}

function openLoginform(){
    document.getElementById('signup').style.display = "none";
    document.getElementById('login').style.display = "block";
}


var  UserName ;

function checkAuth(){
  console.log("Check Auth fun")
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.uid);
      window.location =  "./UserHome.html";
    } else {
      console.log("NO user is login");
      if(document.getElementById('cityname').innerHTML == "Location"){
        locationfun();
      }
    }
  });

}


function signup(){
    var name = document.getElementById('name').value;
    UserName = name;
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;
    var number = document.getElementById('phonenumber').value;
  
          // firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
          //   // Handle Errors here.

          //   var errorCode = error.code;
          //   var errorMessage = error.message;
          //   // ...
          // });
        
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function(result) {
              return result.user.updateProfile({
              displayName: document.getElementById("name").value,
              phoneNumber: document.getElementById('phonenumber').value
           })
          }).catch(function(error) {
          console.log(error);
          alert(error.message);
        });
     

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log(user.uid);
          var database = firebase.database();
          var ref = database.ref("User/");
          ref.child(user.uid+"/name").set(name);
          ref.child(user.uid+"/email").set(email);
          ref.child(user.uid+"/number").set(number);
          ref.child(user.uid+"/isSeller").set(false);
          document.getElementById('lemail').value = email;
          document.getElementById('lpassword').value = password;
          login();
        } else {
          // No user is signed in.
        }
      });

    // document.getElementById('lemail').value = email;
    // document.getElementById('lpassword').value = password;
    // login();
}

function login(){ 
    var email = document.getElementById('lemail').value;
    var password = document.getElementById('lpassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);

        if(errorCode == "auth/wrong-password"){
          alert("Wrong Password for User "+email);
        }
        else if(errorCode == "auth/user-not-found"){
          alert("There is no user in this Email ID");
        }
        
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log(user.uid);

          var database = firebase.database();

          database.ref('User/'+user.uid).once('value').then(function(snapshot) {
            console.log(snapshot.val().name);
            UserName = snapshot.val().name;
            // setTimeout(function(){
              window.location = "./UserHome.html";
            //  },30);
            // snapshot.forEach(function(snapshot1) {
            //   console.log(snapshot1.key); // e.g. "http://..."
            //   snapshot.forEach(function(snapshot2) {
            //     console.log(childSnapshot.key); // e.g. "20170116"
            //     childSnapshot.forEach(function(snapshot3) {
            //       console.log(grandchildSnapshot.key); // e.g. "-Kb9...gkE"
            //       console.log(grandchildSnapshot.val().districtId); // "pne"
            //     });
            //   });
            // });
          });
        } else {
          console.log(" No user is signed in.");
        }
      });
}



function loadUser(){
  var Name;
  if(document.getElementById('cityname').innerHTML == "Location"){
    locationfun();
  }
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var database = firebase.database();
      console.log(user);
      console.log(user.displayName);
      console.log(user.phoneNumber);
      document.getElementById('UserName').innerHTML = user.displayName;
      database.ref('User/'+user.uid).once('value').then(function(snapshot) {
        Name = snapshot.val().name;
      //   user.sendEmailVerification().then(function() {
      //     // Email sent.
      //   }).catch(function(error) {
      //     // An error happened.
      //   });
      });
      database.ref('User/'+user.uid+'/Cart').once('value').then(function(snapshot){
          var count = snapshot.numChildren();
          if(count == 0){
            document.getElementById('itemincart').style.display = 'none';
          }
          else{
          document.getElementById('itemincart').style.display = 'block';
          document.getElementById('itemincart').innerHTML = count;
          }
      })


    } else {
      console.log(" No user is signed in.");
    }
  });
  
}


function logout(){

  firebase.auth().signOut()
  .then(function() {
    console.log("Sign-out successful.");
    window.location = "./index.html";
  })
  .catch(function(error) {
    console.log(error)
    // An error happened
  });

  // FirebaseAuth.getInstance().signOut();
  // setTimeout(function(){
  //   window.location = "./index.html";
  //  },3000);
}


function  resetPass(){
  var auth = firebase.auth();
  var remail = document.getElementById('useremail').value;
  auth.sendPasswordResetEmail(remail).then(function() {
    alert("Email Sent to your Email address "+remail);
    window.location = "./index.html";
  }).catch(function(error) {
    var errorCode = error.code;
    if(errorCode == "auth/user-not-found"){
      alert("There is no user in this Email ID");
    }else{
      alert(error.message);
    }
   
  });

}


// function upload(){
//   const ref = firebase.storage().ref();
// const file = document.querySelector('#pimg').files[0]
// const name = (+new Date()) + '-' + file.name;
// const metadata = {
//   contentType: file.type
// };
// const task = ref.child(name).put(file, metadata);
// task
//   .then(snapshot => snapshot.ref.getDownloadURL())
//   .then((url) => {
//     console.log(url);
//     return url;
//   })
//   .catch(console.error);
// }

var firebaseRef = firebase.database().ref();

function getScoresOfPlayer() {

  var selectedPlayerScores = [];

  return firebaseRef.once('value')  //return here as well
  .then(function(snap) {
    snap.child('Products').forEach(function(child) {  //I guess it should be child(player) and not child('thierschi') here
      selectedPlayerScores.push([child.key, child.val()]);
    });

    return selectedPlayerScores;
  });

}

function loadProducts(){

getScoresOfPlayer()
.then(function(ALlproducts) {
  var table = document.querySelector('#table1');

  for(var k in ALlproducts){
    var row = table.insertRow(-1);
    var cat = document.createElement('h1');
    cat.setAttribute("class","cat")
    cat.innerHTML =  ALlproducts[k][0];
    row.appendChild(cat);
    var products = ALlproducts[k][1]
    
    var count = 0;
    for(var i in products){
      count = count+1;

      var num = 4;

      // var onresize = function(e) {
      //   //note i need to pass the event as an argument to the function
      //   width = e.target.outerWidth;
      //   height = e.target.outerHeight;
      //   if(width<1180){
      //     num = 4;
      //   }
        
      // }
      // window.addEventListener("resize", onresize);
      

      if(count%num == 1){
          var row = table.insertRow(-1);
          row.innerHTML = ""
      }
      var cell = row.insertCell(-1);

      cell.setAttribute("id",i);
      cell.setAttribute("class",ALlproducts[k][0]);
      

      var imgcont = document.createElement('div');
      imgcont.setAttribute("class","imgcontr");
      var img = document.createElement('img');
      img.src = products[i].imgurl;
      img.setAttribute("class","ProdImg");
      imgcont.appendChild(img);
      cell.appendChild(imgcont);
      //Prod description.
      var name  = document.createElement('a')
      name.setAttribute("class","pname");
      name.innerHTML = "<br>"+products[i].name;
      name.setAttribute("href","https://www.google.com/")
      cell.appendChild(name);
      var des  = document.createElement('p')
      des.setAttribute("class","pdes");
      des.innerHTML = "Description : <br>"+products[i].description;
      cell.appendChild(des);
      var Price = document.createElement('p')
      Price.setAttribute("class","pprice")
      Price.innerHTML = "Price : ₹"+products[i].price
      cell.appendChild(Price);
      var quantity = document.createElement('p')
      quantity.setAttribute("class","pquantity")
      quantity.innerHTML = "Available : "+products[i].quantity;
      cell.appendChild(quantity)
      //Button for add to cart
      var btncont = document.createElement('div');
      btncont.setAttribute("class","btncont");
      var btn = document.createElement('button');
      btn.innerHTML = "Add To cart";
      btncont.appendChild(btn);
      btn.setAttribute("class","Addrocartbtn");
      cell.appendChild(btncont);
      btn.onclick = function() {
        // Do code for add to cart.
        // console.log(document.getElementById('prodid'));
        var prodid = $(this).parent().parent().attr('id');
        var cat = $(this).parent().parent().attr('class');
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            var database = firebase.database();
            var ref = database.ref("User/"+user.uid+"/Cart/");
            ref.child(prodid).set(cat);
            loadUser();
          } else {
            alert("First login to your account")
          }
        });
      }
    }
  }
})

}

// var table = document.querySelector('#table1');
// const prodref= firebase.database().ref().child('Products');
// prodref.on('value',snap=>{
//   var products = snap.val();
//   for(var i in products){
//     var row = table.insertRow(-1);
//     for(var j in products[i]){
//       var cell = roe.insertCell(-1);
//       cell.innerHTML = products[i][j];
//     }
//   }

// });


