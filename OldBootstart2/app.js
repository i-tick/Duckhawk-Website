//js

//Firebase Configuration 
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

//Location Box

// $(document).ready(function () {
//   $('#sidebarCollapse').on('click', function () {
//       $('#sidebar').toggleClass('active');
//       $(this).toggleClass('active');
//       $('.navbar-toggler').click();
//   });
// });

function load(){
checkAuth();
loadProducts();
}
// var locbox = document.getElementById("locbox");
// window.onclick = function(event) {

//     if (event.target == locbox) {
//         $('#sidebar').toggleClass('active');
//     }
// }

//Products from the database
function closeLoc(){  
$('#sidebar').toggleClass('active');
// var x=document.getElementById("sidebar").className;
// if(x==""){
//   // console.log(x +"x is null");
//   document.getElementById("sidebar").classList.add("active");
//   x=document.getElementById("sidebar").className;
// }
// // console.log(x);
// // x.classList.remove("active");
}

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
  //   var table = document.querySelector('#table1');
      var container = document.getElementById("Contid"); 
    for(var k in ALlproducts){
      // var row = table.insertRow(-1);
      var row = document.createElement('div');
      row.setAttribute("class","row");
      var cat = document.createElement('h1');
      cat.setAttribute("class","cat")
      cat.innerHTML =  ALlproducts[k][0];
      row.appendChild(cat);
      container.appendChild(row);

      var row = document.createElement('div');
      row.setAttribute("class","row");
      var products = ALlproducts[k][1]
      
      
      for(var i in products){
        
      //   var cell = row.insertCell(-1);
          var cell = document.createElement('div');
          cell.setAttribute("class","col-lg-3 col-md-4 col-sm-6 col-xs "+ALlproducts[k][0]);
          cell.setAttribute("id",i);
          // cell.setAttribute("class",ALlproducts[k][0]);
          
          //ing of the product.
          var imgcont = document.createElement('div');
          imgcont.setAttribute("class","imgcontr");
          var img = document.createElement('img');
          img.src = products[i].imgurl;
          img.setAttribute("class","ProdImg");
          imgcont.appendChild(img);
          cell.appendChild(imgcont);  

        //Prod description.
        var name  = document.createElement('a');
        name.setAttribute("class","pname");
        name.innerHTML = "<br>"+products[i].name;
        name.setAttribute("href","./product.html?cat=" + ALlproducts[k][0]+"&id="+i);
        cell.appendChild(name);
        var des  = document.createElement('p')
        des.setAttribute("class","pdes");
        des.innerHTML = "Description : <br>"+products[i].description;
        // cell.appendChild(des);
        var Price = document.createElement('p')
        Price.setAttribute("class","pprice")
        Price.innerHTML = "Price : ₹"+products[i].price
        cell.appendChild(Price);
        var quantity = document.createElement('p')
        quantity.setAttribute("class","pquantity")
        quantity.innerHTML = "Available : "+products[i].quantity;
        cell.appendChild(quantity);
        //Button for add to cart
        var btncont = document.createElement('div');
        btncont.setAttribute("class","btncont");
        var btn = document.createElement('button');
        btn.innerHTML = "Add To cart";
        btncont.appendChild(btn);
        btn.setAttribute("class","Addtocartbtn");
        cell.appendChild(btncont);
        btn.onclick = function() {
      //     // Do code for add to cart.
      //     // console.log(document.getElementById('prodid'));
          var prodid = $(this).parent().parent().attr('id');
          var cat = $(this).parent().parent().attr('class');
          var cate =  cat.split(" ")[4];
          
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              var database = firebase.database();
              var ref = database.ref("User/"+user.uid+"/Cart/");
              ref.child(prodid).set(cate);
              loadUser();
            } else {
              alert("First login to your account")
            }
          });
        }
          row.appendChild(cell);
      }
      container.appendChild(row);
    }
  })
  
  }


  // loadProducts();


  // added from script.js for authentication, sign up and login
          /*  added from script.js  */ 
var  UserName ;
function checkAuth(){
  console.log("Check Auth fun");
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.uid);
      var database = firebase.database();
          database.ref('User/'+user.uid).once('value').then(function(snapshot) {
            console.log(snapshot.val().name);
            UserName = snapshot.val().name;
            document.getElementById("signin").style.display="none";
            document.getElementById("myprof").innerHTML=UserName;
            loadUser()
          });
    } else {
      console.log("No user is login");
      // if(document.getElementById('cityname').innerHTML == "Location"){
      //   // locationfun();  
      // }
    }
  });

}
function prof(){
  // console.log("prof");
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      // console.log(user);
      window.location.href="profile.html";
    }
    else{
      alert("login first");
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
              phoneNumber:  Number(document.getElementById('phonenumber').value)
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
          $(function() {
            $('#signupbutton').click(function() {
              $('#signup').modal('hide');
          });
         });
        } else {
          // No user is signed in.
        }
      });

    // document.getElementById('lemail').value = email;
    // document.getElementById('lpassword').value = password;
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
            //code to close the modal
            // $(function() {
            //   $('#loginbtn').click(function() {
                $('#login').modal('hide');
                // document.getElementById('login').setAttribute("class","modal fade")
          //   });
          //  });
            // document.getElementById("login").modal="hide";
              // window.location = "./UserHome.html";
          });
        } else {
        //   $(function() {
        //     $('#loginbtn').click(function() {
        //       $('#login').modal('hide');
        //   });
        //  });
          console.log(" No user is signed in.");
        }
      });
}



function loadUser(){
  var Name;
  // if(document.getElementById('cityname').innerHTML == "Location"){
  //   locationfun();
  // }
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var database = firebase.database();
      // console.log(user);
      console.log(user.displayName);
      console.log(user.phoneNumber);
      document.getElementById('myprof').innerHTML = user.displayName;
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
          console.log(count);
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

                // script2.js added files
function placeOrder(){
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var database = firebase.database();
          var items = $('#cartitem tr');
          for(var i = 0;i<items.length;i++){
              console.log(items[i]);
              var cat = $(items[i]).attr('id');
              var prodid = $(items[i]).attr('class');
              
              var ref = database.ref("Orders/");
              var newProdRef = ref.push();
              newProdRef.set({
                  productid : prodid,
                  prodcat : cat,
                  buyer : user.uid,
                  Address : document.getElementById('adr').value
              })
              var key = newProdRef.key;
              console.log(key);

              var userref =  database.ref("User/"+user.uid+"/Orders/"+key);
              userref.child("productid").set(prodid);
              userref.child("Cat").set(cat);
              userref.child("Status").set("Order Received");
              
          }
          database.ref("User/"+user.uid+"/").child("Cart").set(null);
          console.log("Orderd Succesfully");
          location.reload();

      } else {
        console.log(" No user is signed in.");
      }
    });
  
}



function loadOrderdProduct(){

  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

          var firebaseRef = firebase.database().ref();

          function getOrderdItems() {

              var OrderdItems = [];

              return firebaseRef.once('value')  //return here as well
              .then(function(snap) {
                  snap.child("User/"+user.uid+"/Orders/").forEach(function(child) {  //I guess it should be child(player) and not child('thierschi') here
                  OrderdItems.push([child.key, child.val()]);
                  });

                  return OrderdItems;
              });

              }

              var database = firebase.database();
              getOrderdItems().then(function(Ordered){
                  var table = document.querySelector('#op');
                  // console.log(Ordered);
                  for(var i in Ordered){
                      console.log(Ordered[i]);
                      const oid = Ordered[i][0];
                      const p = Ordered[i][1];
                      console.log(oid,p)
                      database.ref('Products/'+p.Cat+'/'+p.productid).once('value').then(function(snapshot) {
                          console.log(snapshot.val());
                          var row = table.insertRow(-1);
                          row.setAttribute("class",oid);
                          var cell = row.insertCell(-1);
                          var imgcont = document.createElement('div');
                          imgcont.setAttribute("class","imgcontr");
                          var img = document.createElement('img');
                          img.src = snapshot.val().imgurl;
                          img.setAttribute("class","ProdImg");
                          imgcont.appendChild(img);
                          cell.appendChild(imgcont);

                          var cell = row.insertCell(-1);
                          var name  = document.createElement('a')
                          name.setAttribute("class","pname");
                          name.innerHTML = "<br>"+snapshot.val().name;
                          name.setAttribute("href","https://www.google.com/")
                          cell.appendChild(name);
                          var Price = document.createElement('p')
                          Price.setAttribute("class","pprice")
                          Price.innerHTML = "Price : ₹"+snapshot.val().price;
                          cell.appendChild(Price);
                          
                          database.ref("User/"+user.uid+"/Orders/"+oid).once('value').then(function(snapshot){
                              console.log(snapshot.val())
                              var cell = row.insertCell(-1);
                              var Price = document.createElement('p')
                              Price.setAttribute("class","Ostatus")
                              Price.innerHTML = " Status : "+snapshot.val().Status;
                              cell.appendChild(Price);
                          });

                      });
                  }
                  
              });

      } else {
        alert("First login to your account")
      }
    });

}

function checkSeller(){
var bol;
var database = firebase.database();
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      database.ref('User/'+user.uid).once('value').then(function(snapshot) {
          
      if(snapshot.val().isSeller){
      
        window.location.href = "./SellerDashbord.html" ;
     
  }else{
   
    window.location.href = "./Seller.html" ;
   
  }
      });
  } else {
      // console.log(" No user is signed in.");
      alert("Please Login first !");
      }
});
}


function isApplied(){
var bol;
var database = firebase.database();
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      database.ref('User/'+user.uid).once('value').then(function(snapshot) {
          
      console.log(snapshot.val().isApplied);
      if(snapshot.val().isApplied){
        document.getElementById('after').style.display = 'block';
      document.getElementById('before').style.display = 'none';
      }
    
      });
  } else {
      // console.log(" No user is signed in.");
      alert("Please Login first !");
      }
});
}
function Submit(){

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
var sname  = document.getElementById("shopname").value;
var email = document.getElementById("inputEmail4").value;
var oname = document.getElementById("ownername").value;
var ono = document.getElementById("ownernumber").value;
var mannum = document.getElementById("managernumber").value;
var manname = document.getElementById("managername").value;
var gstnum = document.getElementById("gstnum").value;
var add1 = document.getElementById("inputAddress").value;
var add2 = document.getElementById("inputAddress2").value;
var city = document.getElementById("inputCity").value;
var state = document.getElementById("inputState").value;
var zip = document.getElementById("inputZip").value;
var mulipleshop = localStorage.getItem("ans");
console.log(mulipleshop);

const ref = firebase.storage().ref();
const file = document.querySelector('#exampleFormControlFile1').files[0];
const name = (+new Date()) + '-' + file.name;
const metadata = {
    contentType: file.type
  };

  const task = ref.child(name).put(file, metadata);
  task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then((url) => {
      var database = firebase.database();
      var ref = database.ref("ApplicationForSeller/"+user.uid+"/");
      ref.set({
        ShopImgUrl : url,
        ShopName : sname,
        Email : email,
        OwnerName : oname,
        OwnerNumber : ono,
        managerName : manname,
        managerNum : mannum,
        GstNum : gstnum,
        Address : add1 + "\n" + add2 ,
        CIty : city,
        State : state,
        ZipCode : zip,
        HaveMulShop : mulipleshop 
      })
    })
    .catch(console.error);


    const file2 = document.querySelector('#exampleFormControlFile2').files[0];
    const name2 = (+new Date()) + '-' + file2.name;
    const metadata2 = {
        contentType: file2.type
      };
      const task2 = ref.child(name2).put(file2, metadata2);
      task2
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
          var database = firebase.database();
          database.ref("ApplicationForSeller/"+user.uid+"/"+"GstImgUrl").set(url);

        })
        .catch(console.error);

        var database = firebase.database();
        database.ref('User/'+user.uid+"/isApplied").set(true);

  }else {
    console.log(" No user is signed in.");
    }
}); 

}

function myFunction(ans) {
localStorage.setItem("ans", ans);
} 

function profile(){
var Name;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var database = firebase.database();
      // console.log(user);
      console.log(user.displayName);
      console.log("phone="+user.number);
      console.log("email="+user.email);
      console.log(user);
      document.getElementById('myprof').innerHTML = user.displayName;
      document.getElementById("signin").style.display="none";
      document.getElementById('name').innerHTML = user.displayName;
      document.getElementById('email').innerHTML = user.email;
      document.getElementById('mobile').innerHTML = user.phoneNumber; 
      database.ref('User/'+user.uid).once('value').then(function(snapshot) {
        Name = snapshot.val().name;
        console.log(snapshot.val());
        document.getElementById('mobile').innerHTML = snapshot.val().number;
      //   user.sendEmailVerification().then(function() {
      //     // Email sent.
      //   }).catch(function(error) {
      //     // An error happened.
      //   });
      });
      database.ref('User/'+user.uid+'/Cart').once('value').then(function(snapshot){
          var count = snapshot.numChildren();
          console.log(count);
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



function getCartItems() {
  var firebaseRef = firebase.database().ref();
    var CartItems = [];
  var user = firebase.auth().currentUser; 
    return firebaseRef.once('value')  //return here as well
    .then(function(snap) {
        snap.child("User/"+user.uid+"/Cart/").forEach(function(child) {  //I guess it should be child(player) and not child('thierschi') here
        CartItems.push([child.key, child.val()]);
        });

        return CartItems;
    });

    }



function loadCart(){
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          let total = 0;
          

          

              var database = firebase.database();
              getCartItems().then(function(CartItem){
                  // var table = document.querySelector('#cartitem');
                  var table = document.getElementById("cartitem");
                  for(var i in CartItem ){
                      document.getElementById('empty').style.display = 'none';
                      const id = CartItem[i][0];
                      const cat = CartItem[i][1];
                      database.ref('Products/'+CartItem[i][1]+'/'+CartItem[i][0]).once('value').then(function(snapshot) {

                          
                          // var row = table.insertRow(-1);
                          var row = document.createElement('div');
                          row.setAttribute("class","row"+" "+id);
                          // row.setAttribute("class",id);
                          row.setAttribute("id",cat);
                          // var cell = row.insertCell(-1);
                          var cell = document.createElement('div');
                          cell.setAttribute("class","col-4");
                          var imgcont = document.createElement('div');
                          imgcont.setAttribute("class","imgcontr");
                          var img = document.createElement('img');
                          img.src = snapshot.val().imgurl;
                          img.setAttribute("class","ProdImg img-fluid");
                          imgcont.appendChild(img);
                          cell.appendChild(imgcont);
                          row.appendChild(cell);

                          // var cell = row.insertCell(-1);
                          var cell = document.createElement('div');
                          cell.setAttribute("class","col-8");
                          var name  = document.createElement('a');
                          name.setAttribute("class","pname");
                          name.innerHTML = "<br>"+snapshot.val().name;
                          name.setAttribute("href","https://www.google.com/")
                          cell.appendChild(name);

                          var Price = document.createElement('p')
                          Price.setAttribute("class","pprice")
                          Price.innerHTML = "Price : ₹"+snapshot.val().price;
                          total += Number(snapshot.val().price);
                          document.getElementById('tp').innerHTML = total;
                          document.getElementById('total').style.display = 'block';
                          document.getElementById('pc').style.display = 'block';
                          cell.appendChild(Price);

                   
            
                          var btn = document.createElement('button');
                          btn.setAttribute("class","removebtn");
                          btn.innerHTML = "Remove Item";
                          cell.setAttribute("id",id)
                          cell.appendChild(btn);
                          

                          var x = document.createElement("INPUT");
                          x.setAttribute("type", "number");
                          x.setAttribute("min", 1);
                          x.setAttribute("value",1);
                          x.setAttribute('class',"quantity")
                          x.setAttribute("max",snapshot.val().quantity);
                          cell.appendChild(x);
                          row.appendChild(cell);
                          table.appendChild(row);


                          // Funcation for remove button

                          btn.onclick = function(){
                              var prodid = $(this).parent().attr('id');
                              console.log(prodid)
                              var database = firebase.database();
                              database.ref("User/"+user.uid+"/Cart").child(prodid).set(null);
                              location.reload();
                          }

                          x.onblur = function(){
                           
                            var q = $(this).attr('max'); 
                            var cv = Number($(this).val());
                            console.log("blured "+q+"cv : "+cv);
                            if(cv > q){
                              $(this).val(q);
                              alert("You Can Not Order greater than "+q+"!");
                              cv = q;
                            }
                            else if( cv < 1){
                              $(this).val(1);
                              alert("You Can Not Order less than "+1+"!");
                              cv = 1;
                            }

                           

                            updateTotal();
                          }



                        });
                  }
                  console.log(total);
              });

      } else {
        alert("First login to your account")
      }
    });
}


function updateTotal(){
  var database = firebase.database();
  var total = 0;
  getCartItems().then(function(CartItem){
    for(var i in CartItem ){
      const id = CartItem[i][0];
      database.ref('Products/'+CartItem[i][1]+'/'+CartItem[i][0]).once('value').then(function(snapshot){
        var p = snapshot.val().price ;
        var qdiv = document.getElementById(id);
        var q = qdiv.getElementsByClassName('quantity');
        // console.log(p,$(q).val());
        total = total + Number(p)*Number($(q).val()) ;
        // console.log(total);
        document.getElementById('tp').innerHTML = total;
      })
      
    }
    
  })
}
function feedback(){
  var database = firebase.database();
  // var firebaseRef = firebase.database().ref();
  var ref1 = database.ref("Feedback/");
  console.log(ref1);
  phone : document.getElementById("phone").value;
  // ref.child(user.uid+"/name").set(name);
  ref1.push({
    name : document.getElementById("yourname").value,
    email : document.getElementById("emailid").value,
    subject : document.getElementById("subject").value,
    phone : document.getElementById("phone").value,
    message: document.getElementById("message").value
  });
 alert("your feedback is successfully submitted.we will get back to you as soon as possible.")
}