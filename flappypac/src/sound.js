export default class Sound {
  constructor(sndList, v = 1) {
    this.sounds = new Array(sndList.length);
    this.muted = false;

    sndList.forEach((src, i) => {
      const snd = new Audio(src);
      snd.setAttribute("preload", "auto");
      snd.setAttribute("controls", "none");
      snd.style.display = "none";
      snd.volume = v;
      document.body.appendChild(snd);
      this.sounds[i] = snd;
    });

    this.listener = (e) => {
      e.srcElement.removeEventListener("ended", this.listener, false);
      const i = Math.floor(Math.random() * 9);
      if (Math.random() < .35) {
        let ii;
        do {
          ii = Math.floor(Math.random() * 9);
        } while (ii === i);
        this.play(ii);
      }
      this.playLoop(i);
    };
  }

  playLoop(snd) {
    this.sounds[snd].addEventListener("ended", this.listener, false);
    this.play(snd);
  }

  isPlaying(snd) {
    return !this.sounds[snd].paused
  }

  play(snd) {
    if (this.muted) return;

    const playPromise = this.sounds[snd].play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        this.sounds[snd].play();
      })
    }
  }

  stop(snd) {
    this.sounds[snd].pause();
    this.sounds[snd].currentTime = 0;
  }

  mute() {
    this.muted = !this.muted;
    return this.muted;
  }
}