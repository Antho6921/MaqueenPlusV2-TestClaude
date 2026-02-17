# Maqueen Plus — Extension MakeCode en français

Extension traduite en français pour le robot éducatif **Maqueen Plus** de DFRobot.
Compatible micro:bit V1 et V2. Traduction réalisée à partir du dépôt original :
[DFRobot/pxt-DFRobot-Maqueenplus](https://github.com/DFRobot/pxt-DFRobot-Maqueenplus)

---

## Utilisation de base

### Initialisation (obligatoire en premier)
```
DFRobotMaqueenPlus.I2CInit()
```

### Faire avancer les moteurs
```
DFRobotMaqueenPlus.I2CInit()
DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 200)
```

### Arrêter les moteurs
```
DFRobotMaqueenPlus.mototStop(Motors.ALL)
```

### Lire la vitesse et la direction d'un moteur
```
DFRobotMaqueenPlus.I2CInit()
basic.forever(function () {
    serial.writeValue("vitesse", DFRobotMaqueenPlus.readSpeed(Motors1.M1))
    serial.writeValue("direction", DFRobotMaqueenPlus.readDirection(Motors1.M1))
})
```

### Lire les capteurs de suivi de ligne
```
DFRobotMaqueenPlus.I2CInit()
basic.forever(function () {
    serial.writeValue("ligne_L1", DFRobotMaqueenPlus.readPatrol(Patrol.L1))
    serial.writeValue("tension_L1", DFRobotMaqueenPlus.readPatrolVoltage(Patrol.L1))
})
```

### Capteur à ultrasons
```
DFRobotMaqueenPlus.I2CInit()
basic.forever(function () {
    serial.writeValue("distance", DFRobotMaqueenPlus.ultraSonic(PIN.P0, PIN.P0))
})
```

### Télécommande infrarouge
```
DFRobotMaqueenPlus.I2CInit()
basic.forever(function () {
    serial.writeValue("IR", DFRobotMaqueenPlus.IR_read())
})
```

### Servomoteurs
```
DFRobotMaqueenPlus.I2CInit()
DFRobotMaqueenPlus.servoRun(Servos.S1, 90)
```

### LEDs RGB
```
DFRobotMaqueenPlus.I2CInit()
DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBALL, Color.BLUE)
```

---

## Licence

MIT — Copyright (c) 2018, DFRobot  
Traduction française : Claude (Anthropic), 2026

## Cible

* for PXT/microbit
