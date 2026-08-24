async function UpcomingIpo(page=1, pageSize=10){

let data = await fetch(`https://api.stockedge.com/Api/IPODashboardApi/GetUpcomingIPOs?page=${page}&pageSize=${pageSize}&lang=en`)
let data1= await data.json()
return data1
}

async function GetOngoingIPOs(page=1, pageSize=10){
let data = await fetch(`https://api.stockedge.com/Api/IPODashboardApi/GetOngoingIPOs?page=${page}&pageSize=${pageSize}&lang=en`)
let data1= await data.json()
return data1
}

async function GetListedIPOs(page=1, pageSize=10){
let data = await fetch(`https://api.stockedge.com/Api/IPODashboardApi/GetOngoingIPOs?page=${page}&pageSize=${pageSize}&lang=en`)
let data1= await data.json()
return data1

}


module.exports= {UpcomingIpo, GetListedIPOs,GetOngoingIPOs}