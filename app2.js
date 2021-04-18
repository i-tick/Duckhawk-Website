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


// firebase.initializeApp(firebaseConfig);

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
    this.console.log(data.cat, data.id);
    data.id = data.id.replace('#', '');
    this.console.log(data.cat, data.id);
    var database = firebase.database();

    database.ref(`Products/${localStorage.getItem('cus_city')}/${data.cat}/${data.id}/`).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        document.getElementById("prodimg").style.visibility="visible";
        document.getElementById("spinner1").style.display="none";
        var prodimg = document.getElementById('prodimg');
        var img = "./icon.jpeg";
        var image = snapshot.child("Product_Image").val();
        if (image != null) {
            img = image;
        }

        document.title = `${snapshot.val().ProductName} | ${snapshot.val().Brand} | DuckHawk`

        prodimg.setAttribute("src", img)
        $("#pdes").append(`
    <div class="card">
    <div class="card-body">
      <h4 class="card-title">${snapshot.val().ProductName}</h4>
      <p class="card-text">${snapshot.val().Brand}</p>
      <p class="card-text">Price: ${snapshot.val().price} MRP: ${snapshot.val().mrp} </p>
      <p class="card-text">Size : ${snapshot.val().Size}</p>
      <p class="card-text">Stock : ${snapshot.val().stock}</p>
      <p class="card-text">${snapshot.val().ProductDesc}</p>
      <div class="mybtncont">
        <center id="mybtn"><div class="btn btn-success" onClick="addToCart(this.id)" id='${localStorage.getItem('cus_city')},${data.cat},${data.id},${snapshot.val().seller},${snapshot.val().price}' ><i class="fa fa-cart-plus" aria-hidden="true"></i> Add to Cart</div></center>
        </div>
    </div>
  </div>
    `);
    });
}

function addToCart(data) {
    console.log(data);
    var data = data.split(',');
    console.log(data)
    var city = data[0];
    var seller = data[3];
    var cat = data[1];
    var prodid = data[2];
    const price = data[4];
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var db = firebase.firestore();
            db.collection("users").doc(user.uid).collection("cart").doc(city).collection(seller).doc(prodid).get()
                .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        console.log("Document alredy exist")
                        alert("Product is already in cart !Please go to cart and Check Out..");
                    } else {
                        db.collection("users").doc(user.uid).collection("cart").doc(city).get().then((data) => {
                            if (!data.exists) {
                                db.collection('users').doc(user.uid).collection('cart').doc(city).set({
                                    quantity: 0
                                })
                            }
                        })
                        db.collection("users").doc(user.uid).collection("cart").doc(city).collection(seller).doc(prodid).set({
                            ProductId: prodid,
                            category: cat,
                            seller: seller,
                            city: city,
                            quantity: 1,
                            price: Number(price)
                        }).then(function (docRef) {
                            db.collection("users").doc(user.uid).collection("cart").doc(city).get().then((snap) => {
                                if (snap.data().quantity == null) {
                                    db.collection('users').doc(user.uid).collection('cart').doc(city).set({
                                        quantity: 1
                                    }).then(() => {
                                        alert("Product Added to cart");
                                    })
                                } else {
                                    db.collection('users').doc(user.uid).collection('cart').doc(city).set({
                                        quantity: snap.data().quantity + 1
                                    }).then(() => {
                                        alert("Product Added to cart");
                                    })
                                }
                            })
                        }).catch(function (error) {
                            console.error("Error adding document: ", error);
                        });
                    }
                });
            loadUser();
        } else {
            alert("First login to your account")
            $('#login').modal('show');
        }
    });
}
