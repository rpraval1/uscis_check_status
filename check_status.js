const uscis = require('uscis')

var list_r = ['EAC1990044119',
'EAC1990044120',
'EAC1990044162',
'EAC1990044173',
'EAC1990044182',
'EAC1990044183',
'EAC1990044184',
'EAC1990044187',
'EAC1990044188',
'EAC1990044195',
'EAC1990044196',
'EAC1990044198',
'EAC1990044199',
'EAC1990044200',
'EAC1990044201',
'EAC1990044202',
'EAC1990044203',
'EAC1990044204',
'EAC1990044205',
'EAC1990044206',
'EAC1990044207',
'EAC1990044208',
'EAC1990044209',
'EAC1990044210',
'EAC1990044211',
'EAC1990044212',
'EAC1990044213',
'EAC1990044214',
'EAC1990044218',
'EAC1990044219',
'EAC1990044224',
'EAC1990044225',
'EAC1990044226',
'EAC1990044228',
'EAC1990044229',
'EAC1990044231',
'EAC1990044232',
'EAC1990044233',
'EAC1990044234',
'EAC1990044236',
'EAC1990044268',
'EAC1990044276',
'EAC1990044277',
'EAC1990044278',
'EAC1990044279']


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

