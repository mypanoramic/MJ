
async function loadData() {
    let threadId = getCookie('threadId')
    if (threadId !== '') {
        const apiUrl = window.location.href + 't/' + threadId;

        // Make a GET request

        const requestOptions = {
            method: 'GET'
        };

        const response = await fetch(apiUrl, requestOptions)
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        const messages = await JSON.parse(data)
        console.log(messages)
        let html = ''
        await messages.forEach(element => {
            let id = element.id
            let data = element.message;
            let htmlcontentsection
            if (id == null || id == 'null') {
                htmlcontentsection = ` 
<div class="usera" style="margin-right: 0px;">
                                                                        <span
                                                                            style="margin-right: 0px; display: inline-block;">
                                                                            <div class="right">
                                                                                ${data}
                                                                            </div>
                                                                        </span>
                                                                        <div class="image" style="right: 0px;"><img
                                                                                src="/u.png" class=""
                                                                                alt="user img">
                                                                        </div>

                                                                    </div>
                                                                    <p></p>`
            } else {
                htmlcontentsection = `  <div class="profa" style="top: 0;">
                                                                    <div class="image">
                                                                        <img src='/AssistantImages/asst_wvK11bBdO0etUNa9prAa5Zff.jpeg'
                                                                            class="" alt="img">
                                                                    </div>

                                                                    <span style=" display: inline-block;">

                                                                        <div class="left">
                                                                            <p> ${data}</p>
                                                                        </div>

                                                                        </strong>
                                                                    </span>
                                                                </div>
                                                                <hr>`
            }
            html = html + htmlcontentsection
        });

        document.getElementById('messages').innerHTML = await html

    }




}



async function submitForm() {
    if (document.getElementById('testvalue').value.length > 0) {
        document.getElementById("btnsubmit").hidden = true;


        document.getElementById("inputContent").innerHTML = document.getElementById('testvalue').value;
        document.getElementById("SubmitMessage").hidden = false;
        document.getElementById("inputContent").scrollIntoView();
        let threadId = getCookie('threadId')

        const apiUrl = window.location.href + 't/' + threadId;

        // Make a GET request

        const responseMessage = document.getElementById('testvalue');
        let value = document.getElementById('testvalue').value

        let formData = { testvalue: value }
        let params = new URLSearchParams(formData).toString()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: params,
        };

        const response = await fetch(apiUrl, requestOptions)
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        const messages = await JSON.parse(data)
        console.log(messages)
        let html = ''
        await messages.forEach(element => {
            let id = element.id
            let data = element.message;
            let htmlcontentsection
            if (id == null || id == 'null') {
                htmlcontentsection = ` 
<div class="usera" style="margin-right: 0px;">
                                                                        <span
                                                                            style="margin-right: 0px; display: inline-block;">
                                                                            <div class="right">
                                                                                ${data}
                                                                            </div>
                                                                        </span>
                                                                        <div class="image" style="right: 0px;"><img
                                                                                src="/u.png" class=""
                                                                                alt="user img">
                                                                        </div>

                                                                    </div>
                                                                    <p></p>`
            } else {
                htmlcontentsection = `  <div class="profa" style="top: 0;">
                                                                    <div class="image">
                                                                        <img src='/AssistantImages/asst_wvK11bBdO0etUNa9prAa5Zff.jpeg'
                                                                            class="" alt="img">
                                                                    </div>

                                                                    <span style=" display: inline-block;">

                                                                        <div class="left">
                                                                            <p> ${data}</p>
                                                                        </div>

                                                                        </strong>
                                                                    </span>
                                                                </div>
                                                                <hr>`
            }
            html = html + htmlcontentsection
        });


        document.getElementById('messages').innerHTML = await html

    }



    document.getElementById("btnsubmit").hidden = false;


    document.getElementById("SubmitMessage").hidden = true;

    document.getElementById("chat-bubble").style.display = 'block';
    eraseText()
}

function eraseText() {
    const textarea = document.getElementById('testvalue');

    // ✅ Clear the textarea value
    textarea.value = '';
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}




async function btnclick(value) {
    document.getElementById("btnsubmit").hidden = true;

    document.getElementById('testvalue').value = value
    document.getElementById('btnsubmit').click()

}