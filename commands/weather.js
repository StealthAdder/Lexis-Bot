module.exports.run = async (client,message,args,messageArray) => {
    const prefix = require("../prefix.json");
    const { MessageEmbed } = require('discord.js');
    const fetch = require('node-fetch');
    const embed = new MessageEmbed();
    const city = messageArray.slice(1).join(' ');

    const API_KEY = prefix.OpenAPI;

    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

    fetch(api)
    .then(response => {
        return response.json();
    })
    .then(data => {
        
        if (data.cod == "404") {
            embed 
            .setColor(0xE53935)
            .addField(`City/ZIPCODE: ${city.toUpperCase()}`, `:warning: Not Found`);
            message.channel.send(embed);
        }
        else {
            const { description, icon } = data.weather[0];
            // console.log(data);
            const { temp, humidity } = data.main;
            const City_name = data.name;
            // const { name } = data.sys.name;
            // const { lon, lat } = data.coord;

            const { country } = data.sys;
            function switchResult(icon) {
                switch(icon) {
                    case "01n":
                    case "01d":
                        return "https://s2.gifyu.com/images/Clear.gif";

                    case "02n":
                    case "02d":
                        // clouds
                        return "https://s2.gifyu.com/images/few-clouds.gif";

                    case "03n":
                    case "03d":
                        // scattered clouds
                        return "https://s2.gifyu.com/images/Mostly-Sunny.gif";
                    
                    case "04n":
                    case "04d":
                        // broken clouds
                        return "https://s2.gifyu.com/images/Cloudly.gif";

                    case "09n":
                    case "09d":
                        // shower rain
                        return "https://s2.gifyu.com/images/Rain3797367f06a42b15.gif";
                    
                    case "10n":
                    case "10d":
                        // rain
                        return "https://s2.gifyu.com/images/Rain3797367f06a42b15.gif";

                    case "11n":
                    case "11d":
                        // thunderstorm
                        return "https://s2.gifyu.com/images/ThunderStorm.gif";

                    case "13n":
                    case "13d":
                        // snow
                        return "https://s2.gifyu.com/images/Snow.gif";

                    case "50n":
                    case "50d":
                        // mist
                        return "https://s2.gifyu.com/images/Hazy.gif";

                    default :
                        return ":warning: Error";
                }
            }

            let cli = switchResult(icon);

            embed
            .setTitle(`Weather Report: **${City_name}** (${country})`)
            .setColor(0x4c8dcf)
            .addField("Descritption", `${description.toUpperCase()}`)
            .addField("Temperature", `:thermometer: ${temp}°F`)
            .setImage(cli)
            .addField("Humidity", `:droplet:${humidity}%\n**Climate Condition**`)
            
            message.channel.send(embed);
        }
    })
  }
  module.exports.help = {
      name:"weather",
      desc:"Weather Information",
      aliases:"w"
  }