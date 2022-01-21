/*!
 * Social utility functions.
 */
(function($){

    var linkEncoder = 'http://m.avlink.it/';
    var socialData = [{
            clazz: 'av-facebook', // (partial) class in CSS
            share: { // share Analytics event
                evtName: 'Facebook', // Name of event
                popup: { h: 320 } // Popup to open when possible
            }
        },{
            clazz: 'av-linkedin',
            data: { url: window.location.href },
            share: { // NOTE: doesn't work with "official" style.
                evtName: 'LinkedIn',
                popup: { h: 480 }
            }
        },{
            clazz: 'av-pinterest',
            data: { url: window.location.href },
            share: {
                evtName: 'Pinterest',
                popup: { h: screen.height, w: 800 }
            }
        },{
            clazz: 'av-twitter',
            share: { // NOTE: doesn't work with "official" style.
                evtName: 'Twitter',
                popup: { h: 253 }
            }
        },{
            clazz: 'av-whatsapp',
            share: {
                evtName: 'Whatsapp',
                callback: function(params){
                    $.ajax({
                        url: linkEncoder + 'add.php',
                        method: 'POST',
                        data: {
                            url: decodeURIComponent(params.data.avUrl)
                        },
                        dataType: 'json',
                        timeout: 5000
                    }).done(function(data){
                        if (data.hash){
                            window.location.href = 'whatsapp://send?text=' + params.data.avTitle + encodeURIComponent(linkEncoder + data.hash + ' ');
                        }else{
                            window.location.href = params.evtLabel;
                        }
                    }).fail(function(data){
                        window.location.href = params.evtLabel;
                    });
                }
            }
        }, {
            clazz: 'av-telegram',
            share: {
                evtName: 'Telegram',
                callback: function (params) {
                    $.ajax({
                        url: linkEncoder + 'add.php',
                        method: 'POST',
                        data: {
                            url: decodeURIComponent(params.data.avUrl)
                        },
                        dataType: 'json',
                        timeout: 5000
                    }).done(function (data) {
                        if (data.hash) {
                            window.location.href = 'tg://msg?text=' + params.data.avTitle + encodeURIComponent(linkEncoder + data.hash + ' ');
                        } else {
                            window.location.href = params.evtLabel;
                        }
                    }).fail(function (data) {
                        window.location.href = params.evtLabel;
                    });
                }
            }
        }
    ];

    var container = $('#container');
    if (container.length == 0){
        container = $(document.body);
    }
    function openWindow(url, name, height, width) {

        var sw = screen.width;
        var sh = screen.height;

        if (!width || width < 0 || width > sw) width = 600;
        if (!height || height < 0 || height > sh) height = 400;

        if (width > sw) width = sw;
        if (height > sh) height = sh;
        window.open(url, 'social_' + name, 'width=' + width + ',height=' + height + ',left=' + ((sw - width) >> 1) + ',top=' + ((sh - height) >> 1));
    }

    $.fn.extend({
       avAddShareTrackingEvents: function(){
           $(this).find('.av-social-btn.av-share-btn').on('click', function(e){
               var el = $(this);
               var clazz = el.attr('class');
               var aEl = $(this).find('a');
               var url = aEl.attr('href');
               var data = aEl.data();
               // If on an official buttons, don't open our popup window.
               var evtAction = 'Share';

               for (var i = 0; i<socialData.length; i++) {
                   var sd = socialData[i];

                   if (clazz.indexOf(sd.clazz) >= 0) {
                       var openPopup = sd.clazz != 'av-messenger';

                       if (!url){
                           url = $(this).find('[data-url]').attr('data-url');
                       }
                       if (sd.share.callback) {
                            sd.share.callback();
                       } else if (openPopup) {
                            openWindow(url, sd.share.evtName, sd.share.popup.h, sd.share.popup.w);
                       }
                       break;
                   }
               }
               if (openPopup){
                   e.stopPropagation();
                   return false;
               }
               return true;
           });
       }
    });

    container.avAddShareTrackingEvents();

}(jQuery));
