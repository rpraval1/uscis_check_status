const uscis = require('uscis')
var colors = require('colors')

var list_r = []
// process.argv[2]
// for(let i=1990044000;i<1990044180;i++) {
for(let i=parseInt(process.argv[2]);i<parseInt(process.argv[3]);i++) {
    list_r.push('EAC' + i);
}

let all_requests = list_r.map(async token => {
    return await uscis(token).then((status) => {
        // console.log(status)
        //console.log(status.details)
        let caseType = 'Others';

        if (status.details.includes('I-765') || status.details.includes('new card')){
            caseType = 'I765';
        }
        let obj = {
            token,
            title: status.title,
            details: status.details,
            type: caseType 
        }
        return obj;
    })
});

let victoryMessage = ''

let statusI765 = {
    "New Card Is Being Produced": {
        count: 0,
        tokens: []
    },
    "Card Was Delivered To Me By The Post Office": {
        count: 0,
        tokens: []
    },
    "Card Was Picked Up By The United States Postal Service": {
        count: 0,
        tokens: []
    },
    "Card Was Mailed To Me": {
        count: 0,
        tokens: []
    },
    "Case Was Received": {
        count: 0,
        tokens: []
    },
    "Others": {
        count: 0,
        tokens: []
    }
}

let statusOthers = {
    "New Card Is Being Produced": {
        count: 0,
        tokens: []
    },
    "Card Was Delivered To Me By The Post Office": {
        count: 0,
        tokens: []
    },
    "Card Was Mailed To Me": {
        count: 0,
        tokens: []
    },
    "Card Was Picked Up By The United States Postal Service": {
        count: 0,
        tokens: []
    },
    "Case Was Received": {
        count: 0,
        tokens: []
    },
    "Others": {
        count: 0,
        tokens: []
    }
}

let statusList = ["New Card Is Being Produced", "Case Was Received", "Others", 
"Card Was Delivered To Me By The Post Office", "Card Was Mailed To Me",
"Card Was Picked Up By The United States Postal Service"]


Promise.all(all_requests).then(loadAllRequests => {
    loadAllRequests.map(response => {
        if (response.type == 'I765') {
            if (statusList.includes(response.title)) {
                statusI765[response.title].count++;

                if(response.title == 'New Card Is Being Produced')
                    statusI765[response.title].tokens.push(response.token)
                else 
                    statusI765[response.title].tokens.push(response.token)

                if (response.token == 'EAC1990044234' && response.title == 'New Card Is Being Produced') {
                    victoryMessage = 'Yayy!!!!! Its done!!!!!!!!!!!!'
                }

            } else {
                statusI765['Others'].count++;
            }
        } else {
            if (statusList.includes(response.title)) {
                statusOthers[response.title].count++;
                statusOthers[response.title].tokens.push(response.token)
            } else {
                statusOthers['Others'].count++;
            }
        }
    });
    if (victoryMessage) {
        console.log(victoryMessage)
    }
    console.log("Summary I765 Forms: ");
    console.log(statusI765);
    if (victoryMessage) {
        console.log(victoryMessage)
    }

    // console.log("Summary Other Forms: ");
    // console.log(statusOthers);
});

