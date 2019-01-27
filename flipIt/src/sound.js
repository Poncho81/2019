export default class Sound {
  constructor(sndList) {
    this.sounds = new Array(sndList.length);
    this.muted = false;

    sndList.forEach((src, i) => {
      const snd = new Audio(src);
      snd.setAttribute("preload", "auto");
      snd.setAttribute("controls", "none");
      snd.style.display = "none";
      document.body.appendChild(snd);
      this.sounds[i] = snd;
    });
  }

  playLoop(snd) {
    this.sounds[snd].addEventListener("ended", (e) => {
      e.srcElement.currentTime = 0;
      e.srcElement.play();
    }, false);
    this.play(snd);
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