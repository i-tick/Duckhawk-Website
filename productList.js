var database = firebase.database();
// console.log(1)

// var url = document.location.href,params = url.split('?')[1].split('&'),data = {}, tmp;
//     for (var i = 0, l = params.length; i < l; i++) {
//          tmp = params[i].split('=');
//          data[tmp[0]] = tmp[1];
//     }
// console.log();
// console.log(data[tmp[0]]);
window.onload = function () {
    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    console.log(data)
    var id = data.id;
    loadProd(id);
    document.getElementById("spinner1").style.display="none";
}
var curr_city = "Bhubaneswar"

// prodcont

function loadProd(id) {
    // alert(1)
    database.ref().child(`/Seller/${localStorage.getItem('cus_city')}/${id}/`).once('value', (snap) => {
        document.getElementById('sname').innerHTML = snap.val().Shop_Name;
        let directionsService = new google.maps.DirectionsService();

        directionsService.route({
            origin: { lat: Number(localStorage.getItem('Loclat')), lng: Number(localStorage.getItem('Loclng')) },
            destination: { lat: Number(snap.val().Latitude), lng: Number(snap.val().Longitude) },
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status == 'OK') {
                var leg = response.routes[0].legs[0];
                // console.log(leg)
                document.getElementById("dist").innerHTML = leg.distance.text;
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    })

    database.ref().child("/Seller/" + localStorage.getItem('cus_city') + '/' + id + "/products/").once("value", function (snapshot) {
        // console.log(snapshot.key)
        console.log(snapshot.val());
        // console.log(snapshot.child("Surf Excel").exists());
        snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            database.ref().child(`Products/${data.City}/${data.cat}/${data.prodid}/`).once('value', function (snap) {
                console.log(snap.val());
                var ds = snap.val();
                var pname = snap.child("ProductName").val();
                var price = snap.child("price").val();
                var str = "duckhawk.in";
                var discount = ((ds.mrp - ds.price) / ds.mrp * 100).toFixed(2);
                // $("#tableBody").append(`<tr><td><a href="${str}">${pname}</a></td>
                // <td>${price}</td><td><a href="#" onClick="addToCart(this.id)" id='${data.City},${data.cat},${data.prodid},${id}'  >+</a></td>`);
                var shopImg = document.getElementById("shopImg");
                // var prodImg=document.getElementById("");
                // console.log(img)
                var img = "./icon.jpeg";
                var image = snap.child("Product_Image").val();
                // console.log(image)
                if (image != null) {
                    img = image;
                }
                // else{
                //     img="./icon.jpeg";
                // }
                console.log("image=" + image);
                $('#prodcont').append(`
                    <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                        <div class="card" style="height:100%">
                        <div class="card-img-top  rounded mx-auto d-block img-thumbnail fixed-height-container" onClick='location.href="./product.html?cat=${data.cat}&id=${data.prodid}"'> 
                <amp-img class="contain i-amphtml-layout-fill i-amphtml-layout-size-defined i-amphtml-element i-amphtml-layout" layout="fill" src="https://unsplash.it/300/300" i-amphtml-layout="fill">
                  <img decoding="async" src="${img}" class="i-amphtml-fill-content i-amphtml-replaced-content">
                </amp-img>
              </div>
                            <div class="card-body" style="padding: 0.25rem;transform: .5s;">
                                <p class="card-title" style="font-weight: 400;">${ds.Brand} <br> ${pname} , ${snap.val().Size} <br>
                                    <span>${price}</span> , <span style="text-decoration-line: line-through;" >${ds.mrp}</span> <span style="color: red;">${discount}% off </span>
                                </p>
                                <center>
                                <div class="mybtncont">
                                <center id="mybtn"><div class="btn btn-success" onClick="addToCart(this.id)" id='${data.City},${data.cat},${data.prodid},${id},${price}' ><i class="fa fa-cart-plus" aria-hidden="true"></i> Add to Cart</></center>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
            })
            //     // console.log(childSnapshot)
            //     // console.log(childSnapshot);
            //     var pname= childSnapshot.child("ProductName").val();
            //     // var phone_no= childSnapshot.child("phone_num").val();
            //     var price= childSnapshot.child("price").val();
            //     // var shoptim= childSnapshot.child("shopTime").val();
            //     console.log(pname);
            //     console.log(price);
            //     var str="duckhawk.in";
            //     // <a href=""></a>

            //     $("#tableBody").append(`<tr><td><a href="'+${str}+'">'+${pname}+'</a></td>'+
            //     '<td>'+${price}+'</td>'+'<td><a href="#" onClick="addToCart()"  >+</a></td>`);
        })
    })
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
                        db.collection("users").doc(user.uid).collection("cart").doc(city).get().then((data)=>{
                            if(!data.exists){
                                db.collection('users').doc(user.uid).collection('cart').doc(city).set({
                                    quantity : 0
                                })
                            }
                        })
                        db.collection("users").doc(user.uid).collection("cart").doc(city).collection(seller).doc(prodid).set({
                            ProductId: prodid,
                            category: cat,
                            seller: seller,
                            city: city,
                            quantity: 1,
                            price : Number(price)
                        }).then(function (docRef) {
                            db.collection("users").doc(user.uid).collection("cart").doc(city).get().then((snap)=>{
                                if(snap.data().quantity == null){
                                    db.collection('users').doc(user.uid).collection('cart').doc(city).set({
                                        quantity : 1
                                    }).then(()=>{
                                        alert("Product Added to cart");
                                    })
                                }else{
                                    db.collection('users').doc(user.uid).collection('cart').doc(city).set({
                                        quantity : snap.data().quantity+1
                                    }).then(()=>{
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
