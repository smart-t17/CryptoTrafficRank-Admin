
import vUrl from 'valid-url';


export class Helper {

    validUrl(str: string) {
        return vUrl.isUri(str);
    }

    validDate(d: any) {
        if (Object.prototype.toString.call(d) === "[object Date]") {
            if (isNaN(d.getTime())) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
}