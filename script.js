const page1 = document.querySelector(".page1");
const page2 = document.querySelector(".page2");
const page3 = document.querySelector(".page3");
const buttonRight = document.querySelector(".btn2");
const buttonLeft = document.querySelector(".btn1");
const add = document.querySelector(".add");
const form1 = document.querySelector(".form1");
const form2 = document.querySelector(".form2");
const push = document.querySelector(".submitbtn");

let name;
let email;
let phone;
let NID;
let startDate;
let endDate;
let birthDate;
let degree = [];
let degreeStart = [];
let degreeEnd = [];

let count = 1;

buttonRight.addEventListener('click', function (e) {
    if (!page1.classList.contains("opaque")) {
        page1.classList.add("opaque");
        page2.classList.remove("opaque");
    } else if (!page2.classList.contains("opaque")) {
        page2.classList.add("opaque");
        page3.classList.remove("opaque");
    }

})

buttonLeft.addEventListener("click", function (e) {
    if (!page2.classList.contains("opaque")) {
        page2.classList.add("opaque");
        page1.classList.remove("opaque");
    } else if (!page3.classList.contains("opaque")) {
        page3.classList.add("opaque");
        page2.classList.remove("opaque");
    }
})

form1.addEventListener("submit", function (e) {
    e.preventDefault();
    name = document.getElementById("name").value;
    email = document.getElementById("email").value;
    phone = checkCountryCode(document.getElementById("phone"));
    NID = document.getElementById("NID").value;
    startDate = document.getElementById("startDate").value;
    endDate = document.getElementById("endDate").value;
    birthDate = document.getElementById("birthDate").value;
    page1.classList.add("opaque");
    page2.classList.remove("opaque");
})

form2.addEventListener("submit", function (e) {
    e.preventDefault();
    let counter = 1;
    while (document.getElementById(`degree${counter}`)) {
        degree.push(document.getElementById(`degree${counter}`).value);
        const start = new Date(document.getElementById(`degreeStart${counter}`).value)
        const end = new Date(document.getElementById(`degreeEnd${counter}`).value)
        degreeStart.push(start.getFullYear());
        degreeEnd.push(end.getFullYear());
        counter += 1;
    }
    activateSummary();
    page2.classList.add("opaque");
    page3.classList.remove("opaque");
})

add.addEventListener("click", function (e) {
    count++;
    if (count < 6) {
        let element = `<select name="degree" id="degree${count}" class="degree">
            <option value="bsc">BSC</option>
            <option value="msc">MSC</option>
            <option value="phd">Phd</option>
        </select>
        <input type="date" id="degreeStart${count}" class="degreeStart">
        <input type="date" id="degreeEnd${count}" onchange=checkYearValidity(this) class="degreeEnd"><br>`
        form2.innerHTML = `${form2.innerHTML}` + element;
    }
})

function activateSummary() {
    const databox = document.querySelector(".summarybox");
    databox.innerHTML = `<p class="data">NAME:&nbsp;${name}</p><br>
        <p class="data">EMAIL:&nbsp; ${email}</p><br>
        <p class="data">PHONE:&nbsp; ${phone}</p><br>
        <p class="data">NID:&nbsp; ${NID}</p><br>
        <p class="data">START:&nbsp; ${startDate}</p><br>
        <p class="data">END:&nbsp; ${endDate}</p><br>
        <p class="data">BIRTH DATE:&nbsp; ${birthDate}</p><br>
        <p class="data">DEGREES:&nbsp; ${degree.join(", ")}</p><br>
        <p class="data">DEGREE START YEARS:&nbsp; ${degreeStart.join(", ")}</p><br>
        <p class="data">DEGREE END YEARS: &nbsp; ${degreeEnd.join(", ")}</p>`
}

// text/plain, */*'
push.addEventListener("click", async function (e) {
    const data = {
        name,
        email,
        phone,
        nid: NID,
        startDate,
        endDate,
        birthDate,
        degree: [],
        degreeStartYear: [],
        degreeEndYear: []
    };
    let counter = 1;
    while (document.getElementById(`degree${counter}`)) {
        data.degree.push(document.getElementById(`degree${counter}`).value);
        data.degreeStartYear.push(document.getElementById(`degreeStart${counter}`).value);
        data.degreeEndYear.push(document.getElementById(`degreeEnd${counter}`).value);
        counter++;
    }

    await fetch("https://63a99939594f75dc1dba7100.mockapi.io/api/v1/employee/Info", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
})

// PHONE NUMBER VALIDATION
function checkCountryCode(element) {
    let str = element.value;
    if (!str.startsWith("+")) {
        str = "+99" + str;
        return str;
    }
    return str;
}

// DEGREE DATE VALIDATOR
function checkYearValidity(element){
    const start = `degreeStart${element.id[element.id.length-1]}`
    const startyear = document.getElementById(start).value;
    const endyear = element.value;
    if(endyear<startyear){
        element.setCustomValidity("Invalid date");
    }else{
        element.setCustomValidity("");
    }
}

// START DATE VALIDATION
function checkStartDateValidity(element) {
    const start = new Date(element.value);
    const today = new Date();

    if (start.getTime() == today.getTime() || start.getTime() > today.getTime()) {
        element.setCustomValidity(" start date must be in the past ")
    } else {
        element.setCustomValidity("");
    }
}

// END DATE VALIDATION
function checkEndDateValidity(element) {
    const start = new Date(document.getElementById("startDate").value);
    const end = new Date(element.value);
    if (end.getTime() < start.getTime() || end.getTime() === start.getTime()) {
        element.setCustomValidity("Invalid end date");
    } else {
        element.setCustomValidity("");
    }
}

// NID VALIDATION
function checkNIDValidity(element) {
    const nid = element.value;
    const exp1 = new RegExp("[1]+[0-9]{3}-[5]+[0-9]{2}-[6]+[0-9]{1}");
    const exp2 = new RegExp("[0-9]{2}1[0-9]{2}-5[0-9]{3}-[0-9]{2}");
    if (exp1.test(nid) || exp2.test(nid)) {
        element.setCustomValidity("");
    } else {
        element.setCustomValidity("Invalid NID")
    }
}

// BIRTHDATE VALIDATION
function checkBirthDateValidity(element) {
    const dob = new Date(element.value);
    let difference = Date.now() - dob.getTime();
    let ageDate = new Date(difference);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 18) {
        element.setCustomValidity("You're too young to be an employee");
    } else if (age > 97) {
        element.setCustomValidity("Speaking from the grave?");
    } else {
        element.setCustomValidity("");
    }
}



