const THREE = require('three')

const LIGHT_GREEN = 0x00ff00

class Game {
  constructor(width, height) {
    this.counter = 1

    this.width = width
    this.height = height

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
    this.camera.rotation.y += Math.PI

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(width, height)
    document.body.appendChild(this.renderer.domElement)

    this.addHorizon()

    const self = this
    document.onkeydown = e => self._handleInput(self, e)
  }

  addHorizon() {
    // Horizon
    const horizonGeometry = new THREE.CircleGeometry(1000, 64)
    horizonGeometry.vertices.shift() // remove centre vertex
    horizonGeometry.rotateX(Math.PI / 2)

    const horizon = this._buildShape(horizonGeometry, 0, 0)
    this.scene.add(horizon)

    // Volcano
    this.addPyramid(0, 350, 500, 250)
  }

  addCube(x, z) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const cube = this._buildShape(geometry, x, z)
    cube.rotation.y += 2
    this.scene.add(cube)
    return cube
  }

  addPyramid(x, z, width = 1, height = 1) {
    const geometry = new THREE.Geometry()
    geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0.5, 1, 0.5))
    geometry.faces.push(
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(0, 3, 2),
      new THREE.Face3(1, 4, 0),
      new THREE.Face3(2, 4, 1),
      new THREE.Face3(3, 4, 2),
      new THREE.Face3(0, 4, 3))
    const transformation = new THREE.Matrix4().makeScale(width, height, width)
    geometry.applyMatrix(transformation)

    const pyramid = this._buildShape(geometry, x, z)
    pyramid.position.y = -0.5
    this.scene.add(pyramid)
    return pyramid
  }

  gameLoop(refreshRateMs = 50) {
    setInterval(() => {
      this._render()
    }, refreshRateMs)
  }

  _render() {
    //requestAnimationFrame(sender._render(sender))
    this.renderer.render(this.scene, this.camera)
  }

  _buildShape(geometry, x, z) {
    const edges = new THREE.EdgesGeometry(geometry)
    const material = new THREE.LineBasicMaterial({color: LIGHT_GREEN})
    const shape = new THREE.LineSegments(edges, material)
    shape.position.x = x
    shape.position.z = z
    return shape
  }

  _getPosVector(d, theta) {
    const hyp = d
    const opp = hyp * Math.sin(theta)
    const adj = hyp * Math.cos(theta)
    return new THREE.Vector2(opp, adj)
  }

  _handleInput(sender, e) {
    const theta = sender.camera.rotation.y - Math.PI
    const pos = sender._getPosVector(.1, theta)

    if (sender.counter % 10 == 0) {
      sender.counter = 1

      const theta2 = Math.random() * Math.PI * 2 + Math.PI
      const pos2 = sender._getPosVector(10, theta + theta2)
      const x2 = sender.camera.position.x + pos2.x
      const y2 = sender.camera.position.z + pos2.y

      const shape = Math.random()
      if (shape >= 0.5)
        sender.addCube(x2, y2)
      else
        sender.addPyramid(x2, y2)
    } else {
      sender.counter ++
    }

    switch(e.keyCode) {
      case 38: // up
        sender.camera.position.x += pos.x
        sender.camera.position.z += pos.y
        break
      case 40: // down
        sender.camera.position.x -= pos.x
        sender.camera.position.z -= pos.y
        break
      case 37: // left
        sender.camera.rotation.y += .1
        break
      case 39: // right
        sender.camera.rotation.y -= .1
        break
    }
    console.log(`x: ${sender.camera.position.x}, y: ${sender.camera.position.y}, z: ${sender.camera.position.z}`)
  }
}

window.Game = Game

