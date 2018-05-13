
const restaurantDetailsComponent = { 
    template: ` <div class="col s6">
                    <div>
                    <img v-bind:src="restaurant.thumb">
                           <h4> {{restaurant.name}}</h4>
                           <hr>
                            <i class="fa fa-address-book" aria-hidden="true"></i> <h6>{{restaurant.address}} </h6></br>
                            <i class="fa fa-book" aria-hidden="true"> <a v-bind:href="restaurant.url" target="_blank"> Website </a></i></br>
                            <i class="fa fa-picture-o" aria-hidden="true"></i> <a v-bind:href="restaurant.photo" target="_blank">Photo Gallery</a></br>
                  </div>
                </div>`,
props: ['restaurant']

}

const socket = io()
const app = new Vue({
    el: '#zomato-app',
    data: {
        cities: [],
        cityname: '',
        showCities: false,
        restaurants: [],
        // city: '',
        showRestaurants: false,
        error: false,
        showDetails: false,
        restaurant: {},
        restaurantId: '',
        userChoice: '',
        history: [], 
        cityObject : {}
    },
    methods: {
        searchCity: function(cityname){
            if(this.cityname.trim()==='')
                this.error= true
            else    
            socket.emit('search-city', this.cityname)
        },

        findRestaurants: function(cityObject){
            app.showDetails = false
            socket.emit('get-restaurants-by-cityName', cityObject)    
            },
        displayDetails: function(restaurantId){
            socket.emit('get-restaurant-details', restaurantId)
        }

    },
    components: {
        'restaurant-details-component':restaurantDetailsComponent
    }
})

socket.on('show-cities', citiesList => {
    if(citiesList){
        app.cities = citiesList
        app.showCities = true
    }
})

socket.on('show-restaurants-by-cityname', (restaurantsList,sh) => {
    if(restaurantsList){
        app.restaurants = restaurantsList
        app.showRestaurants = true
        app.history = sh
        console.log(sh)
    }
})

socket.on('show-restaurant-details', details => {
    if(details!={}){
        app.restaurant = details
        app.showDetails = true
    }
})

Vue.config.devtools = true;