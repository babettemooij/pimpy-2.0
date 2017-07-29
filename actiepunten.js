$("table").on("click", ".glyphicon-remove", function(){
	$(this).parents("tr").remove();
});

$("table").on("click", ".btn:not(#newtodo)", function(){
	if ($(this).hasClass("green")) {
		changeStatus($(this), "green", "red", "On hold");
	} else if ($(this).hasClass("red")) {
		changeStatus($(this), "red", "orange", "In progress");
	} else if ($(this).hasClass("orange")) {
		changeStatus($(this), "orange", "green", "Done");
	}
});

function changeStatus(thisObj, from, to, text) {
	thisObj.removeClass(from);
	thisObj.addClass(to);
	thisObj.text(text);
}

$("table").on("click", ".newtodo", function(){
	$(this).hide();
	makeFormNewTask($(this));
	addToDo();
	$(this).remove();
});

function makeFormNewTask(thisObj) {
	var task = '<textarea class="form-control" rows="1" id="comment"></textarea>';
	thisObj.before('<td>' + task + '</td>');
	var people = '<textarea class="form-control" rows="1" id="comment"></textarea>';
	thisObj.before('<td>' + people + '</td>');
	var status = '<td class="orange btn">In progress</td>';
	thisObj.before(status);
	var icon = '<span class="glyphicon glyphicon-plus"></span>'
	thisObj.before('<td>' + icon + '</td>');
}

function addToDo() {
	var plus = $("td:not('.newtodo') .glyphicon-plus");
	for (var i = 0; i < plus.length; i++) {
		$(plus[i]).on('click', function() {
			var texts = $(this).parents("tr").find("textarea");
			var task = texts[0];
			var people = texts[1];
			$(task).replaceWith($(task).val());
			$(people).replaceWith($(people).val());
			$(this).parents("tr").after('<tr> <td class="btn newtodo" colspan="3"><span class="glyphicon glyphicon-plus"></span>New task</td></tr>');
			$(this).after('<td> <span class="glyphicon glyphicon-remove"></span></td>')
			$(this).remove();
	});
	}
}