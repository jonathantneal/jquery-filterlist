// jQuery Filter List, MIT @jon_neal
(function () {
	/* global $ */
	'use strict';

	// initialize element as filterlist
	function init(element, settings) {
		var
		// get inputs
		$inputs = $(settings.input, element),
		// get lists
		$list = $('<ul class="' + settings.classList.list + '">').appendTo($(settings.output, element));

		// update
		update($inputs, $list, settings);

		// update on input changes
		$inputs.on('change', function () {
			update($inputs, $list, settings);
		});
	}

	// update inputs and lists
	function update($inputs, $list, settings) {
		var
		// initialize collection
		collection = [];

		// clean all lists
		$.each($list, function (listIndex, list) {
			while (list.childNodes.length) list.removeChild(list.lastChild);
		});

		// process all inputs
		$.each($inputs, function (inputIndex, input) {
			var
			// detect input type
			type = input.type === 'checkbox' || input.type === 'radio' ? 'checked' : input.type === 'select-one' || input.type === 'select-multiple' ? 'selected' : 'value' in input ? 'value' : 'node';

			// if checked, push to collection
			if (type === 'checked' && input.checked && input.value) collection.push({
				input: input,
				type: type,
				value: input.getAttribute('title') || input.getAttribute('data-title') || (function () {
					var element = document.querySelector('label[for="' + input.id + '"]') || input;

					while (element && element.nodeName !== 'LABEL') element = element.parentNode;

					return element ? element.innerText || element.textContent : null;
				})() || input.value
			});

			else if (type === 'selected') {
				// process all options
				$.each(input.options, function (optionIndex, option) {
					// if selected, push to collection
					if (option.selected && option.value) collection.push({
						input: input,
						option: option,
						type: type,
						value: option.getAttribute('title') || option.getAttribute('data-title') || option.text || option.value
					});
				});
			}

			// if input with value, push to collection
			else if (type === 'value' && input.value.replace(/^\s+|\s+$/, '')) collection.push({
				input: input,
				type: type,
				value: input.value
			});

			// if node, push to collection
			else if (type === 'node' && (input.innerText || input.textContent || '').replace(/^\s+|\s+$/, '')) collection.push({
				input: input,
				type: type,
				value: input.innerText || input.textContent
			});
		});

		// update all lists
		$.each($list, function (listIndex, list) {
			var listChildNodes = list.childNodes;

			// add all items to list 
			$.each(collection, function (itemIndex, item) {
				var
				// create item
				listitem = document.createElement('li'),
				listitemText = listitem.appendChild(document.createElement('span')),
				listitemDelete = listitem.appendChild(document.createElement('span'));

				// configure item
				listitem.setAttribute('class', settings.classList.item);
				listitemText.setAttribute('class', settings.classList.itemText);
				listitemDelete.setAttribute('class', settings.classList.itemDelete);
				listitemDelete.setAttribute('tabindex', '0');
				listitemDelete.setAttribute('title', 'Remove item');

				listitemText.appendChild(document.createTextNode(item.value));

				// item mouse and keyboard controls
				listitemDelete.onclick = listitemDelete.onkeydown = function () {
					var
					// detect event details
					event = arguments[0] || window.event,
					// on pointer click
					isClick = event.type === 'click',
					// on keyboard enter
					isEnter = event.keyCode === 13,
					// on keyboard back
					isBack = event.keyCode === 37 || event.keyCode == 38,
					// on keyboard next
					isNext = event.keyCode === 39 || event.keyCode == 40;

					// if delete
					if (isClick || isEnter) {
						if (item.type === 'checked') {
							// uncheck input
							item.input.checked = false;
						}

						else if (item.type === 'selected') {
							// unselect option
							item.option.selected = false;

							// IE9 will not properly handle selects without anything selected
							if (!item.input.multiple) item.input.options[0].selected = true;
						}

						else if (item.type === 'value') {
							// clear input
							item.input.value = '';
						}

						else if (item.type === 'node') {
							// empty node
							while (item.input.childNodes && item.input.childNodes.length) item.input.removeChild(item.input.lastChild);
						}

						// fire input onchange event
						$(item.input).trigger('change');

						// focus item occupying old position 
						if (isEnter && listChildNodes.length) (listChildNodes[itemIndex] || listChildNodes[itemIndex - 1]).lastChild.focus();
					}
					// if keyboard back, focus previous item
					else if (isBack && listChildNodes[itemIndex - 1]) listChildNodes[itemIndex - 1].lastChild.focus();
					// if keyboard next, focus next item
					else if (isNext && listChildNodes[itemIndex + 1]) listChildNodes[itemIndex + 1].lastChild.focus();
				};

				list.appendChild(listitem);
			});
		});
	}

	function filterlist(optionalSettings) {
		/* jshint validthis:true */
		var settings = $.extend({}, filterlist.defaults, typeof optionalSettings === 'object' ? optionalSettings : {});

		// initialize all elements as filterlists
		for (var all = this, index = 0, length = all.length; index < length; ++index) init(all[index], settings);

		// return chainable this
		return all;
	}

	filterlist.defaults = {
		classList: {
			list: 'filterlist-list',
			item: 'filterlist-item',
			itemText: 'filterlist-item-text',
			itemDelete: 'filterlist-item-delete'
		},
		input: '.filterlist-input',
		output: '.filterlist-filters'
	};

	$.fn.filterlist = filterlist;
})();
