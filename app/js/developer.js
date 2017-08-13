//Initialize variable
var api_data;
var recently_watched_videos = [];

//COnvert Image intoBase64 for Image Caching
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


//ORIGINAL DATA FROM DEMO MOCK API
function showOriginalData() {
    $(".loader").show();
    $("#current_heading").empty();
    $(".vid_cont").empty();

    // GET METHOD TO RECIEVE DATA
    $.get("https://demo2697834.mockable.io/movies",
        function(data, status) {
            $(".loader").hide();
            if (status === 'success') {
                api_data = data;
                $("#current_heading").html("<h3>New Videos</h3>");

                //ITERATIONS TO MAKE HTML
                $.each(data.entries, function(index, value) {

                    // CACHING IMAGES FOR FUTURE USE
                    // currentImage = value.images[0].url;
                    // currentImageData = getBase64Image(currentImage);
                    // localStorage.setItem("currentImageData_" + index, currentImageData);

                    //HTML CONTENT WITH VIDEO DATA
                    var div_content = '' +
                        '<div class="inner-cont">' +
                        '<a href="#"   onclick=\'openVideoFullScreen("' + value.title + '","' + value.images[0].url + '","' + value.contents[0].url + '")\'>' +
                        '<img src="' + value.images[0].url + '" alt="' + value.title + '"></a>' +
                        '<br /><span>' + value.title + '</span>' +
                        '</div>' +
                        '';
                    $(".vid_cont").append(div_content);

                });
            }
        });
}

//EXIT FULL SCREEN VIEW OF VIDEO AND STOP VIDEO
$('video#video_player_container').bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';
    // Now do something interesting
    if (event == "FullscreenOff") {
        var videoElement = document.getElementById("video_player_container");
        videoElement.load();
    }
});

//FUNCTION TO SHOW ALREADY WATHED VIDEOS 
// VIDEOS ARE ACCORDING TO LATEST VIEW OF VIDEOS
function showWatchedData() {
    $(".loader").show();
    $("#current_heading").empty();
    $(".vid_cont").empty();
    all_watched_videos = JSON.parse(localStorage.getItem('watchedVideosArray'));
    setTimeout(function() {
        $(".loader").hide();

        var keys = Object.keys(all_watched_videos).reverse();
        $("#current_heading").html("<h3>Watched Videos</h3>");
        for (i = 0; i < keys.length; i++) {

            var div_content_watched = '' +
                '<div class="inner-cont">' +
                '<a href="#"   onclick=\'openVideoFullScreen("' + all_watched_videos[keys[i]].title + '","' + all_watched_videos[keys[i]].image + '","' + all_watched_videos[keys[i]].video + '")\'>' +
                '<img src="' + all_watched_videos[keys[i]].image + '" alt="' + all_watched_videos[keys[i]].title + '"></a>' +
                '<br /><span>' + all_watched_videos[keys[i]].title + '</span>' +
                '</div>' +
                '';
            $(".vid_cont").append(div_content_watched);
        }
    }, 2000);
}

//ADD WATCHED VIDEOS TO ARRAY
// AND SAVE AND UPDATE ARRAY IN LOCAL STORAGE
function pushVideosToWatchedList(title_content, image_url, video_url) {
    recently_watched_videos.push({ title: title_content, image: image_url, video: video_url });
    localStorage.setItem('watchedVideosArray', JSON.stringify(recently_watched_videos));
}

//SEE IF VIDEO ALREADY EXIST IN JSON OR NOT
// IN NOT ADD TO JSON
// IF ALREADY EXIST UPDATE ITS INDEX 
function checkWatchedVideos(title_content, image_url, video_url) {
    recently_watched_videos = JSON.parse(localStorage.getItem('watchedVideosArray'));

    if (recently_watched_videos.length == 0) {
        // ADD FIRST VIDEO TO JSON
        pushVideosToWatchedList(title_content, image_url, video_url);
    } else {
        // ADD MORE VIDEO TO JSON
        var isExistInWatched = false;
        var watchedVideoIndex = 0;
        $.each(recently_watched_videos, function(ind, obj_val) {
            watchedVideoIndex = ind + 1;
            if (obj_val.title === title_content && obj_val.image === image_url && obj_val.video === video_url) {
                isExistInWatched = true;
                console.log("Index number = " + ind);
                recently_watched_videos.splice(ind, 1);
            }
            if (recently_watched_videos.length === watchedVideoIndex) {
                pushVideosToWatchedList(title_content, image_url, video_url);
            }
        });
    }
}

//OPEN AND PLAY VIDEO FULL SCREEN
function openVideoFullScreen(title_content, image_url, video_url) {
    checkWatchedVideos(title_content, image_url, video_url);
    $("#video_player_container").html('<source src="' + video_url + '" type="video/mp4"></source>');

    //OPEN VIDEO ON PRESSING ENTER KEY
    document.addEventListener("keydown", function(e) {
        if (e.keyCode == 13) {
            toggleFullScreen();
        }
    }, false);

    //GET VIDEO ELEMENT CONTAINER TO PLAY VIDEO
    var videoElement = document.getElementById("video_player_container");

    //FULL SCREEN VIEW FUNCTION
    function toggleFullScreen() {
        videoElement.load();
        videoElement.play();

        if (!document.mozFullScreen && !document.webkitFullScreen) {
            if (videoElement.mozRequestFullScreen) {
                videoElement.mozRequestFullScreen();
            } else {
                videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else {
                document.webkitCancelFullScreen();
            }
        }
    }

    //FULL SCREEN PREVIEW
    toggleFullScreen();

}

//CALL FUNCTION ON PAGE LOAD
showOriginalData();