"use strict";

(function(inlineStyle) {
	function resize(ifr, div) {
		var r = document.documentElement;
		var b = document.body;
		b.style.position = "relative";

		if (ifr.style.position == "fixed") {
			ifr.style.top = ifr.style.left = div.style.top = div.style.right = 0;
			ifr.style.width = "100%";
		} else {
			var s = style;
			var pxl = s(r, 'marginLeft') + s(r, 'borderLeftWidth') + s(r, 'paddingLeft') + s(b, 'marginLeft') + s(b, 'borderLeftWidth');
			var pxd = document.documentElement.scrollWidth - style(b, 'width') - style(b, 'paddingLeft') - style(b, 'paddingRight');

			ifr.style.left = (-pxl) + 'px';
			ifr.style.width = "100%";
			ifr.style.width = "calc(100% + "+pxd+"px)";
			div.style.right = (-pxd+s(b, 'marginRight')+s(b, 'borderRight')) + 'px';

			var py = style(r, 'marginTop') + style(r, 'borderTopWidth') + style(r, 'paddingTop') + style(b, 'marginTop') + style(b, 'top') + style(b, 'borderTopWidth');
			div.style.top = ifr.style.top = (-py)+"px";
		}
		ifr.style.display = '';
		div.style.display = '';
	}

	// Passare le proprieta' CSS col nome javascript-like (es. marginLeft)
	function style(el, pr, m) {
		var v;
		if (!el)return 0;
		if (document.defaultView && document.defaultView.getComputedStyle) v = document.defaultView.getComputedStyle(el, null)[pr];
		else if (el.currentStyle) v = el.currentStyle[pr];
		else v = el.style[pr];
		return (m ? v : parse(v));
	}

	function bulkElement(tag, d) { var el = document.createElement(tag); for (var i in d) el.setAttribute(i, d[i]); return el; };
	function bulkStyle(el, d) { for (var i in d) el.style[i] = d[i] };
	function bulkAttr (el, d) { for (var i in d) el.setAttribute(i, d[i]) };
	function parse(i) { return isNaN(parseInt(i)) ? 0 : parseInt(i) };
	function hash(u) { for (var c = 0, i = 0; i < u.length; i++) c += u.charCodeAt(i); return c % 255; };

	var media = matchMedia("screen and (min-width:768px)");
	media.onchange = function() {
		if (!media.matches) {
			return;
		}

		media.onchange = null;

		var p, u, hh = 40, base = "//tb.altervista.org/";

		var div = document.getElementById('av_toolbar_regdiv');
		div.style.top = "-40px";
		var link = div.children[0];
		link.className = 'tb-site';

		// Generazione dell'URL della toolbar staticizzata
		if (u = document.location.host.match(/([a-zA-Z0-9]+)\.(ssl\.)?altervista\.org$/)) {
			p = 'tb_html/'+hash(u[1])+'/t2_'+u[1];
		} else {
			u = (document.location.host.match(/[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}$/))[0];
			p = 't2_dom_html/'+hash(u)+'/'+u;
		}

		var ifr = bulkElement('iframe', {id: "av_toolbar_iframe", marginwidth: "0", marginheight: "0", frameborder: "0", scrolling: "no"});
		bulkStyle(ifr, {height: hh+'px', border: 0, position: 'absolute', left: '0', top: "-40px", zIndex: 10000, maxWidth: 'none'});
		ifr.style.display = 'none';

		// Iubenda flag
		var iubenda = false, m;
		if (window._iub && (m = document.cookie.match("_iub_cs-"+_iub.csConfiguration.cookiePolicyId+"=(.+?)($|;)"))) try { iubenda = JSON.parse(decodeURIComponent(m[1])).consent; } catch (e) { /* nothing */ }

		if (div.nextSibling) div.parentNode.insertBefore(ifr, div.nextSibling); else div.parentNode.appendChild(ifr);
		ifr.src = base+p+".html?ref="+encodeURIComponent(location.href)+"&iubenda="+(iubenda?1:0);

		// Stile generico per il crea sito
		document.head.appendChild(bulkElement('link', { rel: "stylesheet", href: base+"css/toolbar-font.css" }));
		document.head.appendChild(bulkElement('link', { rel: "stylesheet", href: base+"css/toolbar-icons.css" }));
		var css = bulkElement('style');
		css.textContent = inlineStyle;
		document.head.appendChild(css);

		var span = bulkElement('span', { "class": "circle" });
		span.appendChild(bulkElement('span', { "class": "tb-icons tb-icon-pencil" }));
		link.children[0].insertBefore(span, link.children[0].firstChild);

		window.addEventListener('load', queueResize, false);

		window.addEventListener("message", function(ev) {
			if (ev.origin.search(/^https?:\/\/tb\.altervista\.org/) == 0) {
				var data = JSON.parse(ev.data);
				if (data._type) {
					ifr.style.position = div.style.position = data.position;
					link.children[0].style.color = data.text_color;
					css.sheet.insertRule('#av_toolbar_regdiv .tb-site a .circle { border-color: '+data.text_color_alt+' !important; }', 0);
					css.sheet.insertRule('#av_toolbar_regdiv .tb-site a:hover .circle { background-color: '+data.text_color+' !important; }', 0);
					css.sheet.insertRule('#av_toolbar_regdiv .tb-site a:hover .tb-icons { color: '+data.background_color+' !important; }', 0);
				}
				queueResize();
			}
		}, false);

		function queueResize() {
			if (!media.matches) {
				media.onchange = queueResize;
				return;
			}
			media.onchange = null

			resize(ifr, div);
		}
	};

	media.onchange();
})("#av_toolbar_regdiv {\n\
	height: 40px;\n\
	margin: 0;\n\
	padding: 0;\n\
	position: absolute;\n\
	right: 0;\n\
	top: -40px;\n\
	width: 100px;\n\
	z-index: 10001;\n\
}\n\
\n\
#av_toolbar_regdiv .tb-site {\n\
	position: relative !important;\n\
	line-height: 40px !important;\n\
	margin: 0 !important;\n\
	padding: 0 !important;\n\
	text-shadow: none !important;\n\
	-webkit-box-shadow: none !important;\n\
	box-shadow: none !important;\n\
	border: none !important;\n\
	text-transform: none !important;\n\
	}\n\
	\n\
#av_toolbar_regdiv .tb-site a,\n\
#av_toolbar_regdiv .tb-site a:hover,\n\
#av_toolbar_regdiv .tb-site a:focus,\n\
#av_toolbar_regdiv .tb-site a:active {\n\
    display: inline-block !important;\n\
    height: 30px !important;\n\
    line-height: 30px !important;\n\
    padding: 6px 0 4px !important;\n\
    margin: 0 !important;\n\
    font-size: 13px !important;\n\
	/* reset */\n\
    background-color: transparent;\n\
    border: none !important;\n\
    font-style: normal !important;\n\
    font-weight: normal !important;\n\
    font-family: 'Lato-tb', sans-serif !important;\n\
    text-align: left !important;\n\
    letter-spacing: 0 !important;\n\
    text-decoration: none !important;\n\
    cursor: pointer !important;\n\
    text-shadow: none !important;\n\
    -webkit-box-shadow: none !important;\n\
    box-shadow: none !important;\n\
    text-transform: none !important;\n\
    outline: none !important;\n\
    font-smooth: auto !important;\n\
    -webkit-font-smoothing: auto !important;\n\
    -moz-osx-font-smoothing: auto !important;\n\
}\n\
\n\
#av_toolbar_regdiv .tb-site a:hover {\n\
	text-decoration: none !important;\n\
}\n\
\n\
#av_toolbar_regdiv .tb-site a:focus {\n\
	outline: none !important;\n\
}\n\
\n\
#av_toolbar_regdiv .tb-site a .circle {\n\
    display: block;\n\
    width: 22px;\n\
	height: 22px;\n\
	margin: 2px 5px 0 0;\n\
	padding: 0;\n\
	float: left;\n\
	border-style: solid;\n\
	border-width: 1px;\n\
	-webkit-border-radius: 12px;\n\
	border-radius: 12px;\n\
	line-height: 22px;\n\
	text-align: center;\n\
	-webkit-transition: background 0.2s ease-in-out 0s;\n\
	transition: background 0.2s ease-in-out 0s;\n\
}\n\
\n\
#av_toolbar_regdiv .tb-site a:hover .circle {\n\
	border-color: transparent !important;\n\
}\n\
\n\
#av_toolbar_regdiv .tb-site a .circle .tb-icons:before {\n\
	line-height: 22px;\n\
}");
