document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.clickable').forEach(function(item) {
        item.addEventListener('click', function() {
            window.location.href = this.getAttribute('data-href');
        });
    });
});
