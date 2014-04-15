$(function(){
    var x_size = 70; //40
    var y_size = 10; //10
    
    var width = $('#mainDiv').innerWidth();
    var height = $('#mainDiv').innerHeight();
    var horizon = 2*height/3;
    
    window.grid = new ParticleGrid(0, horizon, width, height-horizon, x_size, y_size);
    window.stone = new Particle(width/2, height/6);
    window.stone.vy = 30.0;
    window.canvas = new Canvas('mainCanvas', x_size, y_size);
    
    window.canvas.size(width, height);
    window.canvas.set_horizon(horizon);
    window.canvas.set_color_scheme('dark');

    window.engine = new Engine();
    window.engine.start();

});
