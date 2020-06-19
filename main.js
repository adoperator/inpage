function response_inpage(data) {
  if (!data || data == undefined) return;
  var css =
    '.adoperator_inp{position:fixed;z-index:999999;width:310px;min-height:96px;background-color:#fff;border:1px solid #e0e0e0;-webkit-box-shadow:1px 2px 9px 1px #0000002e;-moz-box-shadow:1px 2px 9px 1px #0000002e;box-shadow:1px 2px 9px 1px #0000002e;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;padding:5px;right:-320px;top:5%;font-family:"Roboto",Arial,Helvetica,sans-serif;-webkit-transition:all 500ms cubic-bezier(.735,.16,.38,1.58);-moz-transition:all 500ms cubic-bezier(.735,.16,.38,1.58);-o-transition:all 500ms cubic-bezier(.735,.16,.38,1.58);transition:all 500ms cubic-bezier(.735,.16,.38,1.58);-webkit-transition-timing-function:cubic-bezier(.735,.16,.38,1.58);-moz-transition-timing-function:cubic-bezier(.735,.16,.38,1.58);-o-transition-timing-function:cubic-bezier(.735,.16,.38,1.58);transition-timing-function:cubic-bezier(.735,.16,.38,1.58)}.adoperator_inp.adoperator_inp--active{right:5px}.adoperator_inp a{color:#353535;text-decoration:none;display:block;outline:0}.adoperator_inp .adoperator_inp--close{position:absolute;right:10px;background-color:#c5c5c5;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;height:16px;width:16px;font-size:12px;color:#fff;text-align:center;z-index:99999;cursor:pointer}.adoperator_inp .adoperator_inp--img{background-image:url(' +
    data.icon_url +
    ");-webkit-background-size:contain;-moz-background-size:contain;background-size:contain;background-repeat:no-repeat;width:96px;height:96px;margin-right:8px;display:inline-block;vertical-align:middle}.adoperator_inp .adoperator_inp--desc{display:inline-block;vertical-align:top;width:200px;margin:0;padding:0}.adoperator_inp .adoperator_inp--desc p{margin:15px 0 10px;font-size:14px;padding:0;font-weight:700}.adoperator_inp .adoperator_inp--desc span{font-size:12px;margin:0;padding:0;font-weight:400}@media screen and (max-width:340px){.adoperator_inp{width:85%;min-height:auto;right:-85%}.adoperator_inp .adoperator_inp--desc{width:63%}.adoperator_inp .adoperator_inp--desc p{font-size:13px;margin:0 0 10px}.adoperator_inp .adoperator_inp--img{width:68px;height:68px}.adoperator_inp .adoperator_inp--close{height:13px;width:13px;font-size:11px}}";
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  head.appendChild(style);
  style.type = "text/css";

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  var block = document.createElement("div");
  block.id = "adoperator_inp";
  block.className = "adoperator_inp";
  block.innerHTML =
    '<span class="adoperator_inp--close" onclick=\'document.getElementById("adoperator_inp").classList.remove("adoperator_inp--active")\'>x</span><a href="#" target="_blank" rel="noopener noreferrer"><div class="adoperator_inp--img"></div><div class="adoperator_inp--desc"><p>' +
    data.title +
    "</p><span>" +
    data.text +
    "</span></div></a>";
  document.body.appendChild(block);
  setTimeout(function () {
    block.className = "adoperator_inp adoperator_inp--active";
  }, 1000);
}

function request_inpage() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "//inpage.eu.adopexchange.com/rtb/search/push?ip=125.99.120.166&subId=10001&ua=Mozilla%2F5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML,%20like%20Gecko)%20Ubuntu%20Chromium%2F83.0.4103.61%20Chrome%2F83.0.4103.61%20Safari%2F537.36&format=json&feedid=e908&url=adop.com&keywords=best,price&domain=test.domain",
    true
  );
  xhr.withCredentials = true;

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status == 200) {
        console.log(this.responseText);
        try {
          response_inpage(JSON.parse(this.responseText)[0]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  xhr.send();
}
request_inpage();
