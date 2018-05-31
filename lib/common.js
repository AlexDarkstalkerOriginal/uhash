var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n1iGNMZb5v3DYihkYx4KqLeGEG19tddeqzM";


$('.popup').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
});   
$('.transaction').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
});   

window.onload = function(){         
  if(typeof(webExtensionWallet) === "undefined"){     
        $(".noExtension").show();   
        $(".content").hide();
    }else{
    }
};  

function startRead() {
  // obtain input element through DOM

  var file = document.getElementById('file').files[0];
  if(file){
    getAsText(file);    
  };
} 

function startReadFileSearch() {
  // obtain input element through DOM

  var file = document.getElementById('file_search').files[0];
  if(file){
    getAsText(file);    
  };
} 

function getAsText(readFile) {

  var reader = new FileReader();

  // Read file into memory as UTF-16
  reader.readAsText(readFile, "UTF-8");    
  reader.onload = loaded;
}

function loaded(evt) {
  // Obtain the read file data
  var fileString = evt.target.result;  
  $('#input').val(fileString);
  // Handle UTF-16 file dump
  // if(utils.regexp.isChinese(fileString)) {
  //   //Chinese Characters + Name validation
  // }
  // else {
  //   // run other charset test
  // }
  // xhr.send(fileString)
}


$( '#file' ).each( function()
  {
    var $input   = $( this ),
      $label   = $('.get_hash .label_file label span');
      labelVal = $label.html();

    $input.on( 'change', function( e )
    {
      var fileName = '';

      if( this.files && this.files.length > 1 )
        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
      else if( e.target.value )
        fileName = e.target.value.split( '\\' ).pop();

      if( fileName )
        $label.html( fileName );
      else
        $label.html( labelVal );
    });

    // Firefox bug fix
    $input
    .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
    .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
  });


$( '#file_search' ).each( function()
  {
    var $input   = $( this ),
      $label   = $('.by_file .label_file label span');
      labelVal = $label.html();

    $input.on( 'change', function( e )
    {
      var fileName = '';

      if( this.files && this.files.length > 1 )
        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
      else if( e.target.value )
        fileName = e.target.value.split( '\\' ).pop();

      if( fileName )
        $label.html( fileName );
      else
        $label.html( labelVal );
    });

    // Firefox bug fix
    $input
    .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
    .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
  });


$('#file').change(function(){
  startRead(); 
  $('.md_convert').trigger('click');
})

$('#file_search').change(function(){
  startReadFileSearch (); 
  $('.md_convert_search').trigger('click');
})

$('.result').fadeOut();

result_trans = 0;

function cbAdd(resp) {
  console.log(JSON.stringify(resp));
    hash_value = resp.txhash;    

    if (resp.txhash == undefined) {
     } else {
       $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');     
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {
        console.log('recepient: ' + JSON.stringify(receipt));
        result_trans = receipt.status;
        console.log('doing doing ');
        if (result_trans == 1) {
          $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                        

          setTimeout(function(){ $('#transaction button').trigger('click') } , 2000);                    
          clearInterval(reload_trans);          
        } else if (result_trans == 2) {
          $('#transaction .status_trans').html('<p style="color: blue"> pending </p>');
        } else {
          $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
          setTimeout(function(){ $('#transaction button').trigger('click') } , 2000);          
          clearInterval(reload_trans);          
        }
    })}, 1000);    
}


$('.get_hash .send').click(function(){
  var to = dappAddress;
  var value = 0;
  var callFunction = 'push';
  var hash = $('#hash').val();
  var mail = $('#mail').val();
  var args = [];
  args.push(hash);
  args.push(mail);
  var callArgs = JSON.stringify(args);    
  nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbAdd
  });     
})

$('.info .by_file .send').click(function(){
  var to = dappAddress;
  var value = 0;
  var callFunction = 'read';
  var hash = $('#hash_for_search').val();
  var args = [];
  args.push(hash);
  var callArgs = JSON.stringify(args);    
  nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbSearch
  });     
})

$('.info .by_hash .send').click(function(){
  var to = dappAddress;
  var value = 0;
  var callFunction = 'read';
  var hash = $('.hash_search').val();
  var args = [];
  args.push(hash);
  var callArgs = JSON.stringify(args);    
  nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbSearch
  });     
})

function cbSearch(resp) { 
  console.log(resp);
  console.log(JSON.stringify(resp));    
  try {
    var real_parse = JSON.parse(resp.result);   
  } catch (err) {
    $('.result').html('<h3>Result</h3><p>Error: No information about this hash</p>');
    $('.result').fadeIn(300);    
    return false;
  }
    var date = real_parse.timeStamp.substring(0, 10);
    $('.result .time_res span').html(date);
    $('.result .wallet_res span').html(real_parse.addressOwner);
    $('.result .mail_res span').html(real_parse.mail);          
    $('.result').fadeIn(300);  
}
