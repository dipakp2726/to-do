

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})();




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


const printROWS = function (data) {

    $('#to-do-table tbody').html('')
    // console.log(data)
    data.forEach(task => {

        let checked = task.status == 'Done' ? 'checked' : null

        let highlight = checked == null ? null : 'table-secondary'

        let row = `<tr class="text-center ${highlight} " data-id="${task.id}">
                        <td><input class="form-check-input is-task-done" ${checked} type="checkbox" ></td>
                        <td>${task.title}</td>
                        <td>${task.desc}</td>
                        <td>${task.category} </td>
                        <td>${task.date}</td>
                        <td class="status">${task.status}</td>
                        <td>
                            <button class="btn btn-primary edit-task"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger delete-task"><i class="fa fa-trash"></i></button>
                        </td>
                       
                    </tr>`;


        $('#to-do-table tbody').append(row)


    })



}



const groupBY=function(data){


    let groups = {};
    for (var i = 0; i < data.length; i++) {
        var groupName = data[i].category;
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(data[i]);
    }

    // console.log(groups)

    $('#to-do-table tbody').html('')
    for (let key in groups) {

        let row =` <tr class="text-center bg-secondary bg-gradient">
                               
                          <td colspan="4">Category: ${key}</td>
                               
                         <td colspan="3">Number of To-do : ${groups[key].length}</td>

                            </tr>`

        $('#to-do-table tbody').append(row)

        // console.log(groups[key])

        for (let task of groups[key]) {

            let checked = task.status == 'Done' ? 'checked' : null

            let highlight = checked == null ? null : 'table-secondary'

            let row = `<tr class="text-center ${highlight} " data-id="${task.id}">
                        <td><input class="form-check-input is-task-done" ${checked} type="checkbox" ></td>
                        <td>${task.title}</td>
                        <td>${task.desc}</td>
                        <td>${task.category} </td>
                        <td>${task.date}</td>
                        <td class="status">${task.status}</td>
                        <td>
                            <button class="btn btn-primary edit-task"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger delete-task"><i class="fa fa-trash"></i></button>
                        </td>
                       
                    </tr>`;


            $('#to-do-table tbody').append(row)
           
        }
    }


}

// load initail data
const init = function () {

    function custom_sort(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    fetch('http://localhost:3000/tasks/')
        .then(response => response.json())
        .then(data => {

            data.sort(custom_sort)
            printROWS(data)

        });

};

init()




// convert array to object
const objectifyForm = function (formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}


$(document).ready(function () {

    console.log('ready')

    // $('#to-do-table').DataTable()

    /* insert to-do */
    $('#to-do-insert').on('submit', (event) => {


        event.preventDefault()

        let form = document.getElementById("to-do-insert");
        if (!form.checkValidity()) {
            // console.log('error')
            event.stopPropagation()
            return false
        }

        let task = $('#to-do-insert').serializeArray()
        task = objectifyForm(task)
        task.id = 'id' + (new Date()).getTime();

        // console.log(task)


        $.post('http://localhost:3000/tasks', task)
            .done(function (data) {
                // alert("Data Loaded: " + data);
                console.log('inserted successfully')
            });


       

        document.getElementById("to-do-insert").reset();
        $('#to-do-insert').removeClass('was-validated')

        $('#to-do-response').html(`<div class="alert alert-success" role="alert">
                   Task Inserted Successfully
                    </div>`)

        setTimeout(() => {
            $('#to-do-response').html('')
        }, 2000);

        init()

        // $(form).data('formValidation').resetForm();
    })




    // delete item
    $('#to-do-table').on('click', '.delete-task', function (event) {

        event.preventDefault();
        // console.log('clicked')

        let row = $(this).parent().parent()
        let id = row.attr('data-id');

        fetch('http://localhost:3000/tasks/' + id, {
            method: "DELETE",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then(response => response.json())
            .then(json => console.log('deleted'))
            .catch(err => console.log(err));

        row.html(`<td colspan="7" class=".d-sm-none .d-md-block">
                        <div class="alert alert-danger" role="alert">
                   Task Deleted Successfully
                    </div>
                    <td/>`)

        setTimeout(() => {
            row.remove()
        }, 2000);


    })


    //toggle task status
    $('#to-do-table').on('change', '.is-task-done', function (e) {

        e.preventDefault();
        // console.log('clicked')

        let row = $(this).parent().parent()
        let id = row.attr('data-id');

        let status = $(this).is(':checked') ? 'Done' : 'Pending'

        fetch('http://localhost:3000/tasks/' + id, {
            method: "PATCH",
            body: JSON.stringify({ status: status }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then(response => response.json())
            .then(json => console.log())
            .catch(err => console.log(err));




        if ($(this).is(':checked')) {
            row.addClass('table-secondary')
            row.find('td:eq(5)').html(status)

        } else {
            row.removeClass('table-secondary')
            row.find('td:eq(5)').html(status)
        }


        // refreshing data
        // init()


        return false;




    })

    // edit task
    $('#to-do-table').on('click', '.edit-task', function (event) {

        console.log('clicked')

        let id = $(this).parent().parent().attr('data-id')

        let url = "update.html?id=" + id;

        window.location.href = url



    })



    /* sort items by date */
    $('#sort-by-date').on('change', function (event) {

        event.preventDefault()

        $('#filter-by-category').val('')

        let type = $(this).val()

        fetch('http://localhost:3000/tasks?_sort=date&_order=' + type)
            .then(response => response.json())
            .then(data => {

                printROWS(data)
            });

    })


    // filter item by category
    $('#filter-by-category').on('change', function (event) {

        event.preventDefault()

        let type = $(this).val()

        if (!type) {
            init()
            return false
        }

        fetch('http://localhost:3000/tasks?category=' + type)
            .then(response => response.json())
            .then(data => {
                printROWS(data)
            });

    })


    $('#group-by-check').on('change', function (event) {


        event.preventDefault()
        let status = $(this).is(':checked') 

        


        fetch('http://localhost:3000/tasks/')
            .then(response => response.json())
            .then(data => {

                
                if(status){
                    groupBY (data)

                }else{

                    printROWS(data)
                }

            });



    })







})
