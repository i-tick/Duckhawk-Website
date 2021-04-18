var database = firebase.database();
var curr_city;
var btnShow=document.getElementById("submitBtn")
var id="";
var bt=[];
// alert("please select your location");


function changeCity1(){
    $('#cus_city_modal').modal('show');
  }

function SubmitCity1(){
    var city = document.getElementsByName('customRadio_for_cus_city');
    var select = false;
    for(i = 0;i<city.length;i++){
        if(city[i].checked){
            curr_city=city[i].value;
            // console.log(city[i].value);
            console.log(curr_city)
            select = true;
            break;
        }
    }
  
    if(select){
      old = localStorage.getItem('cus_city');
      localStorage.setItem('cus_city',city[i].value)
      $('#cus_city_modal').modal('hide');
      if(old != localStorage.getItem('cus_city') ){
        setTimeout(()=>{
          var user = firebase.auth().currentUser ; 
          var db = firebase.firestore();
          var batch = firebase.firestore().batch()
          db.collection("users").doc(user.uid).collection("cart").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              db.collection("users").doc(user.uid).collection("cart").doc(doc.id).delete();
                console.log(doc.id);
            })})
          .then(()=>{
            // setTimeout(()=>{
            //   location.reload()
            // },5000)
          })
        },10)
      }
      setTimeout(()=>{
        // location.reload();
      },3000)
    }else{
      alert('You Have to choose One')
    }
    // $('#cus_city_modal').modal('hide');
  }
            
  
  
  
        

btnShow.addEventListener('click',(e)=>{
    // alert("clicked");
    e.preventDefault();
    $("#tableBody tr").remove();
    firebase.auth().onAuthStateChanged(function(user) {
    database.ref().child("/Seller/"+curr_city).once("value",function(snapshot){
        snapshot.forEach(function(childSnapshot){
            // console.log(childSnapshot.key);
            var shopnam= childSnapshot.child("Shop_Name").val(); 
            // var phone_no= childSnapshot.child("phone_num").val();
            var shoptyp= childSnapshot.child("Category").val();
            // var shoptim= childSnapshot.child("shopTime").val();
             id=childSnapshot.key;
            var str="http://duckhawk.in/ProductList.html?id="+id;
            // console.log(user.uid)
            $("#tableBody").append(''+'<tr><td><a href="'+str+'"id="'+id+'">'+shopnam+'</a></td>'+
            '<td>'+shoptyp+'</td>');
            })
        })
        
    })
})


/*
function loadProd(){
    console.log(1+id)
    // alert(1)
    firebase.auth().onAuthStateChanged(function(user) {
        database.ref().child("/Seller/"+curr_city+'/'+user.uid+"/Product/").once("value",function(snapshot){
            snapshot.forEach(function(childSnapshot){
                // console.log(childSnapshot);
                var pname= childSnapshot.child("ProductName").val();
                // var phone_no= childSnapshot.child("phone_num").val();
                var price= childSnapshot.child("price").val();
                // var shoptim= childSnapshot.child("shopTime").val();
                console.log(pname);
                console.log(price);
                var str="duckhawk.in";
                // <a href=""></a>
    
                // $("#tableBody").append(''+'<tr><td><a href="'+str+'">'+shopnam+'</a></td>'+
                // '<td>'+shoptyp+'</td>');
                })
            })
        })
}
*/