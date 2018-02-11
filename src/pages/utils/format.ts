
export class Format {

    constructor() {

    }

    roundNumber(value:any, decimals:number){
        if(!decimals)
            decimals = 2;
        return parseFloat(value).toFixed(decimals);
    }

}