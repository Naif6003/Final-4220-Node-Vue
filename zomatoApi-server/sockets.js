module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment'),
        index = require('./index')


    let users = []
    const messages = []

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {
        
            socket.on('search-city', cityname => {
                
                index.getcityidbyname(cityname)
                                .then(results => {
                                    let citiesList = []
                                    results.data.location_suggestions.forEach(city => {
                                        citiesList.push(city.name)
                                    })
                                    // console.log(citiesList)
                                    socket.emit('show-cities', citiesList)
                    })

            })
        })
}
