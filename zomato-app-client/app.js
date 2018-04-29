// const
//     zomatoApi = require('zomatoApi-server'),
//     inquirer = require('inquirer')

// Chat Component
// const chatComponent = {
//     template: ` <div class="chat-box">
//                    <p v-for="data in content">
//                         <input class="circle" width="30p" type="Image" v-bind:src="data.user.avatar" ></input>
//                        <span><strong>{{data.user.name}}</strong> <small>{{data.date}}</small><span>
//                        <br />
//                        {{data.message}}
//                    </p>
//                </div>`,
//     props: ['content']
// }

// // Users Component
// const usersComponent = {
//     template: ` <div class="user-list">
//                    <h6>Active Users ({{users.length}})</h6>
//                    <ul v-for="user in users">
//                        <li>
//                             <input class="circle" width="30p" type="Image" v-bind:src="user.avatar" ></input>
//                             <span>{{user.name}}</span>
//                        </li>
//                        <hr>
//                    </ul>
//                </div>`,
//     props: ['users','warrningMessage']
// }

// // Welcome Component
// const userComponent = {
//     template: `<div class="me" v-if="user.name">
//         <h5> Welcome </h5>
//             <input class="circle" width="250p" type="Image" v-bind:src="user.avatar" ></input>
//             <h6> Hello {{user.name}} </h6>
//         </div>`,
//         props:['user']
// }




const socket = io()
const app = new Vue({
    el: '#chat-app',
    data: {
        cities: [],
        cityname: ''
    },
    methods: {
    
        getCitybycityname: function(){
            socket.emit('search-city', this.cityname)
        },

    },
    components: {
        // 'users-component': usersComponent,
        // 'chat-component': chatComponent,
        // 'user-component': userComponent
    }
})

socket.on('show-cities', citiesList => {
    app.cities = citiesList
})

Vue.config.devtools = true;