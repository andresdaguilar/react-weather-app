var express = require('express');
var app = express();

app.use(express.static(__dirname +'./../../')); 
app.listen(3000); 

const request = require('request');

app.get('/api/getCities', function(req, res){
    let file = require('./cities.json');
    res.send(file);
});

app.get('/api/search/:location*', function(req, res){
    if (req.params.location != ""){
        let options = {
            url: 'https://www.metaweather.com/api/location/search/?query='+req.params.location
            //headers: {"Ocp-Apim-Subscription-Key": "xxxxx"}
        };
        request(options).pipe(res);
    }else{
        res.send(null);
    }    
});

app.get('/api/weather/:location*', function(req, res){
    let options = {
        url: 'https://www.metaweather.com/api/location/'+req.params.location
        //headers: {"Ocp-Apim-Subscription-Key": "xxxxx"}
    };
    request(options).pipe(res);
});

app.get('/getLoadingImage', function(req, res){
    res.sendFile('../client/images/loading.gif');
})