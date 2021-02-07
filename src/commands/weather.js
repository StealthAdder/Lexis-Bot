module.exports.run = async (client,message,args,messageArray) => {

    const { MessageEmbed } = require('discord.js');
    const fetch = require('node-fetch');
    const embed = new MessageEmbed();
    const city = messageArray.slice(1).join(' ');

    const API_KEY = 'b6bc56974291c659a7565e5d91cb956b';

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
                        return ":night_with_stars:";
                    case "01d":
                        // clear sky
                        return ":sunny:";

                    case "02n":
                    case "02d":
                        // clouds
                        return ":cloud::cloud:";

                    case "03n":
                    case "03d":
                        // scattered clouds
                        return ":cloud::white_sun_small_cloud:";
                    
                    case "04n":
                    case "04d":
                        // broken clouds
                        return ":cloud::zap::cloud_rain:";

                    case "09n":
                    case "09d":
                        // shower rain
                        return ":white_sun_rain_cloud:";
                    
                    case "10n":
                    case "10d":
                        // rain
                        return ":cloud_rain:";

                    case "11n":
                    case "11d":
                        // thunderstorm
                        return ":thunder_cloud_rain:";

                    case "13n":
                    case "13d":
                        // snow
                        return ":cloud_snow::snowflake:";

                    case "50n":
                    case "50d":
                        // mist
                        return ":cloud:";

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
            .addField("Climate Condition", `${cli}`)
            .addField("Humidity", `:droplet:${humidity}%`);
            message.channel.send(embed);
        }
    })
  }
  module.exports.help = {
      name:"weather",
      desc:"Weather Information",
      aliases:"w"
  }