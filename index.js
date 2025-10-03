// DOM
const keys = document.querySelectorAll(".piano-key");
const butt = document.querySelector("button");

// Visualising audio and video
const press_key = (n, show_on_screen = true) => {
  if (show_on_screen) keys[n - 1].className = "piano-key active-key";
  const sound = new Audio("http://localhost:5000/play_note/" + String(n));
  sound.play();
  const on_audio_end = () => {
    sound.removeEventListener("ended", on_audio_end);
    release_key(n);
  };
  sound.addEventListener("ended", on_audio_end);
};

let keys_to_guess = [];
const press_random_key = (
  amount_of_presses,
  show_on_screen = true,
  keys_to_press = []
) => {
  if (amount_of_presses === 0) {
    butt.disabled = false;
    console.log(keys_to_guess);
    butt.innerText = "Listen again";
    return;
  }

  let current_note = Math.round(Math.random() * 7);
  if (keys_to_press.length > 0) current_note = keys_to_press[0] - 1;
  if (show_on_screen) keys[current_note].className = "piano-key active-key";
  const sound = new Audio(
    "http://localhost:5000/play_note/" + String(current_note + 1)
  );
  sound.play();

  const on_audio_end = () => {
    sound.removeEventListener("ended", on_audio_end);
    release_key(current_note + 1);
    press_random_key(
      amount_of_presses - 1,
      show_on_screen,
      keys_to_press.slice(1)
    );
  };
  if (keys_to_press.length === 0)
    keys_to_guess = keys_to_guess.concat([current_note + 1]);
  sound.addEventListener("ended", on_audio_end);
};

const release_key = (n) => {
  keys[n - 1].className = "piano-key";
};

// Game
let player_pressed = [];
let current_note_amount = 2;
const start_game = () => {
  butt.disabled = true;
  butt.innerText = "Listen!";
  player_pressed = [];
  current_note_amount += 1;
  keys_to_guess = [];
  press_random_key(current_note_amount);
};

const check_pressed = () => {
  let i = 0;
  for (; i < player_pressed.length && i < keys_to_guess.length; i++) {
    if (player_pressed[i] !== keys_to_guess[i]) {
      player_pressed = player_pressed.slice(1);
      i = -1;
    }
  }
  if (i === current_note_amount) {
    butt.innerText = "You guessed! Listen next";
  }
};

// Global listeners
keys.forEach((elem, ind) => {
  elem.addEventListener("click", () => {
    player_pressed = player_pressed.concat([ind + 1]);
    if (!butt.disabled) press_key(ind + 1);
    check_pressed();
  });
});

const handle_button_click = () => {
  switch (butt.innerText) {
    case "Start game":
    case "You guessed! Listen next":
      start_game();
      break;
    case "Listen again":
      press_random_key(keys_to_guess.length, true, keys_to_guess);
      butt.innerText = "Listen!";
      break;
  }
};

butt.addEventListener("click", handle_button_click);
