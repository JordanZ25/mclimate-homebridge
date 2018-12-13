const axios = require('axios');
const fs = require('fs');
var exec = require('child_process').exec;

fs.access('/home/mclimate-homebridge/credentials.json', (err) => {
    if (!err) {

        require('dns').resolve('www.google.com', function (err) {
            if (err) {
                console.log("No connection");
            } else {

                var obj = JSON.parse(fs.readFileSync('`/home/mclimate-homebridge/credentials.json', 'utf8'));

                var access_token = 0;
                var refresh_token = 0;
                var username = obj.username;
                var password = obj.password;
                axios({
                    method: 'post',
                    url: "https://developer-api.seemelissa.com/v1/auth/login",
                    data: {
                        client_id: "5c068a81ab1b0",
                        client_secret: "5c068a81ab109",
                        username: username,
                        password: password
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {

                    var auth = response.data.auth;
                    access_token = auth.access_token;
                    refresh_token = auth.refresh_token;

                    axios({
                        method: 'get',
                        url: "https://developer-api.seemelissa.com/v1/controllers",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + auth.access_token
                        }
                    }).then(function (response, auth) {

                        var controllers = response.data._embedded.controller;

                        var accessories = [];
                        controllers.forEach(function (controller) {
                            if (controller.type == 'smart_plug') {
                                accessories.push({
                                    "accessory": "MClimate-SmartPlug",
                                    "name": controller.name,
                                    "plug_name": controller.name,
                                    "serial_number": controller.serial_number,
                                    "access_token": access_token,
                                    "refresh_token": refresh_token


                                })
                            } else if (controller.type == 'melissa') {
                                accessories.push({
                                    "accessory": "MClimate-Melissa",
                                    "name": controller.name,
                                    "melissa_name": controller.name,
                                    "serial_number": controller.serial_number,
                                    "access_token": access_token,
                                    "refresh_token": refresh_token



                                })

                            }


                        })
                        var config = {
                            "bridge": {
                                "name": "Homebridge",
                                "username": "CC:22:3D:E3:CE:30",
                                "port": 51826,
                                "pin": "031-45-154"
                            },

                            "description": "This is an example configuration file with one fake accessory and one fake platform. You can use this as a template for creating your own configuration file containing devices you actually own.",

                            "accessories": accessories



                        }



                        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));


                    })


                })



            }
        });




        exec('homebridge', function (err,stdout,stderr) {})
    }
    console.log('myfile does not exist');
});











