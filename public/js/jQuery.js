$(document).ready(function() {
	/* script per cambiare URI, in modo da caricare nuove risorse in locale */
	if(window.location.host=='localhost:8000') {
		let linkRewriter = function(a, b) {
			/* farlo per gli elementi che interessano public */
			// css (style?)
			$('img[src*="' + a + '"]').each(function() {                //(!!!) si può fare una regex che prenda tutto insieme (qualsiasi src o href)?
				$(this).attr('src', $(this).attr('src').replace(a, b));
			});
			$('script[src*="' + a + '"]').each(function() {
				$(this).attr('src', $(this).attr('src').replace(a, b));
			});
			$('link[href*="' + a + '"]').each(function() {
				$(this).attr('href', $(this).attr('href').replace(a, b));
			});
		};
		linkRewriter('https://site181950.tw.cs.unibo.it', 'http://localhost:8000');
	}

	/* inserire qui tutti gli eventi (onclick etc) */
});
