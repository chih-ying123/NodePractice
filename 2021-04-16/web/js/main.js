//手機版_主選單側滑出現
/*
    * Affix
    * Nav menu mobile
/*/
/* ***************** start document load **********************/
$(document).ready(function() {
	"use strict";
	/*
	|--------------------------------------------------------------------------
	| Affix
	|--------------------------------------------------------------------------
	|
	*/
    $('#myAffix').affix({
        offset: {
            top: 100,
            bottom: function() {
                return (this.bottom = $('.footer').outerHeight(true))
            }
        }
    });
    /* header select city */
    $('.weather__city__list ul li').on('click', function(e) {
        e.preventDefault();

        $(this).siblings("li").removeClass("active");
        $(this).removeClass('active').addClass('active');

        var text = $(this).find("a").html();
        $(".weather__city").find('em').html(text);
        return false;
    });
});


/* ************** start document resize ********************/
$(window).resize(function() {
	"use strict";
    var height = 0;
    var autoHeight1 = $('.col-img_auto-height');
    var autoHeight2 = $('.col-border_auto-height');
    var autoHeight3 = $('.col-border_auto-height-small');
    $(autoHeight1).css('height', 'auto');
    autoHeight1.each(function() {
        if ($(this).height() > height) {
            height = $(this).height();
        }
    });
    autoHeight1.css('height', height);

    $(autoHeight2).css('height', 'auto');
    autoHeight2.each(function() {

        if ($(this).height() > height) {
            height = $(this).height();
        }
    });
    autoHeight2.css('height', height + 25);

    $(autoHeight3).css('height', 'auto');
    autoHeight3.each(function() {

        if ($(this).height() > height) {
            height = $(this).height();
        }
    });
    autoHeight3.css('height', height + 25);
}).resize();
/* **************** end document resize ********************/


$(function() {
	"use strict";
	/*
	|--------------------------------------------------------------------------
	| Nav menu mobile
	|--------------------------------------------------------------------------
	|
	*/
    var $menu = $(".overlapblackbg, .slideLeft");
    var $wsmenucontent = $(".wsmenucontent");
    var openMenu = function() {
        $($menu).removeClass("menuclose").addClass("menuopen")
    };
    var closeMenu = function() {
        $($menu).removeClass("menuopen").addClass("menuclose")
    };
    $("#navToggle").on('click', function() {
        if ($wsmenucontent.hasClass("menuopen")) {
            $(closeMenu)
        } else {
            $(openMenu)
        }
        return false;
    });
    $wsmenucontent.on('click', function() {
        if ($wsmenucontent.hasClass("menuopen")) {
            $(closeMenu)
        }
        return false;
    });
    $("#navToggle,.overlapblackbg").on('click', function() {
        $(".wsmenucontainer").toggleClass("mrginleft");
        return false;
    });
    $(".wsmenu-list li").has(".wsmenu-submenu, .wsmenu-submenu-sub, .wsmenu-submenu-sub-sub").prepend('<span class="wsmenu-click"><i class="wsmenu-arrow fa fa-angle-down"></i></span>');
    $(".wsmenu-list li").has(".megamenu").prepend('<span class="wsmenu-click"><i class="wsmenu-arrow fa fa-angle-down"></i></span>');
    $(".wsmenu-mobile").on('click', function() {
        $(".wsmenu-list").slideToggle("slow");
        return false;
    });
    $(".wsmenu-click").on('click', function() {
        $(this).siblings(".wsmenu-submenu").slideToggle("slow");
        $(this).children(".wsmenu-arrow").toggleClass("wsmenu-rotate");
        $(this).siblings(".wsmenu-submenu-sub").slideToggle("slow");
        $(this).siblings(".wsmenu-submenu-sub-sub").slideToggle("slow");
        $(this).siblings(".megamenu").slideToggle("slow");
        return false;
    });
});


//手機版_回到最上層JS
$(document).ready(function(){
    $("#goToTop").hide()//隐藏go to top按钮
    $(function(){
        $(window).scroll(function(){
            if($(this).scrollTop()>1){//当window的scrolltop距离大于1时，go to top按钮淡出，反之淡入
                $("#goToTop").fadeIn();
            } else {
                $("#goToTop").fadeOut();
            }
        });
    });
    // 给go to top按钮一个点击事件
    $("#goToTop a").click(function(){
        $("html,body").animate({scrollTop:0},800);//点击go to top按钮时，以800的速度回到顶部，这里的800可以根据你的需求修改
        return false;
    });
});


//輪播廣告JS
$(document).ready(function(){
    $(document).ready(function() {
        $('.pgwSlider').pgwSlider();
    });
});


//輪播廣告JS
$(function(){
    // 先取得 #abgne-110223 及 ul, li 及 .caption 元素
    // 並預設先顯示第幾個, 還有動畫速度
    var $block = $('#abgne-110223'), 
        $wrap = $block.find('.wrap-110223'), 
        $ul = $wrap.find('ul'), 
        $li = $ul.find('.page'), 
        $caption = $block.find('.caption'), 
        _default = 0, 
        _width = $wrap.width(), 
        animateSpeed = 400;
    // 先把 ul 的寬度設成 li 數量 x $wrap 的寬
    $ul.width(_width * $li.length);
    // 如果 .arrows 中的 a 被點擊時
    $block.find('.arrows').delegate('a', 'click', function(event){
        // 先找出 .selected 的元素後移掉該樣式
        var $selected = $li.filter('.selected').removeClass('selected'), 
            // 找出目前顯示的元素是第幾個
            _index = $li.index($selected);
        // 依點擊的是上一張或下一張來切換
        _index = (event.target.className == 'prev' ? _index - 1 + $li.length : _index + 1) % $li.length;
        $ul.animate({
            left: _index * _width * -1
        }, animateSpeed);
        // 改變標題
        $caption.hide().html($li.eq(_index).addClass('selected').find('img').attr('alt')).fadeIn(animateSpeed);
        return false;
    });
    // 先顯示預設的
    $ul.css('left', _default * _width * -1);
    $caption.html($li.eq(_default).addClass('selected').find('img').attr('alt'));
    $block.find('a').focus(function(){
        this.blur();
    });
});


// 個人訊息_下拉選單顯示
jQuery(function($){
    $("div.msg_list").css({cursor:"pointer"}).click(function(){
    $(this).next().toggle("bold");
    });
});