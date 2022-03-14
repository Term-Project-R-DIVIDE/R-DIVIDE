var btnLogin = document.getElementById('do-login');
var idLogin = document.getElementById('login');
var username = document.getElementById('username');

document.getElementById('submit').disabled = true;
var foodList = [];
var quanti = document.getElementById("foodQt").children[1].innerText;
var Fname, request, qt;
var orderID = 0;
var price = 0;

$(".mod").click(function(){
    $('.modal').modal('show');
});


function showModal(foodId) {
    food = document.getElementById(foodId);
    real = false;
    quanti = 0;
    index = -1;
    if (foodList.map(x => x[0]).includes(food.children[0].innerText)) {
        real = true;
        index = foodList.map(x => x[0]).indexOf(food.children[0].innerText);
        quanti = foodList[index][2]
    }
    document.getElementById("message-text").value = "";
    document.getElementById("modLabel").innerText = food.children[0].innerText;
    document.getElementById("foodDescript").innerText = food.children[2].children[0].children[0].innerText
    document.getElementById("message-text").value = real ? foodList[index][1] : "";
    document.getElementById("foodQt").children[1].innerText = real ? quanti : 0;
    document.getElementById("sub").disabled = quanti === 0 ? true : false;
    price = food.children[1].children[0].innerHTML.replace("฿", "");
    console.log(price);
}

function addition() {
    quanti++;
    document.getElementById("foodQt").children[1].innerText = quanti;
    document.getElementById("sub").disabled = false;
}

function substract() {
    quanti--;
    document.getElementById("foodQt").children[1].innerText = quanti;
    if (document.getElementById("foodQt").children[1].innerText == 0) {
        document.getElementById("sub").disabled = true;
    }
}

function closeMod() {
    $('.modal').modal('hide');
}

async function submit(){
    let tableNum = document.getElementById('sel-number').value;
    if(document.getElementById("foodQt").children[1].innerText != 0){
        orderID++;
        Fname = document.getElementById("modLabel").innerText;
        request = document.getElementById("message-text").value;
        qt = document.getElementById("foodQt").children[1].innerText;
        foodList.push(['order'+orderID, tableNum, Fname, request, qt, price, qt*price])
        addOrder(orderID, Fname, request, qt);
        document.getElementById('submit').disabled = false; 
    }
    for(let i = 0; i < foodList.length; i++){
        console.log(foodList[i]);
    }
    $('.modal').modal('hide');
}

function searchFood() {
    var input, filter, list, a;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    list = document.getElementsByClassName("row mod");
    console.log(list.length);
    for (let i = 0; i < list.length; i++) {
        a = list[i].children[0].children[0].innerHTML;
        if (a.toUpperCase().indexOf(filter) > -1) {
            list[i].style.display = "";
        } else {
            list[i].style.display = "none"
        }
    }
}

function addOrder(Id, name, request, qt){
    
    let orderBox = document.createElement("div");orderBox.className="orderList";
    let orderRow = document.createElement("div");orderRow.className="row";    
    let orderNameBox = document.createElement("div");orderNameBox.className="foodOr col-10 col-sm-10";
    let orderName = document.createElement("h2");orderName.innerHTML=name;
    let deleteButtonBox = document.createElement("div");deleteButtonBox.className="deleteOrder col-2 col-sm-2";
    let deleteButton = document.createElement("h2");deleteButton.setAttribute('id','order'+Id);deleteButton.setAttribute('role','button');deleteButton.setAttribute('onclick','deleteOrder(this.id)');deleteButton.innerHTML = '-';
    let requestRow = document.createElement("div");requestRow.className="row";
    let requestBox = document.createElement("div");requestBox.className="request col-10 col-sm-10";
    let requestMessage = document.createElement("h5");requestMessage.innerHTML=request;
    let qtBox = document.createElement("div");qtBox.className="qt col-2 col-sm-2";
    let qtTxt = document.createElement("h3");qtTxt.innerHTML=qt;qtTxt.className="qt";
    
    orderNameBox.appendChild(orderName);deleteButtonBox.appendChild(deleteButton);
    orderRow.appendChild(orderNameBox);orderRow.appendChild(deleteButtonBox);
    orderBox.appendChild(orderRow);
    requestBox.appendChild(requestMessage);qtBox.appendChild(qtTxt);
    requestRow.appendChild(requestBox);requestRow.appendChild(qtBox);
    orderBox.appendChild(requestRow);

    document.getElementById("orderRow").prepend(orderBox);
}
function checkSubmit(){
    if(foodList.length < 1){
        document.getElementById('submit').disabled = true;
    } else {
        document.getElementById('submit').disabled = false;
    }
}
function deleteOrder(orderID){
    console.log(orderID)
    if(confirm('Do you want to remove this order?') == true){
        document.getElementById(orderID).parentNode.parentNode.parentNode.remove();
        for (let i = 0; i < foodList.length; i++) {
            if(foodList[i][0] == orderID){
                foodList.splice(i,1)
            }
        } 
    }
    checkSubmit();
}

async function pushToDatabase(event) {
    event.preventDefault();
    var out2 = []
    foodList.forEach(element => {
        var temp = {
            name: element[2],
            quantity: element[4],
            note: element[3],
            price: element[5],
            total: element[6]
        }
        out2.push(temp)
    });
    var out = {
        order: -1,
        table: parseInt(document.getElementById('sel-number').options[document.getElementById('sel-number').selectedIndex].value),
        status: "Queue",
        foodList: out2
    }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/submit");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            var response = JSON.parse(xhr.response);
            if (response["status"] === "success") {
                foodlist = [];
                document.getElementById("orderRow").innerHTML = '';
                window.location.replace("/");
            } else {
                alert("epic fail")
            }
        };
        xhr.send(JSON.stringify({ out }));
    } catch (err) {
        alert(err)
    }
}
async function changeStatus(order, status) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `/changeStatus`);
        out = { "order": order, "status": status }
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            var response = JSON.parse(xhr.response);
            if (response["status"] === "success") {
                console.log("ok");
            } else {
                alert("epic fail")
            }
        };
        xhr.send(JSON.stringify({ out }));
    } catch (err) {
        alert(err)
    }
}

async function cancel(order) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `/cancel`);
        out = { "order": order }
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            var response = JSON.parse(xhr.response);
            if (response["status"] === "success") {
                window.location.replace("/");
            } else {
                alert("epic fail")
            }
        };
        xhr.send(JSON.stringify({ out }));
    } catch (err) {
        alert(err)
    }
}
document.getElementById('submission-form').addEventListener('submit', pushToDatabase);

