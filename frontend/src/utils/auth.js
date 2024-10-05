import Cookies from 'js-cookie';

function checkUserAuth(){

    const myCookie = Cookies.get('token');

    if(myCookie){
        return true;
    }else{
        return false;
    }


}

export default checkUserAuth;