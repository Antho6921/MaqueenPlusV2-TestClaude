/**
 * @file maqueenplus.ts
 * @brief DFRobot's Maqueen Plus makecode library — version française
 * @n Maqueen Plus est un robot éducatif STEM pour micro:bit.
 * @n Optimisé avec une meilleure gestion de l'énergie et une plus grande capacité
 *    d'alimentation, compatible avec le capteur de vision IA Huskylens.
 *
 * @copyright [DFRobot](http://www.dfrobot.com), 2016
 * @copyright MIT License
 * @author jie.tang@dfrobot.com
 * @date 2019-11-19
 * Traduction française : Claude (Anthropic), 2026
 */

enum PIN {
    P0 = 3,
    P1 = 2,
    P2 = 1,
    P8 = 18,
    P12 = 20,
    P13 = 23,
    P14 = 22,
    P15 = 21,
};

enum Motors {
    //% block="gauche"
    M1 = 1,
    //% block="droite"
    M2 = 2,
    //% block="TOUS"
    ALL = 3
}

enum Motors1 {
    //% block="gauche"
    M1 = 1,
    //% block="droite"
    M2 = 2,
}

enum Dir {
    //% block="horaire"
    CW = 0x0,
    //% block="antihoraire"
    CCW = 0x1,
}

enum Patrol {
    //% block="L1"
    L1 = 0x1,
    //% block="L2"
    L2 = 0x2,
    //% block="L3"
    L3 = 0x3,
    //% block="R1"
    R1 = 0x4,
    //% block="R2"
    R2 = 0x5,
    //% block="R3"
    R3 = 0x6,
}

enum Servos {
    //% block="S1"
    S1 = 0x14,
    //% block="S2"
    S2 = 0x15,
    //% block="S3"
    S3 = 0x16,
}

enum RGBLight {
    //% block="RGB gauche"
    RGBL = 0x0,
    //% block="RGB droite"
    RGBR = 0x1,
    //% block="RGB tous"
    RGBALL = 0x2,
}

enum Color {
    //% block="rouge"
    RED = 0x1,
    //% block="vert"
    GREEN = 0x2,
    //% block="bleu"
    BLUE = 0x4,
    //% block="jaune"
    YELLOW = 0x3,
    //% block="rose"
    PINK = 0x5,
    //% block="cyan"
    CYAN = 0x6,
    //% block="blanc"
    WHITE = 0x7,
    //% block="éteint"
    BLACK = 0x0,
}

//% color="#00BFFF" weight=100 icon="\uf1b9" block="Maqueen Plus"
namespace DFRobotMaqueenPlus {
    let irstate: number;
    let state: number;

    export class Packeta {
        public mye: string;
        public myparam: number;
    }

    /**
     * Initialise la communication I2C avec le robot Maqueen Plus.
     * À appeler au début du programme avant toute autre instruction.
     */
    //% weight=100
    //% block="Maqueen Plus : initialiser I2C"
    //% blockId="DFRobotMaqueenPlus_I2CInit"
    export function I2CInit(): void {
        let Version_v = 0;
        pins.i2cWriteNumber(0x10, 0x32, NumberFormat.Int8LE);
        Version_v = pins.i2cReadNumber(0x10, NumberFormat.Int8LE);
        while (Version_v == 0) {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `, 10)
            basic.pause(500)
            basic.clearScreen()
            pins.i2cWriteNumber(0x10, 0x32, NumberFormat.Int8LE);
            Version_v = pins.i2cReadNumber(0x10, NumberFormat.Int8LE);
        }
        basic.showLeds(`
            . . . . .
            . . . . #
            . . . # .
            # . . . .
            . # . . .
            `, 10)
        basic.pause(500)
        basic.clearScreen()
    }

    /**
     * Fait tourner le(s) moteur(s) dans une direction donnée à la vitesse indiquée.
     * @param index Sélectionner le moteur : gauche, droite ou tous
     * @param dir Sens de rotation : horaire ou antihoraire
     * @param speed Vitesse du moteur (0 à 255), par ex. 100
     */
    //% weight=90
    //% block="Maqueen Plus : moteur %index | direction %dir | vitesse %speed"
    //% blockId="DFRobotMaqueenPlus_mototRun"
    //% speed.min=0 speed.max=255
    export function mototRun(index: Motors, dir: Dir, speed: number): void {
        let speed_L = 0, speed_R = 0, Ldir = 0, Rdir = 0;
        let buf = pins.createBuffer(5);
        if (index == Motors.M1) {
            buf[0] = 0x00;
            buf[1] = dir;
            buf[2] = speed;
            buf[3] = dir;
            buf[4] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        } else if (index == Motors.M2) {
            buf[0] = 0x02;
            buf[1] = dir;
            buf[2] = speed;
            buf[3] = dir;
            buf[4] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        } else {
            buf[0] = 0x00;
            buf[1] = dir;
            buf[2] = speed;
            buf[3] = dir;
            buf[4] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        }
    }

    /**
     * Arrête le(s) moteur(s) sélectionné(s).
     * @param index Sélectionner le moteur à arrêter : gauche, droite ou tous
     */
    //% weight=80
    //% block="Maqueen Plus : arrêter moteur %index"
    //% blockId="DFRobotMaqueenPlus_mototStop"
    export function mototStop(index: Motors): void {
        let buf = pins.createBuffer(5);
        buf[0] = 0x00;
        buf[1] = 0;
        buf[2] = 0;
        buf[3] = 0;
        buf[4] = 0;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
     * Lit la vitesse actuelle du moteur sélectionné.
     * @param index Sélectionner le moteur : gauche ou droite
     */
    //% weight=70
    //% block="Maqueen Plus : vitesse moteur %index"
    //% blockId="DFRobotMaqueenPlus_readSpeed"
    export function readSpeed(index: Motors1): number {
        let speed_L_H = 0, speed_L_L = 0, speed_R_H = 0, speed_R_L = 0;
        let speed = 0;
        pins.i2cWriteNumber(0x10, 0x07, NumberFormat.Int8LE, false);
        speed_L_H = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, true);
        speed_L_L = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, true);
        speed_R_H = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, true);
        speed_R_L = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, false);
        if (index == Motors1.M1) {
            speed = speed_L_H * 256 + speed_L_L;
        } else {
            speed = speed_R_H * 256 + speed_R_L;
        }
        return speed;
    }

    /**
     * Lit le sens de rotation actuel du moteur sélectionné.
     * @param index Sélectionner le moteur : gauche ou droite
     */
    //% weight=65
    //% block="Maqueen Plus : direction moteur %index"
    //% blockId="DFRobotMaqueenPlus_readDirection"
    export function readDirection(index: Motors1): number {
        let speed_L_H = 0, speed_L_L = 0, speed_R_H = 0, speed_R_L = 0;
        let dir_L = 0, dir_R = 0;
        pins.i2cWriteNumber(0x10, 0x05, NumberFormat.Int8LE, false);
        dir_L = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, true);
        dir_R = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, false);
        if (index == Motors1.M1) {
            return dir_L;
        } else {
            return dir_R;
        }
    }

    /**
     * Lit l'état (détection ligne) du capteur de suivi de ligne sélectionné.
     * Retourne 0 (ligne noire détectée) ou 1 (pas de ligne).
     * @param patrol Capteur de suivi de ligne à lire (L1, L2, L3, R1, R2, R3)
     */
    //% weight=60
    //% block="Maqueen Plus : capteur ligne %patrol"
    //% blockId="DFRobotMaqueenPlus_readPatrol"
    export function readPatrol(patrol: Patrol): number {
        let state = 0;
        pins.i2cWriteNumber(0x10, 0x1D, NumberFormat.Int8LE, false);
        state = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, false);
        if (patrol == Patrol.L1) {
            return (state & 0x01) ? 1 : 0;
        } else if (patrol == Patrol.L2) {
            return (state >> 1 & 0x01) ? 1 : 0;
        } else if (patrol == Patrol.L3) {
            return (state >> 2 & 0x01) ? 1 : 0;
        } else if (patrol == Patrol.R1) {
            return (state >> 3 & 0x01) ? 1 : 0;
        } else if (patrol == Patrol.R2) {
            return (state >> 4 & 0x01) ? 1 : 0;
        } else {
            return (state >> 5 & 0x01) ? 1 : 0;
        }
    }

    /**
     * Lit la valeur de tension (niveau de gris) du capteur de suivi de ligne.
     * @param patrol Capteur de suivi de ligne à lire (L1, L2, L3, R1, R2, R3)
     */
    //% weight=55
    //% block="Maqueen Plus : tension capteur ligne %patrol"
    //% blockId="DFRobotMaqueenPlus_readPatrolVoltage"
    export function readPatrolVoltage(patrol: Patrol): number {
        let state = 0;
        let reg = 0x1E + ((patrol as number) - 1) * 2;
        pins.i2cWriteNumber(0x10, reg, NumberFormat.Int8LE, false);
        let high = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, true);
        let low = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, false);
        return (high << 8) | low;
    }

    /**
     * Mesure la distance en centimètres à l'aide du capteur à ultrasons.
     * @param trig Broche TRIG du capteur à ultrasons
     * @param echo Broche ECHO du capteur à ultrasons
     */
    //% weight=50
    //% block="Maqueen Plus : ultrasons trig %trig echo %echo"
    //% blockId="DFRobotMaqueenPlus_ultraSonic"
    export function ultraSonic(trig: PIN, echo: PIN): number {
        let duration = 0;
        let RangeInCentimeters = 0;
        pins.digitalWritePin(<number>trig as DigitalPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(<number>trig as DigitalPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(<number>trig as DigitalPin, 0);
        duration = pins.pulseIn(<number>echo as DigitalPin, PulseValue.High, 50000);
        RangeInCentimeters = duration / 39;
        return Math.round(RangeInCentimeters);
    }

    /**
     * Lit la valeur reçue par le récepteur infrarouge (télécommande IR).
     * Retourne le code de la touche reçue.
     */
    //% weight=45
    //% block="Maqueen Plus : lire télécommande IR"
    //% blockId="DFRobotMaqueenPlus_IR_read"
    export function IR_read(): number {
        let keyValue = 0;
        pins.i2cWriteNumber(0x10, 0x0E, NumberFormat.Int8LE, false);
        keyValue = pins.i2cReadNumber(0x10, NumberFormat.Int8LE, false);
        return keyValue;
    }

    /**
     * Positionne un servo-moteur à l'angle indiqué.
     * @param servo Sélectionner le servo : S1, S2 ou S3
     * @param angle Angle cible du servo (0 à 180 degrés), par ex. 90
     */
    //% weight=40
    //% block="Maqueen Plus : servo %servo | angle %angle °"
    //% blockId="DFRobotMaqueenPlus_servoRun"
    //% angle.min=0 angle.max=180
    export function servoRun(servo: Servos, angle: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = servo as number;
        buf[1] = angle;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
     * Allume les LED RGB du Maqueen Plus avec la couleur choisie.
     * @param light Sélectionner la LED RGB : gauche, droite ou toutes
     * @param color Couleur à afficher
     */
    //% weight=35
    //% block="Maqueen Plus : LED RGB %light | couleur %color"
    //% blockId="DFRobotMaqueenPlus_setRGBLight"
    export function setRGBLight(light: RGBLight, color: Color): void {
        let buf = pins.createBuffer(3);
        if (light == RGBLight.RGBALL) {
            buf[0] = 0x0B;
            buf[1] = color as number;
            buf[2] = color as number;
        } else if (light == RGBLight.RGBL) {
            buf[0] = 0x0B;
            buf[1] = color as number;
            buf[2] = 0;
        } else {
            buf[0] = 0x0B;
            buf[1] = 0;
            buf[2] = color as number;
        }
        pins.i2cWriteBuffer(0x10, buf);
    }
}
