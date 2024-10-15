
import axios from 'axios';
import {API_URL} from 'constants';


export default function confirmedBorrow(){

    return axios.post(API_URL + '/api/borrow', {
        data: [{gallon_id: 1, quantity: 2, available_stock: 10}, 
            {gallon_id: 2, quantity: 2, available_stock: 10}]
           
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
    });
// import confirmedBorrow from "api/borrow.js";
//     confirmedBorrow().then(response => {
//         console.log('Borrow response:', response);
//    }).error(err => {

//    });
}