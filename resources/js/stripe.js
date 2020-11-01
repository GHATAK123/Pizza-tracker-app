import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
import {loadStripe} from '@stripe/stripe-js';
export async function initStripe() {
  const stripe = await loadStripe('pk_test_51Him4PImoXzOYK9BTav036K02rYO4oHXE22Q8bd62qpE0t4mcNhMS2dOHZjL2aZdJkO0mCDXhs2aZj4BwUG7ozrs00tgeFlE5e');
  let card = null
  function mountWidget() {
    const elements = stripe.elements();
  let style = {
            base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
            },
            invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
            }
        };
    card = elements.create('card',{style,hidePostalCode : true});
  card.mount("#card-element")
  }

  const paymentType = document.querySelector('#paymentType');
  if(!paymentType){
    return;
  }
  paymentType.addEventListener('change',(e)=>{
    console.log(e.target.value);
    if(e.target.value === 'card') {
      mountWidget();

    } else {
         card.destroy();
    }

  })

  const paymentForm=document.querySelector('#payment-form');
if(paymentForm){
  paymentForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let formData = new FormData(paymentForm);
    let formObject = {};
    for(let [key,value] of formData.entries()){
        formObject[key]=value;
  
    }
    axios.post('/orders',formObject).then((res)=>{
      new Noty({
        type:'success',
        timeout:1000,
        text: res.data.message,
        progressBar:false,
        layout:'topLeft'
      }).show();
      setTimeout(()=>{
        window.location.href = '/customer/orders';

      },1000)
      
    }).catch((err)=>{
      console.log(err);
  
    })
      console.log(formObject)
      
  })
  

}


}