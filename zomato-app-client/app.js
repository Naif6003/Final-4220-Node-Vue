
const RestaurantComponent = {
    template: ` <div class="container">
                    <div class="left-side">
                        <img v-bind:src="restaurant.thumb">
                    </div>
                    <div class="right-side">
                        <name>{{restaurant.name}}</name></br>
                        <property>{{restaurant.location.address}} </property></br>
                        <property>cuisines: </property>{{restaurant.cuisines}}
                    </div>
                </div>`,
    props:['restaurant']
}

const SearchHistoryComponent = {
    template:  ` <div class="user-list">
                    <p v-for="data in searchHistory">
                        <span @click="data.func"><strong>{{data.query}}</strong> <small>{{data.date}}</small></span></p>
                </div>`
                ,
    props:['searchHistory']
}

const socket = io()
const app = new Vue({
    el: '#zomato-app',
    data: {
        cities: [],
        cityname: '',
        showCities: false,
        restaurants: [],
        showRestaurantList: false,
        showRestaurant:false,
        error: false,
        restaurant:{},
        searchHistory:[]
    },
    methods: {
        searchCity: function(cityname){ 
            console.log(cityname)
            if(this.cityname==='')
                this.error= true
            
            socket.emit('search-city', this.cityname)
        },

        findRestaurants: function(city){
            console.log(city.name)
            socket.emit('get-restaurants-by-cityName', city)
        },

        getRestaurant: function(resId){
            console.log(resId)
            socket.emit('get-restaurant-data', resId)
        }

    },
    components: {
        'restaurant-component': RestaurantComponent,
        'search-history-component': SearchHistoryComponent
        // 'user-component': userComponent
    }
})

socket.on('show-cities', citiesList => {
    if(citiesList){
        app.cities = citiesList
        console.log(app.cities)
        app.error = false
        app.showCities = true
    }
})

socket.on('show-restaurants-by-cityname', restaurantsList => {
    if(restaurantsList){
        app.restaurants = restaurantsList
        app.showCities = false
        app.showRestaurantList = true    
    }
})

socket.on('show-restaurant-data', restaurant=>{
    if(restaurant){
        app.restaurant = restaurant
        console.log(restaurant)
        app.showRestaurantList = false
        app.showRestaurant = true
    }
})

// socket.on('refresh-search-history', searchHistory => {
//     app.searchHistory = searchHistory
//     console.log(searchHistory)
// })

Vue.config.devtools = true;