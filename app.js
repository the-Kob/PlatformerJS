//import platform from "./images/platform.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const GRAVITY = 0.25;
const JUMP_HEIGHT = 15;
const BASE_X_VEL = 2.5;

const keys = {
  up: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
};

let aspect = canvas.width / canvas.height;

let groundLevel;

class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 200;
    this.height = 20;
  }

  draw() {
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
  }
}

class Ground extends Platform {
  constructor({ x, y }) {
    super({ x, y });
  }

  update() {
    this.position.x = 0;
    this.position.y = groundLevel;
    this.width = canvas.width;
    this.draw();
  }
}

const ground = new Ground({ x: 0, y: 0 });

const platforms = [
  new Platform({
    x: 200,
    y: 700,
  }),
  new Platform({
    x: 600,
    y: 500,
  }),
];

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 600,
    };
    this.width = 30;
    this.height = 30;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
    this.grounded = false;
  }

  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.bottom = this.position.y + this.height;
    this.left = this.position.x;
    this.right = this.position.x + this.width;

    // Falling handler
    if (this.bottom + this.velocity.y <= ground.position.y) {
      this.velocity.y += GRAVITY;
    } else {
      if (this.grounded && keys.up.pressed) {
        /* Enables continuous jumping on the platform*/ this.grounded = false;
        this.velocity.y -= JUMP_HEIGHT;
      } else {
        this.grounded = true;
        this.velocity.y = 0;
      }
    }
  }
}

const player = new Player();

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.onkeydown = function (event) {
  switch (event.keyCode) {
    case 87: // W
      keys.up.pressed = true;
      break;
    case 65: // A
      keys.left.pressed = true;
      break;
    case 68: // D
      keys.right.pressed = true;
      break;
  }
};

document.onkeyup = function (event) {
  switch (event.keyCode) {
    case 87: // W
      keys.up.pressed = false;
      break;
    case 65: // A
      keys.left.pressed = false;
      break;
    case 68: // D
      keys.right.pressed = false;
      break;
  }
};

window.requestAnimationFrame(animate);

function resizeCanvas(event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  aspect = canvas.width / canvas.height;
  groundLevel = canvas.height / 1.25;
}

function animate() {
  window.requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  ground.update();
  platforms.forEach((platform) => {
    platform.update();
  });

  player.update();
  if (keys.left.pressed && player.left > 0) {
    /* Left mov handler */ player.velocity.x = -BASE_X_VEL;
  } else if (keys.right.pressed && player.right < canvas.width) {
    /* Right mov handler */ player.velocity.x = BASE_X_VEL;
  } else {
    player.velocity.x = 0;
  }

  // Platform collision detection
  platforms.forEach((platform) => {
    if (
      player.bottom <= platform.position.y &&
      player.bottom + player.velocity.y >= platform.position.y &&
      player.right >= platform.position.x &&
      player.left <= platform.position.x + platform.width
    ) {
      player.grounded = true;
      player.velocity.y = 0;
    } else if (player.grounded && keys.up.pressed) {
      /* Enables continuous jumping on the platform*/ player.grounded = false;
      player.velocity.y -= JUMP_HEIGHT;
    }
  });
}
