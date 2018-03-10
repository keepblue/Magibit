/**
 * makecode Four Digit Display (TM1650) Package.
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */

/**
 * Four Digit Display 模块
 */
//% weight=100 color=#64C800 icon="日"
namespace FourDigitDisplay {

    let COMMAND_I2C_ADDRESS = 0x24
    let DISPLAY_I2C_ADDRESS = 0x34
    let buf = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

    let _intensity = 3
    let dbuf = [0, 0, 0, 0]

    /**
     * send command to display
     * @param is command, eg: 0
     */
    function cmd(c: number) {
        pins.i2cWriteNumber(COMMAND_I2C_ADDRESS, c, NumberFormat.Int8BE)
    }

    /**
     * send data to display
     * @param is data, eg: 0
     */
    function dat(bit: number, d: number) {
        pins.i2cWriteNumber(DISPLAY_I2C_ADDRESS + (bit % 4), d, NumberFormat.Int8BE)
    }

    /**
     * 打开显示功能
     */
    //% block
    export function 打开() {
        cmd(_intensity * 16 + 1)
    }

    /**
     * 关闭显示功能
     */
    //% block
    export function 关闭() {
        _intensity = 0
        cmd(0)
    }

    /**
     * 清除显示内容
     */
    //% block
    export function 清除() {
        dat(0, 0)
        dat(1, 0)
        dat(2, 0)
        dat(3, 0)
        dbuf = [0, 0, 0, 0]
    }

    /**
     * 在指定位置显示一个数字
     * @param 数字 (0-15) 是将要显示的参数, eg: 1
     * @param 位代表显示位置, eg: 0
     */
    //% block
    //% num.max=15 num.min=0
    export function 显示(num: number, bit: number) {
        dbuf[bit % 4] = buf[num % 16]
        dat(bit, buf[num % 16])
    }

    /**
     * 显示一个数字
     * @param num 代表将要的整数, eg: 100
     */
    //% block
    export function displayInt(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            显示((num / 1000) % 10, 0)
        显示(num % 10, 3)
        显示((num / 10) % 10, 2)
        显示((num / 100) % 10, 1)
    }

    /**
     * 显示16进制数字
     * @param num 代表将要显示的整数, eg: 123
     */
    //% block
    export function displayHex(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            显示((num >> 12) % 16, 0)
        显示(num % 16, 3)
        显示((num >> 4) % 16, 2)
        显示((num >> 8) % 16, 1)
    }

    /**
     * 显示或隐藏小数点
     * @param bit 代表小数点位置, eg: 0
     * @param show 代表显示或者隐藏, eg: true
     */
    //% block
    export function displayFloat(bit: number, show: boolean) {
        if (show) dat(bit, dbuf[bit % 4] | 0x80)
        else dat(bit, dbuf[bit % 4] & 0x7F)
    }

    /**
     * 设置显示亮度
     * @param dat 代表显示亮度等级，范围[0-8]，0代表关闭，8最亮, eg: 3
     */
    //% block
    export function displayLight(dat: number) {
        if ((dat < 0) || (dat > 8))
            return;
        if (dat == 0)
            关闭()
        else {
            _intensity = dat
            cmd((dat << 4) | 0x01)
        }
    }

    open();
}
