class Game {
  constructor(width, height) {
    this.LIGHT_GREEN = 0x00ff00;

    this.counter = 1;

    this.width = width;
    this.height = height;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    this.camera.position.z = -5;
    this.camera.rotation.y += Math.PI;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    /*var material = new THREE.LineBasicMaterial({ color: this.LIGHT_GREEN });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-2, 0, -3));
    geometry.vertices.push(new THREE.Vector3(0, 2, -3));
    geometry.vertices.push(new THREE.Vector3(2, 0, -3));
    var line = new THREE.Line(geometry, material);
    this.camera.add(line);*/

    var self = this;
    document.onkeydown = e => self._handleInput(self, e);
  }

  addCube(x, z) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var cube = this._buildShape(geometry, x, z);
    cube.rotation.y += 2;
    this.scene.add(cube);
    return cube;
  }

  addPyramid(x, z) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0.5, 1, 0.5));
    geometry.faces.push(
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(0, 3, 2),
      new THREE.Face3(1, 4, 0),
      new THREE.Face3(2, 4, 1),
      new THREE.Face3(3, 4, 2),
      new THREE.Face3(0, 4, 3));

    var pyramid = this._buildShape(geometry, x, z);
    pyramid.position.y = -0.5;
    this.scene.add(pyramid);
    return pyramid;
  }

  gameLoop(refreshRateMs = 50) {
    setInterval(() => {
      this._render();
    }, refreshRateMs);
  }

  _render() {
    //requestAnimationFrame(sender._render(sender));
    this.renderer.render(this.scene, this.camera);
  }

  _buildShape(geometry, x, z) {
    var edges = new THREE.EdgesGeometry(geometry);
    var material = new THREE.LineBasicMaterial({color: this.LIGHT_GREEN});
    var shape = new THREE.LineSegments(edges, material);
    shape.position.x = x;
    shape.position.z = z;
    return shape;
  }

  _getPosVector(d, theta) {
    var hyp = d;
    var opp = hyp * Math.sin(theta);
    var adj = hyp * Math.cos(theta);
    return new THREE.Vector2(opp, adj);
  }

  _handleInput(sender, e) {
    var theta = sender.camera.rotation.y - Math.PI;
    var pos = sender._getPosVector(.1, theta);

    if (sender.counter % 10 == 0) {
      sender.counter = 1;

      var theta2 = Math.random() * Math.PI * 2 + Math.PI;
      var pos2 = sender._getPosVector(10, theta + theta2);
      var x2 = sender.camera.position.x + pos2.x;
      var y2 = sender.camera.position.z + pos2.y;

      var shape = Math.random();
      if (shape >= 0.5)
        sender.addCube(x2, y2);
      else
        sender.addPyramid(x2, y2);
    } else {
      sender.counter ++;
    }

    switch(e.keyCode) {
      case 38: // up
        sender.camera.position.x += pos.x;
        sender.camera.position.z += pos.y;
        break;
      case 40: // down
        sender.camera.position.x -= pos.x;
        sender.camera.position.z -= pos.y;
        break;
      case 37: // left
        sender.camera.rotation.y += .1;
        break;
      case 39: // right
        sender.camera.rotation.y -= .1;
        break;
    }
  }
}
