var data = 	[
    		{
        		value: 20,
        		color:"#637b85"
    		},
    		{
       		 	value : 30,
       		 	color : "#2c9c69"
   		 	},
    		{
        		value : 40,
        		color : "#dbba34"
    		},
    		{
        		value : 10,
        		color : "#c62f29"
    		},
            {
                value : 3,
                color : "#c62f78"
            }
			];
var canvas = document.getElementById("myChart");
var ctx = canvas.getContext("2d");
new Chart(ctx).Doughnut(data);