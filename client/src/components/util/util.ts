export  class Util {
    public static retina :string = 'retina';
    public static desktop :string = 'desktop';
    public static tablet :string = 'tablet';
    public static mobile :string = 'mobile';

    public static getDevice() : string {
        const width = document.body.getBoundingClientRect().width;
        if (width <= 479) {
            return Util.mobile;
        }
        if (width <= 768) {
            return Util.tablet;
        }
        if (width <= 1024) {
            return Util.desktop;
        }
        return Util.retina;
    }
}