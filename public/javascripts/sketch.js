var scketch = function(p){

  var particleNum = 0;
  var particle;
  var particles = [];
  var sentPos = p.createVector(p.windowWidth/2, p.windowHeight/2);

  socket.on('setPos',function(pos){
    sentPos = p.createVector(pos.mx,pos.my);
  });

  var rd = p.random(30,130);
  var rr = p.random(255);
  var rg = p.random(255);
  var rb = p.random(255);


  var Particle = function(pos,v,d){
    this.p = pos;
    this.v = v;
    this.a = p.createVector(0,0);
    this.d = d;
    this.r = d/2;
    this.mass = this.r/100;
    this.lifespan = 100;
    this.col_r = p.floor(p.random(rr));
    this.col_g = p.floor(p.random(rg));
    this.col_b = p.floor(p.random(rb));
    this.col_a = 0.6;
  }
  Particle.prototype.addForce = function(f){
    this.a.add(f);
    this.a.div(this.mass);
  }
  Particle.prototype.update = function(){
    this.v.add(this.a);
    this.p.add(this.v);
    this.lifespan -= 2;
    this.col_a -= 0.014;
    this.a.mult(0);
  }
  Particle.prototype.draw = function(){
    p.noStroke();
    //gradation
    var grad  = p.drawingContext.createRadialGradient(this.p.x,this.p.y,0,this.p.x,this.p.y,this.r);
    grad.addColorStop(0,'rgba(' + this.col_r + ',' + this.col_g + ',' + this.col_b + ','+ this.col_a +')');
    grad.addColorStop(1,'rgba(0, 0, 0, 0)');
    p.drawingContext.fillStyle = grad;
    p.ellipse(this.p.x,this.p.y,this.d,this.d);
  }
  Particle.prototype.isLive = function(){
    if(this.lifespan<=0){
      return false;
    }else{
      return true;
    }
  }


  /*--
    p5 framwork
  ------------------------------------*/
  p.setup = function(){
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.blendMode(p.ADD);
    p.background(0);
  }

  p.draw = function(){
    p.clear();
    p.background(0);

    //add particle
    for(var i=0; i<3; i++){
      var vec = p.createVector(p.randomGaussian()*4,p.randomGaussian(1,3));
      particle = new Particle(sentPos.copy(),vec,rd);
      particles.push(particle);
    }

    //move upward as smoke
    for(var i = particles.length-1; i>=0; i--){
      var toMouse = p5.Vector.sub(sentPos.copy(),particles[i].p);
      toMouse.normalize();
      toMouse.mult(0.5);
      var force = p.createVector(toMouse.x,-0.3);

      particles[i].addForce(force);
      particles[i].update();
      particles[i].draw();

      if(!particles[i].isLive()){
        particles.splice(i,1);
      }

    }

  }

  p.mousePressed = function() {
  };

  p.mouseMoved = function() {
    var pos = {mx:p.mouseX,my:p.mouseY};
    socket.emit('getPos',pos);
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }


}

new p5(scketch);
