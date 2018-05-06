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

// gets all the categories in the API
exports.categories = () => {
        return _fetch('categories')
}

// get the id of the city by city name.
exports.getcityidbyname = (cityname) => {
    return _fetch(`cities?q=${cityname}`)
}

// get the restaurants in a specific city by city id.
exports.searchrestaurants = (cityId) => {
    return _fetch(`search?entity_id=${cityId}&entity_type=city`)
}

// search for a restaurant type in a city
exports.searchrestauranttype = (entity_id, establishment_type) => {
    return _fetch(`search?entity_id=${entity_id}&entity_type=city&establishment_type=${establishment_type}`)
}

// get establishment_type by city_id
exports.getestablishmenttypebyid = (city_id) => {
    return _fetch(`establishments?city_id=${city_id}`)
}
// get restaurant reviews
exports.getrestaurantreviews = (res_id) => {
    return _fetch(`reviews?res_id=${res_id}`)
}

exports.getRestaurantListByCity = (cityName) => {
    return _fetch(`search?entity_type=city&q=${cityName}`)
}

exports.getRestaurantReviewsAndRatings = (restaurantID) =>{
    return _fetch(`reviews?res_id=${restaurantID}`)
}

exports.cuisines = (cityId) => {
    return _fetch(`/cuisines?city_id=${cityId}`)
}

exports.searchForCuisine = (cityId,ids) => {
   
    return _fetch(`/search?entity_id=${cityId}&entity_type=city&cuisines=${ids}`)
}

exports.establishments = (cityId) => {
    
    return _fetch(`/establishments?city_id=${cityId}`)
}

exports.searchForTypes = (cityId,id) => {
    return _fetch(`/search?entity_id=${cityId}&entity_type=city&establishment_type=${id}`)
}
exports.getLocationData = (cityname) => {
    return _fetch(`locations?query=${cityname}`)
}
exports.geocode = (latitude, longitude) => {
    return _fetch(`geocode?lat=${latitude}&lon=${longitude}`)
}
exports.search = (id) =>{
    return _fetch(`search?entity_id=${id}&entity_type=city`)
}