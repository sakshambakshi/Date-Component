
  fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    console.log(data) // Prints result from `response.json()` in getRequest
    const availableDates = {};
    console.log(availableDates)
  const pendingDates = {};
  const nospaceDates = {}
  Object.keys(data.availableDates).forEach(date=>{
    availableDates[ new Date(date)] = new Date(date)
  })
  Object.keys(data.pendingDates).forEach(date=>{
    pendingDates[ new Date(date)] = new Date(date)
  })
  Object.keys(data.nospaceDates).forEach(date=>{
    nospaceDates[ new Date(date)] = new Date(date)
  })
  console.table({availableDates , pendingDates , nospaceDates})

  $('#datepicker').datepicker({
    minDate: 0,
    beforeShowDay: function( date ) {  
        if( availableDates[date] ){   
          return [true, "available", 'Tooltip text'];
        } if( pendingDates[date] ) {   
          return [true, "pending", 'Tooltip text'];
        }if(nospaceDates[date]){
          return [true, "Notavailable", 'Tooltip text']
        }else {
          return [true, "", 'Tooltip text'];
        }
    },
    onSelect: (x  , y )=>{
      console.log(x)
      //   let date = new Date(x)
      //   console.log(date)
      //   date = date.toString().split(" ");
      //   let month = date[1];
      //   let monthNo = date[2]
      // console.log()
      // console.log(y);
      console.log("event");
      // this.event.target.href="https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript"
      // console.log(this.event.target.href)
      console.log(`/date?date=${x}`)
      window.open(`/date?date=${x}`)

    }
});
  })



