$(function() {
	function scroll(element) {
	    $('html, body').animate({
	        scrollTop: $('[name="' + $(element).attr('href').substr(1) + '"]').offset().top-40
	    }, 500, 'easeInOutExpo');
	}

	$('a.scroll').click(function(){
		$(config.container).slideUp();
		scroll($(this));
		return false;
	});

	$('.navbar-brand').click(function() {
	    $('.gallery-detail-close').click();
		$('.nav li').removeClass('active');
	});

	$('.nav li a').click(function() {
	    $('.gallery-detail-close').click();
		$(this).parent().addClass('active').siblings().removeClass('active');
	});

	$("a").click(function() {
		$(this).blur();
	});
	
	$(config.container).on('mouseenter', '.picture', function(event) {
		if ($(".hover", this).length == 0) {
			$(this).append(
				$("<div class=\"hover\">").append(
					$("<a class=\"disabled btn btn-default\">").append(
						$("<i class=\"glyphicon glyphicon-fullscreen\"></i>")
					)
				)
			)
		}
	});

	$(config.container).on('mouseleave', '.picture', function(event) {
		$(".hover", this).remove();
	});

	$(config.container).on('click', '.picture', function(event) {
		var self = this;
		var detail = $("#detail");
		$(detail).css({
			'height' : config.container.height(),
			'width' : config.container.width(),
			'left' : config.container.offset().left,
			'top' : config.container.offset().top
		});
		
		var carousel = new Carousel("#detail .carousel", false);
		$(".gallery-navbar").fadeIn(function() {
			var self = this;
			$(".gallery-detail-close", this).click(function() {
				$(self).fadeOut();
				carousel.destroy();
			});
		});
		
		$(detail).fadeIn(function() {
			var clickedIndex = $(self).attr("rel");
			$.each($(".picture", config.container), function(index, picture) {
				//if (index == 0) {
				carousel.add(new CarouselItem(
						(index == clickedIndex ? true : false),
						pictures[index].getFull(config.container.height() - 40)
						//pictures[index].title,
						//pictures[index].description
				));//}
			});
			carousel.show();
		});
	});
	
	$("a.gallery").click(function() {
		var self = this;
		$(config.container).show();
		scroll($(self));
		$(window).resize();
		return false;
	});

	$("button.open-gallery").click(function() {
		$("a.gallery").click();
	});
	
	function carousel() {
		var carousel = new Carousel(".landing .carousel", false);
		fetch('https://picasaweb.google.com/data/feed/api/user/www.glassart.cz/albumid/5918507007024693649?&kind=photo&access=public&max-results=10&imgmax=1200&&orderby=date&alt=jsonc', function(pictures) {
			$.each(pictures, function(index, picture) {
				carousel.add(new CarouselItem(
					(index == 0 ? true : false),
					picture.getFull($(".landing .carousel").height())
					//picture.description
				));
			});
		});
		carousel.show();
	}

	resize();
	carousel();
});

