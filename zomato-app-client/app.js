
// const citiesComponent = {
//     template: `<div v-show="showCities" class="me" class="col s9">
//                 <h5> Pick a city from the suggestion:  </h5>
//                     <ul>
//                         <li v-for="city in cities"> 
//                             <a v-on:click="findRestaurants(city)"> {{city}} </button>
//                         </li>
//                     </ul>
//                 </div>`,
//         props:["cities","showCities","findRestaurants"]
// }


const socket = io()
const app = new Vue({
    el: '#zomato-app',
    data: {
        cities: [],
        cityname: '',
        showCities: false,
        restaurants: [],
        showRestaurants: false
    },
    methods: {
    
        getCitybycityname: function(){
            socket.emit('search-city', this.cityname)
        },

        findRestaurants: function(cityName){
            socket.emit('get-restaurants-by-cityName', this.cityName)
        }

    },
    components: {
        // 'cities-component': citiesComponent,
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