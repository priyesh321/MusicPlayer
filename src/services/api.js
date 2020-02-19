import { AsyncStorage } from 'react-native';
const objectToFormData = require('object-to-formdata');

export const api = async(url, method, token, body, isFormData =false) => {
  let errorCondition = false;
  let headers;
  if (isFormData) {
    headers = {
      'Content-Type': `multipart/form-data`
    }
  } else {
    headers = {
      'Content-Type': "application/json"
    }
  }
  if (token) {
    console.log(token,'token');
    
    const userToken = await AsyncStorage.getItem('userkey')
    console.log(userToken,'userToken');
    
    headers['Authorization'] = 'Token ' + userToken;
  }

  let structure = {method: method, headers: headers};
  if (body) {
    let formData;
    if (isFormData) {
      const options = {indices: false, nulls: true};
      formData = objectToFormData(
          body,
          options, // optional
      );
    } else {
      formData = JSON.stringify(body)
    }
    structure.body = formData;
  }
  console.log('Calling URL: ' + url + '\nwith structure: ');
  console.log(structure);
  return fetch(url, structure)
      .then((resp) => resp.json())
      .then(jsonResp => {
        // console.log('1- json resp', jsonResp);
        if (errorCondition)
          return {message: 'Server Error', code: ''};
        console.log('API Response for URL: ' + url + '\nis: ', jsonResp);
        return jsonResp;
      })
      .catch(err => {
        console.log('1- err', err);
        alert(err);
      });
}
