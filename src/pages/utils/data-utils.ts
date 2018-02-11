
export class DataUtils {

    constructor() {

    }

    // 2016-11-14
    dateToUnix( dateStr:String ):String{
        try{
            
            var dateArray = [];
            //"2016-11-25T13:39:49.117Z"
            dateStr = dateStr.split('T')[0];
            dateArray = dateStr.split('-');
            return (Number(new Date( dateArray[0] , dateArray[1]-1 , dateArray[2] )) /1000).toFixed(0);
        }catch(e){
            console.log((e))
        }
    }

    unixToDate( unixTime:number ):String {
        try{       
            var dt = new Date(unixTime*1000);
            //return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();


            var day = (dt.getDate() < 10 ? '0'+dt.getDate() : dt.getDate());
            var month = ((dt.getMonth() + 1) < 10 ? '0'+(dt.getMonth() + 1) : (dt.getMonth() + 1)); 
            var year = dt.getFullYear();

            return year + "-" + month + "-" + day;

        }catch(e){
            console.log(e);
        }
    }

    dateToString( date:Date ):String{
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

}