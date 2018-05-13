const
     config = require('./config'),
     axios = require('axios')


_fetch = (command) => {
    return axios.get(`${config.url}/${command}`, {
        headers: {
            Accept: 'application/json',
            'user-key': '04c6fbfc2c4918c90087b43b62f1d511 '
        }
    })
        .then(response => response)
        .catch(error => error.response.body)
}


// get the id of the city by city name.
exports.getcityidbyname = (cityname) => {
    return _fetch(`cities?q=${cityname}`)
}

// get the restaurants in a specific city by city id.
exports.searchrestaurants = (cityId) => {
    return _fetch(`search?entity_id=${cityId}&entity_type=city`)
}

exports.getRestaurant = (resId) => {
    return _fetch(`/restaurant?res_id=${resId}`)
}