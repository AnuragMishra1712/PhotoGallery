

var apigClient = apigClientFactory.newClient();
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition

function voiceSearch(){
    if ('SpeechRecognition' in window) {
        console.log("SpeechRecognition is Working");
    } else {
        console.log("SpeechRecognition is Not Working");
    }
    
    var inputSearchQuery = document.getElementById("search_query");
    const recognition = new window.SpeechRecognition();
    //recognition.continuous = true;

    micButton = document.getElementById("mic_search");  
    
    if (micButton.innerHTML == "mic") {
        recognition.start();
    } else if (micButton.innerHTML == "mic_off"){
        recognition.stop();
    }

    recognition.addEventListener("start", function() {
        micButton.innerHTML = "mic_off";
        console.log("Recording.....");
    });

    recognition.addEventListener("end", function() {
        console.log("Stopping recording.");
        micButton.innerHTML = "mic";
    });

    recognition.addEventListener("result", resultOfSpeechRecognition);
    function resultOfSpeechRecognition(event) {
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        inputSearchQuery.value = transcript;
        console.log("transcript : ", transcript)
    }
}




function textSearch() {
    var searchText = document.getElementById('search_query');
    if (!searchText.value) {
        alert('Please enter a valid text or voice input!');
    } else {
        searchText = searchText.value.trim().toLowerCase();
        console.log('Searching Photos....');
        searchPhotos(searchText);
    }
    
}

function searchPhotos(searchText) {

    console.log(searchText);
    document.getElementById('search_query').value = searchText;
    document.getElementById('photos_search_results').innerHTML = "<h4 style=\"text-align:center\">";

    var params = {
        'q' : searchText
    };
    
    apigClient.searchGet(params, {}, {})
        .then(function(result) {
            console.log("Result : ", result);

            image_paths = result["data"]["results"];
            console.log("image_paths : ", image_paths);

            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "";

            var n;
            for (n = 0; n < image_paths.length; n++) {
                images_list = image_paths[n]["url"].split('/');
                imageName = images_list[images_list.length - 1];
                photosDiv.innerHTML += '<figure class="inline-block"><img src="' + image_paths[n]["url"] + '" style="width:100%"><figcaption>' + imageName + '</figcaption></figure>';
            }
        }).catch(function(result) {
            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "Image not found!";
            console.log(result);
        });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if (encoded.length % 4 > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
}

function uploadPhoto() {
    var file = document.getElementById('uploaded_file').files[0];
    console.log(custom_labels.value);
    var file_data;
    var encoded_image = getBase64(file).then((data) => {
        console.log(data);
        var apigClient = apigClientFactory.newClient();

        var file_type = file.type + ';base64';
        //var file_type = file.type;

        console.log(file.type);

        var body = data;
        var params = {
        key: file.name,
            bucket: 'b2-photos-album',
            'Content-Type': file.type,
            'x-amz-meta-customLabels': custom_labels.value,
            Accept: 'image/*',
        };
        var additionalParams = {};
        apigClient
        .uploadBucketKeyPut(params, body, additionalParams)
        .then(function (res) {
            if (res.status == 200) {
            document.getElementById('uploadText').innerHTML =
                'Image Uploaded  !!!';
            document.getElementById('uploadText').style.display = 'block';
            }
      });
  });
}

function uploadPhoto() {
    let file = document.getElementById('uploaded_file').files[0];
    let file_name = file.name;
    let file_type = file.type;
    let reader = new FileReader();

    reader.onload = function() {
        let arrayBuffer = this.result;
        let blob = new Blob([new Int8Array(arrayBuffer)], {
            type: file_type
        });
        let blobUrl = URL.createObjectURL(blob);


        let data = document.getElementById('uploaded_file').files[0];
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                document.getElementById('uploadText').innerHTML ='Image Uploaded  !!!';
                document.getElementById('uploadText').style.display = 'block';
            }
        });
        xhr.withCredentials = false;
        xhr.open("PUT", "https://x3ld1f6tk1.execute-api.us-east-1.amazonaws.com/dev2/upload/b2bucket2/"+data.name);
        xhr.setRequestHeader("Content-Type", data.type);
        xhr.setRequestHeader("x-api-key","FRRZrspOs61U3Wm0eDxSh3zIOWuzdiBLaEVH002P");
        xhr.setRequestHeader("x-amz-meta-customLabels", custom_labels.value);
        xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
        xhr.send(data);
    };
    reader.readAsArrayBuffer(file);
}

/*
function uploadPhoto() {
    let file = document.getElementById('uploaded_file').files[0];
    let file_name = file.name;
    let file_type = file.type;
    let reader = new FileReader();

    reader.onload = function() {
        let arrayBuffer = this.result;
        let blob = new Blob([new Int8Array(arrayBuffer)], {
            type: file_type
        });
        let blobUrl = URL.createObjectURL(blob);


        let data = document.getElementById('uploaded_file').files[0];
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                document.getElementById('uploadText').innerHTML ='Image Uploaded  !!!';
                document.getElementById('uploadText').style.display = 'block';
            }
        });
        xhr.withCredentials = false;
        xhr.open("PUT", "/v1/upload/photos-recognition/"+data.name);
        xhr.setRequestHeader("Content-Type", data.type);
        xhr.setRequestHeader("x-api-key","");
        xhr.setRequestHeader("x-amz-meta-customLabels", custom_labels.value);
        xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
        xhr.send(data);
    };
    reader.readAsArrayBuffer(file);
}*/