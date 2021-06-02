var editNode;

function clearChart() {
    document.getElementById("category-graph").innerHTML = "";
}

function loadChart() {
    // create data
    var data = [
        ["FEB 28", 100],
        ["MAR 7", 120],
        ["MAR 14", 130],
        ["MAR 21", 100],
        ["MAR 28", 90]
    ];

    $.get('/getCategoryDetails', function (result) {
        // create a chart
        var chart = anychart.column();

        // create a column series and set the data
        var series = chart.column(data);

        chart.background().fill("#1B0E44");
        series.color(result.color);
        chart.xAxis().labels().fontColor("#BCC3FF");
        chart.yAxis().labels().fontColor("#BCC3FF");

        // set the container id
        clearChart();
        chart.container("category-graph");

        // initiate drawing the chart
        chart.draw();
    });


}

anychart.onDocumentReady(loadChart());

function onClickBtnAddItem() {
    var adder = document.getElementById("add-item");
    adder.style.display = "flex";
    var description = document.getElementById("blank-description").value = "";
    var price = document.getElementById("blank-price").value = "";
}

function onClickBtnSubmitItem() {
    var description = document.getElementById("blank-description").value
    var price = document.getElementById("blank-price").value
    var adder = document.getElementById("add-item");
    var category = document.getElementById("category-name").innerText;

    if (description != "" && price != "") {
        $.get('/addCategoryExpense', { category: category, description: description, amount: price }, function (data, status) {

            if (data != '') {
                var item = document.createElement("div");
                item.classList.add("category-item");

                var desc = document.createElement("div");
                desc.classList.add("category-item-description");
                desc.innerText = description;
                var edit = document.createElement("div");
                edit.classList.add("category-edit");
                var itemPrice = document.createElement("div");
                itemPrice.classList.add("category-item-price");
                itemPrice.innerText = price;
                var btn = document.createElement("div");
                btn.classList.add("edit-btn");
                btn.setAttribute("onclick", "onClickBtnEdit(this)");
                btn.innerHTML = "<i class=\"fas fa-edit\"></i>"

                var hiddenID = document.createElement("div");
                hiddenID.setAttribute('style', 'display:none');
                hiddenID.innerText = data;


                edit.appendChild(itemPrice);
                edit.appendChild(btn);
                edit.appendChild(hiddenID);
                item.appendChild(desc);
                item.appendChild(edit);


                document.getElementById("current").appendChild(item);
            }

        });
    }

    adder.style.display = "none";
}

function onClickBtnEdit(elem) {
    if (editNode != null) {
        return;
    }
    var editor = document.getElementById("edit-item");
    editor.style.display = "flex";

    document.getElementById("edit-price").value = elem.previousElementSibling.innerHTML;
    elem.previousElementSibling.innerHTML = "..."
    editNode = elem;
}

function onClickBtnSaveEdit() {
    var editor = document.getElementById("edit-item");
    $.get('/editExpense', { id: editNode.nextElementSibling.innerText, amount: $('#edit-price').val() }, function (data, status) {
        if (data == 'edit') {
            editor.style.display = "none";
            editNode.previousElementSibling.innerHTML = document.getElementById("edit-price").value;
            editNode = null;
        }
    });
}

function onClickBtnDeleteEdit() {
    var editor = document.getElementById("edit-item");
    $.get('/deleteExpense', { id: editNode.nextElementSibling.innerText }, function (data, status) {
        if (data == 'delete') {
            editor.style.display = "none";
            editNode.parentElement.parentElement.remove();
            editNode = null;
        }
    });
}

function showFrmCategoryEditor() {
    document.getElementById('frm-category-editor').style.display = 'flex';
}

function closeFrmCategoryEditor() {
    document.getElementById('frm-category-editor').style.display = 'none';
}

function submitFrmCategoryEditor(form) {
    var oldName =  $('#category-name').text().trim();
    console.log(oldName);
    var response = form.elements;
    var cname = response[0].value;
    var ccolor = response[1].value;

    var icons = response["caticon"];
    var cicon = "";

    for (var i = 0, length = icons.length; i < length; i++) {
        if (icons[i].checked) {
            cicon = icons[i].value;
            break;
        }
    }

    if(cname == "")
        {cname = oldName;}
    if(cicon == "")
        {cicon = 'angle-double-up';} //default
    if(ccolor == '#000000')
        {ccolor = 'gold';}//default
    document.getElementById("category-name").innerHTML = cname;
    document.getElementById("category-img-container").innerHTML = "<i class=\"fas fa-" + cicon + " fa-fw\"></i>"
    categoryColor = ccolor;
    loadChart();


    console.log(cname);
    console.log(ccolor);
    console.log(cicon);

    closeFrmCategoryEditor();
    $.get('/editCategory',{name:cname, icon:cicon, oldName:oldName, color:ccolor}, function(data, status){});
}

function onClickDeleteCategory() {
    var category = document.getElementById("category-name").innerText;
    $.get('/deleteCategory', { category: category }, function (data, status) { 
        window.location.href = "/budget";
    });
}