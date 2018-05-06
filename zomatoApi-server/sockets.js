module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment'),
        indexApi = require('./index')


    io.on('connection', socket => {
            var searchHistory = [] 
            socket.on('search-city', cityName => {  
                indexApi.getcityidbyname(cityName)
                                .then(results => {
                                    let citiesList = []
                                    results.data.location_suggestions.forEach(city => {
                                        citiesList.push(city.name)
                                    })
                                    socket.emit('show-cities', citiesList)
                    })

            })


            socket.on('get-restaurants-by-cityName', cityName => {
                searchHistory.push(cityName)
                indexApi.getcityidbyname(cityName)
                .then(result => {
                    result.data.location_suggestions.forEach(obj => {
                        if(cityName == obj.name){
                            indexApi.searchrestaurants(obj.id)
                                .then(results => {
                                    let restaurantsList = []
                                    results.data.restaurants.forEach(rest => {
                                        restaurantsList.push(rest.restaurant)
                                    })
                                    socket.emit('show-restaurants-by-cityname', restaurantsList,searchHistory)
                                })
                        }
                    })
                })
            })

            socket.on('get-restaurant-details', restaurantId => {
                
                indexApi.getRestaurantReviewsAndRatings(restaurantId.R.res_id)
                .then(results => {
                    const detailsList = []
                    var restaurantChoice = {
                        name: restaurantId.name,
                        url: restaurantId.url,
                        address: restaurantId.location.address+restaurantId.location.city,
                        photo: restaurantId.photos_url
                    }

                    detailsList.push(restaurantChoice);
                    socket.emit('show-restaurant-details', detailsList)
            
                })
            })
        })
}