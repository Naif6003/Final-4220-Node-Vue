module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment'),
        indexApi = require('./index')


    io.on('connection', socket => {
        
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
                // console.log(cityName)

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
                                    socket.emit('show-restaurants-by-cityname', restaurantsList)
                                })
                        }
                    })
                })
            })
        })
}