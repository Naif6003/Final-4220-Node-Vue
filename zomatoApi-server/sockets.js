module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment'),
        indexApi = require('./index')


    io.on('connection', socket => {
            const searchHistory = [] 
            socket.on('search-city', cityName => {  
                indexApi.getcityidbyname(cityName)
                                .then(results => {
                                    let citiesList = []
                                    results.data.location_suggestions.forEach(city => {
                                        citiesList.push({'id':city.id, 'name':city.name})
                                    })
                                    socket.emit('show-cities', citiesList)
                    })

            })

            socket.on('get-restaurants-by-cityName', city => {
                        searchHistory.push(city)
                            indexApi.searchrestaurants(city.id)
                                .then(results => {
                                    let restaurantsList = []
                                    results.data.restaurants.forEach(rest => {
                                        restaurantsList.push(rest.restaurant)
                                    })
                                    socket.emit('show-restaurants-by-cityname', restaurantsList,searchHistory)
                                })
                        })
            
            socket.on('get-restaurant-details', resId => {
                indexApi.getRestaurant(resId)
                        .then(restaurant=>{
                            const restaurantData = {
                            name: restaurant.data.name,
                            url: restaurant.data.url,
                            address: restaurant.data.location.address+restaurant.data.location.city,
                            photo: restaurant.data.photos_url,
                            thumb: restaurant.data.thumb
                        }
                        if (restaurantData.thumb == "")
                            restaurantData.thumb = "../img/restaurant-image.png"

                    socket.emit('show-restaurant-details', restaurantData)
            
                })
            })
        })
}