
/**
 * This file adds client-side functionality to the contact app
 */


// loading the list of contacts as soon as the page loads
window.onload = getContacts

// keeping track of the currently selected contact to modify it quickly
// instead of having to search for it every time we need to unselect it
selected_contact = null

// delete_emails is a variable that temporarily holds the emails to
// be deleted. If the user cancels their updates, the objects in 
// this variable will be restored to the DOM
deleted_emails = []

// DOM elements that will be frequently changed. I am making them global
// to avoid looking them up in the DOM multiple times
contact_form = document.getElementById('contact-form')
home = document.getElementById('Home')
form_group_3 = document.getElementById('form-group-3')
details = document.getElementById('details')
buttons = document.getElementById('buttons')
info_section = document.getElementById('info-section')
contactsList = document.getElementById('contact-list')
first_name_box = document.getElementById('first-name')
last_name_box = document.getElementById('last-name')
emails_list_object = document.getElementById('emails') 
email_box = document.getElementById('email')
first_name_form = document.getElementById('form-fn')
last_nam_form = document.getElementById('form-ln')
email_form = document.getElementById('form-email')
pattern = /^\S+@\S+\.\S+$/
regex = new RegExp(pattern); // Create a regex object

/*This function gets all contacts in the database and displays them on front-end */
async function getContacts()
{
    let response = await fetch('/contacts');
    let contacts = await response.json();
    contactsList.innerHTML = ''

    // updating the DOM
    for (let contact of contacts)
    {
        container = document.createElement('div')
        contactElement = document.createElement('div')
        contactElement.classList.add('contact-item')
        contactElement.classList.add('fade-in')
        contactElement.innerText = contact.first_name + " " + contact.last_name
        // embedding the contact id for future use
        contactElement.setAttribute("data-info", contact.id);
        contactElement.onclick = (e) => showContactInfo(e)
        contactsList.append(contactElement)
    }
}


/*This function shows the details of the contact selected
 * and highlights the selected contact */
async function showContactInfo(myEvent) {
    // removing the old selected contact if it exists
    if (selected_contact != null)
        selected_contact.classList.remove('selected')

    // highlight the current selected contact
    selected_contact = myEvent.srcElement
    selected_contact.classList.add('selected')


    // retrieving the name and id from the selected element 
    let name = myEvent.srcElement.innerText.split(' ')
    let request_data = myEvent.srcElement.getAttribute('data-info')
    let id = request_data
    // fetching emails 
    let response = await fetch(`/emails/${id}`)

    // checking the status code of the response since the selected user can
    // have no emails in which case emails will stay null
    let emails = null;
    if (response.status == 200)
        emails = await response.json()
    addContent(emails,name)
    addStyle()    
}

/* This function is a helper function that adds the content
*  of the contact info section */
function addContent(emails,name)
{
    // adding the user name to the DOM in the input fields
    first_name_box.value = name[0] 
    last_name_box.value = name[1];
    emails_list_object.innerHTML = ''
    emails_list_object.innerText = 'Email:'

    // returning if the user has no emails
    if (emails==null)
        return
    // adding the emails to the DOM 
    for (let my_email of emails)
    {
        email_object = document.createElement('div')
        email_object.setAttribute('data-info',my_email.id)
        email_object.classList.add('email')
        email_object.innerText = my_email.email

        delete_email = document.createElement('i')
        delete_email.classList.add('fa-solid')
        delete_email.classList.add('fa-circle-minus')
        delete_email.classList.add('fa-xl')
        delete_email.classList.add('delete-email')
        delete_email.onclick = (e) => deleteSelectedEmail(e)

        email_container = document.createElement('div')
        email_container.classList.add('email-container')
        email_container.append(email_object)
        email_container.append(delete_email)
        emails_list_object.append(email_container)     
    }
}


/* This function is a helper function that adds style to the
/* contact info section */
async function addStyle()
{

    contact_form.style.display = 'none';
    home.style.display = 'none'; 
    form_group_3.style.display = 'none'; 

    // displaying the info sections and animating them
    details.style.display = 'block'
    buttons.style.display = 'block'
    
    details.classList.add('fade-in')
    buttons.classList.add('fade-in')

    setTimeout(() => {
        details.classList.remove('fade-in')
        buttons.classList.remove('fade-in')
    }, 300);

    
}


/*This function shows the new contact form and hides the info section */
function showForm() {
    first_name_form.value = ""
    last_nam_form.value = ""
    email_form.value = ""
    contact_form.style.display = 'block';
    contact_form.classList.add('fade-in')

    setTimeout(() => {
        contact_form.classList.remove('fade-in')
    }, 300);

    home.style.display = 'none'; 
    details.style.display = 'none'; 
    buttons.style.display = 'none'; 
    // unselecting the selected contact
    if (selected_contact!=null)
        selected_contact.classList.remove('selected')
}



async function deleteSelectedContact() {

    let userResponse = window.confirm('This action is irreversible. Click ok to delete contact')
    if (!userResponse)
        return
    let id = selected_contact.getAttribute('data-info')
    response = await fetch(`/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    document.getElementById('details').style.display = 'none';
    document.getElementById('Home').style.display = 'block';  

    selected_contact.classList.add("fade-out"); // Apply fade-out class
    setTimeout(() => 
        {
            selected_contact.remove();
        }, 300);

}

/*This function resets the contact info area when the user click cancel */
function reset()
{
    // updating input fields
    first_name_box.value = selected_contact.innerText.split(' ')[0]
    last_name_box.value = selected_contact.innerText.split(' ')[1]
    // restoring the deleted emails
    for (let email_object of deleted_emails)
    {
        email_object.style.display = 'flex'
        email_object.classList.remove('fade-out')
        email_object.classList.add('fade-in')
        emails_list_object.append(email_object)
    }
}

/*This function is a switch that shows/hides the email input field 
* if the user wants to add an email or changed their mind about adding an 
* email and wants to remove the new email field  */
function ToggleInputField()
{
    newEmailElement = document.getElementById('form-group-3')
    newSetting = newEmailElement.style.display == 'none' ? 'block':'none';
    newEmailElement.style.display = newSetting; 
    newEmailElement.classList.add('fade-in')
    setTimeout(() => {
        newEmailElement.classList.remove('fade-in')
    }, 300);
}

/*This function updates the contact  */
async function updateContact()
{
    first_name = first_name_box.value 
    last_name = last_name_box.value 
    // if the first/last name of the selected contact is not the same as the first/last name
    // we get from the input field, it means a change in first/last name has happened
    first_name_change =  selected_contact.innerText.split(' ')[0] != first_name
    last_name_change =  selected_contact.innerText.split(' ')[1] != last_name
    email = email_box.value
    emailChange = form_group_3.style.display == 'block' 
    // alerting the user if the input is not valid
    if ((email.trim() === "" && emailChange) || first_name.trim() === "" || last_name.trim() === "")
    {
        window.alert('Make sure your input fields are not empty')
        return
    }
    // adding an email when necessary
    if (emailChange)
    {
        let return_value = addEmail(email)
        if (!return_value)
            return;
    }

    // changing the name when necessary
    if (first_name_change || last_name_change)
    {
        change_name(first_name,last_name)
    }

    deleteOldEmails()
}

/*This function adds a new email to the currently selected contact */
async function addEmail(email)
{
    // validating the email 
    if (!regex.test(email))
        {
            window.alert('The email you entered is not valid')
            return;
        }
    id = selected_contact.getAttribute('data-info')

    response = await fetch('/add_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({"email":  `${email}`,'contact_id': `${id}`})
    })

    data = await response.json()

    // error handling
    if (response.status == 402)
    {
        window.alert(response.message);
        return 0;
    }

    // creating an object for the new email
    email_object = document.createElement('div')
    email_object.setAttribute('data-info',data.id)
    email_object.classList.add('email')
    email_object.innerText = email

    delete_email = document.createElement('i')
    delete_email.classList.add('fa-solid')
    delete_email.classList.add('fa-circle-minus')
    delete_email.classList.add('fa-xl')
    delete_email.classList.add('delete-email')
    delete_email.onclick = (e) => deleteSelectedEmail(e)

    email_container = document.createElement('div')
    email_container.classList.add('fade-in')
    email_container.classList.add('email-container')
    email_container.append(email_object)
    email_container.append(delete_email)
    emails_list_object.append(email_container)      
    setTimeout(()=>{
        email_container.classList.remove('fade-in')
    },300)
    return 1;
}

/*This function confirms the deleting of emails from the database*/
async function deleteOldEmails()
{
    // sending the delete requests to the server one by one
    for (let email of deleted_emails)
    {
        let id = email.children[0].getAttribute('data-info')
        response = await fetch(`/delete_email/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }        
        })
    }
    deleted_emails = []
}

/* This function takes the new first and last name and updates the record
*   in the library */
async function change_name(first_name,last_name) {
    id = selected_contact.getAttribute('data-info')
    // making a request to update the contact
    response = await fetch(`/update_contact/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },        
        body:JSON.stringify({"first_name":  `${first_name}`,"last_name": `${last_name}`})}
    )
}

/* This function is called when the minus button next to an email
* is clicked to delete the corresponding email*/
function deleteSelectedEmail(e)
{
    deleted_emails.push(e.srcElement.parentNode)
    e.srcElement.parentNode.classList.add("fade-out"); // Apply fade-out class

    setTimeout(() => 
        {
            e.srcElement.parentNode.style.display = 'none'
        }, 300);
    // since the user can always cancel their changes, we do not make a delete
    // request to the server. Instead we store the deleted email in a temporary
    // list. Once the user clicks save to confirm their changes, we loop through
    // the deleted_emails list and make delete requests to the server.
}


/* This function is used to add a contact to the database */
async function addContact()
{
    email = document.getElementById('form-email').value
    first_name = document.getElementById('form-fn').value 
    last_name = document.getElementById('form-ln').value 
    // input check
    if ((email.trim() === "") || first_name.trim() === "" || last_name.trim() === "")
    {
        window.alert('Make sure your input fields are not empty')
        return
    }
    
    if (!regex.test(email))
    {
        window.alert('The email you entered is not valid')
        return;
    }
    // adding the contact to the db
    response = await fetch('/add_contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({"first_name":  `${first_name}`, "last_name":`${last_name}`, "email":`${email}`})
    })

    data = await response.json()
    // adding the new contact to the DOM
    if(response.status == 200)
    {
        window.alert(data.message)
        let contactsList = document.getElementById('contact-list')
        container = document.createElement('div')
        contactElement = document.createElement('div')
        contactElement.classList.add('contact-item')
        contactElement.classList.add('fade-in')
        contactElement.innerText = first_name + " " + last_name
        contactElement.setAttribute("data-info", data.id);
        contactElement.onclick = (e) => showContactInfo(e)
        contactsList.append(contactElement)
        first_name_form.value = ''
        last_nam_form.value = ''
        email_form.value = ''
    }
    else
    {    
        window.alert(data.error)  
    }
}