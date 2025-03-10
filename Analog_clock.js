function Analog_clock(canvas_element) {
    this.canvas_elem = canvas_element;
    this.canvas = this.canvas_elem.getContext("2d");
    this.radius = 0;
    this.time;
}

Analog_clock.prototype.draw_analog = function (level) {
    var width = this.canvas_elem.height = this.canvas_elem.width = this.canvas_elem.clientWidth;
    this.radius = width / 2;
    this.canvas.translate(this.radius, this.radius);
    this.draw_face();
    switch (parseInt(level)) {
        case 1:
            this.draw_hr_nums();
            this.draw_hr_ticks();
            this.draw_minor_nums();
            this.draw_min_ticks();
            break;
        case 2:
            this.draw_hr_nums();
            this.draw_hr_ticks();
            this.draw_major_nums();
            this.draw_min_ticks();
            break;
        case 3:
            this.draw_hr_nums();
            this.draw_hr_ticks();
            this.draw_min_ticks();
            break;
        case 4:
            this.draw_hr_ticks();
            this.draw_min_ticks();
            break;
        case 5:
            this.draw_hr_ticks();
            break;
        default:
            this.draw_hr_nums();
            this.draw_hr_ticks();
            this.draw_minor_nums();
            this.draw_min_ticks();
            break;
    }
    this.draw_hands();
};

Analog_clock.prototype.draw_face = function() {
    this.canvas.beginPath();
    this.canvas.arc(0, 0, this.radius, 0, 2 * Math.PI);
    this.canvas.fillStyle = "cyan";
    this.canvas.fill();
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.arc(0, 0, this.radius * 0.84, 0, 2 * Math.PI);
    this.canvas.fillStyle = "#F1F1F1";
    this.canvas.fill();
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.arc(0, 0, 2 * this.radius * 0.01, 0, 2 * Math.PI);
    this.canvas.fillStyle = "#222827";
    this.canvas.fill();
    this.canvas.stroke();
};

Analog_clock.prototype.draw_hr_nums = function() {
    var radian;
    this.canvas.textAlign = "center";
    this.canvas.textBaseline = "middle";
    this.canvas.font = "1.2em 'Comic Sans MS', sans-serif";
    for (var i = 1; i < 13; i++) {
        radian = Math.PI * (i / 6 - 1 / 2);
        this.canvas.fillText(i.toString(), this.radius * 0.67 * Math.cos(radian), this.radius * 0.67 * Math.sin(radian));
    }
};

Analog_clock.prototype.draw_major_nums = function() {
    this.canvas.textAlign = "center";
    this.canvas.textBaseline = "middle";
    this.canvas.fillStyle = "black";
    this.canvas.font = "bold 0.9em 'Comic Sans MS', sans-serif";
    for (var i = 0; i < 12; i++) {
        radian = Math.PI * (i / 6 - 1 / 2);
        this.canvas.fillText((i * 5).toString(), this.radius * 0.92 * Math.cos(radian), this.radius * 0.92 * Math.sin(radian));
    }
}

Analog_clock.prototype.draw_minor_nums = function() {
    this.canvas.textAlign = "center";
    this.canvas.textBaseline = "middle";
    this.canvas.fillStyle = "black";
    this.canvas.font = "bold 0.7em 'Comic Sans MS', sans-serif";
    for (var i = 0; i < 60; i++) {
        radian = Math.PI * (i / 30 - 1 / 2);
        this.canvas.fillText((i).toString(), this.radius * 0.92 * Math.cos(radian), this.radius * 0.92 * Math.sin(radian));
    }
}

Analog_clock.prototype.draw_hr_ticks = function() {
    this.canvas.lineWidth = 4;
    for (var i = 1; i < 13; i++) {
        radian = i * Math.PI / 6 - Math.PI / 2;
        this.canvas.beginPath();
        this.canvas.moveTo(this.radius * 0.76 * Math.cos(radian), this.radius * 0.76 * Math.sin(radian));
        this.canvas.lineTo(this.radius * 0.835 * Math.cos(radian), this.radius * 0.835 * Math.sin(radian));
        this.canvas.stroke();
    }
}

Analog_clock.prototype.draw_min_ticks = function() {
    this.canvas.lineWidth = 2;
    for (var i = 1; i < 60; i++) {
        radian = i * Math.PI / 30 - Math.PI / 2;
        this.canvas.beginPath();
        this.canvas.moveTo(this.radius * 0.8 * Math.cos(radian), this.radius * 0.8 * Math.sin(radian));
        this.canvas.lineTo(this.radius * 0.835 * Math.cos(radian), this.radius * 0.835 * Math.sin(radian));
        this.canvas.stroke();
    }
}

Analog_clock.prototype.draw_hands = function() {
    if (!this.time) {
        return;
    }
    var radian, x, y;
    var hr = this.time.getHours();
    var min = this.time.getMinutes();

    this.canvas.beginPath();
    this.canvas.lineCap = "round";
    this.canvas.lineWidth = 8;
    this.canvas.moveTo(0, 0);
    radian = Math.PI * (hr / 6 + min / 360 - 1 / 2);
    x = this.radius * 0.55 * Math.cos(radian);
    y = this.radius * 0.55 * Math.sin(radian);
    this.canvas.lineTo(x, y);
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.lineWidth = 4;
    this.canvas.moveTo(0, 0);
    radian = Math.PI * (min / 30 - 1 / 2);
    this.canvas.lineTo(this.radius * 0.7 * Math.cos(radian), this.radius * 0.7 * Math.sin(radian));
    this.canvas.stroke();
}

Analog_clock.prototype.random_time = function(level) {
    var min;
    switch (level) {
        case 1:
            min = 0;
            break;
        case 2:
            min = 30 * rand(0, 1);
            break;
        case 3:
            min = 15 * rand(0, 3);
            break;
        case 4:
            min = 5 * rand(0, 11);
            break;
        default:
            min = rand(0, 59);
            break;
    }
    this.time = new Date(2000, 1, 1, rand(1, 12), min);
    this.draw_analog(this.time);
}

function rand(min, max) {
    return Math.floor((Math.random() + new Date().getTime() % 1) * (max - min + 1) + min);
}
