const uscis = require("uscis");
var colors = require("colors");

var list_r = [
  "LIN1990480278",
  "LIN1990480295",
  //   "LIN1990480297",
  "LIN1990480300",
  //   "LIN1990480302",
  "LIN1990480311",
  "LIN1990480312",
  "LIN1990480353",
  "LIN1990480361",
  "LIN1990480385",
  "LIN1990480425",
  "LIN1990480428",
  "LIN1990480429",
  //   "LIN1990480467",
  "LIN1990480430",
  //   "LIN1990480505",
  "LIN1990480510",
  "LIN1990480540",
  "LIN1990480522",
  "LIN1990480534",
  "LIN1990480536",
  "LIN1990480546",
  "LIN1990480550",
  "LIN1990480551",
  "LIN1990480579",
  //   "LIN1990480584",
  "LIN1990480633",
  "LIN1990480707",
  "LIN1990480709",
  "LIN1990480716",
  "LIN1990480765",
  "LIN1990480788",
  "LIN1990480789",
  "LIN1990480790",
  "LIN1990480827",
  "LIN1990480845",
  "LIN1990480853",
  "LIN1990480862",
  //   "LIN1990480889",
  "LIN1990480901",
  "LIN1990480903",
  "LIN1990480915",
  "LIN1990480944",
  //   "LIN1990480949",
  "LIN1990480952",
  "LIN1990480953",
  "LIN1990480954",
  "LIN1990480955",
  "LIN1990480956",
  "LIN1990480957",
  "LIN1990480986",
  "LIN1990480988",
  //   "LIN1990481210",
  "LIN1990481370",
  //   "LIN1990481380",
  "LIN1990481410",
  "LIN1990481560",
  "LIN1990481562",
  "LIN1990481603",
  "LIN1990481608"
];

// for (let i = parseInt(process.argv[2]); i < parseInt(process.argv[3]); i++) {
//   list_r.push("LIN" + i);
// }

console.log(
  new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
);

let all_requests = list_r.map(async token => {
  return await uscis(token).then(status => {
    //console.log(status)
    // console.log(status.details);
    let caseType = "Others";

    var caseChangeDate = "";

    if (
      status.details.includes("I-765") ||
      status.details.includes("new card")
    ) {
      caseType = "I765";
    }

    if (status.details.includes("ordered your new card")) {
      caseChangeDate = status.details.match(/(?<=On\s+).*?(?=\s+we)/gs);
      // console.log(caseChangeDate);
      caseChangeDate = caseChangeDate[0].substring(
        0,
        caseChangeDate[0].length - 1
      );
    }

    if (status.title.includes("Card Was Delivered")) {
      caseChangeDate = status.details.match(
        /(?<=On\s+).*?(?=\s+the\ Post\ Office)/gs
      );
      // console.log(caseChangeDate);
      caseChangeDate = caseChangeDate[0].substring(
        0,
        caseChangeDate[0].length - 1
      );
    }
    //
    let obj = {
      token,
      title: status.title,
      details: status.details,
      type: caseType,
      caseChangeDate
    };
    return obj;
  });
});

let victoryMessage = "";

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
  "Case Was Approved": {
    count: 0,
    tokens: []
  },
  "Case Was Received": {
    count: 0,
    tokens: []
  },
  Others: {
    count: 0,
    tokens: []
  }
};

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
  "Case Was Approved": {
    count: 0,
    tokens: []
  },
  "Case Was Received": {
    count: 0,
    tokens: []
  },
  Others: {
    count: 0,
    tokens: []
  }
};

let statusList = [
  "Case Was Approved",
  "New Card Is Being Produced",
  "Case Was Received",
  "Others",
  "Card Was Delivered To Me By The Post Office",
  "Card Was Mailed To Me",
  "Card Was Picked Up By The United States Postal Service"
];

Promise.all(all_requests).then(loadAllRequests => {
  loadAllRequests.map(response => {
    if (response.type == "I765") {
      if (statusList.includes(response.title)) {
        statusI765[response.title].count++;

        if (response.title == "New Card Is Being Produced")
          statusI765[response.title].tokens.push(
            response.token + " | Date: " + response.caseChangeDate
          );
        else if (response.title.includes("Card Was Delivered"))
          statusI765[response.title].tokens.push(
            response.token + " | Date: " + response.caseChangeDate
          );
        else statusI765[response.title].tokens.push(response.token);

        if (
          response.token == "LIN1990480853" &&
          response.title == "New Card Is Being Produced"
        ) {
          victoryMessage = "Yayy!!!!! Its done!!!!!!!!!!!!";
        }
      } else {
        statusI765["Others"].count++;
        statusI765["Others"].tokens.push(
          response.token + " | " + response.title
        );
      }
    } else {
      if (statusList.includes(response.title)) {
        statusOthers[response.title].count++;
        statusOthers[response.title].tokens.push(response.token);
      } else {
        statusOthers["Others"].count++;
        statusOthers["Others"].tokens.push(
          response.token + " | " + response.title
        );
      }
    }
  });
  if (victoryMessage) {
    console.log(victoryMessage);
  }
  console.log("Summary I765 Forms: ");
  console.log(statusI765);
  console.log(statusOthers);
  if (victoryMessage) {
    console.log(victoryMessage);
  }

  // console.log("Summary Other Forms: ");
  // console.log(statusOthers);
});
