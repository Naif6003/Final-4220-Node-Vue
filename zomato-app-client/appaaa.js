const
    zomatoApi = require('zomatoApi'),
    inquirer = require('inquirer')

// /**
//  * Search for Restaurants
//  *
//  * Asks for City name, and then defers to getter(s)
//  */
// const searchRestaurants = () => {
//     console.log("IN HERE");
// }

/**
  * Get Restaurants By City
  *
  * Ex: cli.js details --city "Los Angeles"
*/
const getRestaurantsByCity = (cityName) => {
    if(cityName){
        zomatoApi.getRestaurantListByCity(cityName)
            .then(response =>{
                // let citiesList = response.data.cities;
                let restuarantList = response.data.restaurants;

                if (restuarantList === undefined || restuarantList.length == 0){
                    console.log("No Restaurants were found with that name! :(, please make sure you entered the name correctly, or wrapped it in quotes (\" \")");
                }else{
                    // We have restuarants
                    // Next, create a better list to show the user
                    var restuarantChoices = [];

                    restuarantList.forEach(restuarantObj =>{
                        var restaurantChoice = {
                            name: restuarantObj.restaurant.name,
                            value: restuarantObj.restaurant
                        }

                        restuarantChoices.push(restaurantChoice);
                    })

                    return inquirer.prompt([{
                        type: 'list',
                        message: 'Select a Restaurant to learn more information:',
                        name: 'restaurant',
                        choices: restuarantChoices,
                        validate: () => {
                            return true
                        }
                    }])
                    .then(choice =>{
                        let restaurant = choice.restaurant;

                        displayRestaurantInformation(restaurant);

                        getRatingsAndReviews(restaurant);
                    });
                }
            })
    }else{
        console.log("ERROR! Please provide the name of a City");
    }
}

const displayRestaurantInformation = (restaurant) => {
    console.log(restaurant.name + "\n Address:" + restaurant.location.address + "\n Cuisine: " + restaurant.cuisines + "\n View the menu here: " + restaurant.menu_url);
}

const getRatingsAndReviews = (restaurant) => {
    return inquirer.prompt([{
        type: 'confirm',
        message: "Do you want rating/reviews for: " + restaurant.name,
        name: "wantsRatingsAndReviews",
    }])
    .then(answer => {
        let wantsRatingsAndReviews = answer.wantsRatingsAndReviews;

        if(wantsRatingsAndReviews){
            zomatoApi.getRestaurantReviewsAndRatings(restaurant.id)
            .then(response =>{
                let ratingsAndReviews = "";

                ratingsAndReviews += "\n\n" + restaurant.name + " - Ratings And Reviews \n"
                ratingsAndReviews += "Average User Rating: " + restaurant.user_rating.aggregate_rating + " - " + restaurant.user_rating.rating_text + "\n";
                ratingsAndReviews += "Based On " + restaurant.user_rating.votes + " Reviews";
                ratingsAndReviews += "\n-----------------------------------\n";

                let reviewResponse = response.data.user_reviews;

                let reviewList = reviewResponse.forEach(review =>{
                    review = review.review;
                    // console.log(review);
                    ratingsAndReviews += review.user.name + " Said: \n" + review.review_text + "\nRating: " + review.rating + " - " + review.rating_text;
                    ratingsAndReviews += "\n-----------------------------------\n";
                });

                console.log(ratingsAndReviews);
            })
        }else{
            console.log("Goodbye");
        }
    })
}

const findcitiestosearch = (cityname) => {
    if(cityname){
        zomatoApi.getcityidbyname(cityname)
        .then(result => {
                return inquirer.prompt([{
                    type: 'list',
                    message: 'select the city you want',
                    name: 'citysuggestions',
                    choices: () => {
                        let obj = []
                         result.data.location_suggestions.forEach(citynamesuggestions => {
                                  obj.push(citynamesuggestions.name)
                            checked: false
                        })
                        return obj
                    },
                    validate: () => {
                        return true
                    }
                }])

        })
                .then(answers => {
                    zomatoApi.getcityidbyname(answers.citysuggestions)
                    .then(result => {
                        result.data.location_suggestions.forEach(city => {
                                if(city.name === answers.citysuggestions){
                                    zomatoApi.searchrestaurants(city.id)
                                    .then(result => {
                                        console.log("-----ALL RESTAURANTS IN ONE CITY----")
                                        result.data.restaurants.forEach(city => {
                                            console.log(city.restaurant.name)
                                        })
                                        console.log('------------------------------------')
                                    })
                                }
                        })
                    })
        })
        .catch(err => console.log(err))
    }else{
        console.log("Please provide a city name!");
    }
}

const getrestaurantbytype = () => {
          return inquirer.prompt([{
                  type: 'input',
                  message: "Enter the city you want to search in: ",
                  name: "cityName",
         },{
             type: 'input',
             message: "Enter the type of the restaurant: (Café, Bakery or Fast Food):",
             name: "restaurantType",
        }])
        .then(results => {
            restauranttypebycity(results)
        })
        .catch(err => console.log(err))
    }


// get all restaurants in a city by city_id
const searchrestaurantsincity = (cityname) => {
    zomatoApi.getcityidbyname(cityname)
        .then(result => {
            /* location_suggestions will bring all names around the world
                which has the same restaurant name
            */
            result.data.location_suggestions.forEach(cityId => {
                if(cityname.replace(/([a-z])([A-Z])/, '$1 $2') === cityId.name.split(',')[0]){
                    /*  after we matched the city name with its Id
                        we call searchrestaurants function to get all restaurants
                        is this city.
                    */
                    zomatoApi.searchrestaurants(cityId.id)
                        .then(allRestInCity => {
                            console.log('------------ Restaurants Names:')
                            allRestInCity.data.restaurants.forEach(restaurant => {
                                console.log(restaurant.restaurant.name)
                            })
                            console.log('------------------------------')
                        })

                }
            })
        .then(result => {
                return inquirer.prompt([{
                    type: 'list',
                    message: 'select the city you want',
                    name: 'citysuggestions',
                    choices: () => {
                        let obj = []
                         result.data.location_suggestions.forEach(citynamesuggestions => {
                                  obj.push(citynamesuggestions.name)
                            checked: false
                        })
                        return obj
                    },
                    validate: () => {
                        return true
                    }
                }])

        })
        .then(answers => { // after finding the list of all correct cities we find the rest in them.
                    let obj = zomatoApi.getcityidbyname(answers.citysuggestions)
                    return [obj , answers] // the way to pass two arguments
        })
                .then(restaurants => {
                    restaurants[0].then(result => {
                        result.data.location_suggestions.forEach(city => {
                                if(city.name === restaurants[1].citysuggestions){
                                    zomatoApi.searchrestaurants(city.id)
                                    .then(result => {
                                        console.log("-----ALL RESTAURANTS IN ONE CITY----")
                                        result.data.restaurants.forEach(city => {
                                            console.log(city.restaurant.name)
                                        })
                                        console.log('------------------------------------')
                                    })
                                }else{
                                    console.log("Please provide a city name!");
                                }
                        })
                    })
        })
        .catch(err => console.log(err))
    })
}

const getrestaurantrevs = () => {
    return inquirer.prompt([{
        type: 'input',
        message: "Enter the City that the Restaurant is Located in: ",
        name: "cityName",
    },{
      type: 'input',
      message: 'Enter Restaurant Name for Ratings and Reviews: ',
      name: "restaurantName",
  }])
  .then(params => {
      searchrestaurantreviews(params)
  })
  .catch(err => console.log(err))
}

// get all restaurants in a city by restaurant type.
const restauranttypebycity = (answersObj) => {
    zomatoApi.getcityidbyname(answersObj.cityName)
        .then(result => {
            /* location_suggestions will bring all names around the world
                which has the same (cityname) in it
            */
            result.data.location_suggestions.forEach(cityId => {
                if(answersObj.cityName === cityId.name.split(',')[0]){
                    /*  after we matched the city name with its Id
                        we call getestablishmenttypebyid function to get all restaurants
                        is this city with the matching type .
                    */
                    zomatoApi.getestablishmenttypebyid(cityId.id)
                        .then(allRestInCity => {
                            allRestInCity.data.establishments.forEach(establishments => {
                                    if(establishments.establishment.name === answersObj.restaurantType){
                                        zomatoApi.searchrestauranttype(cityId.id,establishments.establishment.id)
                                            .then(finalresults => {
                                                finalresults.data.restaurants.forEach(restaurantName => {
                                                        console.log(restaurantName.restaurant.name)
                                                })
                                            })
                                    }
                            })
                        })

                }
            })
        })
        .catch(err => console.log(err))
}


    const displayOptions=()=>{
        return inquirer.prompt([{
            type: 'list',
            message: 'select filter option',
            name: 'filterType',
            choices: () => {
                let options=[
                             {name:"Filter according to type",value:1},
                             {name:"Filter according to Cuisines",value:2},
                             {name:"Get all restaurants in the city",value:3}
                            ]
                            return options;
            },  
            validate: () => {
                return true
            }
    }])
}

    const findcitiestosearchExt = (cityname) => {     
        zomatoApi.getcityidbyname(cityname)
            .then(result => {
                    return inquirer.prompt([{
                        type: 'list',
                        message: 'select the city you want',
                        name: 'citysuggestions',
                        choices: () => {
                            let obj = []
                            result.data.location_suggestions.forEach(cityId =>   {
                                if(cityname  ===cityId.name.split(',')[0])
                                     { 
                                      let v={
                                     name:cityId.name,
                                      value:cityId.id
                                      }
                                        obj.push(v)}
                                 })
                                 checked: false
                                 return obj;
                                },       
                        validate: () => {
                            return true
                        }
                    }])
    
            })
            .catch(err => console.log(err))
            .then(answers => { // after finding the list of all correct cities we find the rest in them.
                //console.log(answers);
                displayOptions()
                .then(filterr=>{
                    
                    if(filterr.filterType==1)
                    {
                        zomatoApi.getestablishmenttypebyid(answers.citysuggestions)
                        .then(allRestInCity => {
                            let ListOfTypes=[];
                            allRestInCity.data.establishments.forEach(elem => {
                                ListOfTypes.push(elem.establishment.name);
                                 })
                                 displayTypes(ListOfTypes)
                                  .then(inputt => {
                                         let typeid;
                                         allRestInCity.data.establishments.forEach(elem => {
                                            if(elem.establishment.name===inputt.Typerestaurants)
                                                typeid=elem.establishment.id;
                                            })          
                                          searchForTypes(answers.citysuggestions,typeid);
                                    })
                                    .catch(err => console.log(err))
                        })
                       .catch(err => console.log(err))
                    }
                    else if(filterr.filterType==2)
                    {
                        zomatoApi.cuisines(answers.citysuggestions)
                                    .then(result => {
                                        let ListOfCuisines=[];
                                        result.data.cuisines.forEach(elem => 
                                                {
                                                var cuisine={
                                                name: elem.cuisine.cuisine_name,
                                                value: elem.cuisine.cuisine_id
                                                } 
                                        ListOfCuisines.push(cuisine);
                                             })
                                       //display cuisines     
                                        displayCuisines(ListOfCuisines)
                                            .then(input => {
                                                let commaseperatedValue=input.restaurants.join(", ")
                                                listRestaurantsFCuisine(answers.citysuggestions,commaseperatedValue);
                                             })
                        .catch(err => console.log(err))
                    
                         })   
            
                    }
                    else {
                        zomatoApi.searchrestaurants(answers.citysuggestions)
                                        .then(resultt => {
                                            getDetailsofRestaurant(resultt.data.restaurants);
                                        })
                    }
                    })  
              
             })
             .catch(err => console.log(err))
      
    }
    const displayCuisines = (result) => {
        //Launch the prompt interface 
        return inquirer.prompt([{
            type: 'checkbox',
            message: 'Filter restaurants by Cuisines ',
            name: 'restaurants',
            choices: result,        
            validate: (input) => {
                 if (input.length == 0) {
                    return 'select atlease one cuisine';
                  }
                  return true;
            }  
        }])
    }

    const displayTypes = (result) => {
        return inquirer.prompt([{
            type: 'list',
            message: 'select Types of Restaurant to Display the restaurants',
            name: 'Typerestaurants',
            choices: result,        
            validate: (input) => {
                
                  if (input.length == 0) {
                    return 'all';
                  }
                  return true;
            }  
        }])
    }
  
    
    
        const listRestaurantsFCuisine = (cityId,result) => {
            zomatoApi.searchForCuisine(cityId,result)
                .then(result => {
                    
                    getDetailsofRestaurant(result.data.restaurants);
                 
                })
                .catch(err => console.log(err))
        }
        
        const searchForTypes = (cityId,id) => {
            zomatoApi.searchForTypes(cityId,id)
                .then(result => {
                    getDetailsofRestaurant(result.data.restaurants);
                 })
                .catch(err => console.log(err))
        }
        

        const getDetailsofRestaurant =(restuarantList)=>{
            var restuarantChoices = [];
        
            restuarantList.forEach(restuarantObj =>{
                var restaurantChoice = {
                    name: restuarantObj.restaurant.name,
                    value: restuarantObj.restaurant
                }
                restuarantChoices.push(restaurantChoice);
        })
        return inquirer.prompt([{
            type: 'list',
            message: 'Select a Restaurant to learn more information:',
            name: 'restaurant',
            choices: restuarantChoices,
            validate: () => {
                return true
            }
        }])
        .then(choice =>{
            let restaurant = choice.restaurant;
        
            displayRestaurantInformation(restaurant);
        
            getRatingsAndReviews(restaurant);
        });
        }

        const getTopCuisines = (cityName)=> {
            if(cityName){
           //     console.log(`----------City : ${cityName} ------------`)
                return zomatoApi.getLocationData(cityName)
                .then(result=>{
                return result.data.location_suggestions[0]
            })
            .then(locationObject=>{
               return zomatoApi.geocode(locationObject.latitude,locationObject.longitude)
            })
            .then(result =>{
                    console.log(`--------Top Cuisines in ${cityName}-------`)
                    result.data.popularity.top_cuisines.forEach(elem=>{
                        console.log(`${elem}`)
                    })
            })
            .catch(err => {
                console.log(err)
            })
        }else{
            console.log("---- Error : No City Found   ----")
        }
    }
    
    const search = (id) => {
           zomatoApi.search(id)
           .then(result => {
               obj = {city_id: '', city: '', restaurants:[]}
               obj.city = result.data.restaurants[0].restaurant.location.city
               obj.city_id = result.data.restaurants[0].restaurant.location.city_id
               result.data.restaurants.forEach(elem=>{
                   obj.restaurants.push(elem.restaurant.name)
               })
               console.log(obj)
           })
           .catch(err=>{
               console.log(err)
           })
    } 

module.exports = {
  	findcitiestosearchExt,
    getRestaurantsByCity,
    findcitiestosearch,
    searchrestaurantsincity,
    restauranttypebycity,
    getrestaurantbytype,
    getTopCuisines,
    search

}
