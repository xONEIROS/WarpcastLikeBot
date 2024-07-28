let hasLiked = false;

function clickPlanet() {
    if (!hasLiked) {
        var planets = document.getElementsByClassName("group flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-red");

        if (planets.length > 0) {
            for (let i = 0; i < planets.length; i++) {
                // بررسی می‌کنیم که کلاس text-faint وجود داشته باشد
                if (planets[i].classList.contains('text-faint')) {
                    planets[i].click();
                    planets[i].classList.remove('text-faint'); // حذف کلاس text-faint بعد از لایک کردن
                    hasLiked = true; // پس از لایک کردن، فلگ را به true تغییر دهید
                    break; // توقف بعد از لایک کردن اولین المان
                }
            }
        }
    }
}

clickPlanet();
