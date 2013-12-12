(function() {
    var elm = document.getElementById('episodes'),
        df = document.createDocumentFragment();
    for (var i = 1; i <=56; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.appendChild(document.createTextNode("Episode " + i));
        df.appendChild(option);
    }
    elm.appendChild(df);
}());