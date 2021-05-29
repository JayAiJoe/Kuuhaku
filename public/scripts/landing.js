function showFrmPickCategory() {
    document.getElementById('frm-pick-category').style.display = 'flex';
}

function closeFrmPickCategory() {
    document.getElementById('frm-pick-category').style.display = 'none';
}

function switchCategory(elem) {
    var btn = document.getElementById('category-btn');
    var info = document.getElementById('hiddenCategoryInfo');
    btn.innerHTML = elem.innerHTML;
    info.value = elem.innerText;
    btn.style.backgroundColor = elem.getAttribute("name");
    closeFrmPickCategory();
}