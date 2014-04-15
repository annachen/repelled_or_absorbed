
var Engine = function(){
    var self = this;  
    self.current_time = 0;
    self.interval_id = null;

    self.timestep = function(){
        // clear canvas
        window.canvas.timestep();

        // calculate next positions
        particles = window.grid.grid;
        for (var i=0; i<particles.length; i++) {
            var p = particles[i];
            p.calculate_replacement();
        }
        window.stone.calculate_replacement();

        // draw particles
        for (var i=0; i<particles.length; i++) {
            var p = particles[i];
            p.timestep();
            window.canvas.draw_particle(p.x, p.y);           
        }
        window.stone.timestep();
        window.canvas.draw_particle(window.stone.x, window.stone.y);

        // increase time (for god's sake)
        self.current_time += 1;
        console.log(self.current_time);
           
        // end of the world
        if (self.current_time == 300){
            window.clearInterval(self.interval_id);
        }

        // debugging
        console.log(window.stone.vy);
    };

    self.start = function(){
        self.interval_id = setInterval(self.timestep, 30)
    };
}

var ParticleGrid = function(x_offset, y_offset, width, height, x_size, y_size){

    var self = this;

    self.x_offset = x_offset;
    self.y_offset = y_offset;
    self.width = width;
    self.height = height;
    self.x_size = x_size; // number of particles horizontally
    self.y_size = y_size; // number of particles vertically

    self.x_unit = self.width / self.x_size;
    self.y_unit = self.height / self.y_size;

    // declare all the particles in the grid
    self.grid = new Array();
    var temp_grid = {};

    var x = -1.0;
    var y = -1.0;
    for (var i=0; i<x_size*y_size; i++){
        x += 1.0;
        if (i%x_size == 0) {
            x = 0.0;
            y += 1.0;
        }
        var cx = x * self.x_unit + self.x_unit / 2.0 + x_offset;
        var cy = y * self.y_unit + y_offset;
        var p = new Particle(cx, cy);
        self.grid.push(p);
        temp_grid[x.toString()+' '+y.toString()] = p;
    }

    // set neighbors for all particles
    var x_dir = [-1, 0, 1, 1, 1, 0, -1, -1];
    var y_dir = [-1, -1, -1, 0, 1, 1, 1, 0];

    x = -1.0;
    y = -1.0;
    for (var i=0; i<x_size*y_size; i++){
        x += 1.0;
        if (i%x_size == 0) {
            x = 0.0;
            y += 1.0;
        }
        var p = temp_grid[x.toString()+' '+y.toString()];
        for (var k=0; k<8; k++) {
            var new_x = x + x_dir[k];
            var new_y = y + y_dir[k];
            if (0 <= new_x && new_x < x_size && 0 <= new_y && new_y < y_size){
                var neighbor = temp_grid[new_x.toString()+' '+new_y.toString()];
                p.add_neighbor(neighbor);
            }
        }
        
    }

}

const VELOCITY_DISCOUNT = 0.98;
const DIST_THRESHOLD = 15.0;
const G = 0.0;

var Particle = function(x, y){

    var self = this;

    self.x = x;
    self.y = y;
    self.vx = 0.0;
    self.vy = 0.0;

    self.delta_x = 0.0;
    self.delta_y = 0.0;
    
    self.neighbors = new Array();

    self.add_neighbor = function(neighbor){
        self.neighbors.push(neighbor);
    };

    self.calculate_replacement = function(){
        var vx = self.vx;
        var vy = self.vy + G;
        for (var i=0; i<self.neighbors.length; i++) {
            var x_n = self.neighbors[i].x;
            var y_n = self.neighbors[i].y;
            var vx_n = self.neighbors[i].vx;
            var vy_n = self.neighbors[i].vy;
            if (dist(self.x, self.y, x_n, y_n) < DIST_THRESHOLD){
                vx += vx_n - self.vx;
                vy += vy_n - self.vy;
                self.neighbors[i].vx -= self.vx - vx_n;
                self.neighbors[i].vy -= self.vy - vy_n;
            }
        }
        self.delta_x = vx;
        self.delta_y = vy;
    };

    self.timestep = function(){
        self.x += self.delta_x;
        self.y += self.delta_y;
        self.vx *= VELOCITY_DISCOUNT;
        self.vy *= VELOCITY_DISCOUNT;

        // special case for the stone
        if(self != window.stone && dist(self.x, self.y, window.stone.x, window.stone.y) < DIST_THRESHOLD){
            debugger
            window.stone.add_neighbor(self);
        }
    };
};

function dist(x1, y1, x2, y2){
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
