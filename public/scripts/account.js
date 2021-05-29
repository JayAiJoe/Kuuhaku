function customizeAvatar() {
    window.location = "avatar";
}

function showFrmEditDisplayName() {
    $('#input-newdisplayname').val('');
    $('#pwd-newdisplayname').val('');
    document.getElementById('frm-edit-display-name').style.display = 'flex';
}

function showFrmEditUsername() {
    $('#input-newusername').val('');
    $('#pwd-newusername').val('');
    document.getElementById('frm-edit-username').style.display = 'flex';
}

function showFrmChangePwd() {
    $('#old-pwd').val('');
    $('#new-pwd').val('');
    document.getElementById('frm-change-pwd').style.display = 'flex';
}

function showFrmFeedback() {
    document.getElementById('frm-feedback').style.display = 'flex';
}

function closeForm(obj) {
    obj.parent().parent()[0].style.display = "none";
}

$(document).ready(function () {
    $("#input-newusername").keyup(function () {
        var user = $("#input-newusername").val();

        $("#input-newusername").css('background-color', 'rgb(200,0,0)');
        $("#input-newusername").css('color', 'white');
        $("#btn-submitnewusername").css('background-color', 'gray');
        $("#btn-submitnewusername").prop('disabled', true);

        if (user.match(/^[a-z0-9]+$/i)) {
            //check username is unique
            $("#input-newusername").css('background-color', '#1B0E44');
            $("#input-newusername").css('color', '#BCC3FF');
            $("#btn-submitnewusername").css('background-color', '#FFCB17');
            $("#btn-submitnewusername").prop('disabled', false);
        }
    });

    $("#input-newdisplayname").keyup(function () {
        var user = $("#input-newdisplayname").val();

        $("#input-newdisplayname").css('background-color', 'rgb(200,0,0)');
        $("#input-newdisplayname").css('color', 'white');
        $("#btn-submitnewdisplayname").css('background-color', 'gray');
        $("#btn-submitnewdisplayname").prop('disabled', false);


        if (user.match(/^[a-z]+$/i)) {
            $("#input-newdisplayname").css('background-color', '#1B0E44');
            $("#input-newdisplayname").css('color', '#BCC3FF');
            $("#btn-submitnewdisplayname").css('background-color', '#FFCB17');
            $("#btn-submitnewdisplayname").prop('disabled', false);
        }
    });

    $("#frm-editdisplayname").submit(function (e) {
        e.preventDefault();

        var user = $("#input-newdisplayname").val();
        var pass = $("#pwd-newdisplayname").val();

        $.get("/checkPassword", { pass: pass }, function (result) {
            if (result.success != null) {
                $.post("/updateDisplayname", { user: user }, function (result) {
                    $("#display-name")[0].innerHTML = user;
                    $("#account-name")[0].innerHTML = user;
                });
            }
        });

        closeForm($("#close-frmeditdisplayname"));
    });

    $("#frm-editusername").submit(function (e) {
        e.preventDefault();

        var user = $("#input-newusername").val();
        var pass = $("#pwd-newusername").val();

        $.get("/checkPassword", { pass: pass }, function (result) {
            if (result.success != null) {
                $.post("/updateUsername", { user: user }, function (result) {
                    $("#username")[0].innerHTML = user;
                });
            }
        });

        closeForm($("#close-frmeditusername"));
    });

    $("#frm-change-pwd").submit(function (e) {
        e.preventDefault();

        var oldpass = $("#old-pwd").val();
        var newpass = $("#new-pwd").val();

        $.get("/checkPassword", { pass: oldpass }, function (result) {
            if (result.success != null) {
                $.post("/updatePassword", { newpass: newpass}, function (result) {});
            }
        });

        closeForm($("#close-frmchangepwd"));
    });

    $("#close-frmchangepwd").click(function () {
        closeForm($(this));
    });

    $("#close-frmeditusername").click(function () {
        closeForm($(this));
    });

    $("#close-frmfeedback").click(function () {
        closeForm($(this));
    });

    $("#close-frmeditdisplayname").click(function () {
        closeForm($(this));
    });
});