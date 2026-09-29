 const cl = console.log;

const stdform = document.getElementById('stdform')
const stdNamecontrol = document.getElementById('stdName')
const stdLnamecontrol = document.getElementById('stdLname')
const stdSalarycontrol = document.getElementById('stdsalary')
const stdemailcontrol = document.getElementById('stdemail')
const stdcontactcontrol = document.getElementById('stdcontact')
const addbtn = document.getElementById('addbtn')
const updatebtn = document.getElementById('updatebtn')
const tableInfo = document.getElementById('tableInfo')

const BASE_URL = `https://crud-dfd04-default-rtdb.firebaseio.com/`
const STUDENT_URL = `${BASE_URL}student.json`

let studentArr = [];

function snackBar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}
//read

function oncreate(){
    let xhr = new XMLHttpRequest()
    xhr.open("GET",STUDENT_URL)
    xhr.send(null)
    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            for(const key in res){
                cl(key)
                res[key].id = key
                cl(res)
                studentArr.push(res[key])
            }
            templeting(studentArr)
        }else{
            cl("Error..!")
        }
    }
}
oncreate(studentArr)

function templeting(arr){
    let result = ``;
    arr.forEach((ele,i)=>{
        result += `
                           <tr id="${ele.id}">
                            <td>${i+1}</td>
                            <td>${ele.fname}</td>
                            <td>${ele.lname}</td>
                            <td>${ele.email}</td>
                            <td>${ele.contact}</td>
                            <td>${ele.salary}</td>
                            <td><button onclick="onedit(this)" class="btn btn-sm btn-dark">Edit</button></td>
                            <td><button onclick="onremove(this)" class="btn btn-sm btn-danger">Delete</button></td>
                        </tr>  `
    })
    tableInfo.innerHTML = result;
}


//Create.....

function onAddstd(eve){
    eve.preventDefault()
    let newObj = {
        fname:stdNamecontrol.value,
        lname:stdLnamecontrol.value,
        email:stdemailcontrol.value,
        contact:stdcontactcontrol.value,
        salary:stdSalarycontrol.value,
    }
    let xhr = new XMLHttpRequest()
    xhr.open("POST",STUDENT_URL)
    xhr.send(JSON.stringify(newObj))
    xhr.onload = function(){
        if(xhr.status === 200){
        studentArr.unshift(newObj)
        let res = JSON.parse(xhr.response)
        newObj.id = res.name;
        let tr = document.createElement('tr');
        tr.id = res.name;
        tr.innerHTML = `
                    <td>${1}</td>
                    <td>${newObj.fname}</td>
                    <td>${newObj.lname}</td>
                    <td>${newObj.emali}</td>
                    <td>${newObj.contact}</td>
                    <td>${newObj.salary}</td>
                    <td><button onclick="onedit(this)" class="btn btn-sm btn-dark">Edit</button></td>
                    <td><button onclick="onremove(this)" class="btn btn-sm btn-danger">Delete</button></td>  
                    `
                    tableInfo.prepend(tr)

                    let tds = [...document.querySelectorAll('#tableInfo tr td:first-child')]
                    tds.forEach((ele,i)=>{
                        ele.innerHTML = i + 1
                    })
                    stdform.reset()

                    snackBar('New Student Added Successfully !!','success')
                }else{
                    cl('Error..!')
                }

    }
}

//Edit....

function onedit(ele){
    let editId = ele.closest('tr').id;
    localStorage.setItem('updateId',editId)
    let editUrl = `${BASE_URL}student/${editId}.json`

    let xhr = new XMLHttpRequest()
    xhr.open("GET",editUrl)
    xhr.send(null)
    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            cl(res)
            stdNamecontrol.value = res.fname;
            stdLnamecontrol.value = res.lname;
            stdemailcontrol.value = res.email;
            stdcontactcontrol.value = res.contact;
            stdSalarycontrol.value = res.salary;

            addbtn.classList.add('d-none')
            updatebtn.classList.remove('d-none')

        }else{
            cl('Error...!')
        }
    }
}

//Update...

function onupdate(eve){
    let updateId = localStorage.getItem('updateId')
    let updateUrl = `${BASE_URL}student/${updateId}.json`
    let updatedObj = {
        fname:stdNamecontrol.value,
        lname:stdLnamecontrol.value,
        email:stdemailcontrol.value,
        contact:stdcontactcontrol.value,
        salary:stdSalarycontrol.value
    }  
    cl(updatedObj)
    let xhr = new XMLHttpRequest()
    xhr.open("PATCH",updateUrl)
    xhr.send(JSON.stringify(updatedObj))
    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            cl(res)

           let tr = document.getElementById(updateId)
           tr.innerHTML = 
                    `<td>${1}</td>
                    <td>${updatedObj.fname}</td>
                    <td>${updatedObj.lname}</td>
                    <td>${updatedObj.email}</td>
                    <td>${updatedObj.contact}</td>
                    <td>${updatedObj.salary}</td>
                    <td><button onclick="onedit(this)" class="btn btn-sm btn-dark">Edit</button></td>
                    <td><button onclick="onremove(this)" class="btn btn-sm btn-danger">Delete</button></td>  
                    `

            snackBar('Student Data Updated Successfully !!')
            stdform.reset()
            addbtn.classList.remove('d-none')
            updatebtn.classList.add('d-none')
        }else{
            cl('Error...!')
        }
    }
}

//Delete.....

function onremove(ele){
    let removeId = ele.closest('tr').id;
    
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    let removeUrl = `${BASE_URL}student/${removeId}.json`
    let xhr = new XMLHttpRequest()
    xhr.open("DELETE",removeUrl)
    xhr.send(null)
    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            ele.closest('tr').remove()

            let td = document.querySelectorAll('#tableInfo tr')
            td.forEach((ele,i)=>{
                ele.querySelector('td').innerHTML = i +1
            })
            snackBar('The Data is Deleted Successfully !!!')
        }else{
            cl('Error...!!')
        }
    }
  }
});
}

stdform.addEventListener("submit",onAddstd)
updatebtn.addEventListener("click",onupdate)