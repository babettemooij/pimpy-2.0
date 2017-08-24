$(".table").on("click", ".newtodo", function(){
	$(this).parent().hide();
	makeFormNewTask($(this));
});

function makeFormNewTask(thisObj) {
	var currentLocation = window.location.pathname;
	thisObj.parent().before('<form class="tr" action="/tasks" method="POST"><div class="td"> <textarea class="form-control" name="todo" rows="1"></textarea> </div><div class="td"> <textarea class="form-control" name="people" rows="1"></textarea> </div><input hidden name="groupname" value="'+ currentLocation + '"><div class="td red btn"> Not started </div><div class="td" id="empty"> <button type="submit"><span class="glyphicon glyphicon-plus"></span></button></div></form>');
}