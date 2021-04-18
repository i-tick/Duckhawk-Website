firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
      console.log("uid="+user.uid);

      var database = firebase.database();
      const name=document.getElementById("pname");
      const desc=document.getElementById("pdescription");
      const siz=document.getElementById("psize");
      const brand= document.getElementById('pbrand');
      const mrp= document.getElementById('mrp');
      const price= document.getElementById('sprice');
      const stock= document.getElementById('stockCount');
      const categ= document.getElementById('cat');
      const city= document.getElementById('city');
      const zip=document.getElementById('inputZip');
      const btn=document.getElementById("submit");
          btn.addEventListener('click',(e)=>{
              e.preventDefault();
                  database.ref('/Seller/'+city.value+'/'+user.uid+'/product/'+name.value).set({
                      ProductName : name.value,
                      ProductDesc : desc.value,
                      Size : siz.value,
                      Brand : brand.value,
                      mrp : mrp.value,
                      price:price.value,
                      stock:stock.value,
                      category: categ.value,
                      zip:zip.value
                  });
                  alert("added: "+name.value);
          });




}});


// console.log("connected")
// firebase.initializeApp(firebaseConfig);

    
    