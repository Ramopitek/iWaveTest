// Initialize app and store it to myApp variable for futher access to its methods
var myApp = new Framework7({
    
    precompileTemplates: true
});
var token;
var $$ = Dom7;
if (getCookie("token") !== ""){
    myApp.closeModal('.login-screen');
    console.log(getCookie("token"));
    getMainContent();
}

 
var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});

 
myApp.onPageInit('news_list', function (page) {
    getNews();
})
myApp.onPageInit('index', function (page) {
    if (getCookie("token") !== ""){
        myApp.closeModal('.login-screen');
        console.log(getCookie("token"));
        getMainContent();
    }
})

$(document).on("click","#signInBtn",function(e){
    success = false;
    var data = $('#signInForm').serializeArray();
    $.ajax({
        method:"POST",
        url: "http://demo.interwave.pro/api/1/auth/request-token",
        data: data,
        success: function(ret){
            if (ret['success'] === true){
                myApp.closeModal('.login-screen');
                token = ret['data']['token'];
                success = true;
                document.cookie = "token="+token;
                getMainContent();
                console.log("singed in: " + token);
            }else{
                console.log(ret)
            }
        }
    });
});


//вывод последних пяти новостей
function getMainContent(){
    var url = "http://demo.interwave.pro/api/1/tables/News/rows?access_token=" + getCookie("token");
    var perPage = "&perPage=5";
    var currentPage = "&currentPage=0";
    var sort = "&sort=id";
    var sortOrder = "&sort_order=DESC"
    $.ajax({
        method:"GET",
        url: url + perPage + currentPage + sort + sortOrder,
        success: function(ret){
            if (ret['success'] === false){
                return false;
            }
            showMainPageContent(ret['rows']);
        }
    })
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showMainPageContent(items){
    var template = $$('#slider').html();
    var compiledTemplate = Template7.compile(template);
    var html = "";
    $(items).each(function(i,e){
        var context = {
            itemName: e.title,
            imageUrl: e.Photo.url,
        };
        html += compiledTemplate(context);
    })
    $$('.swiper-wrapper').html(html);
    initSlider();
}



function initSlider(cl,pg){
    //slider
    var mySwiper = myApp.swiper('.swiper-container', {
        preloadImages: false,
        pagination:'.swiper-pagination',
        lazyLoading: true,
    });
}



//полуение и вывод списка новостей.
function getNews(page,size){
    var url = "http://demo.interwave.pro/api/1/tables/News/rows?access_token=" + getCookie("token");
    if (typeof size !== "undefined")
        var perPage = "&perPage="+size;
    else
        var perPage = "";
    if (typeof page !== "undefined")
        var currentPage = "&currentPage=" + page;
    else
        var currentPage = ""
    var sort = "&sort=id";
    var sortOrder = "&sort_order=DESC";
    $.ajax({
        method:"GET",
        url: url + perPage + currentPage + sort + sortOrder,
        success: function(ret){
            if (ret['success'] === false){
            }else{
                showNews(ret['rows']);
            }
        }
    })
}


// вывод списка новостей на страницу новостей
function showNews(news){
    var templateNews = $$('#newslistTemplate').html();
    var compiledTemplateNews = Template7.compile(templateNews);
    var htmlNews = "";
    $(news).each(function(i,e){
        var contextNews = {
            itemImage: e.Photo.url,
            itemName: e.title,
            itemShort: e.Short_Desc,
            itemId: e.id,
        };
        htmlNews += compiledTemplateNews(contextNews);
    })
    $$('.news-list-block').html(htmlNews);
}

//popup
var el;
$('body').on('click', '.create-popup', function (e) {
    el = e;
    id = e.currentTarget.dataset.id;
    var url = "http://demo.interwave.pro/api/1/tables/News/rows?access_token=" + getCookie("token");
    $.ajax({
        method:"GET",
        url: url + "&id=" + id,
        success: function(ret){
            if (ret['success'] === false){
            }else{
                console.log(ret);
                var template = $$('#newsPopup').html();
                var compiledTemplate = Template7.compile(template);
                var context = {
                    itemImage: ret.Photo.url,
                    itemName: ret.title,
                    itemLong: ret.Body,
                    itemId: ret.id,
                };
                myApp.popup(compiledTemplate(context));
            }
        }
    })
});