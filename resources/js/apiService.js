import axios from 'axios';
import Noty from 'noty';
export function placeOrder(formObject) {
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

}