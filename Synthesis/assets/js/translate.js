const apiKey = "AIzaSyCJ7_NoaZ4cFjupJuTikKc0-Oq1wH1sAdg";

// Set endpoints
const endpoints = {
  translate: "",
  languages: "languages"
};

// Abstract API request function
function makeApiRequest(endpoint, data, type, authNeeded) {
  url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
  url += "?key=" + apiKey;

  // If not listing languages, send text to translate
  if (endpoint !== endpoints.languages) {
    url += "&q=" + encodeURI(data.textToTranslate);
  }

  // If translating, send target and source languages
  if (endpoint === endpoints.translate) {
    url += "&target=" + data.targetLang;
    url += "&source=" + data.sourceLang;
  }

  // Return response from API
  return $.ajax({
    url: url,
    type: type || "GET",
    data: data ? JSON.stringify(data) : "",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

// Translate
function translate(data) {
  makeApiRequest(endpoints.translate, data, "GET", false).success(function(
    resp
  ) {
    $(".welcomeMSG").text(resp.data.translations[0].translatedText);
  });
}

// Get languages
function getLanguages() {
  makeApiRequest(endpoints.languages, null, "GET", false).success(function(
    resp
  ) {
    $.when(getLanguageNames()).then(function(data) {
      $.each(resp.data.languages, function(i, obj) {
        $(".source-lang, .target-lang").append(
          '<option value="' +
            obj.language +
            '">' +
            data[obj.language] +
            "</option>"
        );
      });
    });
  });
}

// Convert country code to country name
function getLanguageNames() {
  return $.getJSON("https://api.myjson.com/bins/155kj1");
}

// On document ready
$(function() {
  window.makeApiRequest = makeApiRequest;
  var translationObj = {};
  targetLang = "en";
  textToTranslate = "Welcome to Synthesis! We hope you enjoy the United States and we hope you can find your place in this country."
  // Popuplate source and target language dropdowns
  getLanguages();

  $(document)
    // Bind translate function to translate button
    .on("click", ".EnglishButton" || ".SpanishButton" || ".BosnianButton" || ".ChineseButton" || ".JapaneseButton", function() {
        switch(this.id){
            case "SpanishButton":
                targetLang = "es"
            break;
            case "BosnianButton":
                targetLang = "bs"
            break;
            case "ChineseButton":
                targetLang = "zh-CN"
            break;
            case "JapaneseButton":
                targetLang = "ja"
            break;
            default:
                targetLang = "en"
            break;
        }
        translationObj = {
            sourceLang: "en",
            targetlang: targetlang,
            textToTranslate: textToTranslate
        }
        translate(translationObj)
      
    })
});