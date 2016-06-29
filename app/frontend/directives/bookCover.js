/**
 * Generates a book cover. 
 *
 * This directive generates a canvas element and produces the graphics
 * as specified inside of the 'link' function. 
 * 
 * @author Roman Pusec
 */
app.directive('bookCover', function(){
	return {
		restring: 'E',
		link: function(scope, elem, attr){
			var canvas = elem.context.children[0];
			var context = canvas.getContext('2d');
			
			if(angular.isUndefined(attr.author))
				attr.author = "Author not specified. ";

			if(angular.isUndefined(attr.title))
				attr.title = "Title not specified. ";

			if(angular.isUndefined(attr.description))
				attr.description = "Description not specified. ";

			if(angular.isUndefined(attr.price))
				attr.price = 20;

			if(!angular.isUndefined(attr.width))
				canvas.width = attr.width;

			if(!angular.isUndefined(attr.height))
				canvas.height = attr.height;

			if(angular.isUndefined(attr.margin))
				attr.margin = 50;

			if(angular.isUndefined(attr.pagesThickness))
				attr.pagesThickness = parseInt(attr.price) / 3;

			if(angular.isUndefined(attr.shadowColorX))
				attr.shadowColorX = '#ccc';

			if(angular.isUndefined(attr.shadowColorY))
				attr.shadowColorY = '#F5F5F5';

			context.fillStyle = generateBgColor();
			var	bookX = attr.margin
			,	bookY = attr.margin
			,	bookWidth = attr.width - attr.margin*2 - attr.pagesThickness
			,	bookHeight = attr.height - attr.margin*2;
			context.fillRect(bookX, bookY, bookWidth, bookHeight);

			context.fillStyle = attr.shadowColorX;
			context.setTransform(1, -1, 0, 1, bookX + bookWidth, bookY);
			context.fillRect(0, 0, attr.pagesThickness, bookHeight);

			context.fillStyle = attr.shadowColorY;
			context.setTransform(1, 0, -1, 1, bookX + attr.pagesThickness, bookY - attr.pagesThickness);
			context.fillRect(0, 0, bookWidth, attr.pagesThickness);

			context.setTransform(1, 0, 0, 1, 0, 0);

			addBoxes('rgba(0, 0, 0, 0.05)');
			addBoxes('rgba(0, 0, 0, 0.1)', true);

			addText(attr.title, "bold 15px Arial", "center", "#000", bookWidth/2 + bookX, bookHeight/2 + bookY);
			addText(attr.author, "10px Arial", "center", "#000", bookWidth/2 + bookX, bookHeight/2 + bookY + 15);

			/**
			 * Adds text to the canvas. 
			 * @param {String}  text  The text. 
			 * @param {String}  font  The font. 
			 * @param {String}  align Alignment. 
			 * @param {String}  color The color.
			 * @param {Integer} x     X axis. 
			 * @param {Integer} y     Y axis.
			 * @see the documentation on canvas text. 
			 */
			function addText(text, font, align, color, x, y){
				context.fillStyle = color;
				context.font = font;
				context.textAlign = align;
				context.fillText(text, x, y, bookWidth);
			}

			/**
			 * Generates the "shadow boxes" effect. It takes the length value 
			 * of the description and converts it into base 2, it then takes the number 
			 * of zeros and ones and calculates the square root of that number. 
			 * The square root represents the maximum number of columns per row.
			 * It then finally iterates through these zeros and ones and adds the 
			 * shadow boxes; each one represents a shadow box and each zero represents 
			 * an empty field.  
			 * @param {String}  color   The html color of the box. 
			 * @param {Boolean} reverse Should the zeros and ones be reversed. 
			 */
			function addBoxes(color, reverse){
				context.fillStyle = color;

				if(typeof reverse !== 'boolean')
					reverse = false;

				var binaryDescr = attr.description.length.toString('2');

				if(reverse)
					binaryDescr = binaryDescr.split('').reverse().join('');

				var root = Math.ceil(Math.sqrt(binaryDescr.length));
				var boxWidth = bookWidth/root;
				var boxHeight = bookHeight/root;
				var col = 0;
				var row = 0;

				for(var i = 0; i < binaryDescr.length; i++)
				{
					if(col !== root)
					{
						if(parseInt(binaryDescr[i]) === 1)
							context.fillRect(bookX + col*boxWidth, bookY + row*boxHeight, boxWidth, boxHeight);
						col++;
					}
					else
					{
						i--;
						col = 0;
						row++;
					}
				}
			}

			/**
			 * Generates a random color based on 
			 * the length of the description. 
			 * @param  {Integer} limit Specifies how many characters should be avoided. 
			 * @return {String}        HTML color. 
			 */
			function generateBgColor(limit){
				if(typeof limit !== 'number')
					limit = 10;

				var addupBy = Math.ceil(attr.description.length / limit);
				var lengthBy3 = Math.floor(attr.description.length/3);

				var inputR = attr.description.substr(0, lengthBy3);
				var inputG = attr.description.substr(lengthBy3, lengthBy3);
				var inputB = attr.description.substr(lengthBy3*2);

				var inputRLength = inputR.length/2;
				var inputGLength = inputR.length/2;
				var inputBLength = inputR.length/2;

				var outputR = 0;
				var outputG = 0;
				var outputB = 0;

				for(var i = 0; i < inputR.length; i+=addupBy)
					outputR += inputR[i].charCodeAt(0);

				for(var i = 0; i < inputG.length; i+=addupBy)
					outputB += inputG[i].charCodeAt(0);

				for(var i = 0; i < inputB.length; i+=addupBy)
					outputG += inputB[i].charCodeAt(0);

				var outputR = outputR % 255;
				var outputG = outputG % 255;
				var outputB = outputB % 255;

				var minColor = Math.min(outputR, outputG, outputB);

				if(minColor === outputR)
					outputR = 255;

				if(minColor === outputG)
					outputG = 255;
				
				if(minColor === outputB)
					outputB = 255;

				return 'rgb('+outputR+','+outputG+','+outputB+')';
			}
		},
		template: '<canvas></canvas>'
	}
});