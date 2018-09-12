(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DialogWearableService {
        constructor(device, server, service, control_characteristic, accelerometer_characteristic, gyroscope_characteristic, magnetometer_characteristic, log) {
            this.device = device;
            this.server = server;
            this.service = service;
            this.control_characteristic = control_characteristic;
            this.accelerometer_characteristic = accelerometer_characteristic;
            this.gyroscope_characteristic = gyroscope_characteristic;
            this.magnetometer_characteristic = magnetometer_characteristic;
            this.log = log;
        }
        start() {
            send(this.control_characteristic, [1], this.log);
        }
        stop() {
            send(this.control_characteristic, [0], this.log);
        }
        // todo: notification listener management
        ggg() {
            this.accelerometer_characteristic.startNotifications()
                .then(() => {
                this.log('Acc notifications started');
                this.accelerometer_characteristic.addEventListener('characteristicvaluechanged', (notification) => { this.log("acc not:", notification); });
            });
        }
    }
    async function dialog_wearable_service(l) {
        const device = await navigator.bluetooth.requestDevice({
            // filters:[
            //     {name: 'My Myo'},
            //     {
            //         services: ['battery_service']
            //     }
            // ],
            acceptAllDevices: true,
            optionalServices: [UUIDs.DEVICE_INFO_SERVICE]
        });
        l("found device");
        const server = await device.gatt.connect();
        l("connected to device");
        const service = await server.getPrimaryService(UUIDs.DEVICE_INFO_SERVICE);
        l("got service");
        const control_characteristic = await service.getCharacteristic(UUIDs.CONTROL_POINT);
        const accelerometer_characteristic = await service.getCharacteristic(UUIDs.ACCELEROMETER.DATA);
        const gyroscope_characteristic = await service.getCharacteristic(UUIDs.GYROSCOPE.DATA);
        const magnetometer_characteristic = await service.getCharacteristic(UUIDs.MAGNETOMETER.DATA);
        l("got characteristics");
        return new DialogWearableService(device, server, service, control_characteristic, accelerometer_characteristic, gyroscope_characteristic, magnetometer_characteristic, l);
    }
    exports.dialog_wearable_service = dialog_wearable_service;
    // const l = console.log;
    function send(characteristic, value, log) {
        log('sending', value);
        return characteristic
            .writeValue(new Uint8Array(value))
            .then(response => {
            log("data sent!");
        })
            .catch(error => {
            log("error while sending the data", error);
        });
    }
    // UUIDs for services, characteristics and descriptors
    const UUIDs = {
        NOTIFICATION_DESCRIPTOR: '00002902-0000-1000-8000-00805f9b34fb',
        CONTROL_POINT: '2ea78970-7d44-44bb-b097-26183f402409',
        CONTROL_REPLY: '2ea78970-7d44-44bb-b097-26183f40240A',
        DEVICE_INFO_SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
        FEATURES_DATA: '2ea78970-7d44-44bb-b097-26183f402408',
        ACCELEROMETER: {
            SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
            DATA: '2ea78970-7d44-44bb-b097-26183f402401',
        },
        GYROSCOPE: {
            SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
            DATA: '2ea78970-7d44-44bb-b097-26183f402402',
        },
        MAGNETOMETER: {
            SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
            DATA: '2ea78970-7d44-44bb-b097-26183f402403',
        },
        BAROMETER: {
            SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
            DATA: '2ea78970-7d44-44bb-b097-26183f402404',
        },
        HUMIDITY: {
            SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
            DATA: '2ea78970-7d44-44bb-b097-26183f402405',
        },
        TEMPERATURE: {
            SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
            DATA: '2ea78970-7d44-44bb-b097-26183f402406',
        },
        // Only in IoT Sensor SFL
        SFL: {
            SERVICE: '2ea78970-7d44-44bb-b097-26183f402400',
            DATA: '2ea78970-7d44-44bb-b097-26183f402407',
        },
    };
});
