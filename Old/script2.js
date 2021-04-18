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

function loadCart(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let total = 0;
            var firebaseRef = firebase.database().ref();

            function getCartItems() {

                var CartItems = [];

                return firebaseRef.once('value')  //return here as well
                .then(function(snap) {
                    snap.child("User/"+user.uid+"/Cart/").forEach(function(child) {  //I guess it should be child(player) and not child('thierschi') here
                    CartItems.push([child.key, child.val()]);
                    });

                    return CartItems;
                });

                }

                var database = firebase.database();
                
                getCartItems().then(function(CartItem){
                    var table = document.querySelector('#cartitem');
                    for(var i in CartItem ){
                        
                        const id = CartItem[i][0];
                        const cat = CartItem[i][1];
                        database.ref('Products/'+CartItem[i][1]+'/'+CartItem[i][0]).once('value').then(function(snapshot) {

                            
                            var row = table.insertRow(-1);
                            row.setAttribute("class",id);
                            row.setAttribute("id",cat);
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
                            total += Number(snapshot.val().price);
                            document.getElementById('tp').innerHTML = total;
                            document.getElementById('total').style.display = 'block';
                            document.getElementById('pc').style.display = 'block';
                            cell.appendChild(Price);

                            var cell = row.insertCell(-1);
                            var btn = document.createElement('button');
                            btn.setAttribute("class","removebtn");
                            btn.innerHTML = "Remove Item";
                            cell.setAttribute("id",id)
                            cell.appendChild(btn);



                            // Funcation for remove button

                            btn.onclick = function(){
                                var prodid = $(this).parent().attr('id');
                                console.log(prodid)
                                var database = firebase.database();
                                database.ref("User/"+user.uid+"/Cart").child(prodid).set(null);
                                location.reload();
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

loadCart();



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
                    console.log(Ordered);
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