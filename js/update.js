
// date restriction
(function () {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;

    $('.datepicker').attr('min', today);
})();



// convert array to object
const objectifyForm = function (formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}


function getID(){

    let url = window.location.href;
    url = new URL(url);
    let id = url.searchParams.get("id")
    return id
}

// intialize form Data
(function () {

    let id=getID();

    fetch('http://localhost:3000/tasks/' + id)
        .then(response => response.json())
        .then(data => {

            $('#title').val(data.title)
            $('#desc').val(data.desc)
            $('#date').val(data.date)
            $('#category').val(data.category)
            $('#status').val(data.status)
            $()

        });



})();


$(function () {


    console.log('ready')

    /* update to-do */
    $('#to-do-update').on('submit', (event) => {


        event.preventDefault()

        let form = document.getElementById("to-do-update");
        if (!form.checkValidity()) {
            // console.log('error')
            event.stopPropagation()
            return false
        }

        let id =getID()
     
        let UpdatedTask = $('#to-do-update').serializeArray()
        UpdatedTask = objectifyForm(UpdatedTask)

        // console.log(task)

        fetch('http://localhost:3000/tasks/' +id, {
            method: "PATCH",
            body: JSON.stringify(UpdatedTask),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));

        window.location.href = 'index.html';

    
    })








})