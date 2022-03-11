var timer_loading = setInterval(function(){
    var pos_x = parseInt($('.jumbotron').css('background-position-x'));
    pos_x--;
    $('.jumbotron').css('background-position-x', pos_x);
}, 15);

var sf = 'https://docs.google.com/spreadsheets/d/' + id_spreadsheet + '/gviz/tq?tqx=out:json';
$.ajax({url: sf, type: 'GET', dataType: 'text'})
.done(function(data) {
  const r = data.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
  if (r && r.length == 2) {
    const obj = JSON.parse(r[1]);
    const table = obj.table;
    const header = table.cols.map(({label}) => label);
    const rows = table.rows.map(({c}) => c.map(({v}) => v));

    let new_table = [];
    for(let i=1; i<rows.length; i++){


        var photo_final = rows[i][3];
        if( $(document).width() < 500 ){
            photo_final = rows[i][4];
        }

        new_table.push({
            category: rows[i][0],
            title: rows[i][1],
            description: rows[i][2],
            photo: photo_final,
            gif: rows[i][4],
            url: rows[i][5],
        });
    }

    showInfo(new_table);
    
  }
})
.fail((e) => console.log(e.status));





function showInfo(data) {
    var tableOptions = {
        "data": data,
        "pagination": 100,
        "tableDiv": "#fullTable",
        "filterDiv": "#fullTableFilter"
    }
    Sheetsee.makeTable(tableOptions);
    Sheetsee.initiateTableFilter(tableOptions);


    var categories = [];
    $('.item').each(function () {
        var category = $(this).data('category');
        if ($.inArray(category, categories) == -1) {
            categories.push(category);
        }
    });


    categories.sort();

    $(categories).each(function (key, elem) {
        $('.pagination').append('<li class="page-item btn_filter"><a class="page-link" href="#' + elem + '">' + elem + '</a></li>');
    })


    $('.pagination').hide().css('visibility', 'visible').fadeIn('slow', function(){
        clearInterval(timer_loading);
    });

    $('.btn_filter').click(function () {

        $('.btn_filter').removeClass('active');
        $(this).addClass('active');

        var type = $(this).find('a').attr('href').replace('#', '');

        if (type) {
            $('.item').hide();

            $('.item[data-category$="' + type + '"]').show();

        } else {
            $('.item').show();
        }

    });

    /*
    $('.card_link').click(function(){
        //$(this).css('background-image', "url('" + $(this).data('gif') + "')" );


        $('#modal').modal('show');

        $('#modal_body').html('<iframe border="0" style="max-width:100%;" frameborder="0" height="500" width="700" src="https://twitframe.com/show?url=' + encodeURI($(this).attr('href')) + '"></iframe> ');


        return false;
    });
    */


    $('.card-img-top').mouseover(function(){
        $(this).css('background-image', "url('" + $(this).data('gif') + "')" );
    });


    $('.card-img-top').mouseout(function(){
        $(this).css('background-image', "url('" + $(this).data('original') + "')" );
    });






    if (document.location.hash) {
        $('.btn_filter a[href$="' + decodeURI(document.location.hash.replace('#', '')) + '"]').click();
    }
}
