import Lang from "../language/lang";

export default class DateFormat{
    

    public static get(input:Date) : string {
        let output = "";
        if(input===undefined || input==null){
            return output;
        }

        const today = new Date();

        const date = new Date(input);

        
        if(date.getFullYear() == today.getFullYear()){
            if(date.getMonth() == today.getMonth()){
                if(date.getDay() == today.getDay()){
                    output = Lang.get("date_today");
                }else if(date.getDay() - today.getDay() == 1){
                    output = Lang.get("date_yesterday");
                }else{
                    output = this.getTwoDigit(date.getDay()) + " " + this.getMonthAsString(date.getMonth());
                }
            }else {
                output = this.getTwoDigit(date.getDay()) + " " + this.getMonthAsString(date.getMonth()) ;
            }
        }else {
            output = this.getTwoDigit(date.getDay()) + " " + this.getMonthAsString(date.getMonth()) + " " + date.getFullYear();
        }

        output += " " + this.getTwoDigit(date.getHours()) + ":"+ this.getTwoDigit(date.getMinutes());
        
        return output;
    }

    private static getTwoDigit(input: number) : string{
        return input<10?"0"+input: ""+input
    }

    private static getMonthAsString(month: number) : string {
        switch( month ){
            case 0:
                return Lang.get("date_month_jan");
            case 1:
                return Lang.get("date_month_feb");
            case 2:
                return Lang.get("date_month_mar");
            case 3:
                return Lang.get("date_month_apr");
            case 4:
                return Lang.get("date_month_may");
            case 5:
                return Lang.get("date_month_jun");
            case 6:
                return Lang.get("date_month_jul");
            case 7:
                return Lang.get("date_month_aug");
            case 8:
                return Lang.get("date_month_sep");
            case 9:
                return Lang.get("date_month_oct");
            case 10:
                return Lang.get("date_month_nov");
            case 11:
                return Lang.get("date_month_dec");
        }
    }

}
