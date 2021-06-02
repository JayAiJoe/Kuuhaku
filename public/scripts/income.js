var editNode;


function onClickBtnAddItem() {
    var adder = document.getElementById("add-item");
    adder.style.display = "flex";
}

function onClickBtnSubmitItem() {
    var description = document.getElementById("blank-description").value
    var price = document.getElementById("blank-price").value
    var adder = document.getElementById("add-item");

    if (description != "" && price != "") {

        var item = document.createElement("div");
        item.classList.add("income-item");
        var desc = document.createElement("div");
        desc.classList.add("income-item-description");
        desc.innerText = description;
        var edit = document.createElement("div");
        edit.classList.add("income-edit");
        var itemPrice = document.createElement("div");
        itemPrice.classList.add("income-item-price");
        itemPrice.innerText = price;
        var btn = document.createElement("div");
        btn.classList.add("edit-btn");
        btn.setAttribute("onclick", "onClickBtnEdit(this)");
        btn.innerHTML = "<i class=\"fas fa-edit\"></i>"

        var hiddenID = document.createElement("div");
        hiddenID.setAttribute('style','display:none');
        hiddenID.innerText = data;


        edit.appendChild(itemPrice);
        edit.appendChild(btn);
        edit.appendChild(hiddenID);
        item.appendChild(desc);
        item.appendChild(edit);
        

        document.getElementById("current").appendChild(item);
    
    };

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
    $.get('/editIncome', { id: editNode.nextElementSibling.innerText, amount: $('#edit-price').val() }, function (data, status) {
        if (data == 'edit') {
            editor.style.display = "none";
            editNode.previousElementSibling.innerHTML = document.getElementById("edit-price").value;
            editNode = null;
        }
    });
}

function onClickBtnDeleteEdit() {
    var editor = document.getElementById("edit-item");
    $.get('/deleteIncome', { id: editNode.nextElementSibling.innerText }, function (data, status) {
        if (data == 'delete') {
            editor.style.display = "none";
            editNode.parentElement.parentElement.remove();
            editNode = null;
        }
    });
}


$(document).ready(function () 
{
    $('#add-item').click(function()
    {
        var description = $('#blank-description').val();
        var amount = $('#blank-price').val();

        if (description && amount)
        {
            $.get('/addIncome', {description: description, amount: amount}, function(result)
            {
                // result <partial>
                const year = new Date().getFullYear();
                const month = new Date().getMonth();

                $(`#${month+1}-${year}`).after(result);
                $('#add-item').css("display","none");
                $("form").trigger("reset");
                onClickBtnSubmitItem();
            });
        }
    });
    /*
    $('#save'),click(function()
    {
        var price = $('#edit-price').val();

        if (price)
        {
            $.get('/editIncome',)
        }


    });
    */

    /*
    $('#edit-item').on('click','.btn-delete',function()
    {
        $(this).parent().remove();
        $.get('/deleteIncome',{description:$(this).parent().find('p:nth-child(2)').html()}, function(result)
			{
			});

    });
    */





});
