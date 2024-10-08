// Light/Dark Theme Toggle 
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-button");
    const captionTexts = document.getElementsByClassName("popup");
    const jumpLink = document.getElementById("jump-link");
    const animatedLines = document.getElementsByClassName("line");
    const nationButtons = document.getElementsByClassName("nation-btn");
    

    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (jumpLink) jumpLink.classList.add('dark-mode-jump');
            for (let text of captionTexts) {
                if (text) text.classList.add('dark-mode-text');
            }
            for (let line of animatedLines){
                if (line) line.classList.add('dark-mode-line');
            }
            for (let btn of nationButtons) {
                if (btn) btn.classList.add('dark-mode-nation-btn')
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (jumpLink) jumpLink.classList.remove('dark-mode-jump');
            for (let text of captionTexts) {
                if (text) text.classList.remove('dark-mode-text');
            }
            for (let line of animatedLines){
                if (line) line.classList.remove('dark-mode-line');
            }
            for (let btn of nationButtons) {
                if (btn) btn.classList.remove('dark-mode-nation-btn')
            }
        }
    }

    // Check the saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Add event listener to the toggle button
    toggleButton.addEventListener("click", () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Image Animation
    anime({
        targets: '#animated-img',
        opacity: [0, 1],
        scale: [1, 1],
        easing: 'easeInOutQuad',
        duration: 600,
        delay: 3000 // Delay to start after the text animation
    });


    // Title Animation

    // Wrap every letter in a span
    let textWrapper = document.querySelector('#title .letters');
    if (textWrapper){
        textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
    }

    // Apply the animation to the letters and lines
    anime.timeline({loop: false})
        .add({
            targets: '#title .line',
            scaleX: [0, 1],
            opacity: [0.5, 1],
            easing: "easeInOutExpo",
            duration: 700
        }).add({
            targets: '#title .letter',
            translateY: ["1.1em", 0],
            translateZ: 0,
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 1400,
            offset: '-=775',
            delay: (el, i) => 50 * i
        }).add({
            targets: '#title .line',
            scaleX: [1, 0],
            opacity: [1, 0.5],
            easing: "easeInOutExpo",
            duration: 700,
            offset: '-=1250'
        })

    // Bounce animation for the icons
    anime({
        targets: '#comic-pic, #yt-pic, #avatar-studios-pic',
        translateY: [
            { value: -10, duration: 500 },
            { value: 0, duration: 500 }
        ],
        easing: 'easeInOutQuad',
        loop: true,
        delay: anime.stagger(500) // stagger the animation for each image
    });
});