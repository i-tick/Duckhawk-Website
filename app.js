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

function load() {
  checkAuth();
  onReloadLocation();
  includeHTML();
}

function closeLoc() {
  $('#sidebar').toggleClass('active');
}


function SetLocation() {
  // var prod_container = document.getElementById("Contid");
  // var cus_city_div = document.getElementById('cus_city_div');
  if (localStorage.getItem('cus_city')) {

    // prod_container.style.display = 'block' ;
    // cus_city_div.style.display = 'block';
    // loadProducts()
    // loadProductsInSwiper();
    // loadWhatsApp();

    // document.getElementById('cus_city').innerHTML = localStorage.getItem('cus_city');
    // document.getElementById('cus_city_div_not_Select').style.display = "none";

  } else {
    // prod_container.style.display = 'none' ;
    // localStorage.setItem('cus_city','Bhubaneswar')
    // $('#cus_city_modal').modal('show');
    $('#sidebar').toggleClass('active');
  }
}


// return firebaseRef.once('value')  //return here as well
// .then(function (snap) {
//   snap.child('Products/' + localStorage.getItem('cus_city')).forEach(function (child) {  //I guess it should be child(player) and not child('thierschi') here
//     selectedPlayerScores.push([child.key, child.val()]);
//   });

//   return selectedPlayerScores;
// });

function checkForCategory() {

  var url = document.location.href;
  var param = url.split('?')[1];
  if (param == null) {
    location.href = "./home.html"
  }
  var params = param.split('&'),
    data = {}, tmp;
  // console.log(url);
  for (var i = 0, l = params.length; i < l; i++) {
    tmp = params[i].split('=');
    data[tmp[0]] = tmp[1];
  }

  var category = data.InbjhUHHJbjO;
  // console.log(category);
  if (category === "All") {
    loadSellerList();
  } else {
    loadSellerListWithCat(category);
  }

}

function loadSellerList() {
  var database = firebase.database();
  var shops = [];
  firebase.auth().onAuthStateChanged(function (user) {

    database.ref().child("/Seller/" + localStorage.getItem('cus_city')).once("value").then(async function (snapshot) {
      // console.log(snapshot.numChildren())
      const nos = snapshot.numChildren();

      await snapshot.forEach(function (childSnapshot, callback) {
        document.getElementById("spinner1").style.display="none";
        var dist;
        let directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: { lat: Number(localStorage.getItem('Loclat')), lng: Number(localStorage.getItem('Loclng')) },
          destination: { lat: Number(childSnapshot.val().Latitude), lng: Number(childSnapshot.val().Longitude) },
          travelMode: 'DRIVING'
        }, async function (response, status) {

          if (status == 'OK') {
            var leg = await response.routes[0].legs[0];
            console.log(leg)
            dist = leg.distance.text;
            var shop = childSnapshot.val();
            shop.id = childSnapshot.key;
            shop.distance = leg.distance.text;
            shop.distvalue = leg.distance.value;
            shops.push(shop);
            if (shops.length == nos) {
              var i = 0;
              shops.sort(GetSortOrder('distvalue'));
              shops.forEach((b) => {
                i = i + 1;
                var str = "./ProductList.html?id=" + b.id + "&q=rsa";
                var dcharge = 0;
                if (b.distvalue < 5001) {
                  dcharge = 45;
                } else if (b.distvalue < 10001) {
                  dcharge = 75;
                } else if (b.distvalue < 20001) {
                  dcharge = 135;
                } else {
                  dcharge = 'Not Deliverable';
                }
                $("#shoplist").append(`
                <div class="col-lg-3 col-md-6 col-sm-12 ${ (i % 2) ? 'odd' : 'even'}" id="shopCont" style="margin: 1px 0px;padding-bottom: 5px;" onClick='location.href="${str}"'>
            <div class="container vertical-center" >
              <div class="row d-flex align-items-center">
                <div class="col-5" id="shop_img">
                <img class="img-fluid" src="${b.Shop_Image == "" ? b.Shop_Image : b.Shop_Image}" alt="" srcset="" >
                </div>
                <div class="col-7" id="shopdetail">
                  <p><b>${b.Shop_Name}</b></p>
                  <p>${b.Category}</p>
                  <p>${b.distance}</p>
                  <p>Delivery charge :₹ ${dcharge}</p>
                </div>
              </div>
            </div>
          </div>
                `)

              })
            }

          } else {
            console.log('Directions request failed due to ' + status);
          }
          // var shopnam = childSnapshot.child("Shop_Name").val();

          // var shoptyp = childSnapshot.child("Category").val();

          // id = childSnapshot.key;
          // var str = "./ProductList.html?id=" + id + "&q=rsa";
          //       $("#shoplist").append(`
          //       <div class="col-lg-3 col-md-6 col-sm-12  ${ (i % 2)  ?'odd' :'even' }" id="shopCont" style="margin: 1px 0px;padding-bottom: 5px;" onClick='location.href="${str}"'>
          //   <div class="container vercal-center" >
          //     <div class="row d-flex align-items-center">
          //       <div class="col-5" id="shop_img">

          //       </div>
          //       <div class="col-7" id="shopdetail">
          //         <p><b>${shopnam}</b></p>
          //         <p>${shoptyp}</p>
          //         <p>${dist}</p>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          //       `)
        });

      })
      console.log("Hello")
      shops.sort(GetSortOrder('distvalue'));
      console.log(shops);
      return shops;
    }, () => { console.log("SecondThen") })

  })
}

function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}


// function loadWhatsApp() {

//   var hasService = ["Bhubaneswar", "Rourkela", "Berhampur"]

//   if (hasService.indexOf(localStorage.getItem('cus_city')) > -1) {
//     document.getElementById('hasService').style.display = "block";
//   }
//   else {
//     document.getElementById('NoProduct').style.display = 'block';
//   }
// }

function SendMessage() {
  var user = firebase.auth().currentUser;
  if (user) {
    if (!localStorage.getItem('Loclat')) {
      alert('Set Your Location First ?')
      $('#sidebar').toggleClass('active');
    }
    var message = "Welcome *" + user.displayName + "* to %0A%0D*DuckHawk* - *_Online Shopping_*.%0A%0D%0A%0DYour Current location is : ";
    message = message + "%0A%0Dhttps://www.google.com/maps/search/%3Fapi=1%26query=" + localStorage.getItem('Loclat') + "," + localStorage.getItem('Loclng') + " %0A%0D%0A%0D";
    message = message + "Your City : *" + localStorage.getItem('cus_city') + "*%0A%0D";
    message = message + "At the last be sure to give the Complete Address%0A%0D";
    message = message + "*List Your Orders Here :*  %0A%0D";
    console.log(message);
    // window.location.href = "https://wa.me/917303548895/?text=%0A%0D"+message;

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
      window.location.href = "https://wa.me/917303548895/?text=%0A%0D" + message;
      return 'iOS';

    }
    else if (userAgent.match(/Android/i)) {
      window.location.href = "https://wa.me/917303548895/?text=%0A%0D" + message;
      return 'Android';
    }
    else {
      alert("WhatApp Not Installed ");
      return 'unknown';
    }

  }
  //   else{
  //     alert("First Login to DocHawk.")
  //     $('#login').modal('show');   
  //   }
}


// function changeCity() {
//   $('#cus_city_modal').modal('show');
// }

function SubmitCity() {
  var city = document.getElementsByName('customRadio_for_cus_city');
  var select = false;
  for (i = 0; i < city.length; i++) {
    if (city[i].checked) {
      console.log(city[i].value);
      select = true;
      break;
    }
  }

  if (select) {
    old = localStorage.getItem('cus_city');
    localStorage.setItem('cus_city', city[i].value)
    $('#cus_city_modal').modal('hide');
    if (old != localStorage.getItem('cus_city')) {
      setTimeout(() => {
        var user = firebase.auth().currentUser;
        var db = firebase.firestore();
        var batch = firebase.firestore().batch()
        db.collection("users").doc(user.uid).collection("cart").get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            db.collection("users").doc(user.uid).collection("cart").doc(doc.id).delete();
            console.log(doc.id);
          })
        })
          .then(() => {
            // setTimeout(()=>{
            //   location.reload()
            // },5000)
          })
      }, 10)
    }
    setTimeout(() => {
      location.reload();
    }, 3000)
  } else {
    alert('You Have to choose One')
  }
  // $('#cus_city_modal').modal('hide');
}

// SetLocation();


function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}







//Products from the database
var firebaseRef = firebase.database().ref();

function getScoresOfPlayer() {

  var selectedPlayerScores = [];

  return firebaseRef.once('value')  //return here as well
    .then(function (snap) {
      snap.child('Products/' + localStorage.getItem('cus_city')).forEach(function (child) {  //I guess it should be child(player) and not child('thierschi') here
        selectedPlayerScores.push([child.key, child.val()]);
      });

      return selectedPlayerScores;
    });

}

function loadProducts() {

  var isEmpty = false;
  getScoresOfPlayer()
    .then(function (ALlproducts) {
      //   var table = document.querySelector('#table1');
      var container = document.getElementById("Contid");
      if (ALlproducts.length == 0) {
        document.getElementById('NoProduct').style.display = 'block';
        document.getElementById("spinner1").style.display="none";
      }
      document.getElementById("spinner1").style.display="none";
      console.log(document.getElementById("spinner1"));
      for (var k in ALlproducts) {

        // var row = table.insertRow(-1);
        var row = document.createElement('div');
        row.setAttribute("class", "row");
        var cat = document.createElement('h1');
        cat.setAttribute("class", "cat")
        cat.innerHTML = ALlproducts[k][0];
        row.appendChild(cat);
        container.appendChild(row);

        var row = document.createElement('div');
        row.setAttribute("class", "row");
        var products = ALlproducts[k][1]


        for (var i in products) {

          //   var cell = row.insertCell(-1);
          var cell = document.createElement('div');
          cell.setAttribute("class", "col-lg-3 col-md-4 col-sm-6 col-xs " + ALlproducts[k][0]);
          cell.setAttribute("id", i);
          // cell.setAttribute("class",ALlproducts[k][0]);

          //ing of the product.
          var imgcont = document.createElement('div');
          imgcont.setAttribute("class", "imgcontr");
          var img = document.createElement('img');
          img.src = products[i].imgurl;
          img.setAttribute("class", "ProdImg");
          imgcont.appendChild(img);
          cell.appendChild(imgcont);

          //Prod description.
          var name = document.createElement('a');
          name.setAttribute("class", "pname");
          name.innerHTML = "<br>" + products[i].name;
          name.setAttribute("href", "./product.html?cat=" + ALlproducts[k][0] + "&id=" + i);
          cell.appendChild(name);
          var des = document.createElement('p')
          des.setAttribute("class", "pdes");
          des.innerHTML = "Description : <br>" + products[i].description;
          // cell.appendChild(des);
          var Price = document.createElement('p')
          Price.setAttribute("class", "pprice")
          Price.innerHTML = "Price : ₹" + products[i].price
          cell.appendChild(Price);
          var quantity = document.createElement('p')
          quantity.setAttribute("class", "pquantity")
          quantity.innerHTML = "Available : " + products[i].quantity;
          cell.appendChild(quantity);
          //Button for add to cart
          var btncont = document.createElement('div');
          btncont.setAttribute("class", "btncont");
          var btn = document.createElement('button');
          btn.innerHTML = "Add To cart";
          btncont.appendChild(btn);
          btn.setAttribute("class", "Addtocartbtn");
          cell.appendChild(btncont);
          btn.onclick = function () {
            // Do code for add to cart.
            var prodid = $(this).parent().parent().attr('id');
            var cat = $(this).parent().parent().attr('class');
            var cate = cat.split(" ")[4];

            firebase.auth().onAuthStateChanged(function (user) {
              if (user) {

                var db = firebase.firestore();


                db.collection("users").doc(user.uid).collection("cart").doc(prodid).get()
                  .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                      console.log("Document alredy exist")
                      alert("Product is already in cart");
                    } else {
                      db.collection("users").doc(user.uid).collection("cart").doc(prodid).set({
                        ProductId: prodid,
                        category: cate,
                        quantity: 1
                      }).then(function (docRef) {
                        console.log("Document written with ID  product added to cart");
                      }).catch(function (error) {
                        console.error("Error adding document: ", error);
                      });
                    }
                  });
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

// added from script.js for authentication, sign up and login
/*  added from script.js  */
var UserName;

function checkAuth() {
  // console.log("Check Auth fun");
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.uid);
      var db = firebase.firestore();
      db.collection("users").doc(firebase.auth().currentUser.uid)
        .onSnapshot(function (doc) {
          // console.log("Current data: ", doc.data());
          // console.table(doc.data())

          UserName = doc.data().Name;
          document.getElementById("signin").style.display = "none";
          document.getElementById("myprof").innerHTML = UserName;

          db.collection('users').doc(user.uid).collection('cart').doc(localStorage.getItem('cus_city')).get()
            .then(function (snapshot) {
              var count = snapshot.data().quantity;
              console.log("hello : " + count);
              if (count == 0 || count == null) {
                document.getElementById('itemincart').style.display = 'none';
              }
              else {
                document.getElementById('itemincart').style.display = 'block';
                document.getElementById('itemincart').innerHTML = count;
              }
            })

        });
      loadUser();
    } else {
      // console.log("No user is login");
      localStorage.setItem("l", { lat: 6.7839749, long: 798.78978 })
      if (localStorage.getItem("location")) {
        closeLoc();
        console.log(Boolean(localStorage.getItem("locBool")));
        localStorage.removeItem('locBool');
      }
    }
  });

}


function prof() {
  // console.log("prof");
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // console.log(user);
      window.location.href = "profile.html";
    }
    else {
      alert("login first");
    }
  });

}

function signup() {
  var name = document.getElementById('name').value;
  UserName = name;
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;
  var number = document.getElementById('phonenumber').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (result) {
      var db = firebase.firestore();
      var user = firebase.auth().currentUser;
      db.collection("users").doc(user.uid).set({
        Name: name,
        email: email,
        phone: number,
        isSeller: false,
      })
        .then(function (docRef) {
          console.log("Document written with ID: " + user.uid);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });

      return result.user.updateProfile({
        displayName: document.getElementById("name").value,
        phoneNumber: Number(document.getElementById('phonenumber').value)
      }).then(() => {
        $('#signup').modal('hide');
        alert("Account Created Successfully Now Login With same Details.");
        document.getElementById('lemail').value = email;
        $('#login').modal('show');
      })

    }).catch(function (error) {
      console.log(error);
      alert(error.message);
    });


  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     console.log(user.uid);

  //     document.getElementById('lemail').value = email;
  //     document.getElementById('lpassword').value = password;
  //     login();
  //         $('#signup').modal('hide');
  //   } else {
  //     alert("Some Problem is there ,Be Sure you have active internet connection...?");
  //   }
  // });

}

function login() {
  var email = document.getElementById('lemail').value;
  var password = document.getElementById('lpassword').value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {

    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    console.log(errorCode);

    if (errorCode == "auth/wrong-password") {
      alert("Wrong Password for User " + email);
    }
    else if (errorCode == "auth/user-not-found") {
      alert("There is no user in this Email ID");
    }

  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.uid);
      var db = firebase.firestore();
      db.collection("users").doc(user.uid).onSnapshot(function (doc) {
        console.log("Current data: ", doc.data().phone);
        console.table(doc.data())
        UserName = doc.data().Name;
        $('#login').modal('hide');
      });

      // var database = firebase.database();

      // database.ref('User/'+user.uid).once('value').then(function(snapshot) {
      //   console.log(snapshot.val().name);
      //   UserName = snapshot.val().name;
      //   //code to close the modal
      //   // $(function() {
      //   //   $('#loginbtn').click(function() {
      //       $('#login').modal('hide');
      //       // document.getElementById('login').setAttribute("class","modal fade")
      // //   });
      // //  });
      //   // document.getElementById("login").modal="hide";
      //     // window.location = "./UserHome.html";
      // });
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



function loadUser() {
  var Name;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var database = firebase.database();
      // console.log(user);
      console.log(user.displayName);
      console.log(user.phoneNumber);
      document.getElementById('myprof').innerHTML = user.displayName;

      var db = firebase.firestore();
      db.collection('users').doc(user.uid).collection("cart").get().then(res => {
        var count = res.size;
        console.log(count);
        if (count == 0) {

          document.getElementById('itemincart').style.display = 'none';
        }
        else {
          document.getElementById('itemincart').style.display = 'block';
          document.getElementById('itemincart').innerHTML = count;
        }
      });

    } else {
      console.log("No user is signed in.");
    }
  });

}


function logout() {

  firebase.auth().signOut()
    .then(function () {
      console.log("Sign-out successful.");
      window.location = "./index.html";
    })
    .catch(function (error) {
      console.log(error)
      // An error happened
    });
}


function resetPass() {
  var auth = firebase.auth();
  var remail = document.getElementById('useremail').value;
  auth.sendPasswordResetEmail(remail).then(function () {
    alert("Email Sent to your Email address " + remail);
    window.location = "./index.html";
  }).catch(function (error) {
    var errorCode = error.code;
    if (errorCode == "auth/user-not-found") {
      alert("There is no user in this Email ID");
    } else {
      alert(error.message);
    }

  });

}

function loadOrderdProduct() {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      var firebaseRef = firebase.database().ref();

      function getOrderdItems() {

        var OrderdItems = [];

        return firebaseRef.once('value')  //return here as well
          .then(function (snap) {
            snap.child("User/" + user.uid + "/Orders/").forEach(function (child) {  //I guess it should be child(player) and not child('thierschi') here
              OrderdItems.push([child.key, child.val()]);
            });

            return OrderdItems;
          });

      }

      var database = firebase.database();
      getOrderdItems().then(function (Ordered) {
        var table = document.querySelector('#op');
        // console.log(Ordered);
        for (var i in Ordered) {
          console.log(Ordered[i]);
          const oid = Ordered[i][0];
          const p = Ordered[i][1];
          console.log(oid, p)
          database.ref('Products/' + p.Cat + '/' + p.productid).once('value').then(function (snapshot) {
            console.log(snapshot.val());
            var row = table.insertRow(-1);
            row.setAttribute("class", oid);
            var cell = row.insertCell(-1);
            var imgcont = document.createElement('div');
            imgcont.setAttribute("class", "imgcontr");
            var img = document.createElement('img');
            img.src = snapshot.val().imgurl;
            img.setAttribute("class", "ProdImg");
            imgcont.appendChild(img);
            cell.appendChild(imgcont);

            var cell = row.insertCell(-1);
            var name = document.createElement('a')
            name.setAttribute("class", "pname");
            name.innerHTML = "<br>" + snapshot.val().name;
            name.setAttribute("href", "https://www.google.com/")
            cell.appendChild(name);
            var Price = document.createElement('p')
            Price.setAttribute("class", "pprice")
            Price.innerHTML = "Price : ₹" + snapshot.val().price;
            cell.appendChild(Price);

            database.ref("User/" + user.uid + "/Orders/" + oid).once('value').then(function (snapshot) {
              console.log(snapshot.val())
              var cell = row.insertCell(-1);
              var Price = document.createElement('p')
              Price.setAttribute("class", "Ostatus")
              Price.innerHTML = " Status : " + snapshot.val().Status;
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

function checkSeller() {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      var db = firebase.firestore();
      db.collection("users").doc(user.uid).onSnapshot(function (doc) {

        if (doc.data().isSeller) {

          window.location.href = "./SellerDashBoard";

        } else {
          window.location.href = "./Seller.html";
        }

      });

    } else {
      // console.log(" No user is signed in.");
      $('#login').modal('show')
      setTimeout(() => {
        alert("Please Login first !");
      }, 300)
    }
  });
}


function isApplied() {
  console.log("Called IS Applied");
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      db.collection("users").doc(user.uid).onSnapshot(function (doc) {

        if (doc.data().isApplied) {
          if (doc.data().isSeller) {
            location.href = "./SellerDashBoard"
          }
          document.getElementById('after').style.display = 'block';
          document.getElementById('before').style.display = 'none';
        }
      });
    } else {

      $('#login').modal('show')
      setTimeout(() => {

        alert("Please Login first !");
      }, 300)

    }
  });
}
function Submit() {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var sname = document.getElementById("shopname").value;
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
      var cat = document.getElementById("inputCat").value;
      var mulipleshop = localStorage.getItem("ans");
      console.log(mulipleshop);

      // const ref = firebase.storage().ref();
      // const file = document.querySelector('#exampleFormControlFile1').files[0];
      // const name = (+new Date()) + '-' + file.name;
      // const metadata = {
      //     contentType: file.type
      //   };

      //   const task = ref.child(name).put(file, metadata);
      //   task
      //     .then(snapshot => snapshot.ref.getDownloadURL())
      //     .then((url) => {
      //       var database = firebase.database();
      //       var ref = database.ref("ApplicationForSeller/"+user.uid+"/");


      // For FireStore

      // var db = firebase.firestore()
      // db.collection("Application for sellers").doc(user.uid).set({
      //   // Shop_Image : url,
      //   Shop_Name : sname,
      //   Email_id : email,
      //   Owner_Name : oname,
      //   Owner_Number : ono,
      //   Manager_Name : manname,
      //   Manager_Phone : mannum,
      //   GST_Number : gstnum,
      //   Address1 : add1,
      //   Address2 : add2 ,
      //   City : city,
      //   State : state,
      //   Zip : zip,
      //   HaveMulShop : (mulipleshop == "no" )?false:true 
      // }).then(()=>{
      //   var db = firebase.firestore()
      //   db.collection("users").doc(user.uid).update({
      //     isApplied : true
      //   }).then(()=>{
      //     document.getElementById('after').style.display = 'block';
      //     document.getElementById('before').style.display = 'none';
      //   })
      // })

      var database = firebase.database();
      var ref = database.ref("ApplicationForSeller/" + user.uid + "/");
      // var newProdRef = ref.push();
      ref.set({
        // Shop_Image : url,
        Shop_Name: sname,
        Email_id: email,
        Owner_Name: oname,
        Owner_Number: ono,
        Manager_Name: manname,
        Manager_Phone: mannum,
        Aadhar_Number: gstnum,
        Address1: add1,
        Address2: add2,
        City: city,
        State: state,
        Zip: zip,
        Category: cat,
        HaveMulShop: (mulipleshop == "no") ? false : true
      }).then(() => {
        var db = firebase.firestore()
        db.collection("users").doc(user.uid).update({
          isApplied: true
        }).then(() => {
          document.getElementById('after').style.display = 'block';
          document.getElementById('before').style.display = 'none';
        })
      })

      // }).catch(console.error);


      // const file2 = document.querySelector('#exampleFormControlFile2').files[0];
      // const name2 = (+new Date()) + '-' + file2.name;
      // const metadata2 = {
      //     contentType: file2.type
      //   };
      //   const task2 = ref.child(name2).put(file2, metadata2);
      //   task2
      //     .then(snapshot => snapshot.ref.getDownloadURL())
      //     .then((url) => {

      //       var db = firebase.firestore()
      //       db.collection("Application for sellers").doc(user.uid).update({
      //         GST_Certificate : url
      //       })
      //     })
      //     .catch(console.error);



    } else {
      $('#login').modal('show')
      setTimeout(() => {

        alert("You Have to Login first !");
      }, 300)
    }
  });

}

function myFunction(ans) {
  localStorage.setItem("ans", ans);
}

function profile() {
  var Name;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var database = firebase.database();
      // console.log(user);
      console.log(user.displayName);
      console.log("phone=" + user.number);
      console.log("email=" + user.email);
      console.log(user);
      document.getElementById('myprof').innerHTML = user.displayName;
      document.getElementById("signin").style.display = "none";
      document.getElementById('name').innerHTML = user.displayName;
      document.getElementById('email').innerHTML = user.email;
      document.getElementById('mobile').innerHTML = user.phoneNumber;

      var db = firebase.firestore();
      db.collection("users").doc(user.uid).onSnapshot(function (doc) {

        Name = doc.data().Name;
        document.getElementById('mobile').innerHTML = doc.data().phone;

      });



      // database.ref('User/'+user.uid).once('value').then(function(snapshot) {
      //   Name = snapshot.val().name;
      //   console.log(snapshot.val());
      //   document.getElementById('mobile').innerHTML = snapshot.val().number;
      // //   user.sendEmailVerification().then(function() {
      // //     // Email sent.
      // //   }).catch(function(error) {
      // //     // An error happened.
      // //   });
      // });


      database.ref('User/' + user.uid + '/Cart').once('value').then(function (snapshot) {
        var count = snapshot.numChildren();
        console.log(count);
        if (count == 0) {

          document.getElementById('itemincart').style.display = 'none';
        }
        else {
          document.getElementById('itemincart').style.display = 'block';
          document.getElementById('itemincart').innerHTML = count;
        }
      })


    } else {
      console.log(" No user is signed in.");
    }
  });
}

const getSubCollections = firebase
  .functions()
  .httpsCallable('getSubCollections');

var total;
var wp = document.getElementById("wp");
var user = firebase.auth().currentUser;
var orderString;

function loadCart() {
  firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
      // orderString = "Welcome *"+user.displayName+"* to %0A%0D*DuckHawk* - *_Online Shopping_*.%0A%0D%0A%0DYour Order Details are : %0A%0D " ; 

      total = 0;
      var db = firebase.firestore();
      var database = firebase.database();
      var table = document.getElementById("cartitem");
      var charges = [];

      getSubCollections({ docPath: `/users/${user.uid}/cart/${localStorage.getItem('cus_city')}/` })
        .then(async function (result) {
          var collections = result.data.collections;
          console.log(collections);
          for (i in collections) {
            console.log(collections[i])
            var shopName;
            const shopId = collections[i];
            await database.ref(`Seller/${localStorage.getItem('cus_city')}/${shopId}/`).once('value').then(async (snapshot) => {
              console.log(snapshot.val())
              shopName = snapshot.val().Shop_Name;

              let directionsService = new google.maps.DirectionsService();
              directionsService.route({
                origin: { lat: Number(localStorage.getItem('Loclat')), lng: Number(localStorage.getItem('Loclng')) },
                destination: { lat: Number(snapshot.val().Latitude), lng: Number(snapshot.val().Longitude) },
                travelMode: 'DRIVING'
              }, async function (response, status) {
                if (status == 'OK') {
                  var leg = await response.routes[0].legs[0];
                  var dcharge = 0;
                  var distvalue = leg.distance.value;
                  if (distvalue < 5001) {
                    dcharge = 45;
                  } else if (distvalue < 10001) {
                    dcharge = 75;
                  } else if (distvalue < 20001) {
                    dcharge = 135;
                  } else {
                    dcharge = 500;
                  }
                  charges.push(dcharge);
                  await $("#cartitem").append(`<div class="row">
                <div class="col">
                    <h2> Shop : ${shopName}</h1>
                    <p>Delivery charge :₹ ${dcharge}</p>
                </div>
              </div>`)
                }
              });

            }).then(async () => {

              await db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem("cus_city")).collection(shopId).get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  // doc.data() is never undefined for query doc snapshots
                  console.log(doc.id, " => ", doc.data());
                  const id = doc.data().ProductId;
                  const cat = doc.data().category;
                  document.getElementById('empty').style.display = 'none';
                  database.ref('Products/' + localStorage.getItem('cus_city') + "/" + cat + '/' + id).once('value').then(function (snapshot) {

                    // const prodString  = `* *Name* : ${snapshot.val().name} %0A%0D*Quantity* : ${doc.data().quantity} %0A%0D*Price* : ${snapshot.val().price} %0A%0D%0A%0D `;
                    // var row = table.insertRow(-1);
                    var row = document.createElement('div');
                    row.setAttribute("class", "row" + " " + id);
                    // row.setAttribute("class",id);
                    row.setAttribute("id", cat);
                    row.setAttribute("style", "padding : 0px 10px");
                    row.setAttribute('shop', shopId);
                    // var cell = row.insertCell(-1);
                    var cell = document.createElement('div');
                    cell.setAttribute("class", "col-4");

                    // var imgcont = document.createElement('div');
                    // imgcont.setAttribute("class","imgcontr");
                    // var img = document.createElement('img');
                    // img.src = snapshot.val().imgurl;
                    // img.setAttribute("class","ProdImg img-fluid");
                    // imgcont.appendChild(img);
                    // cell.appendChild(imgcont);
                    // row.appendChild(cell);

                    // var cell = row.insertCell(-1);
                    var cell = document.createElement('div');
                    cell.setAttribute("class", "col");
                    var name = document.createElement('a');
                    name.setAttribute("class", "pname");
                    name.innerHTML = "<br>" + snapshot.val().ProductName;
                    name.setAttribute("href", "./product.html?cat=" + cat + "&id=" + id + "q=rsa")
                    cell.appendChild(name);

                    var Price = document.createElement('p')
                    Price.setAttribute("class", "pprice")
                    Price.innerHTML = "Price : ₹" + snapshot.val().price * Number(doc.data().quantity) + "<br>For Quantity";
                    total += Number(snapshot.val().price) * Number(doc.data().quantity);
                    document.getElementById('tp').innerHTML = total;
                    document.getElementById('total').style.display = 'block';
                    document.getElementById('pc').style.display = 'block';
                    cell.appendChild(Price);

                    var x = document.createElement("INPUT");
                    x.setAttribute("type", "number");
                    x.setAttribute("min", 1);
                    x.setAttribute("value", doc.data().quantity);
                    x.setAttribute('class', "quantity")
                    x.setAttribute("max", snapshot.val().stock);
                    cell.appendChild(x);

                    var btn = document.createElement('button');
                    btn.setAttribute("class", "removebtn");
                    btn.innerHTML = "Remove Item";
                    cell.setAttribute("id", id)
                    cell.appendChild(btn);

                    var line = document.createElement('hr');
                    cell.appendChild(line);
                    row.appendChild(cell);
                    table.appendChild(row);


                    // Funcation for remove button

                    btn.onclick = function () {
                      var prodid = $(this).parent().attr('id');
                      const shop = $(this).parent().parent().attr('shop');
                      console.log(prodid)
                      var database = firebase.database();
                      // database.ref("User/"+user.uid+"/Cart").child(prodid).set(null);
                      db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).collection(shop).doc(prodid).delete().then(() => {
                        db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).get().then((doc) => {
                          if (doc.exists) {
                            db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).set({
                              quantity: doc.data().quantity - 1
                            }).then(() => {
                              location.reload();
                            })
                          }
                        })
                      }).catch(function (error) {
                        console.error("Error removing document: ", error);
                      });
                      // location.reload();
                    }

                    x.onblur = function () {
                      var prodid = $(this).parent().attr('id');
                      const shop = $(this).parent().parent().attr('shop');
                      console.log(prodid, shop);
                      var q = Number($(this).attr('max'));
                      var cv = Number($(this).val());
                      console.log("blured " + q + " cv : " + cv);
                      if (cv > q) {
                        $(this).val(q);
                        alert("You Can Not Order greater than " + q + "!");
                        cv = q;
                        alert(`Quantity Changed to ${cv}`)
                        db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).collection(shop).doc(prodid).update({
                          quantity: Number(cv)
                        }).then(() => {
                          console.log("Updated in database");
                          location.reload();
                        }).catch(err => {
                          console.log(err);
                        })
                      }
                      else if (cv < 1) {
                        $(this).val(1);
                        alert("You Can Not Order less than " + 1 + "!");
                        cv = 1;
                        alert(`Quantity Changed to ${cv}`)
                        db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).collection(shop).doc(prodid).update({
                          quantity: cv
                        }).then(() => {
                          console.log("Updated in database");
                          location.reload();
                        }).catch(err => {
                          console.log(err);
                        });
                      } else {
                        db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).collection(shop).doc(prodid).update({
                          quantity: cv
                        }).then(() => {
                          console.log("Updated in database");
                          location.reload();
                        }).catch(err => {
                          console.log(err);
                        });
                      }
                      updateTotal(collections, charges)
                      console.log(charges);

                    }
                    updateTotal(collections, charges);
                    console.log(charges);
                  })
                });
              })
            })
          }





        })
        .catch(function (error) {

          var code = error.code;
          var message = error.message;
          var details = error.details;

        });

      //   db.collection("users").doc(user.uid).collection("cart").get().then(function(querySnapshot) {
      //     console.log(querySnapshot)
      //     querySnapshot.forEach(function(doc) {
      //         // doc.data() is never undefined for query doc snapshots
      //         console.log(doc.id, " => ", doc.data());


      //     });
      // })
      // .then(()=>{
      //   orderString = orderString+"%0A%0DTotal : "+total+"%0A%0D";
      //   console.log(orderString)
      // })



    } else {
      alert("First login to your account")
    }
  });
}


function updateTotal(collections, charges) {
  console.log(charges);
  var db = firebase.firestore();
  var database = firebase.database();
  var user = firebase.auth().currentUser;
  // var spinner = document.createElement('div');
  // spinner.setAttribute('class',"spinner-border");
  document.getElementById('tp').innerHTML = '';
  document.getElementById('ti').innerHTML = '';
  document.getElementById('tdc').innerHTML = '';
  document.getElementById('tfp').innerHTML = '';
  document.getElementById('tp').setAttribute('class', "spinner-grow spinner-grow-lg");
  document.getElementById('tfp').setAttribute('class', "spinner-grow spinner-grow-lg");
  document.getElementById('ti').setAttribute('class', "spinner-grow spinner-grow-sm");
  document.getElementById('tdc').setAttribute('class', "spinner-grow spinner-grow-sm");
  var total1 = 0;
  var i = 0;
  for (j in collections) {
    db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).collection(collections[j]).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const id = doc.data().ProductId;
        const cat = doc.data().category;

        database.ref('Products/' + localStorage.getItem('cus_city') + "/" + cat + '/' + id).once('value').then(function (snapshot) {
          var p = snapshot.val().price;
          var qdiv = document.getElementById(id);
          var q = qdiv.getElementsByClassName('quantity');
          i = i + Number($(q).val());
          // console.log(p,$(q).val());
          total1 = total1 + Number(p) * Number($(q).val());
          // console.log(total);
          document.getElementById('tp').innerHTML = total1;
          document.getElementById('tp').removeAttribute('class', "spinner-grow spinner-grow-lg");
          document.getElementById('ti').innerHTML = i;
          document.getElementById('ti').removeAttribute('class', "spinner-grow spinner-grow-sm");
          var sum = charges.reduce(function (a, b) {
            return a + b;
          }, 0);
          localStorage.setItem("Dcharges", JSON.stringify(charges));
          document.getElementById('tdc').innerHTML = sum;
          document.getElementById('tdc').removeAttribute('class', "spinner-grow spinner-grow-sm");
          document.getElementById('tfp').innerHTML = Number(total1) + Number(sum);
          document.getElementById('tfp').removeAttribute('class', "spinner-grow spinner-grow-lg");
        })
      })
    }).catch(err => {
      alert("There is some problem");
    });
  }
}
var tf = 0;


function constructOrderString() {
  console.log("Called constructor")
  tf = 0;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      orderString = "Welcome *" + user.displayName + "* to %0A%0D*DuckHawk* - *_Online Shopping_*.%0A%0D%0A%0DYour Order Details are : %0A%0D ";
      var db = firebase.firestore();
      var database = firebase.database();
      db.collection("users").doc(user.uid).collection("cart").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const id = doc.data().ProductId;
          const cat = doc.data().category;
          database.ref('Products/' + localStorage.getItem('cus_city') + "/" + cat + '/' + id).once('value').then(function (snapshot) {
            const prodString = `* *Name* : ${snapshot.val().name} %0A%0D*Quantity* : ${doc.data().quantity} %0A%0D*Price* : ${snapshot.val().price} %0A%0D%0A%0D `;
            tf += Number(snapshot.val().price) * Number(doc.data().quantity);
            orderString = orderString + prodString;
          })
        })
      }).then(() => {

      })
    }
  });
}




// Get element references

//  var confirmBtn2 = document.getElementById('confirmPosition2');
//  var onClickPositionView2 = document.getElementById('onClickPositionView2');
//  var onIdlePositionView2 = document.getElementById('onIdlePositionView2');
var map2 = document.getElementById('map2');

var lp2 = new locationPicker(map2, {
  setCurrentPosition: true, // You can omit this, defaults to true
}, {
  gestureHandling: 'greedy',
  streetViewControl: false,
  zoomControl: false,
  zoom: 15 // You can set any google map options here, zoom defaults to 15
});
lp2.setLocation(localStorage.getItem('Loclat'), localStorage.getItem('Loclng'))

// var getCur2 = document.getElementById('getCurrent2');

// getCur2.onclick = function(){
//   lp2.setCurrentPosition();
// }


// confirmBtn2.onclick = function () {

//   var location = lp2.getMarkerPosition();
//   // onClickPositionView2.innerHTML = 'The chosen location is ' + location.lat + ',' + location.lng;

// };



google.maps.event.addListener(lp2.map, 'idle', function (event) {

  var location = lp2.getMarkerPosition();
  console.log(location.lat + ',' + location.lng)
});














// function loadProductsInSwiper() {

//   getScoresOfPlayer()
//     .then(function (ALlproducts) {
//       //   var table = document.querySelector('#table1');
//       var container = document.getElementById("swid");

//       for (var k in ALlproducts) {
//         var products = ALlproducts[k][1]


//         for (var i in products) {

//           //   var cell = row.insertCell(-1);
//           var cell = document.createElement('div');
//           cell.setAttribute("class", "swiper-slide");
//           cell.setAttribute("id", i);
//           // cell.setAttribute("class",ALlproducts[k][0]);

//           //img of the product.
//           var imgcont = document.createElement('div');
//           imgcont.setAttribute("class", "imgcontr");
//           var img = document.createElement('img');
//           img.src = products[i].imgurl;
//           img.setAttribute("class", "ProdImg");
//           imgcont.appendChild(img);
//           cell.appendChild(imgcont);

//           //Prod description.
//           var name = document.createElement('a');
//           name.setAttribute("class", "pname");
//           name.innerHTML = "<br>" + products[i].name;
//           name.setAttribute("href", "./product.html?cat=" + ALlproducts[k][0] + "&id=" + i);
//           cell.appendChild(name);
//           var des = document.createElement('p')
//           des.setAttribute("class", "pdes");
//           des.innerHTML = "Description : <br>" + products[i].description;
//           // cell.appendChild(des);
//           var Price = document.createElement('p')
//           Price.setAttribute("class", "pprice")
//           Price.innerHTML = "Price : ₹" + products[i].price
//           cell.appendChild(Price);

//           container.appendChild(cell);
//         }
//         // container.appendChild(cell);
//       }
//     }).then(() => {
//       var swiper = new Swiper('.swiper-container', {
//         effect: 'coverflow',
//         grabCursor: true,
//         centeredSlides: true,
//         slidesPerView: 'auto',
//         coverflowEffect: {
//           rotate: 50,
//           stretch: 0,
//           depth: 100,
//           modifier: 1,
//           slideShadows: true,
//         },
//         pagination: {
//           el: '.swiper-pagination',
//         },
//         navigation: {
//           nextEl: '.swiper-button-next',
//           prevEl: '.swiper-button-prev',
//         },
//       });
//     })

// }


// script2.js added files
function placeOrder() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // var database = firebase.database();
      // var items = $('#cartitem tr');
      // for(var i = 0;i<items.length;i++){
      //     console.log(items[i]);
      //     var cat = $(items[i]).attr('id');
      //     var prodid = $(items[i]).attr('class');

      //     var ref = database.ref("Orders/");
      //     var newProdRef = ref.push();
      //     newProdRef.set({
      //         productid : prodid,
      //         prodcat : cat,
      //         buyer : user.uid,
      //         Address : document.getElementById('adr').value
      //     })
      //     var key = newProdRef.key;
      //     console.log(key);

      //     var userref =  database.ref("User/"+user.uid+"/Orders/"+key);
      //     userref.child("productid").set(prodid);
      //     userref.child("Cat").set(cat);
      //     userref.child("Status").set("Order Received");

      // }
      // database.ref("User/"+user.uid+"/").child("Cart").set(null);
      // console.log("Orderd Succesfully");
      // location.reload();

      setTimeout(() => {
        constructOrderString()
        console.log("Called1")
      }, 3000);


      setTimeout(() => {
        // orderString = orderString+"%0A%0DTotal : *"+tf+"*";
        // wp.setAttribute("href","https://wa.me/919078908824/?text=%0A%0D"+orderString);
        // window.location.href = "https://wa.me/919078908824/?text=%0A%0D"+orderString;
        console.log("Called product2")
      }, 3500);

    } else {
      console.log(" No user is signed in.");
    }
  });

}



// function placeOrderDone(){
//   var add = document.getElementById('adr').value ;
//   if(!localStorage.getItem('Loclat')){
//     alert('Set Your Location First ?')
//     $('#sidebar').toggleClass('active');
//   }
//   else{
//     if(add){
//       setTimeout(() => {
//         orderString = orderString+"%0A%0DTotal : *"+tf+"*"+"%0A%0DAddress : "+add+"%0A%0Dhttps://www.google.com/maps/search/%3Fapi=1%26query="+localStorage.getItem('Loclat')+","+localStorage.getItem('Loclng')+"%0A%0DNote :%0A%0D*If you don't give any number ,Delevery Boy Will Contact to your WhatsApp Number.*%0A%0D%0A%0D*Thank You..*";
//         console.log(orderString);
//         window.location.href = "https://wa.me/917303548895/?text=%0A%0D"+orderString;
//       console.log("Called product")
//       }, 3000);
//       setTimeout(()=>{
//         var user = firebase.auth().currentUser ; 
//         var db = firebase.firestore();
//         var batch = firebase.firestore().batch()
//         db.collection("users").doc(user.uid).collection("cart").get().then(function(querySnapshot) {
//           querySnapshot.forEach(function(doc) {
//             db.collection("users").doc(user.uid).collection("cart").doc(doc.id).delete();
//               console.log(doc.id);
//           })})
//         .then(()=>{
//           // setTimeout(()=>{
//           //   location.reload()
//           // },5000)
//         })
//       },10)
//     }else{
//       alert("Please Write your Address.");
//     }
//   }
// }

function goToMyOrders() {
  location.href = "./profile.html#orders";
}

function placeOrderDone() {

}

document.getElementById('finalpo').addEventListener('click', (e) => {
  e.preventDefault();
  var user = firebase.auth().currentUser;
  var add = document.getElementById('adr').value;
  var location = lp2.getMarkerPosition();
  var db = firebase.firestore();
  var orders = [];
  var Dcharges = JSON.parse(localStorage.getItem("Dcharges"));
  console.log(location.lat + ',' + location.lng)
  console.log(location);
  if (add) {
    getSubCollections({ docPath: `/users/${user.uid}/cart/${localStorage.getItem('cus_city')}/` })
      .then(async function (result) {
        var collections = result.data.collections;
        for (i in collections) {
          console.log(collections[i])
          const shopId = collections[i];
          const dcharge = Dcharges[i];
          var ref = firebase.database().ref(`Orders/${localStorage.getItem('cus_city')}/`);

          await db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem("cus_city")).collection(shopId).get().then(async function (querySnapshot) {
            var newOrderRef = await ref.push();
            console.log(newOrderRef);
            orders.push(newOrderRef.key);
            await newOrderRef.set({
              buyer: user.uid,
              time: new Date().toString(),
              location: location,
              Address: add,
              seller: shopId,
              dcharge: dcharge
            })

            await firebase.database().ref(`Seller/${localStorage.getItem('cus_city')}/${shopId}/Orders/${newOrderRef.key}`).set({
              buyer: user.uid,
              time: new Date().toString()
            });

            var total = 0;
            querySnapshot.forEach(async function (doc) {
              total = total + doc.data().price * doc.data().quantity;
              newOrderRef.child("Products").child(doc.data().ProductId).set(doc.data());
              console.log(total);
              newOrderRef.update({
                total: total
              })
            })
            await db.collection("users").doc(user.uid).collection("orders").doc(newOrderRef.key).set({
              time: firebase.firestore.Timestamp.fromDate(new Date()),
              city: localStorage.getItem("cus_city"),
              total: total
            })
          })
        }
      }).then(async () => {
        alert("Your Order Successfully placed");
        $('.removebtn').click()
        await db.collection("users").doc(user.uid).collection("cart").doc(localStorage.getItem('cus_city')).delete().then(() => {
          console.log("deleted");
          goToMyOrders();
        }).catch(function (error) {
          console.error("Error removing document: ", error);
        });

      })
  } else {
    alert("Plaese Give your address");
  }

  


  // if(add){
  //   // firebase.database().ref("/LOcationTrial").child("Hello").set(location);
  //   var ref = firebase.database().ref(`Orders/${localStorage.getItem('cus_city')}/`);
  //   var newOrderRef = ref.push();

  //   newOrderRef.set({
  //     time : new Date(),
  //     location : location,
  //     Address : add
  //   })


});



function showOrder() {
  var db = firebase.firestore();
  var database = firebase.database();
  var cont = document.getElementById('orders');
  firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
      db.collection("users").doc(user.uid).collection("orders").orderBy("time", "desc").get().then((ordoc) => {
        ordoc.forEach(function (doc) {
          database.ref(`/Orders/${doc.data().city}/${doc.id}`).once('value').then((snap) => {
            // $('#orders').append(`
            //     <div class="row" id="${doc.id}">
            //     <div class="col-lg-7 col-md-7 col-sm">
            //     Order ID:  ${doc.id}
            //     </div>
            //     </div>`);
            var date = new Date(snap.val().time); 

            $('#orders').append(`
            <div class="row eachorder"  id="oid" >
              <div class="col-lg-7 col-md-7 col-sm">
            Order ID:  ${doc.id} <br>
            Delevery Charge :  ${snap.val().dcharge} <br>
            Total : ${snap.val().total + snap.val().dcharge}
            </div>
            <div class="col-lg-5 col-md-5 col-sm">
            ${date.toLocaleTimeString()} , ${date.toLocaleDateString()} <br>
            ${doc.data().city}
            </div>
            <div class="container" id="${doc.id}">
              <div class="row">
                Products : ...
              </div>
            </div>
           </div>
          </div>
            `);

            snap.child('Products').forEach((prod) => {
              console.log(prod.val().ProductId);
              var name;
              database.ref(`/Products/${prod.val().city}/${prod.val().category}/${prod.val().ProductId}/ProductName`).once('value').then((s) => {
                name = s.val();
                $(`#${doc.id}`).append(`
                <div class="row" id="eachproduct">
              <div class="col-lg-7 col-md-7 col-sm">
              ${name} <br>
              </div>  
              <div class="col-lg-5 col-md-5 col-sm">
              Price : ${prod.val().price} ,
              Quantity :  ${prod.val().quantity}
              </div>
              </div>
                `);
              })

            })

          })

        })
      })
    }
  })

}

function loadSellerListWithCat(categoryofseller) {
  var database = firebase.database();
  var shops = [];
  firebase.auth().onAuthStateChanged(function (user) {

    database.ref().child("/Seller/" + localStorage.getItem('cus_city')).orderByChild("Category").equalTo(categoryofseller).on("value", async function (snapshot) {
      // console.log(snapshot.numChildren())
      const nos = snapshot.numChildren();

      if (nos == 0) {
        $("#shoplist").append(`
  <div class="col-12">
            <div class="card">
              <!-- <img class="card-img-top" src="holder.js/100x180/" alt=""> -->
              <div class="card-body">
                <h4 class="card-title">There Is no shops in ${localStorage.getItem('cus_city')} for the Category ${categoryofseller} .</h4>
                <p class="card-text">Plaese try again by changing the location or the category..</p>
              </div>
            </div>
          </div>
  `);
  document.getElementById("spinner1").style.display="none";
        return
      }
      await snapshot.forEach(function (childSnapshot, callback) {
        var dist;
        let directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: { lat: Number(localStorage.getItem('Loclat')), lng: Number(localStorage.getItem('Loclng')) },
          destination: { lat: Number(childSnapshot.val().Latitude), lng: Number(childSnapshot.val().Longitude) },
          travelMode: 'DRIVING'
        }, async function (response, status) {

          if (status == 'OK') {
            var leg = await response.routes[0].legs[0];
            // console.log(leg)
            dist = leg.distance.text;
            var shop = childSnapshot.val();
            shop.id = childSnapshot.key;
            shop.distance = leg.distance.text;
            shop.distvalue = leg.distance.value;
            shops.push(shop);
            if (shops.length == nos) {
              var i = 0;
              shops.sort(GetSortOrder('distvalue'));
              shops.forEach((b) => {
                i = i + 1;
                var str = "./ProductList.html?id=" + b.id + "&q=rsa";
                var dcharge = 0;
                if (b.distvalue < 5001) {
                  dcharge = 45;
                } else if (b.distvalue < 10001) {
                  dcharge = 75;
                } else if (b.distvalue < 20001) {
                  dcharge = 135;
                } else {
                  dcharge = 'Not Deliverable';
                }
                $("#shoplist").append(`
                <div class="col-lg-3 col-md-6 col-sm-12 ${ (i % 2) ? 'odd' : 'even'}" id="shopCont" style="margin: 1px 0px;padding-bottom: 5px;" onClick='location.href="${str}"'>
            <div class="container vertical-center" >
              <div class="row d-flex align-items-center">
                <div class="col-5" id="shop_img">
                <img class="img-fluid" src="${b.Shop_Image == "" ? b.Shop_Image : b.Shop_Image}" alt="" srcset="" >
                </div>
                <div class="col-7" id="shopdetail">
                  <p><b>${b.Shop_Name}</b></p>
                  <p>${b.Category}</p>
                  <p>${b.distance}</p>
                  <p>Delivery charge :₹ ${dcharge}</p>
                </div>
              </div>
            </div>
          </div>
                `)

              })
            }
            document.getElementById("spinner1").style.display="none";
          } else {
            console.log('Directions request failed due to ' + status);
            document.getElementById("spinner1").style.display="none";
          }
        });
        document.getElementById("spinner1").style.display="none";
      })
      // console.log("Hello")
      shops.sort(GetSortOrder('distvalue'));
      document.getElementById("spinner1").style.display="none";
      // console.log(shops);
      return shops;
    }, () => { console.log("SecondThen") })

  })
}