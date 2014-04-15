
var Canvas = function(id, x_size, y_size){
    var self = this;
    
    self.id = id;
    self.ctx = $('#'+self.id)[0].getContext('2d');
    self.width = -1;
    self.height = -1;
    self.horizon = -1;

    self.x_size = x_size;
    self.y_size = y_size;
    
    self.x_unit = -1;
    self.y_unit = -1;

    self.scheme = 'default';
    self.bg_color = '';
    self.stroke_color = '';

    self.size = function(width, height){
        self.width = width;
        self.height = height;
        $('#'+self.id).attr('width', self.width);
        $('#'+self.id).attr('height', self.height);
        self.update_settings();
    };

    self.set_horizon = function(y){
        self.horizon = y;
        self.update_settings();
    };

    self.update_settings = function(){
        self.x_unit = self.width / self.x_size;
        self.y_unit = (self.height - self.horizon) / self.y_size;
    };

    self.draw_particle = function(x, y){
        self.ctx.beginPath();
        self.ctx.arc(x, y, 10, 0, 2 * Math.PI);
        self.ctx.strokeStyle = self.stroke_color;
        self.ctx.stroke();
    };

    self.set_color_scheme = function(scheme_name){
        if (scheme_name == 'dark'){
            $('#'+self.id).css('background-color', 'rgba(0, 0, 0, 0.8)');
            self.stroke_color = '#999999';
        }
    };

    self.timestep = function(){
        self.ctx.clearRect(0, 0, self.width, self.height);
    };
};

