
const moment = require('moment');
//creates new date in mm-dd-yyyy format
function convertDate(){
    let convertedDate = moment().format(); 
    // console.log(convertedDate)
    return getWeek(convertedDate) 
}

//seperates date by mm and dd to use comparison logic
function getWeek(convertedDate){
  let currentWeek;
  let mm = moment(convertedDate).month() + 1
  console.log(mm)
  let dd = moment(convertedDate).date()
  console.log(dd)
  if (mm == 9 && (dd >= 8 && dd < 15)){
    currentWeek = 1;
  }
  else if (mm == 9 && (dd >= 15 && dd < 22)){
    currentWeek = 2;
  }
  else if (mm == 9 && (dd >= 22 && dd < 29)){
    currentWeek = 3;
  }
  else if ((mm == 9 && dd >= 29) || (mm == 10 && dd < 6)) {
    currentWeek = 4;
  }

  else if (mm == 10 && (dd >= 6 && dd < 13)) {

    currentWeek = 5;
  }
  else if (mm == 10 && (dd >= 13 && dd < 20)){
    currentWeek = 6;
  }
  else if (mm == 10 && (dd >= 20 && dd < 27)){
    currentWeek = 7;
  }
  else if ((mm == 10 && dd >= 27) || (mm == 11 && dd < 3)){
    currentWeek = 8;
  }
  else if (mm == 11 && (dd >= 3 && dd < 10)){
    currentWeek = 9;
  }
  else if (mm == 11 && (dd >= 10 && dd < 17)){
    currentWeek = 10;
  }
  else if (mm == 11 && (dd >= 17 && dd < 24)){
    currentWeek = 11;
  }
  else if (mm == 11 && (dd >= 24 && dd <= 30)){
    currentWeek = 12;
  }
  else if (mm == 12 && (dd >= 1 && dd < 8)){
    currentWeek = 13;
  }
  else if (mm == 12 && (dd >= 8 && dd < 15)){
    currentWeek = 14;
  }
  else if (mm == 12 && (dd >= 15 && dd <=22)){
    currentWeek = 15;
  }
  else if (mm == 12 && (dd >= 22 && dd < 29)){
    currentWeek = 16;
  }
  else if ((mm == 12 && dd >= 29) || (mm == 1 && dd < 5)){
    currentWeek = 17;
  }
  //defaults to week 17
  else {
    currentWeek = 17;
  }
  console.log(currentWeek)
  return currentWeek
  // getSchedule(currentWeek)

}

//can use for loops to write logic for schedule for weeks outside of current week and
//also for the current week
function getSchedule(currentWeek){
  // for (let i = currentWeek; i < 18; i++){
    // console.log('hi')
    //put logic of what we need in here for games
    //after current week
  // }
  // for (let i = currentWeek; i >0; i--){
    // console.log('hi')
    //put logic of what we need in here for games
    //before current week
//   }
// }

  console.log(currentWeek);
  return currentWeek
}

// convertDate()

module.exports = convertDate;
