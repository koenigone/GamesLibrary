$("#toggleBtn").on('click', ()=> {
    $("header #toggleBtn i").toggleClass("fa-bars fa-arrow-up");
    $("header .inputsDiv").slideToggle();
});