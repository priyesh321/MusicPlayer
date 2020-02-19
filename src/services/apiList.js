import { api } from './api';

export const baseUrl = 'http://139.59.34.253/api/';
export const songUrl = "http://139.59.34.253/"
const album = 'store/albums/';
const order = 'orders/';
const user = 'users/';
const auth = 'auth/';

export const getAlbums = async (body) => {
  let url = baseUrl + album;
  let method = 'GET';
  let res = await api(url, method, true, '');
  return res
}

export const postOrder = async (body, isFormData) => {
  let url = baseUrl + order;
  let method = 'POST';
  let res = await api(url, method, true, body);
  return res
}

export const postUser = async (body, isFormData) => {
  let url = baseUrl + user;
  let method = 'POST'
  let res = await api(url, method, true, body);
  return res
}

export const login = async (body) => {
  let url = baseUrl + auth;
  let method = 'POST'
  let res = await api(url, method, true, body);
  return res
}

export const updateOrder = async (body, orderID, isFormData) => {
  let url = baseUrl + order + orderID + "/";
  let method = 'PUT';
  let res = await api(url, method, true, body);
  return res
}

export const getSongs = async (body) => {
  console.log(body,'song body');
  
  let url = baseUrl + album + body.id;
  let method = 'GET';
  let res = await api(url, method, true, '');
  return res
}

export const getUser = async (userId) => {
  let url = baseUrl + user + userId + "/";
  let method = 'GET'
  let res = await api(url, method, true, '');
  return res
}

export const sendSms = async (phoneNo, message, senderId) => {
  let url = "http://sms.mesms.in/api/sendhttp.php?authkey=304641Aliql50adV5dd3c40d&mobiles=" + phoneNo + "&message=" + message +
    "&sender=" + senderId + "&route=4&country=91"
  let method = 'GET';
  let errorCondition = false;
  let headers;
  headers = {
    'Content-Type': "application/json"
  }
  let structure = { method: method, headers: headers };
  console.log('Calling URL: ' + url + '\nwith structure: ');
  console.log(structure);
  return fetch(url, structure)
    .then((resp) => {
      console.log("===response", resp)
      if (resp.status == 200) {
        return { success: true }
      } else {
        return { success: false }
      }
    })
    .catch(err => {
      console.log('1- err', err);
      alert(err);
      return { success: false }
    });
}
