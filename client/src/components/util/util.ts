import { Constants } from "../../services/config/constants";

export  class Util {

    public static getDevice() : string {
        const width = document.body.getBoundingClientRect().width;
        if (width <= 479) {
            return Constants.mobile;
        }
        if (width <= 768) {
            return Constants.tablet;
        }
        if (width <= 1024) {
            return Constants.desktop;
        }
        return Constants.retina;
    }
}