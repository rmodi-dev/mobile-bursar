const jwt = require('jsonwebtoken');

function checkTokenExpiry(token){
    const decoded = jwt.decode(token);

    const currentTime = Math.floor(Date.now() / 1000);

    if(!decoded) return false;

    const days = Math.floor((decoded.exp - currentTime)/(60*60*24));
    const hours = Math.floor((decoded.exp - currentTime)/(60*60));
    const minutes = Math.floor((decoded.exp - currentTime)/60);
    const seconds = (decoded.exp - currentTime)%60;

    return({days: days, hours: hours, minutes: minutes, seconds: seconds});
}

module.exports = checkTokenExpiry;