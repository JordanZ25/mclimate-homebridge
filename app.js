const axios = require('axios');
const fs = require('fs');
var exec = require('child_process').exec;

fs.access('/home/mclimate-homebridge/credentials.json', (err) => {
    if (!err) {

        require('dns').resolve('www.google.com', function (err) {
            if (err) {
                console.log("No connection");
            } else {

                var obj = JSON.parse(fs.readFileSync('/home/mclimate-homebridge/credentials.json', 'utf8'));

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

                            } else if (controller.type == 'vicki') {
                                accessories.push({
                                    "accessory": "MClimate-Vicki",
                                    "name": controller.name,
                                    "vicki_name": controller.name,
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
                            "description": "This is configuration file with all accessories.",
                            "accessories": accessories
                        }

                        fs.writeFile('/root/.homebridge/config.json', JSON.stringify(config, null, 2), (error) =>{
                            if(error){
                                console.log(error)
                            }else{
                                exec('homebridge', {env:{'PATH':'/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'}}, function (err, stdout, stderr) {
                                    console.log(err)
                                    console.log(stdout)
                                    console.log(stderr)
                                     })
    
                            }
                        } );


                    })


                })



            }
        });




        
    }else{
    console.log('myfile does not exist');
    }
});











