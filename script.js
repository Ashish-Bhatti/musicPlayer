let song = [
    {
        singerName: 'Afusic, Talwiinder',
        songName: 'Pal Pal 💖',
        url: './songs/palpal.mp3',
        img: './img/palpal.jpg',
    },
    {
        singerName: 'Garry Sandhu, Jasmine Sandlas',
        songName: 'Illegal Weapon 🔥',
        url: './songs/illegalWeapon.mp3',
        img: './img/illegalWeapon.jpg',
    },
    {
        singerName: 'Akhil',
        songName: 'Khaab 🌙',
        url: './songs/khaab.mp3',

        img: './img/khaab.jpg',
    },
    {
        singerName: 'Yo Yo Honey Singh',
        songName: 'Lalapari 🔥',
        url: './songs/lalapari.mp3',
        img: './img/lalapari.jpg',
    },
    {
        singerName: 'Coke Studio',
        songName: 'Pasoori 🎵',
        url: './songs/pasoori.mp3',
        img: './img/pasoori.jpg',
    },
    {
        singerName: 'Bintu Pabra',
        songName: 'Roots 🌳',
        url: './songs/root.mp3',
        img: './img/roots.jpg',
    },
    {
        singerName: 'Aditya Rikhari',
        songName: 'Sahiba 💖',
        url: './songs/sahiba.mp3',
        img: './img/sahiba.jpg',
    },
    {
        singerName: 'Hasan Raheem & Talwiinder',
        songName: 'Wishes',
        url: './songs/wishes.mp3',
        img: './img/wishes.jpg',
    },
];
let songsArray = song.map((item) => {
    let songsPath = item.url;
    return new Audio(songsPath);
});

let playSong = document.querySelector('#play');
let prevSong = document.querySelector('#prev');
let nextSong = document.querySelector('#next');
let circle = document.querySelector('.circle');
let songName = document.querySelector('.title h1');
let singerName = document.querySelector('.title h3');
let intialTime = document.querySelector('#intialTime');
let finalTime = document.querySelector('#finalTime');
let songBar = document.querySelector('#songBar');

circle.style.backgroundImage = `url(${song[0].img})`;
songName.innerHTML = `${song[0].songName}`;
singerName.innerHTML = `${song[0].singerName}`;
// first song's time update on first render
songsArray[0].addEventListener(
    'loadedmetadata',
    () => {
        finalTime.innerHTML = songTime(0);
    },
    { once: true }
);

let currentSong = 0; // song index
let songStatus = 'play'; // song status
let isAnimating = false; // rotate circle
let rotation = 0;

// roate inside circle
function rotateCircle() {
    if (!isAnimating) return;
    rotation = songsArray[currentSong].currentTime * 30;
    circle.style.transform = `rotate(${rotation}deg)`;
    requestAnimationFrame(rotateCircle); // it's for frame by frame roation
}
requestAnimationFrame(rotateCircle); // next/prev roation fix - window function

// dom update
function domUpdate() {
    circle.style.backgroundImage = `url(${song[currentSong].img})`;
    songName.innerHTML = `${song[currentSong].songName}`;
    singerName.innerHTML = `${song[currentSong].singerName}`;
    finalTime.innerHTML = songTime(currentSong);
}

// enable/disable prev button
function prevAction() {
    if (currentSong == 0) {
        prevSong.style.pointerEvents = 'none';
        prevSong.style.opacity = 0.5;
    } else {
        prevSong.style.pointerEvents = 'auto';
        prevSong.style.opacity = 1;
    }
}

// enable/disable next button
function nextAction() {
    if (currentSong == song.length - 1) {
        nextSong.style.pointerEvents = 'none';
        nextSong.style.opacity = 0.5;
    } else {
        nextSong.style.pointerEvents = 'auto';
        nextSong.style.opacity = 1;
    }
}

// play/pause/next/prev song
function songAction() {
    // play/pause
    playSong.addEventListener('click', () => {
        if (songStatus == 'play') {
            songsArray[currentSong].play();
            playSong.innerHTML = '<i class="ri-pause-fill"></i>';
            songStatus = 'pause';

            isAnimating = true;
            rotateCircle();
        } else {
            songsArray[currentSong].pause();
            playSong.innerHTML = '<i class="ri-play-fill"></i>';
            songStatus = 'play';

            isAnimating = false;
        }
    });

    // next song
    nextSong.addEventListener('click', () => {
        playSong.innerHTML = '<i class="ri-pause-fill"></i>';

        songStatus = 'pause';
        songsArray[currentSong].pause();
        currentSong++;
        songsArray[currentSong].currentTime = 0;
        songsArray[currentSong].play();

        isAnimating = true;
        rotateCircle();

        prevAction();
        nextAction();
        domUpdate();
        currentTime();
        setSongBarMax();
    });

    // prev song
    prevSong.addEventListener('click', () => {
        playSong.innerHTML = '<i class="ri-pause-fill"></i>';
        songStatus = 'pause';
        songsArray[currentSong].pause();
        currentSong--;
        songsArray[currentSong].currentTime = 0;
        songsArray[currentSong].play();

        isAnimating = true;
        rotateCircle();

        prevAction();
        nextAction();
        domUpdate();
        currentTime();
        setSongBarMax();
    });
}

// time calculate in min-sec
function timeCal(time) {
    const min = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
    const sec = Math.floor(time % 60)
        .toString()
        .padStart(2, '0');
    return `${min}:${sec}`;
}

//  full song duration
function songTime() {
    let duration = songsArray[currentSong].duration;
    return timeCal(duration);
}

// update song current time
function currentTime() {
    songsArray[currentSong].addEventListener('timeupdate', () => {
        let currentTime = songsArray[currentSong].currentTime;
        songBar.value = currentTime;

        intialTime.innerHTML = `${timeCal(currentTime)}`;

        // for custom bar color change
        const percent = (songBar.value / songBar.max) * 100;
        songBar.style.setProperty('--value', percent + '%');
    });
}
// set bar max
function setSongBarMax() {
    const audio = songsArray[currentSong];

    // If duration is ready, set immediately
    if (audio.duration > 0) {
        songBar.max = audio.duration;
    } else {
        // Otherwise wait for metadata once
        audio.addEventListener(
            'loadedmetadata',
            () => {
                songBar.max = audio.duration;
            },
            { once: true }
        );
    }
    // reset current value so bar doesn't show previous track's progress
    songBar.value = 0;
}

// track song on bar update
function songBarTrack() {
    songBar.addEventListener('input', () => {
        songsArray[currentSong].currentTime = songBar.value;

        // for custom bar color change
        const percent = (songBar.value / songBar.max) * 100;
        songBar.style.setProperty('--value', percent + '%');
    });
}

songAction();
prevAction();
setSongBarMax();
songBarTrack();
currentTime();
