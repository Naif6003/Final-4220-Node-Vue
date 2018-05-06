
// const citiesComponent = {
//     template: `<div v-show="showCities" class="me" class="col s9">
//                     <h3> Pick a city from the suggestion:  </h3>
//                         <select v-model="cityname">
//                             <option v-for="city in cities">
//                                 {{city}}
//                             </option>
//                         </select>
//             <button v-on:click="findRestaurants(city)" class="btn-small waves-effect waves-light" type="submit"> 
//                  submit 
//             </button>
//     </div>`,
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
        city: '',
        showRestaurants: false
    },
    methods: {
    
        getCitybycityname: function(){
            socket.emit('search-city', this.cityname)
        },

        findRestaurants: function(){
            socket.emit('get-restaurants-by-cityName', this.city)
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