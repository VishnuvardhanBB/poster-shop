

var load_num_product=4;
var watcher;
new Vue({
el: "#app",
data: {
    total:0,
    // products:[{title:  "product 1",id:1, price: 20.56},
    //           {title:  "product 2",id:2, price : 25.67},
    //            {title: "product 3",id:3, price: 45.45}],
    products:[],
    cart:[],
    search:"cat",
    lastsearch:"" ,
    loading:false,
    ProductResults:[]           
},
methods : {
    AddtoCart : function(product){
        this.total = this.total +product.price;
        var found=false;
        for(var i=0;i<this.cart.length;i++){
            if(this.cart[i].id === product.id){
                found=true;
                this.cart[i].qty++;
            }
        }
        if(!found){
            this.cart.push(
                { id:product.id, title: product.title, price : product.price, qty : 1 });
                
        }
        
    },
    increment:function(item){
            item.qty++;
            this.total += item.price;
    },
    decrement:function(item){
        item.qty--;
        this.total -= item.price;
        if(item.qty <= 0){
            var indexOfItem = this.cart.indexOf(item);
            this.cart.splice(indexOfItem,1);
        }
    },
    onSubmit:function(){
        this.products=[];
        this.ProductResults=[];
        this.loading=true;
        console.log('Search');
        var path="/search?q=".concat(this.search);
        this.$http.get(path)
        .then(function(response){
           
             setTimeout(function(){
                 this.ProductResults=response.body;
               // this.products= response.body.splice(0,load_num_product);
                this.lastsearch= this.search;
                this.appendResultProduct();
                this.loading=false;
             }.bind(this),3000);
        
        });

    },
    appendResultProduct:function(){
        if(this.products.length < this.ProductResults.length){
          var productAppend =this.ProductResults.slice(this.products.length,load_num_product+this.products.length);
          this.products= this.products.concat(productAppend);
      }
    },
    
},
filters:{ currency :function(price){
    return "$".concat(price.toFixed(2));
    }
},
created:function(){
    this.onSubmit();
},
updated:function(){
   var sensor =document.querySelector("#product-list-bottom");
    watcher = scrollMonitor.create(sensor);
    watcher.enterViewport(this.appendResultProduct);
},
beforeUpdate:function(){
     if(watcher){
        watcher.destroy();
        watcher=null;
    }
}
});


