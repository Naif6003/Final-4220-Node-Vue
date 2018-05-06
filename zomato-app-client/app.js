

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

const restaurantDetailsComponent = { 
    template: ` <div class="zomato-box">
                    <p v-for="restaurant in details">
                            {{restaurant.name}}</br>
                            {{restaurant.address}}</br>
                            {{restaurant.url}}</br>
                            {{restaurant.photo}}</br>
                       
                    </p>
                </div>`,
props: ['details']

}

const socket = io()
const app = new Vue({
    el: '#zomato-app',
    data: {
        cities: [],
        cityname: '',
        showCities: false,
        restaurants: [],
        city: '',
        showRestaurants: false,
        error: false,
        showDetails: false,
        details: [],
        restaurant: ''
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
        displayDetails: function(restaurant){
            socket.emit('get-restaurant-details', restaurant)
        }

    },
    components: {
        'restaurant-details-component':restaurantDetailsComponent
        //  'search-cities-component': searchCitiesComponent
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

socket.on('show-restaurant-details', details => {
    if(details){
        app.details = details
        app.showDetails = true
    }
})

Vue.config.devtools = true;