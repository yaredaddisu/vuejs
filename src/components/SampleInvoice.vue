<template>

  <!-- Main modal -->
 

  <div   class="bg-white p-20 ">
    <div class="w-100 bg-white p-15  min-w-full justify-center">
       
             <section  v-for="item in cart" :key="item.id"   class="main-pd-wrapper h-auto w-full "  >
              
               
                            
               
        <div style="
        text-align: center;
        margin: auto;
        line-height: 1.5;
        font-size: 14px;
        color: #4a4a4a;
      ">
      <div class="flex justify-center" >
    <JustboilLogo/>
   </div>
      <p style="font-weight: bold; color: #000; margin-top: 15px; font-size: 18px;">
        Tax Invoice/Bill Of Supply  <br> 
        <strong class="text-2xl font-sans ">{{ user.company }}</strong>

      </p>
      <div style="margin: 15px auto;">
       <p class="font-bold font-serif text-xl">Address</p>
      {{user.address}}
      </div>
      <p>
        <b>Email:</b> {{ user.email }}
      </p>
      <p>
        <b>Phone:</b> {{ user.phone }}
      </p>
      <p>
        <b>Cart Date. :</b> {{ item.updated_at }} OR {{ item.created_at }}
      </p>
      <p>
        <b>REF :</b> {{ item.Reference }}
      </p>
      <hr style="border: 1px dashed rgb(131, 131, 131); margin: 25px auto">
    </div>
                       <div  class="  w-full dark:text-gray-800">

                       <table >
                         <thead>
                           <tr>
                              <th >Item  </th>
                             <th>QTY</th>
                              <th >Total</th>

                           </tr>
                         </thead>
                         <tbody>
                           <tr v-for="data in item.questions" :key="data.id"  class="invoice-items">
                              <td   data-label="Item Name">  <strong class="text-sm">{{data.productName  }}</strong> X </td>
                             <td data-label="QTY"><strong class="text-sm"> {{ data.quantity * -1}}</strong> </td>
 
                             <td  data-label="Price" ><strong>{{$filters.currencyUSD(Math.abs(   data.quantity * data.salesPrice * -1 ))}}</strong></td>

                           </tr>
                         
                        
                         </tbody>
                       </table>
         <hr>
                       <div class="w-full"  >
                         <div>
                           <div class="grid grid-cols-3 sm:grid-cols-2 msm:grid-cols-2 ssm:grid-cols-2 gap-4 px-4 py-4">
                               <div  >Total Products ({{ item.questions.length }})</div>

                             <div  >Total Quantity ({{ totalQuantity }})</div>


                             <div  >Sub Total {{$filters.currencyUSD(Math.abs( item.amount ))}}</div>

                           </div>
                         </div>
                      
                       </div>
         
                   
                       <table class="w-full mt-15 mr-5 "  style=" 
                        border: 1px dashed #00cd00;
                       border-radius: 3px;">
                         <thead>
                           <tr>
                             <td>{{ item.tax }}% (Tax)</td>
 
                                                          <td style="text-align: right;">{{ $filters.currencyUSD(Math.abs(Tax ))}}</td>

                           </tr>
                           <tr>
                             <td>Shipping: </td>
                             <td style="text-align: right;">{{ $filters.currencyUSD(Math.abs(item.shipping)) }}</td>
                           </tr>
                         </thead>
                      
                       </table>

                       <hr>

                     
                       <div class="w-full"  >
                        <div>
                          <div class="grid grid-cols-1  gap-4 px-4 py-4">
 
                             


                            <div>Grand Total    <strong class="ml-2">{{$filters.currencyUSD(Math.abs( parseInt(item.amount) + Tax + parseInt(item.shipping)))}}</strong></div>

                            


                            <div>Payment Method <strong class="ml-2">{{item.paymentMethod}}</strong></div>

                          </div>
                        </div>
                     
                      </div>
        
                      </div>

                      <hr>
                         <span class="mdi mdi-printer"></span>
                         <div  class="grid grid-cols- mb-6 m-5 gap-4  hide">


                          <button  :disabled="!cart.length"  @click.prevent="getInvoice(item)"
                          type="button" class="focus:outline-none 
                          text-white bg-sky-700 hover:bg-sky-800 focus:ring-4
                           focus:ring-sky-300 font-medium rounded-lg text-sm px-5
                            py-2.5 mr-2 mb-2 dark:bg-sky-600 dark:hover:bg-sky-700
                             dark:focus:ring-sky-800"> 
                            
                             Invoice
                          </button>
                           
             
                  
                         </div>
             </section>
           
            </div>            </div>
</template>


<script>
  import { useRouter } from "vue-router";
  import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { mdiEye, } from "@mdi/js";
import store from "@/store";
 
const router = useRouter();

export default {

computed:{
  cart(){
    return this.$store.state.cart;
  },

   user(){
    return this.$store.state.user.data;
  },
 
  cartTotalPrice(){
    return this.$store.getters.cartTotalPrice;
  },
   totalQuantity(){
    return this.$store.getters.totalQuantity;
  },
     Tax(){
    return this.$store.getters.Tax;
  },
},

mounted(){
this.$store.dispatch('getCartItems');
this.$store.dispatch('getUser' );

},
  components: { 
     store,
router,
BaseButtons,
BaseButton,
mdiEye

 },
 props: ["print"],

data: function () {


          return {
            showModel:true,
             
          }

      },
      methods:{
        toggleModal(){
      this.showModel = !this.showModel;
    },

    
    clearCartItems: function(cart){
    this.$store.dispatch("clearCartItems", cart)
    .then(()=>{
  this.$store.commit('notify', {
    type: 'success',
    message: 'Cart was successfully deleted!'
  })
  this.$router.push('/stock-out')

this.$store.dispatch('getCartItems');
});

 
          },

          getInvoice: function( item){

            //alert(item.id)
//window.print();
const route = this.$router.resolve({
name:"invoice",
params: {id: item.id}

});
 
  window.open( route.href, '', 'height=600,width=600')


      
},
 

  
      }

  }

</script>
  <style scoped>
  @media print {
    .hide{
      display:none;
    }
  }
  </style>