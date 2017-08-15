$(".table").on("click", ".glyphicon-remove", function(){
	$(this).parents(".tr").remove();
});

$(".table").on("click", ".btn:not(#newtodo)", function(){
	if ($(this).hasClass("green")) {
		changeStatus($(this), "green", "red", "Not started");
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

$(".table").on("click", ".newtodo", function(){
	$(this).parent().hide();
	makeFormNewTask($(this));
});

function makeFormNewTask(thisObj) {
	thisObj.parent().before('<form class="tr" action="/tasks" method="POST"><div class="td"> <textarea class="form-control" name="todo" rows="1"></textarea> </div><div class="td"> <textarea class="form-control" name="people" rows="1"></textarea> </div><div class="td red btn"> Not started </div><div class="td"> <button type="submit"><span class="glyphicon glyphicon-plus"></span></button></div></form>');
}