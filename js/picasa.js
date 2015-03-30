var pictures = [];

function Picture(id, title, description, image, thumbs) {
	this.id = id;
	this.title = (title === "[UNSET]") ? "" : title;
	this.description = description;
	this.image = image;
	this.resize = function(height) {
		this.height = height;
		this.width = Math.round(height / this.image.height * this.image.width)
	}
	this.getThumb = function() {
		var url = this.image.url;
		url = url.substring(0, url.lastIndexOf('/'));
		url = url.substring(0, url.lastIndexOf('/'));
		url += '/s'	+ (this.width / this.height > 1 ? (this.width + 1) : (this.height + 1)) + '/';
		return url;
	},
	this.getFull = function(height) {
		var url = this.image.url;
		this.resize(height);
		
		url = url.substring(0, url.lastIndexOf('/'));
		url = url.substring(0, url.lastIndexOf('/'));
		console.log(this.width + ":" + this.height);
		url += '/s'	+ (this.width / this.height > 1 ? Math.round(height * this.width / this.height) : height) + '/';
		return url;
	}
}

function Row() {
	this.width = $(config.container).width();
	this.height = Math.round(($(config.container).height() - ((config.rows) * config.spacing)) / config.rows) - 1;
	this.pictures = [];
	this.getWidth = function() {
		var w = 0;
		$.each(this.pictures, function(index, picture) {
			w += picture.width;
		});
		w += 2 * config.spacing * this.pictures.length
		return w;
	}
	this.isFull = function() {
		return this.getWidth() >= this.width;
	}
	this.add = function(picture) {
		picture.resize(this.height);
		this.pictures.push(picture);
	}
	this.overhang = function() {
		var overhang = this.getWidth() - this.width;
		return overhang > 0 ? overhang : 0;
	}
}

function fetch(url, callback) {
	var pictures = [];
	$.get(url, function(result) {
		$.each(result.data.items, function(index, item) {
			pictures[pictures.length] = new Picture(item.id, item.title,
					item.description, item.media.image, []);
		});
		callback(pictures);
	}, "jsonp");
}

function prepare(pictures) {
	// prepare rows - amend picture width to align them
	var notfull = true, index = 0, rows = [];

	rows[rows.length] = new Row()
	while (rows.length <= config.rows) {
		if (rows[rows.length - 1].isFull()) {
			if (rows.length == config.rows) {
				break;
			}
			rows.push(new Row());
		}
		if (pictures[index]) {
			rows[rows.length - 1].add(pictures[index++]);
		} else {
			break;
		}
	}
	return rows;
}

function display(rows) {
	var pictureIndex = 0;
	$.each(rows, function(index, row) {
		var r = $("<div/>").attr('class', 'line');
		config.container.append(r);
		var overhang = row.overhang();
		var piece = Math.round(overhang / row.pictures.length);
		$.each(row.pictures, function(i, picture) {
			if (i == (row.pictures.length - 1)) {
				piece = overhang;
			} else {
				overhang = overhang - piece;
			}
			
			$("<div/>").hide().attr({
				'class': 'picture',
				'rel': pictureIndex++
			}).css({
				'margin' : config.spacing + 'px',
				'width' : picture.width - piece,
				'height' : picture.height,
				'background' : '#fff url("' + picture.getThumb() + '") no-repeat center center'
			}).appendTo(r).fadeIn('slow');
		});
	});
}

var process = function(pics) {
	pictures = pics;
	var rows = prepare(pictures);
	display(rows);
}

function resize() {
	var height = $(config.container).height();
	var width = $(config.container).width();

	var newHeight = ($(window).height() - ($('.navbar').height() + 1));
	var newWidth = ($(window).width());
	
	if (height != newHeight) {
		$(config.container).css({
			"height" : newHeight + "px",
			"padding" : config.padding + "px"
		});
	}
	if (height != newHeight || width != newWidth) {
		return true;
	} else {
		return false;
	}
}

$(window).resize(_.debounce(function() {
	if ($(config.container).is(":visible") && (resize() || $(".picture", config.container).length == 0)) {
		$(".picture", config.container).fadeOut(400);
		fetch(config.url, process);
	}
}, 500));

var config = {
		url : 'https://picasaweb.google.com/data/feed/api/user/www.glassart.cz/albumid/5920690831753535393?&kind=photo&access=public&max-results=50&imgmax=1200&alt=jsonc',
		container : $('div.gallery'),
		rows : 3,
		spacing : 1,
		padding : 0
	}

$.ajaxSetup({ cache: false});
