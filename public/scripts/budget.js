function onClickBtnAddItem() {
    var adder = document.getElementById("add-item");
    adder.style.display = "flex";
}

function onClickBtnSubmitItem() {
    var description = $("#blank-description").val();

    if (description != "") {
        $.get('/addCategory', { categoryName: description }, function (data, status) {
            console.log(data);
            if (data != null) {
                var btn = document.createElement("button");
                btn.classList.add("category-type");

                btn.onclick = function ()
                    {
                        var categoryName = $(this).find('.category-title')[0].innerHTML;
                        window.location.href = "/category?categoryName=" + categoryName;
                    };

                var item = document.createElement("div");
                item.classList.add("category-icon");
                var icon = document.createElement("i");
                icon.classList.add("fas");
                icon.classList.add("fa-utensils");
                icon.classList.add("fa-lg");
                item.appendChild(icon);

                var itemDetails = document.createElement("div");
                itemDetails.classList.add("category-type-details");

                var itemInfo = document.createElement("div");
                itemInfo.classList.add("category-type-info");
                var itemTitle = document.createElement("span");
                itemTitle.classList.add("category-title");
                itemTitle.innerHTML = description;
                itemInfo.appendChild(itemTitle);
                itemInfo.appendChild(document.createTextNode("100% used"));

                var itemBar = document.createElement("div");
                itemBar.classList.add("category-status-bar");
                var itemValue = document.createElement("div");
                itemValue.classList.add("bar-value");
                itemValue.setAttribute("style", "width: 100%");
                itemBar.appendChild(itemValue);

                itemDetails.appendChild(itemInfo);
                itemDetails.appendChild(itemBar);

                btn.appendChild(item);
                btn.appendChild(itemDetails);
                $('#history').append(btn);
            }
        });
    }

    $("#add-item").hide();
}

anychart.onDocumentReady(function () {
    // create data
    var data = [];

    $.get('/getBudgetAllocation', function (result) {
        result.forEach(function (elem) {
            var json = {
                x: elem.categoryName,
                value: elem.maxAmount,
                normal: {
                    fill: elem.color
                }
            };
            console.log(json);

            data.push(json);
        });

        // create a chart
        var chart = anychart.pie(data);

        // set the position of labels
        chart.labels().position("inside");

        chart.background().fill("#1B0E44");

        // configure connectors
        chart.connectorStroke({ color: "#595959", thickness: 2, dash: "2 2" });

        // disable the legend
        chart.legend(false);

        chart.container("category-graph");

        // initiate drawing the chart
        chart.draw();
    });
});

$(document).ready(function () {
    $('#budget-setup-item').click(function () {
        $('#budget-setup-editor').html("");
        console.log($('#budget-setup-editor').html(""));
        $.get('/getCategories', function (result) {
            result.forEach(function (elem) {
                var item = document.createElement("div");
                item.classList.add("budget-category-title");
                var icon = document.createElement("i");
                icon.classList.add("fas");
                icon.classList.add(elem.icon);
                icon.classList.add("fa-fw");
                var input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("id", "budget-category");
                input.setAttribute("value", elem.maxAmount);

                item.appendChild(icon);
                item.appendChild(document.createTextNode(elem.categoryName));
                item.appendChild(input);
                console.log(item);
                $('#budget-setup-editor').append(item);
            });

            $('.popup-overlay').css("display", "flex");
        });
    });

    $('.close').click(function () {
        $('.popup-overlay').hide();
    });

    $('#edit-budgetplan').submit(function (e) {
        e.preventDefault();

        var categories = [];
        $('.budget-category-title').map(function () {
            categories.push(this.innerText);
        });

        var values = [];
        $('.budget-category-title > input').map(function () {
            values.push(this.value);
        });

        var update = [];
        for (var i = 0; i < categories.length; i++) {
            var category = {
                categoryName: categories[i],
                maxAmount: values[i]
            };

            update.push(category);
        }

        console.log("update");
        console.log(update);
        update.forEach(function (category, index) {
            console.log(category);
            $.post('/updateOneBudgetAllocation', category, function (result) {
                console.log(result);
                if (index == update.length - 1) {
                    window.location.href = "/budget";
                }
            });
        });

    });

    $('.category-type').click(function () {
        var categoryName = $(this).find('.category-title')[0].innerHTML;

        window.location.href = "/category?categoryName=" + categoryName;
    });
});