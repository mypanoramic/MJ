const RemoveSources = require('./RemoveSources')
const markdown = require('markdown').markdown;
const express = require('express');
const dotenv = require('dotenv')
//const email = require('./email')
//const aiEmail = require('./email1') // Added for AIContactRequest
const path = require('path');
var cookieParser = require('cookie-parser');
const OpenAI = require('openai');

const branchEmailMap = {

    'eastern cape': 'brendon@mypanoramic.com',
    'kwazulu natal': 'nikita@mypanoramic.com',
    'gauteng': 'ninette@mypanoramic.com',
    'pretoria': 'chanel@mypanoramic.com'
};

dotenv.config()

const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())

const assistantId = 'asst_wvK11bBdO0etUNa9prAa5Zff'
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.API_KEY
})

let branchname = 'Boksburg'

async function GetAssistantName(id) {
    var Assistant = await openai.beta.assistants.retrieve(id);
    return Assistant.name;
}

app.get('/', async (req, res) => {
    let threadId;
    let testarr = []
    let ArrId = []
    if (req.cookies.threadId) {
        threadId = req.cookies.threadId
        try {
            await openai.beta.threads.messages.list(threadId);
        } catch (e) {
            console.log(e)
            var thread = await openai.beta.threads.create();
            threadId = thread.id;
            res.cookie('threadId', threadId);
        }
    } else {
        var thread = await openai.beta.threads.create();
        threadId = thread.id;
        res.cookie('threadId', threadId);
    }
    var AssistantName = await GetAssistantName(assistantId)
    let assistantimg = '/AssistantImages/' + assistantId + '.jpeg'
    res.render('index', { testarr, assistantimg, AssistantName, ArrId, formLink: '/', branchname, clearURL: '/clear' })
});

app.get('/t/:id', async (req, res) => {
    const threadId = req.params.id;
    try {
        let o = { messageData: [] };
        var messages = await openai.beta.threads.messages.list(threadId);
        for (const message of messages.data.reverse()) {
            var data = {
                id: `${message.assistant_id}`,
                message: `${RemoveSources(markdown.toHTML(message.content[0].text.value))}`
            };
            o.messageData.push(data);
        }
        res.json(JSON.stringify(o.messageData));
    } catch (e) {
        console.log(e);
    }
});

app.post('/t/:id', async (req, res) => {
    console.log('post t');
    const threadId = req.params.id;
    const formLink = '/t/' + threadId;
    const submittext1 = req.body.testvalue;
    console.log(submittext1);
    console.log(threadId);
    try {
        let ArrId = []
        let testarr = []
        var message = await openai.beta.threads.messages.create(
            threadId,
            {
                role: "user",
                content: submittext1
            }
        );
        console.log(assistantId);

        var run1 = await openai.beta.threads.runs.createAndPoll(
            threadId,
            {
                assistant_id: assistantId,
            }
        );

        const threadID = threadId;
        console.log(run1.status + '{}{}{}{}{}{}');
        while (run1.status !== "completed" && run1.status !== '200') {
            console.log(threadID);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            run1 = await fetch(`https://api.openai.com/v1/threads/${threadID}/runs/${run1.id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            }).then(res => res.json());

            if (run1.status == "requires_action") {
                const toolCalls = run1.required_action.submit_tool_outputs.tool_calls;
                let toolOutputs = []
                for (const toolCall of toolCalls) {
                    const functionName = toolCall.function.name;
                    let args = JSON.parse(toolCall.function.arguments);
                    let output;

                    if (functionName === 'ContactRequest') {
                        const selectedBranch = args.branch?.toLowerCase() || 'gauteng';
                        const branchEmail = branchEmailMap[selectedBranch] || 'ninette@mypanoramic.com';
                        output = await email(args.template, branchEmail);
                    }
                    else if (functionName === 'AIContactRequest') {
                        output = await aiEmail(args.template);
                    }

                    toolOutputs.push({
                        tool_call_id: toolCall.id,
                        output
                    });
                }

                await fetch(`https://api.openai.com/v1/threads/${threadID}/runs/${run1.id}/submit_tool_outputs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.API_KEY}`,
                        'Content-Type': 'application/json',
                        'OpenAI-Beta': 'assistants=v2'
                    },
                    body: JSON.stringify({ tool_outputs: toolOutputs })
                });
                console.log("Tool outputs submitted successfully.");
            }

            if (["failed", "cancelled", "expired", "completed"].includes(run1.status)) {
                console.log(`Run status is '${run1.status}'. Unable to complete the request or done.`);
                break;
            }

            run1 = await fetch(`https://api.openai.com/v1/threads/${threadID}/runs/${run1.id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            }).then(res => res.json());
            console.log(run1.status + '\\');
        }

        if (run1.status === 'completed') {
            var o = {}
            var key = 'messageData';
            o[key] = [];
            var messages = await openai.beta.threads.messages.list(threadId);
            for (const message of messages.data.reverse()) {
                var data = {
                    id: `${message.assistant_id}`,
                    message: `${RemoveSources(markdown.toHTML(message.content[0].text.value))}`
                };
                o[key].push(data);
            }
            let a = o.messageData;
            res.json(JSON.stringify(a));
        }
    } catch (e) {
        console.error(e);
    }
});

app.get('/clear', async (req, res) => {
    res.clearCookie('threadId');
    res.redirect('/');
});

app.post('/clear', async (req, res) => {
    res.clearCookie('threadId');
    res.redirect('/');
});

const server = app.listen(4000, function () {
    console.log('listening to port 4000');
});
