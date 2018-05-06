
// const searchCitiesComponent = {
//     template: `<div class="search-city-entry">
//                     <p>Search restaurants by city name:</p>
//                     <input id="input" v-model="cityname" placeholder="City Name" type="text" class="u-full-width">
//                     <button v-on:click="searchCity" class="btn-small waves-effect waves-light" type="submit">
//                         Search
//                     </button>
//                     <p class="help has-text-danger" v-if="error">
//                         Field can not be blank..!!
//                     </p>
//                 </div>`,
//     props:['cityname','searchCity','error']
// }

const socket = io()
const app = new Vue({
    el: '#zomato-app',
    data: {
        cities: [],
        cityname: '',
        showCities: false,
        restaurants: [],
        city: '',
        restDetails: {},
        restName: '',
        showRestaurants: false,
        error: false
    },
    methods: {
        searchCity: function(cityname){
            if(this.cityname==='')
                this.error= true
            else    
            socket.emit('search-city', this.cityname)
        },

        findRestaurants: function(city){
            socket.emit('get-restaurants-by-cityName', this.city)
        },

        restdetails: function(restName){
            socket.emit('get-rest-details', restName)
        }

    },
    components: {
        //  'search-cities-component': searchCitiesComponent
        // 'chat-component': chatComponent,
        // 'user-component': userComponent
    }
})

socket.on('show-cities', citiesList => {
    if(citiesList){
        app.cities = citiesList
        app.showCities = true
    }
})

socket.on('show-restaurants-by-cityname', restaurantsList => {
    if(restaurantsList){
        app.restaurants = restaurantsList
        app.showRestaurants = true
        
    }
})

Vue.config.devtools = true;