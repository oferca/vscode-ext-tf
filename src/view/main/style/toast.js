module.exports.toast = `


.btn {
    display: inline-block;
    padding: 0.85rem 2.13rem;
    border-radius: 5px;
    border: 0;
    -webkit-transition: 0.2s ease-out;
    cursor: pointer;
    transition: 0.2s ease-out;
    word-wrap: break-word;
  }
  .btn-success {
    color: #fff;
    background: #00c851;
  }
  .btn-info {
    background-color: #33b5e5 !important;
    color: #fff;
  }
  .btn-danger {
    background-color: #ff3547 !important;
    color: #fff;
  }
  .btn-warning {
    background-color: #fb3 !important;
    color: #fff;
  }
  .toast-title {
    font-weight: 700;
  }
  .toast-message {
    -ms-word-wrap: break-word;
    word-wrap: break-word;
  }
  .toast-message a,
  .toast-message label {
    color: #fff;
  }
  .toast-message a:hover {
    color: #ccc;
    text-decoration: none;
  }
  .toast-close-button {
    position: relative;
    right: -0.3em;
    top: -0.3em;
    float: right;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    -webkit-text-shadow: 0 1px 0 #fff;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.8;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
    filter: alpha(opacity=80);
    line-height: 1;
  }
  .toast-close-button:focus,
  .toast-close-button:hover {
    color: #000;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.4;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
    filter: alpha(opacity=40);
  }
  .rtl .toast-close-button {
    left: -0.3em;
    float: left;
    right: 0.3em;
  }
  button.toast-close-button {
    padding: 0;
    cursor: pointer;
    background: 0 0;
    border: 0;
    -webkit-appearance: none;
  }
  .toast-top-center {
    top: 0;
    right: 0;
    width: 100%;
  }
  .toast-bottom-center {
    bottom: 0;
    right: 0;
    width: 100%;
  }
  .toast-top-full-width {
    top: 0;
    right: 0;
    width: 100%;
  }
  .toast-bottom-full-width {
    bottom: 0;
    right: 0;
    width: 100%;
  }
  .toast-top-left {
    top: 12px;
    left: 12px;
  }
  .toast-top-right {
    top: 12px;
    right: 12px;
  }
  .toast-bottom-right {
    right: 12px;
    bottom: 12px;
  }
  .toast-bottom-left {
    bottom: 12px;
    left: 12px;
  }
  #toast-container {
    position: fixed;
    z-index: 999999;
    pointer-events: none;
  }
  #toast-container * {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  #toast-container > div {
    position: relative;
    pointer-events: auto;
    overflow: hidden;
    margin: 0 0 6px;
    padding: 15px 15px 15px 50px;
    width: 300px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    background-position: 15px center;
    background-repeat: no-repeat;
    -moz-box-shadow: 0 0 12px #999;
    -webkit-box-shadow: 0 0 12px #999;
    box-shadow: 0 0 12px #999;
    color: #fff;
    opacity: 0.8;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
    filter: alpha(opacity=80);
  }
  #toast-container > div.rtl {
    direction: rtl;
    padding: 15px 50px 15px 15px;
    background-position: right 15px center;
  }
  #toast-container > div:hover {
    -moz-box-shadow: 0 0 12px #000;
    -webkit-box-shadow: 0 0 12px #000;
    box-shadow: 0 0 12px #000;
    opacity: 1;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
    filter: alpha(opacity=100);
    cursor: pointer;
  }
  #toast-container > .toast-info {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=) !important;
  }
  #toast-container > .toast-error {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=) !important;
  }
  #toast-container > .toast-success {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==) !important;
  }
  #toast-container > .toast-warning {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=) !important;
  }
  #toast-container.toast-bottom-center > div,
  #toast-container.toast-top-center > div {
    width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  #toast-container.toast-bottom-full-width > div,
  #toast-container.toast-top-full-width > div {
    width: 96%;
    margin-left: auto;
    margin-right: auto;
  }
  .toast {
    background-color: #030303;
  }
  .toast-success {
    background-color: #51a351;
  }
  .toast-error {
    background-color: #bd362f;
  }
  .toast-info {
    background-color: #2f96b4;
  }
  .toast-warning {
    background-color: #f89406;
  }
  .toast-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background-color: #000;
    opacity: 0.4;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
    filter: alpha(opacity=40);
  }
  @media all and (max-width: 240px) {
    #toast-container > div {
      padding: 8px 8px 8px 50px;
      width: 11em;
    }
    #toast-container > div.rtl {
      padding: 8px 50px 8px 8px;
    }
    #toast-container .toast-close-button {
      right: -0.2em;
      top: -0.2em;
    }
    #toast-container .rtl .toast-close-button {
      left: -0.2em;
      right: 0.2em;
    }
  }
  @media all and (min-width: 241px) and (max-width: 480px) {
    #toast-container > div {
      padding: 8px 8px 8px 50px;
      width: 18em;
    }
    #toast-container > div.rtl {
      padding: 8px 50px 8px 8px;
    }
    #toast-container .toast-close-button {
      right: -0.2em;
      top: -0.2em;
    }
    #toast-container .rtl .toast-close-button {
      left: -0.2em;
      right: 0.2em;
    }
  }
  @media all and (min-width: 481px) and (max-width: 768px) {
    #toast-container > div {
      padding: 15px 15px 15px 50px;
      width: 25em;
    }
    #toast-container > div.rtl {
      padding: 15px 50px 15px 15px;
    }
  }
  
  /* Toastr custom styles*/
  #toast-container {
  }
  
  #toast-container.toast-bottom-center > div,
  #toast-container.toast-top-center > div {
    margin: 10px auto 0;
  }
  
  #toast-container > .toast-info,
  #toast-container > .toast-error,
  #toast-container > .toast-warning,
  #toast-container > .toast-success {
    background-image: none;
  }
  
  #toast-container > div {
    background: #fff;
    padding: 20px;
    color: #6a6c6f;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
  
  #toast-container > div:hover {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .toast-close-button {
    color: #000;
    opacity: 0.2;
  }
  
  .toast-info {
    background: #fff;
    border-left: 6px solid #3498db;
  }
  .toast-success {
    background: #fff;
    border-left: 6px solid #62cb31;
  }
  .toast-warning {
    background: #fff;
    border-left: 6px solid #ffb606;
  }
  .toast-error {
    background: #fff;
    border-left: 6px solid #e74c3c;
  }
  
  .toast-progress {
    opacity: 0.6;
  }
  
  .toast-info .toast-progress {
    background-color: #3498db;
  }
  .toast-success .toast-progress {
    background-color: #62cb31;
  }
  .toast-warning .toast-progress {
    background-color: #ffb606;
  }
  .toast-error .toast-progress {
    background-color: #e74c3c;
  }
  
  /* Nestable list */
  
  .dd {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
    line-height: 20px;
  }
  
  .dd-list {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  .dd-list .dd-list {
    padding-left: 30px;
  }
  
  .dd-collapsed .dd-list {
    display: none;
  }
  
  .dd-item,
  .dd-empty,
  .dd-placeholder {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
    min-height: 20px;
    font-size: 13px;
    line-height: 20px;
  }
  
  .dd-handle {
    display: block;
    margin: 5px 0;
    padding: 5px 10px;
    color: #333;
    text-decoration: none;
    border: 1px solid #e4e5e7;
    background: #f7f9fa;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  
  .dd-handle span {
    font-weight: bold;
  }
  
  .dd-handle:hover {
    background: #f0f0f0;
    cursor: pointer;
    font-weight: bold;
  }
  
  .dd-item > button {
    display: block;
    position: relative;
    cursor: pointer;
    float: left;
    width: 25px;
    height: 20px;
    margin: 5px 0;
    padding: 0;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    border: 0;
    background: transparent;
    font-size: 12px;
    line-height: 1;
    text-align: center;
    font-weight: bold;
  }
  
  .dd-item > button:before {
    content: "+";
    display: block;
    position: absolute;
    width: 100%;
    text-align: center;
    text-indent: 0;
  }
  
  .dd-item > button[data-action="collapse"]:before {
    content: "-";
  }
  
  #nestable2 .dd-item > button {
    font-family: FontAwesome;
    height: 34px;
    width: 33px;
    color: #c1c1c1;
  }
  
  #nestable2 .dd-item > button:before {
    content: "\f067";
  }
  
  #nestable2 .dd-item > button[data-action="collapse"]:before {
    content: "\f068";
  }
  
  .dd-placeholder,
  .dd-empty {
    margin: 5px 0;
    padding: 0;
    min-height: 30px;
    background: #f2fbff;
    border: 1px dashed #e4e5e7;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  
  .dd-empty {
    border: 1px dashed #bbb;
    min-height: 100px;
    background-color: #e5e5e5;
    background-image: -webkit-linear-gradient(
        45deg,
        #fff 25%,
        transparent 25%,
        transparent 75%,
        #fff 75%,
        #fff
      ),
      -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff
            75%, #fff);
    background-image: -moz-linear-gradient(
        45deg,
        #fff 25%,
        transparent 25%,
        transparent 75%,
        #fff 75%,
        #fff
      ),
      -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff
            75%, #fff);
    background-image: linear-gradient(
        45deg,
        #fff 25%,
        transparent 25%,
        transparent 75%,
        #fff 75%,
        #fff
      ),
      linear-gradient(
        45deg,
        #fff 25%,
        transparent 25%,
        transparent 75%,
        #fff 75%,
        #fff
      );
    background-size: 60px 60px;
    background-position: 0 0, 30px 30px;
  }
  
  .dd-dragel {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
  }
  
  .dd-dragel > .dd-item .dd-handle {
    margin-top: 0;
  }
  
  .dd-dragel .dd-handle {
    -webkit-box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);
  }
  
  /**
  * Nestable Extras
  */
  .nestable-lists {
    display: block;
    clear: both;
    padding: 30px 0;
    width: 100%;
    border: 0;
    border-top: 2px solid #e4e5e7;
    border-bottom: 2px solid #e4e5e7;
  }
  
  #nestable-menu {
    padding: 0;
    margin: 10px 0 20px 0;
  }
  
  #nestable-output,
  #nestable2-output {
    width: 100%;
    font-size: 0.75em;
    line-height: 1.333333em;
    font-family: open sans, lucida grande, lucida sans unicode, helvetica, arial,
      sans-serif;
    padding: 5px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  
  #nestable2 .dd-handle {
    color: inherit;
    border: 1px dashed #e4e5e7;
    background: #f7f9fa;
    padding: 10px;
  }
  
  #nestable2 .dd-handle:hover {
    /*background: #bbb;*/
  }
  
  #nestable2 span.label {
    margin-right: 10px;
  }
  
  #nestable-output,
  #nestable2-output {
    font-size: 12px;
    padding: 25px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
`