var user = {
    firstName: "John",
    lastName: "Doe",
    gender: "male",

    calories: 2500,
    caloriesConsumed: 1850,
    caloriesLeft: 650,
    protein: 53,
    vitamins: 10,
    minerals: 25,
    fats: 65,
    carbs: 73,
    water: 2  // Water value is based out of 8 cups per day
}
/**
 * Run when the web app finishes loading.
 */
function onLoad() {
    // var user = {
    //     firstName: "John",
    //     lastName: "Doe",
    //     gender: "male",

    //     calories: 2500,
    //     caloriesConsumed: 1850,
    //     caloriesLeft: 650,
    //     protein: 53,
    //     vitamins: 10,
    //     minerals: 25,
    //     fats: 65,
    //     carbs: 73,
    //     water: 2  // Water value is based out of 8 cups per day
    // }

    document.getElementById("calories-consumed").innerHTML = user.caloriesConsumed + "/" + user.calories + " Calories Consumed"
    document.getElementById("calories-left").innerHTML = user.caloriesLeft + " calories remaining today"

    document.getElementById("calories").style.width = ((user.caloriesConsumed / user.calories) * 100)+ "%";
    document.getElementById("protein").style.width = user.protein + "%";
    document.getElementById("vitamins").style.width = user.vitamins + "%";
    document.getElementById("minerals").style.width = user.minerals + "%";
    document.getElementById("fats").style.width = user.fats + "%";
    document.getElementById("carbs").style.width = user.carbs + "%";
    document.getElementById("water").style.width = ((user.water / 8) * 100) + "%";
}

/**
 * Function for the button that adds food to the user's logs.
 */
function quickAddFood() {
            let foodInput = document.getElementById("quick-add-food").value

            if (foodInput == "" || foodInput == null) {
                alert("Please enter a food to search for.")
                return
            }

            let searchResult = foodInput.split(' ').join('+')

            let url = 'https://api.nal.usda.gov/ndb/search/?format=json&q=' + searchResult + '&max=25&offset=0&api_key=9LRFhM1aD2ZkYEWu6hFaDb6N8ccr3NELnDIBZCUQ'
            console.log("Retrieving data from " + url)

            let foodData  // The JSON response of the API call
            let foodItems = []  // The item array in the JSON response
            let foodNames = []  // The names of the foods in the foodOptions array

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                foodData = JSON.parse(this.responseText)
                console.log(foodData)

                try {
                    if (foodData.errors.error[0].status == 400) {
                    alert("No foods matching \"" + foodInput + "\" were found in the database.")
                    }
                } catch (e) {
                    console.log(e)
                }

                foodItems = foodData.list.item
                for (let i = 0; i < foodItems.length; i++) {
                    foodNames.push(foodItems[i].name)
                }

                console.log(foodNames)
                document.getElementById("multiple-selection-items").innerHTML = ""
                generateMultipleOptions(foodNames)
                $("#foodSelectionModal").modal()
            }};
            xmlhttp.open("GET", url, true)
            xmlhttp.send()
}

function generateMultipleOptions(foodOptions) {
    let multipleSelectionItems = document.getElementById("multiple-selection-items")

    for (let i = 0; i < foodOptions.length; i++) {
        let radioButtonDiv = document.createElement("div")
        radioButtonDiv.setAttribute("class", "form-check")

        // Create and append the radio button
        let radioButton = document.createElement("input")
        radioButton.setAttribute("class", "form-check-input")
        radioButton.setAttribute("type", "radio")
        radioButton.setAttribute("name", "foodOptions")
        radioButton.setAttribute("id", "foodOptions" + i)
        radioButton.setAttribute("value", "option" + i)
        radioButtonDiv.appendChild(radioButton)
        
        // Create and append the label
        let radioButtonLabel = document.createElement("label")
        radioButtonLabel.setAttribute("class", "form-check-label")
        radioButtonLabel.setAttribute("for", "foodOption" + i)
        radioButtonLabel.innerHTML = foodOptions[i]
        radioButtonDiv.appendChild(radioButtonLabel)

        multipleSelectionItems.appendChild(radioButtonDiv)
    }    
}

function confirmQuickAdd() {

    var multipleSelectionItems = $('#multiple-selection-items input:radio:checked').val()
    console.log(multipleSelectionItems)
    console.log("Quick adding food...")
    alert("Added successfully.")
}

function recommendFoods() {
    let userDataArray = [
        user.protein,
        user.vitamins,
        user.minerals,
        user.fats,
        user.carbs,
        ((user.water / 8) * 100)
    ]

    let lowestValue = 100
    let lowestValuePos
    let lowestHumanReadableItem
    for (let i = 0; i < userDataArray.length; i++) {
        if (userDataArray[i] < lowestValue) {
            lowestValue = userDataArray[i]
            lowestValuePos = i
            switch (i) {
                case 0:
                    lowestHumanReadableItem = "protein"
                    break
                case 1:
                    lowestHumanReadableItem = "vitamins"
                    break
                case 2:
                    lowestHumanReadableItem = "minerals"
                    break
                case 3:
                    lowestHumanReadableItem = "fats"
                    break
                case 4:
                    lowestHumanReadableItem = "carbs"
                    break
                case 5:
                    lowestHumanReadableItem = "water"
            }
        }
    }

    console.log("lowest value is " + lowestValue)

    document.getElementById("food-suggestion").innerHTML = "Because you are lacking in " + lowestHumanReadableItem + " today, we would recommend the following foods to increase your " + lowestHumanReadableItem + " while keeping your calorie intake low." +
    "<hr>" +
    "- Apple" +
    "- Banana" +
    "- Cherry"

    $("#recommendFoodsModal").modal()
}

function cycleThroughNutrition(dbNumber) {
    url = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + dbNumber + "&type=f&format=json&api_key=9LRFhM1aD2ZkYEWu6hFaDb6N8ccr3NELnDIBZCUQ"

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        foodNutrition = JSON.parse(this.responseText)
        console.log(foodNutrition)

        foodItems = foodNutrition.list.item
        for (let i = 0; i < foodItems.length; i++) {
            foodNames.push(foodItems[i].name)
        }

        console.log(foodNames)
        // document.getElementById("multiple-selection-items").innerHTML = ""
        // generateMultipleOptions(foodNames)
        // $("#foodSelectionModal").modal()
    }};
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
}